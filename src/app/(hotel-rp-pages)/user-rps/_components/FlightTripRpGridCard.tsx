'use client';

import { Booking, FlightPayload } from '@/app/api/rp-trips/route';
import { formatDateNoTZ } from '@/lib/date-formatters';

import { DotIcon, PlaneIcon } from 'lucide-react';

interface FlightTripRpGridCardProps {
    trip: Booking & { type: 'flight'; payload: FlightPayload };
}

export default function FlightTripRpGridCard({ trip }: FlightTripRpGridCardProps) {
    const hasSavings = (trip.payload.potential_savings_cents?.amount ?? 0) > 0;

    return (
        <div className='absolute bottom-0 left-0 flex w-full flex-col overflow-hidden p-2 text-neutral-50 drop-shadow-md'>
            <div className='flex flex-1 flex-col justify-between p-2'>
                <div className='flex flex-row items-center justify-between'>
                    <div className='relative text-sm font-bold'>
                        {trip.payload.departure_city} to {trip.payload.arrival_city}
                        {hasSavings && <DotIcon className='absolute -right-6 -bottom-1.5 z-50 size-8 text-[#1DC167]' />}
                    </div>
                </div>
                <div className='text-xs text-neutral-200'>{formatDateNoTZ(trip.payload.departure_date)}</div>
                <div className='flex items-center justify-start gap-2'>
                    <PlaneIcon className='h-3 w-3 text-neutral-200' />
                    <div className='text-xs text-neutral-200'>{trip.payload.airline}</div>
                </div>
            </div>
        </div>
    );
}
