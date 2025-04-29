'use client';

import Image from 'next/image';

import { Booking, FlightPayload, HotelPayload } from '@/app/api/rp-trips/route';
import { getCurrencyAndAmountText } from '@/lib/money';
import { PlusIcon } from '@radix-ui/react-icons';

import { isFuture, parseISO } from 'date-fns';
import { ShieldCheck } from 'lucide-react';

type RpGridCardWrapperProps = {
    children: React.ReactNode;
    className?: string;
    loading?: boolean;
    addItem?: boolean;
    onClick?: () => void;
    trip?: Booking;
};

export default function RpGridCardWrapper({
    children,
    className,
    loading,
    addItem,
    onClick,
    trip
}: RpGridCardWrapperProps) {
    // Helper to get potential savings in dollars
    const getPotentialSavings = (trip?: Booking) => {
        if (!trip?.payload.potential_savings_cents?.amount) return 0;

        return trip.payload.potential_savings_cents.amount;
    };

    // Helper to check if trip is in the future
    const isTripInFuture = (trip?: Booking) => {
        if (!trip) return false;

        const date =
            trip.type === 'hotel'
                ? (trip.payload as HotelPayload).check_in_date
                : (trip.payload as FlightPayload).departure_date;

        return isFuture(parseISO(date));
    };

    // Show protection badge only for future trips without current savings
    const shouldShowProtection = trip && isTripInFuture(trip) && !getPotentialSavings(trip);

    // Helper to get image alt text
    const getAltText = (trip?: Booking) => {
        if (!trip) return '';
        if (trip.type === 'hotel') {
            return (trip.payload as HotelPayload).hotel_name;
        }
        const flightPayload = trip.payload as FlightPayload;

        return `${flightPayload.departure_city} to ${flightPayload.arrival_city}`;
    };

    const defaultImage = 'https://cdn.worldota.net/t/1024x768/c/76/da/76daa523375daf6deb793635b63dc245ada00b04.jpeg';

    return (
        <div
            className={`relative h-[254px] w-[177px] cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm drop-shadow-xl transition-transform duration-300 hover:rotate-6 ${
                getPotentialSavings(trip) ? 'border-[#1DC167]' : ''
            } ${className}`}>
            {shouldShowProtection && (
                <div className='absolute top-2 left-2 z-50 flex flex-row items-center justify-center gap-2 rounded-full bg-neutral-500 px-2 py-1'>
                    <ShieldCheck className='size-4 text-[#1DC167]' />
                    <span className='text-xs font-semibold text-[#1DC167]'>Price drop protection</span>
                </div>
            )}
            <Image src={trip?.payload.image_url || defaultImage} alt={getAltText(trip)} fill className='object-cover' />
            {/* TODO: remove this */}
            {/* <Image src={'https://cataas.com/cat'} alt={getAltText(trip)} fill className='object-cover' /> */}

            {/* bottom up shadow to top */}
            <div className='absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-t from-black from-0% via-black/60 via-25% to-transparent to-100%' />
            {getPotentialSavings(trip) ? (
                <div className='absolute inset-x-0 -top-1 flex h-8 flex-row bg-[#1DC167]'>
                    <div className='flex w-full items-center justify-center text-xs font-semibold text-white'>
                        Tap to save{' '}
                        {getCurrencyAndAmountText(
                            trip?.payload.potential_savings_cents ?? { amount: 0, currency: 'USD' }
                        )}
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
