'use client';

import { useRouter } from 'next/navigation';

import { trackLuckyOrangeEvent } from '@/lib/analytics';
import { PlusIcon } from '@radix-ui/react-icons';

export default function AddTripCard() {
    const router = useRouter();

    const handleClick = () => {
        // Track the add-trip-clicked event in Lucky Orange
        trackLuckyOrangeEvent('add-trip-clicked', { source: 'trip_card' });

        // Navigate to the add trip page
        router.push('/add-trip');
    };

    return (
        <div
            onClick={handleClick}
            className='flex h-[254px] w-[177px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-white/50 transition-all hover:border-neutral-400 hover:shadow-sm'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#D2D2D2]'>
                <PlusIcon className='h-4 w-4 text-white' />
            </div>
            <p className='text-center text-sm font-semibold text-[#D2D2D2]'>Add a trip</p>
        </div>
    );
}
