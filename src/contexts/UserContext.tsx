'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Types
interface UserSettings {
    // Add settings fields as needed
    notifications?: boolean;
    emailPreferences?: string[];
}

interface UserProfile {
    phone: string;
    name?: string;
    email?: string;
    image?: string;
    settings?: UserSettings;
}

interface UserContextType {
    user: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    updateUserInfo: (data: Partial<UserProfile>) => Promise<void>;
    updateUserSettings: (settings: UserSettings) => Promise<void>;
    updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/user/me');
            if (!response.ok) throw new Error('Failed to fetch user');
            const data = await response.json();
            setUser({
                phone: data.phone,
                name: data.name,
                email: data.email,
                image: data.image,
                settings: data.settings
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const updateUserInfo = async (data: Partial<UserProfile>) => {
        try {
            const response = await fetch('/api/user/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to update user info');
            const updatedData = await response.json();
            setUser((prev) => ({ ...prev!, ...updatedData.updated_fields }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        }
    };

    const updateUserSettings = async (settings: UserSettings) => {
        try {
            const response = await fetch('/api/user/me/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (!response.ok) throw new Error('Failed to update settings');
            const updatedData = await response.json();
            setUser((prev) => ({ ...prev!, settings: updatedData.updated_settings }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        }
    };

    const updateUserProfile = async (profile: Partial<UserProfile>) => {
        try {
            const response = await fetch('/api/user/me/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profile)
            });

            if (!response.ok) throw new Error('Failed to update profile');
            const updatedData = await response.json();
            setUser((prev) => ({ ...prev!, ...updatedData.updated_profile }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        }
    };

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            const response = await fetch('/api/user/me/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
            });

            if (!response.ok) throw new Error('Failed to change password');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            throw err;
        }
    };

    const value = {
        user,
        isLoading,
        error,
        updateUserInfo,
        updateUserSettings,
        updateUserProfile,
        changePassword
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}
