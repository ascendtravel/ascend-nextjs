'use client';

import { Booking, HotelPayload } from '@/app/api/rp-trips/route';
import { formatDateNoTZ } from '@/lib/date-formatters';

import { DotIcon, MapPinIcon } from 'lucide-react';

interface HotelStayRPGridCardProps {
    trip: Booking & { type: 'hotel'; payload: HotelPayload };
}

export default function HotelStayRPGridCard({ trip }: HotelStayRPGridCardProps) {
    const hasSavings = (trip.payload.potential_savings_cents?.amount ?? 0) > 0;

    return (
        <div className='absolute bottom-0 left-0 flex w-full flex-col p-2 text-neutral-50 shadow-sm'>
            <div className='flex flex-1 flex-col justify-between p-2'>
                <div className='flex flex-col items-start justify-start'>
                    <span className='relative flex flex-row items-center justify-start gap-1 text-sm font-semibold'>
                        {trip.payload.hotel_name}
                        {hasSavings && <DotIcon className='absolute -right-6 -bottom-1.5 z-50 size-8 text-[#1DC167]' />}
                    </span>
                    <div className='text-xs text-neutral-300'>{formatDateNoTZ(trip.payload.check_in_date)} </div>
                </div>
                <div className='flex items-center justify-start gap-2'>
                    <MapPinIcon className='h-3 w-3 text-neutral-100' />
                    <div className='text-xs text-neutral-100'>{trip.payload.city}</div>
                </div>
            </div>
        </div>
    );
}
