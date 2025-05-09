'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
    id: string;
    main_phone?: string;
    main_email?: string;
    emails?: string[];
    phones?: string[];
    first_name?: string | null;
    last_name?: string | null;
    is_admin?: boolean;
    stats?: Record<string, unknown>;
    citizenship?: string;
    date_of_birth?: string;
}

interface UserContextType {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    login: (token: string, customer_id: string, impersonateUserId?: string) => void;
    logout: () => void;
    getToken: () => string | null;
    isImpersonating: () => boolean;
    stopImpersonating: () => void;
    startImpersonating: (userId: string) => void;
    reloadUser: () => void;
    updateUser: (user: {
        first_name: string;
        last_name: string;
        citizenship: string;
        date_of_birth: string;
    }) => Promise<void>;
    getImpersonateUserId: () => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * TokenManager - Centralized utilities for managing auth tokens and impersonation
 * Handles both localStorage and cookie storage for better persistence
 */
const TokenManager = {
    // Cookie utilities
    getCookie: (name: string): string | null => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }

        return null;
    },

    setCookie: (name: string, value: string, additionalOptions: string = '') => {
        // Base cookie security settings
        const securityFlags = [
            'path=/', // Cookie path
            'SameSite=Strict', // Prevent CSRF by restricting cross-site usage
            'Secure', // Only transmit over HTTPS
            'HttpOnly', // Prevent JavaScript access to cookies
            'max-age=86400' // 24 hour expiry as a security best practice
        ];

        // Add any additional options
        if (additionalOptions) {
            securityFlags.push(additionalOptions);
        }

        // Encode value to prevent injection
        const encodedValue = encodeURIComponent(value);

        document.cookie = `${name}=${encodedValue}; ${securityFlags.join('; ')}`;
    },

    clearCookie: (name: string) => {
        // When clearing cookies, maintain the same security settings
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict; Secure; HttpOnly`;
    },

    // Auth token management
    getAuthToken: (): string | null => {
        // Try localStorage first, then cookies
        const localToken = localStorage.getItem('authToken');
        if (localToken) return localToken;

        // Check cookies if not in localStorage
        const cookieToken = TokenManager.getCookie('authToken');

        // If found in cookies but not localStorage, restore it
        if (cookieToken) {
            localStorage.setItem('authToken', cookieToken);
            console.log('[TokenManager] Recovered token from cookies');
        }

        return cookieToken;
    },

    setAuthToken: (token: string) => {
        localStorage.setItem('authToken', token);
        // Set auth token as secure as possible
        TokenManager.setCookie('authToken', token);
    },

    clearAuthToken: () => {
        localStorage.removeItem('authToken');
        TokenManager.clearCookie('authToken');
    },

    // Customer ID management
    setCustomerId: (id: string) => {
        localStorage.setItem('customerId', id);
        // Also store in secure cookie for better persistence
        TokenManager.setCookie('customerId', id);
    },

    clearCustomerId: () => {
        localStorage.removeItem('customerId');
        TokenManager.clearCookie('customerId');
    },

    // Impersonation management
    getImpersonateUserId: (): string | null => {
        // Try localStorage first, then cookies
        const localId = localStorage.getItem('impersonateUserId');
        if (localId) return localId;

        // Check cookies if not in localStorage
        const cookieId = TokenManager.getCookie('impersonateUserId');

        // If found in cookies but not localStorage, restore it
        if (cookieId) {
            localStorage.setItem('impersonateUserId', cookieId);
        }

        return cookieId;
    },

    setImpersonateUserId: (userId: string) => {
        localStorage.setItem('impersonateUserId', userId);
        TokenManager.setCookie('impersonateUserId', userId);
    },

    clearImpersonateUserId: () => {
        localStorage.removeItem('impersonateUserId');
        TokenManager.clearCookie('impersonateUserId');
    },

    isImpersonating: (): boolean => {
        return TokenManager.getImpersonateUserId() !== null;
    },

    // Clear all auth data
    clearAllAuth: () => {
        TokenManager.clearAuthToken();
        TokenManager.clearCustomerId();
        TokenManager.clearImpersonateUserId();
    }
};

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Improved initial load handling
    useEffect(() => {
        const initializeUser = async () => {
            setIsLoading(true);

            const token = TokenManager.getAuthToken();
            const impersonateUserId = TokenManager.getImpersonateUserId();

            if (!token) {
                setIsLoading(false);

                return;
            }

            try {
                if (impersonateUserId) {
                    await fetchUser(token, true);
                } else {
                    await fetchUser(token);
                }
            } catch (err) {
                console.error('[UserContext] Error in initialization:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
                // Clear auth on error
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        initializeUser();
    }, []);

    /*
     *    ------------------------------------------------------------
     *    Impersonation functions
     *    ------------------------------------------------------------
     */
    const isImpersonating = () => TokenManager.isImpersonating();

    const stopImpersonating = () => TokenManager.clearImpersonateUserId();

    const startImpersonating = (userId: string) => TokenManager.setImpersonateUserId(userId);

    const getImpersonateUserId = () => TokenManager.getImpersonateUserId();

    /*
     *    ------------------------------------------------------------
     *    User functions
     *    ------------------------------------------------------------
     */

    const reloadUser = () => {
        const token = TokenManager.getAuthToken();
        if (!token) return;

        const isImpersonatingUser = TokenManager.isImpersonating();
        fetchUser(token, isImpersonatingUser);
    };

    // Modified fetchUser to handle impersonation more explicitly
    const fetchUser = async (token: string, isImpersonationLoad = false) => {
        try {
            const impersonateUserId = TokenManager.getImpersonateUserId();
            const url = new URL('/api/user/me', window.location.origin);

            if (isImpersonationLoad && impersonateUserId) {
                url.searchParams.set('impersonationId', impersonateUserId);
            }

            console.log('[UserContext] Fetching user', {
                token,
                impersonateUserId,
                isImpersonationLoad
            });

            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const data = (await response.json()) as UserProfile;
            setUser(data);

            return data;
        } catch (err) {
            console.error('[UserContext] Error fetching user:', err);
            throw err; // Re-throw to handle in the caller
        }
    };

    const login = (token: string, customer_id: string, impersonateUserId?: string) => {
        TokenManager.setAuthToken(token);
        TokenManager.setCustomerId(customer_id);

        if (impersonateUserId) {
            startImpersonating(impersonateUserId);
        }

        fetchUser(token, impersonateUserId ? true : false);
    };

    const logout = () => {
        TokenManager.clearAllAuth();
        setUser(null);
    };

    const updateUser = async (user: {
        first_name: string;
        last_name: string;
        citizenship: string;
        date_of_birth: string;
    }) => {
        const impersonateUserId = TokenManager.getImpersonateUserId();
        const token = TokenManager.getAuthToken();

        if (!token) {
            throw new Error('No authentication token available');
        }

        const url = new URL('/api/user/update-me', window.location.origin);
        if (impersonateUserId) {
            url.searchParams.set('impersonationId', impersonateUserId);
        }

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                first_name: user.first_name,
                last_name: user.last_name,
                citizenship: user.citizenship,
                date_of_birth: user.date_of_birth
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update user');
        }

        // re fetch user
        reloadUser();
    };

    /*
     *    ------------------------------------------------------------
     *    Helper functions
     *    ------------------------------------------------------------
     */

    const getToken = () => TokenManager.getAuthToken();

    return (
        <UserContext.Provider
            value={{
                user,
                isLoading,
                error,
                login,
                logout,
                getToken,
                isImpersonating,
                stopImpersonating,
                startImpersonating,
                getImpersonateUserId,
                reloadUser,
                updateUser
            }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}
