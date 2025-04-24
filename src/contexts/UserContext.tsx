'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
    phone: string;
    customer_id: string;
}

interface UserContextType {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    login: (token: string, customer_id: string) => void;
    logout: () => void;
    getToken: () => string | null;
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

        if (token && customer_id) {
            fetchUser(token, customer_id);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = async (token: string, customer_id: string) => {
        try {
            const response = await fetch('/api/user/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const data = await response.json();
            setUser({
                phone: data.phone,
                customer_id: customer_id
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            // Clear invalid auth
            localStorage.removeItem('authToken');
            localStorage.removeItem('customerId');
        } finally {
            setIsLoading(false);
        }
    };

    const login = (token: string, customer_id: string) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('customerId', customer_id);
        fetchUser(token, customer_id);
    };

    const logout = () => {
        // Clear client-side storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('customerId');

        // Clear cookie
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

        setUser(null);
    };

    const getToken = () => localStorage.getItem('authToken');

    return (
        <UserContext.Provider
            value={{
                user,
                isLoading,
                error,
                login,
                logout,
                getToken
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
