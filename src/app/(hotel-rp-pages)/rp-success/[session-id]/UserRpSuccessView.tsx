'use client';

import Link from 'next/link';

import { Booking, FlightPayload, HotelPayload } from '@/app/api/rp-trips/route';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTripsRp } from '@/contexts/TripsRpContext';

import { CircleCheck, CopyIcon } from 'lucide-react';
import Confetti from 'react-confetti';
import { toast } from 'sonner';

interface UserRpSuccessViewProps {
    tripId: string;
}

export default function UserRpSuccessView({ tripId }: UserRpSuccessViewProps) {
    const { getTrip } = useTripsRp();
    const trip = getTrip(tripId);

    const flightPayload = trip?.payload as FlightPayload;
    const hotelPayload = trip?.payload as HotelPayload;

    if (!trip) return null;

    const getPotentialSavings = () => {
        if (!trip.payload.potential_savings_cents?.amount) return 0;

        return (trip.payload.potential_savings_cents.amount / 100).toFixed(2);
    };

    return (
        <div className='flex h-full w-full flex-col items-center justify-start gap-2 pt-8'>
            <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={500} recycle={false} />
            <div className='flex w-full flex-row items-center justify-start gap-2 px-6'>
                <CircleCheck className='size-5 text-[#2B9136]' />
                <div className='w-full text-lg font-bold text-[#2B9136]'>Payment Confirmed!</div>
            </div>
            <div className='w-full px-6 text-left text-2xl font-bold text-neutral-900'>
                You pocketed ${trip.type === 'hotel' ? 'an extra' : ''} ${getPotentialSavings()}!
            </div>
            <div className='px-6 text-sm text-neutral-900'>
                <span className='font-bold'>We're now refunding your existing booking,</span>
                <br /> and will alert you on SMS and email once it's confirmed.
            </div>
            <div className='px-6 text-sm text-neutral-900'>
                Below are the confirmation details for you new reservation:
            </div>

            {trip.type === 'flight' ? (
                <div className='flex w-full flex-col items-center justify-center gap-4'>
                    <div
                        className='relative flex w-[90%] flex-col items-start justify-center rounded-lg border border-neutral-700/20 p-4'
                        onClick={() => {
                            navigator.clipboard.writeText('987987987987');
                            toast.success('Copied to clipboard');
                        }}>
                        Confirmation Number <br />
                        <span className='font-bold'>{flightPayload.confirmation_number}</span>
                        <CopyIcon className='absolute top-4 right-4 size-4 cursor-pointer' />
                    </div>

                    {/* payload as Flight Payload */}
                    <div className='relative flex w-full flex-row items-center justify-between px-6'>
                        <div className='absolute inset-x-0 top-3.5 left-1/2 h-0.5 w-[90%] -translate-x-1/2 bg-neutral-700/40' />
                        <div className='text-md font-semibold text-neutral-600'>Your original total was</div>
                        <div className='text-lg font-bold text-red-700'>
                            $
                            {flightPayload?.current_price_cents?.amount
                                ? (flightPayload.current_price_cents.amount / 100).toFixed(2)
                                : '0.00'}
                        </div>
                    </div>
                    <div className='-mt-4 flex w-full flex-row items-center justify-between px-6'>
                        <div className='text-md font-semibold text-neutral-600'>With Ascend, you've paid only</div>
                        <div className='text-xl font-bold text-[#1DC167]'>
                            $
                            {flightPayload?.new_market_price_cents?.amount
                                ? (flightPayload?.new_market_price_cents?.amount / 100).toFixed(2)
                                : '0.00'}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className='flex w-[90%] flex-col items-start justify-center rounded-lg p-4'>
                        <div className='text-lg font-bold'>{(trip.payload as HotelPayload).hotel_name}</div>
                        <div className='text-sm text-neutral-500'>{(trip.payload as HotelPayload).city}</div>
                        <div className='text-sm text-neutral-500'>
                            {(trip.payload as HotelPayload).check_in_date} to{' '}
                            {(trip.payload as HotelPayload).check_out_date}
                        </div>
                    </div>

                    {/* <div
                        className='relative flex w-[90%] flex-col items-start justify-center rounded-lg border border-neutral-700/20 p-4'
                        onClick={() => {
                            navigator.clipboard.writeText('987987987987');
                            toast.success('Copied to clipboard');
                        }}>
                        Confirmation Number <br />
                        <span className='font-bold'>{'987987987987'}</span>
                        <CopyIcon className='absolute top-4 right-4 size-4 cursor-pointer' />
                    </div> */}
                </>
            )}

            <div className='flex w-full flex-1 flex-col items-center justify-end px-6 pb-26 text-sm text-neutral-500'>
                <div className='mb-8 flex flex-row items-center justify-center gap-2'>
                    Need Help? <a href='mailto:help@ascend.travel'>help@ascend.travel</a>
                </div>
                <Separator className='w-full' />
                <Link href='/user-rps' className='w-full'>
                    <Button className='w-full rounded-full bg-[#1DC167] font-bold text-white'>Back to My Trips</Button>
                </Link>
            </div>
        </div>
    );
}
