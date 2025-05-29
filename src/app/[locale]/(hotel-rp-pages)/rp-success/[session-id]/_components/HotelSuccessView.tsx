'use client';

import { Booking, HotelPayload } from '@/app/api/rp-trips/route';
import { formatDateNoTZ } from '@/lib/date-formatters';

interface HotelSuccessViewProps {
    trip: Booking & { payload: HotelPayload };
}

export default function HotelSuccessView({ trip }: HotelSuccessViewProps) {
    return (
        <div className='flex w-full flex-col items-start justify-center gap-2 rounded-lg p-4'>
            <div className='text-lg font-bold'>{trip.payload.hotel_name}</div>
            <div className='text-sm text-neutral-500'>
                {trip.payload.address}, {trip.payload.city}
            </div>
            <div className='flex w-full flex-col items-center justify-between text-sm text-neutral-500'>
                <div className='flex w-full flex-row items-center justify-between'>
                    <div className='font-bold'>Check In</div>
                    <div>{formatDateNoTZ(trip.payload.check_in_date)}</div>
                </div>
                <div className='flex w-full flex-row items-center justify-between'>
                    <div className='font-bold'>Check Out</div>
                    <div>{formatDateNoTZ(trip.payload.check_out_date)}</div>
                </div>
            </div>
        </div>
    );
}
