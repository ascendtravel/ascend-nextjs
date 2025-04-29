'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { ArrowLeft } from 'lucide-react';

interface BackGreenButtonProps {
    onClick?: () => void;
    className?: string;
    preventNavigation?: boolean;
}

export default function BackGreenButton({ onClick, className = '', preventNavigation = false }: BackGreenButtonProps) {
    const router = useRouter();

    useEffect(() => {
        if (!preventNavigation) return;

        const handlePopState = (event: PopStateEvent) => {
            // Prevent the navigation
            window.history.pushState(null, '', window.location.href);

            // Execute onClick if provided
            if (onClick) {
                onClick();
            }
        };

        // Add an initial state so back button works
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, [onClick, preventNavigation]);

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <button
            className={cn('flex items-center rounded-lg py-2 text-sm text-[#1DC167]', className)}
            onClick={handleClick}>
            <ArrowLeft className='h-4 w-4' />
            Go Back
        </button>
    );
}
