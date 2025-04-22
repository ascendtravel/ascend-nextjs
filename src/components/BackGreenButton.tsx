import { ArrowLeft } from 'lucide-react';

interface BackGreenButtonProps {
    onClick?: () => void;
}

export default function BackGreenButton({ onClick }: BackGreenButtonProps) {
    return (
        <button className='flex items-center rounded-lg py-2 text-sm text-[#1DC167]' onClick={onClick}>
            <ArrowLeft className='h-4 w-4' />
            Go Back
        </button>
    );
}
