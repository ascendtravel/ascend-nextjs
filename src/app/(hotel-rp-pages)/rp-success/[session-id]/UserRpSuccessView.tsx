'use client';

import Link from 'next/link';

import { FlightTrip, HotelTrip } from '@/app/api/rp-trips/route';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTripsRp } from '@/contexts/TripsRpContext';

import { CircleCheck } from 'lucide-react';
import Confetti from 'react-confetti';

interface UserRpSuccessViewProps {
    tripId: string;
}

export default function UserRpSuccessView({ tripId }: UserRpSuccessViewProps) {
    const { getTrip } = useTripsRp();

    const trip = getTrip(tripId);

    return (
        <div className='flex h-full w-full flex-col items-center justify-start gap-2 pt-8'>
            <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={500} recycle={false} />
            <div className='flex w-full flex-row items-center justify-start gap-2 px-6'>
                <CircleCheck className='size-5 text-[#2B9136]' />
                <div className='w-full text-lg font-bold text-[#2B9136]'>Payment Confirmed!</div>
            </div>
            <div className='text-2xl font-bold text-neutral-900'>You pocketed an extra ${trip?.potential_savings}!</div>
            <div className='px-6 text-sm text-neutral-900'>
                <span className='font-bold'>We're now refunding your existing booking,</span>
                <br /> and will alert you on SMS and email once it's confirmed.
            </div>
            <div className='px-6 text-sm text-neutral-900'>
                Below are the confirmation details for you new reservation:
            </div>

            {trip?.type === 'flight' ? (
                <div>
                    <div>{(trip as FlightTrip).airline}</div>
                    <div>{(trip as FlightTrip).flight_number}</div>
                </div>
            ) : (
                <>
                    <div className='flex w-[90%] flex-col items-start justify-center rounded-lg p-4'>
                        <div className='text-lg font-bold'>{(trip as HotelTrip).hotel_name}</div>
                        <div className='text-sm text-neutral-500'>{(trip as HotelTrip).city}</div>
                        <div className='text-sm text-neutral-500'>
                            {(trip as HotelTrip).check_in_date} to {(trip as HotelTrip).check_out_date}
                        </div>
                    </div>

                    <div className='flex w-[90%] flex-col items-start justify-center rounded-lg border border-neutral-700/20 p-4'>
                        {/* Confirmation Number: <span className='font-bold'>{(trip as HotelTrip).confirmation_number}</span> */}
                        Confirmation Number <br />
                        <span className='font-bold'>{'987987987987'}</span>
                    </div>
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
