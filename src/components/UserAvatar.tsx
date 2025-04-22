'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

const VARIANT_STYLES = {
    xs: {
        avatar: 'h-8 w-8',
        container: 'text-sm'
    },
    md: {
        avatar: 'h-10 w-10',
        container: 'text-base'
    },
    lg: {
        avatar: 'h-12 w-12',
        container: 'text-lg'
    }
} as const;

interface UserAvatarProps {
    variant?: keyof typeof VARIANT_STYLES;
    showName?: boolean;
    className?: string;
    darkMode?: boolean;
}

export default function UserAvatar({ variant = 'md', showName = false, className, darkMode = true }: UserAvatarProps) {
    const { user } = useUser();
    const styles = VARIANT_STYLES[variant];

    // Get initials from phone number if no name is available
    const getInitials = () => {
        if (user?.name) {
            return user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        }

        // Use last 2 digits of phone number
        return user?.phone.slice(-2) || 'U';
    };

    return (
        <div className={cn('flex items-center gap-3', styles.container, className)}>
            {showName && (
                <span className={darkMode ? 'font-medium text-white' : 'font-medium'}>
                    Hello, {user?.name || `+${user?.phone}` || 'User'}
                </span>
            )}
            <Avatar className={styles.avatar}>
                <AvatarImage src={user?.image} alt={user?.name || 'User avatar'} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
        </div>
    );
}
