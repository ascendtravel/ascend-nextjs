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

    // Get initials from name or email
    const getInitials = () => {
        if (user?.first_name || user?.last_name) {
            const nameParts = [user.first_name, user.last_name].filter(Boolean);

            return nameParts
                .map((part) => (part ? part[0] : ''))
                .join('')
                .toUpperCase();
        }

        // Use first letter of email name if available
        if (user?.main_email) {
            const emailName = user.main_email?.split('@')[0];

            return emailName?.[0]?.toUpperCase() || 'U';
        }

        return 'U';
    };

    // Get display name
    const getDisplayName = () => {
        if (user?.first_name || user?.last_name) {
            return [user.first_name, user.last_name].filter(Boolean).join(' ');
        }

        if (user?.main_email) {
            const emailName = user.main_email?.split('@')[0];

            return `${emailName}`;
        }

        if (user?.main_phone) {
            return `Stranger (+${user.main_phone})`;
        }

        return 'Stranger';
    };

    return (
        <div className={cn('flex items-center gap-3', styles.container, className)}>
            {showName && (
                <span className={darkMode ? 'font-medium text-white' : 'font-medium'}>Hello, {getDisplayName()}</span>
            )}
            <Avatar className={styles.avatar}>
                <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
        </div>
    );
}
