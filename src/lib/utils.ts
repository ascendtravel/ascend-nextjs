import { UserProfile } from '@/contexts/UserContext';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function ValidateProfileCompleted(user: UserProfile) {
    return (
        user.last_name &&
        user.last_name !== '' &&
        user.first_name &&
        user.first_name !== '' &&
        user.citizenship &&
        user.citizenship !== '' &&
        user.date_of_birth &&
        user.date_of_birth !== ''
    );
}
