'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

import { ArrowLeft } from 'lucide-react';

interface BackGreenButtonProps {
    backUrl?: string;
    onClick?: () => void;
    className?: string;
}

export default function BackGreenButton({ backUrl, onClick, className = '' }: BackGreenButtonProps) {
    const router = useRouter();

    useEffect(() => {
        // Only add listener if backUrl is provided
        if (!backUrl) return;

        const handlePopState = (event: PopStateEvent) => {
            // Prevent default back behavior
            event.preventDefault();
            // Navigate to specified URL
            router.push(backUrl);
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [backUrl, router]);

    const handleClick = () => {
        if (backUrl) {
            router.push(backUrl);
        } else if (onClick) {
            onClick();
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
