import { cn } from '@/lib/utils';

import { ArrowLeft } from 'lucide-react';

interface BackGreenButtonProps {
    onClick?: () => void;
    className?: string;
}

export default function BackGreenButton({ onClick, className = '' }: BackGreenButtonProps) {
    return (
        <button className={cn('flex items-center rounded-lg py-2 text-sm text-[#1DC167]', className)} onClick={onClick}>
            <ArrowLeft className='h-4 w-4' />
            Go Back
        </button>
    );
}
