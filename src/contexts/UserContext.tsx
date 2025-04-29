'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
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
    login: (token: string, customer_id: string) => void;
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

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing auth on mount
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const customer_id = localStorage.getItem('customerId');

        if (token) {
            fetchUser(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    /*
     *    ------------------------------------------------------------
     *    Impersonation functions
     *    ------------------------------------------------------------
     */
    const isImpersonating = () => {
        const impersonateUserId = localStorage.getItem('impersonateUserId');

        return impersonateUserId !== null;
    };

    const stopImpersonating = () => {
        localStorage.removeItem('impersonateUserId');

        document.cookie = 'impersonateUserId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    };

    const startImpersonating = (userId: string) => {
        localStorage.setItem('impersonateUserId', userId);

        document.cookie = `impersonateUserId=${userId}; path=/`;
    };

    const getImpersonateUserId = () => localStorage.getItem('impersonateUserId');

    /*
     *    ------------------------------------------------------------
     *    User functions
     *    ------------------------------------------------------------
     */

    const reloadUser = () => {
        fetchUser(getToken() || '');
    };

    const fetchUser = async (token: string) => {
        try {
            const impersonateUserId = localStorage.getItem('impersonateUserId');

            const url = new URL('/api/user/me', window.location.origin);

            console.log('\n\nFetching user from /me', {
                token,
                impersonateUserId
            });

            if (impersonateUserId) {
                url.searchParams.set('impersonationId', impersonateUserId);
            }

            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const data = (await response.json()) as UserProfile;

            setUser(data); // Now storing the complete user profile
        } catch (err) {
            console.error('[UserContext] Error fetching user:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            localStorage.removeItem('authToken');
            localStorage.removeItem('customerId');
        } finally {
            setIsLoading(false);
        }
    };

    const login = (token: string, customer_id: string) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('customerId', customer_id);

        // add it to cokies also, make it secure with secure: true
        document.cookie = `authToken=${token}; path=/; secure; samesite=strict;`;

        fetchUser(token);
    };

    const logout = () => {
        // Clear client-side storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('customerId');

        // Clear cookie
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        // clear impersonations cookies
        document.cookie = 'impersonateUserId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

        setUser(null);
    };

    const updateUser = async (user: {
        first_name: string;
        last_name: string;
        citizenship: string;
        date_of_birth: string;
    }) => {
        const impersonateUserId = localStorage.getItem('impersonateUserId');

        const url = new URL('/api/user/update-me', window.location.origin);
        if (impersonateUserId) {
            url.searchParams.set('impersonationId', impersonateUserId);
        }

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getToken()}`
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

    const getToken = () => localStorage.getItem('authToken');

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
