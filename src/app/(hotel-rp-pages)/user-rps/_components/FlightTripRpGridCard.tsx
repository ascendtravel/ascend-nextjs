'use client';

import { Booking, FlightPayload } from '@/app/api/rp-trips/route';
import { formatDateNoTZ } from '@/lib/date-formatters';

import { DotIcon, PlaneIcon } from 'lucide-react';

interface FlightTripRpGridCardProps {
    trip: Booking & { type: 'flight'; payload: FlightPayload };
}

const AirplaneIcon = ({ size }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size ?? 24} height={size ?? 24} viewBox="0 0 24 24" fill="none" className="lucide lucide-plane-icon lucide-plane" >
    <rect width="24" height="24" rx="12" fill="white" />
    <svg y="3" xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="24px" fill="#666666"><path d="m397-115-99-184-184-99 71-70 145 25 102-102-317-135 84-86 385 68 124-124q23-23 57-23t57 23q23 23 23 56.5T822-709L697-584l68 384-85 85-136-317-102 102 26 144-71 71Z" /></svg></svg >




export default function FlightTripRpGridCard({ trip }: FlightTripRpGridCardProps) {
    const hasSavings = (trip.payload.potential_savings_cents?.amount ?? 0) > 0;

    return (
        <div className='absolute bottom-0 left-0 flex w-full flex-col overflow-hidden p-2 text-neutral-50 drop-shadow-md'>
            <div className='flex flex-1 flex-col justify-between p-2'>
                <div className='flex flex-row items-center justify-between mb-1.5'>
                    <div className='relative text-sm font-bold'>
                        <div className="mb-2">
                            <AirplaneIcon size={16} />
                        </div>
                        {trip.payload.departure_city} to {trip.payload.arrival_city}
                        {hasSavings && <DotIcon className='absolute -right-6 -bottom-1.5 z-50 size-8 text-[#1DC167]' />}
                    </div>
                </div>
                <div className='text-xs text-neutral-300'>{formatDateNoTZ(trip.payload.departure_date, "MM/dd/yy")}</div>
            </div>
        </div>
    );
}
