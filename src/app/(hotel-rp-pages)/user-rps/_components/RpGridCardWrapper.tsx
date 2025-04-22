'use client';

import Image from 'next/image';

import { FlightTrip, HotelTrip, Trip } from '@/app/api/rp-trips/route';
import { PlusIcon } from '@radix-ui/react-icons';

type RpGridCardWrapperProps = {
    children: React.ReactNode;
    className?: string;
    loading?: boolean;
    addItem?: boolean;
    onClick?: () => void;
    trip?: Trip;
};

export default function RpGridCardWrapper({
    children,
    className,
    loading,
    addItem,
    onClick,
    trip
}: RpGridCardWrapperProps) {
    return (
        <div
            className={`relative h-[254px] w-[177px] cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm drop-shadow-xl transition-transform duration-300 hover:rotate-6 ${trip?.potential_savings ? 'border-3 border-[#1DC167]' : ''} ${className}`}>
            <Image
                src={trip?.image_url || ''}
                alt={trip?.type === 'hotel' ? (trip as HotelTrip).hotel_name : (trip as FlightTrip).departure_city}
                fill
                className='object-cover'
            />
            {/* bottom up shadow to top */}
            <div className='absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-t from-black from-0% via-black/60 via-25% to-transparent to-100%' />
            {trip?.potential_savings ? (
                <div className='absolute inset-x-0 -top-1 flex h-8 flex-row bg-[#1DC167]'>
                    <div className='flex w-full items-center justify-center text-xs font-semibold text-white'>
                        Tap to save ${trip.potential_savings}
                    </div>
                </div>
            ) : null}
            {!loading && !addItem && children}
            {loading && (
                <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-neutral-500' />
                </div>
            )}
            {addItem && (
                <div className='absolute right-0 bottom-0'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-500'>
                        <PlusIcon className='h-5 w-5 text-neutral-50' />
                    </div>
                </div>
            )}
        </div>
    );
}
