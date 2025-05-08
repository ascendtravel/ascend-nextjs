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
            className='flex h-[254px] w-[177px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-300 bg-white/50 transition-all hover:border-neutral-400 hover:shadow-sm hover:drop-shadow-md'>
            <div className='flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100'>
                <PlusIcon className='h-6 w-6 text-neutral-500 drop-shadow-lg' />
            </div>
            <p className='text-center text-sm font-medium text-neutral-500'>Add trip</p>
        </div>
    );
}
