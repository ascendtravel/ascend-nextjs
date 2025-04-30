'use client';

import Link from 'next/link';

import { Booking, FlightPayload } from '@/app/api/rp-trips/route';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getCurrencyAndAmountText } from '@/lib/money';

import { CircleCheck, CopyIcon } from 'lucide-react';
import { toast } from 'sonner';

interface FlightSuccessViewProps {
    trip: Booking & { payload: FlightPayload };
}

export default function FlightSuccessView({ trip }: FlightSuccessViewProps) {
    return (
        <div className='flex w-full flex-col items-center justify-center gap-4'>
            <div
                className='relative flex w-[90%] flex-col items-start justify-center rounded-lg border border-neutral-700/20 p-4'
                onClick={() => {
                    navigator.clipboard.writeText(trip.payload.confirmation_number || '');
                    toast.success('Copied to clipboard');
                }}>
                Confirmation Number <br />
                <span className='font-bold'>{trip.payload.confirmation_number}</span>
                <CopyIcon className='absolute top-4 right-4 size-4 cursor-pointer' />
            </div>

            <div className='relative flex w-full flex-row items-center justify-between px-6'>
                <div className='absolute inset-x-0 top-3.5 left-1/2 h-0.5 w-[90%] -translate-x-1/2 bg-neutral-700/40' />
                <div className='text-md font-semibold text-neutral-600'>Your original total was</div>
                <div className='text-lg font-bold text-red-700'>
                    {getCurrencyAndAmountText(trip.payload.current_price_cents)}
                </div>
            </div>
            <div className='-mt-4 flex w-full flex-row items-center justify-between px-6'>
                <div className='text-md font-semibold text-neutral-600'>With Ascend, you've paid only</div>
                <div className='text-xl font-bold text-[#1DC167]'>
                    {getCurrencyAndAmountText(trip.payload.new_market_price_cents)}
                </div>
            </div>
        </div>
    );
}
