'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Booking, FlightPayload, HotelPayload } from '@/app/api/rp-trips/route';
import IconHotelBed from '@/components/Icon/IconHotelBed';
import IconPlaneCircleTilt from '@/components/Icon/IconPlaneCircleTilt';
import { Button } from '@/components/ui/button';
import { getCurrencyAndAmountText, getTripSavingsString } from '@/lib/money';

import { format, isFuture, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { PlaneIcon, ShieldCheck } from 'lucide-react';
import ReactConfetti from 'react-confetti';

interface UserSpecificTripCardProps {
    trip?: Booking;
}

export default function UserSpecificTripCard({ trip }: UserSpecificTripCardProps) {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(true);
    const hasSavings = (trip?.payload.potential_savings_cents?.amount ?? 0) > 0;

    const isTripInFuture = (trip: Booking) => {
        if (!trip) return false;

        const date =
            trip.type === 'hotel'
                ? (trip.payload as HotelPayload).check_in_date
                : (trip.payload as FlightPayload).departure_date;

        return isFuture(parseISO(date));
    };

    const isUpcoming = trip ? isTripInFuture(trip) : false;

    useEffect(() => {
        if (hasSavings) {
            setTimeout(() => {
                setShowConfetti(false);
            }, 2000);
        }
    }, [hasSavings]);

    if (!trip) return null;

    const handleRepriceClick = () => {
        router.push(`/user-rp/${trip.import_session_id}?view-state=ConfirmUserInfo`);
    };

    const potentialSavings = (trip.payload.potential_savings_cents?.amount ?? 0) / 100;
    const pastSavings = (trip.payload.past_savings_cents?.amount ?? 0) / 100;

    return (
        <motion.div
            className='w-full px-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                ease: 'easeOut'
            }}>
            {hasSavings && (
                <ReactConfetti
                    className='fixed inset-0 z-50 max-w-md'
                    numberOfPieces={100}
                    recycle={showConfetti}
                    height={400}
                    gravity={0.1}
                    colors={['#1DC167', '#006DBC', '#5AA6DA', '#FFD700', '#FF69B4']}
                    tweenDuration={200}
                />
            )}
            <div className='flex flex-row items-center justify-start gap-4 py-4'>
                <div className='relative h-[150px] w-[200px] overflow-hidden rounded-lg bg-neutral-200'>
                    <Image
                        src={trip.payload.image_url || ''}
                        alt={`Repricing Card for ${trip.type}`}
                        fill
                        className='absolute inset-0 rounded-lg object-cover'
                    />
                    <div className='absolute -bottom-1 left-0 flex size-10 items-center justify-center rounded-full opacity-70 drop-shadow-md'>
                        {trip.type === 'hotel' ? (
                            <IconHotelBed fill={potentialSavings > 0 ? '#1DC167' : '#fff'} />
                        ) : (
                            <IconPlaneCircleTilt fill={potentialSavings > 0 ? '#1DC167' : '#fff'} />
                        )}
                    </div>
                </div>
                {trip.type === 'hotel' && (
                    <div className='flex flex-col items-start justify-end'>
                        {isUpcoming && (
                            <>
                                <div className='flex flex-row items-center justify-start gap-2'>
                                    <ShieldCheck className='mb-0.5 size-5 text-[#1DC167]' />
                                    <span className='text-sm font-bold text-[#1DC167]'>Price drop protection</span>
                                </div>
                                <div className='pb-2 text-sm text-neutral-500'>
                                    We are monitoring this hotel for price drops.
                                </div>
                            </>
                        )}
                        <div className='text-2xl font-bold'>{(trip.payload as HotelPayload).hotel_name}</div>
                        <div className='flex flex-row items-center justify-start gap-2'>
                            <div className='text-xs'>
                                {getNiceFormattedDate((trip.payload as HotelPayload).check_in_date)}
                            </div>
                            <div className='text-sm text-neutral-500'>To</div>
                            <div className='text-xs'>
                                {getNiceFormattedDate((trip.payload as HotelPayload).check_out_date)}
                            </div>
                        </div>
                    </div>
                )}
                {trip.type === 'flight' && (
                    <div className='flex flex-col items-start justify-end'>
                        {isUpcoming && (
                            <>
                                <div className='flex flex-row items-center justify-start gap-2'>
                                    <ShieldCheck className='mb-0.5 size-5 text-[#1DC167]' />
                                    <span className='text-sm font-bold text-[#1DC167]'>Price drop protection</span>
                                </div>
                                <div className='pb-2 text-sm text-neutral-500'>
                                    We are monitoring this flight for price drops.
                                </div>
                            </>
                        )}
                        <div className='text-xl font-bold'>
                            {(trip.payload as FlightPayload).departure_airport_iata_code} to{' '}
                            {(trip.payload as FlightPayload).arrival_airport_iata_code}
                        </div>
                        <div className='text-sm text-neutral-500'>
                            Flight Number {(trip.payload as FlightPayload).outbound_flight_numbers}
                        </div>
                        <div className='flex flex-row items-center justify-start gap-2'>
                            <div className='text-xs'>
                                {getNiceFormattedDate((trip.payload as FlightPayload).departure_date)}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {pastSavings > 0 && (
                <div className='my-2 text-sm text-gray-500'>
                    We've saved you ${pastSavings} on this {trip.type === 'hotel' ? 'stay' : 'flight'}!
                </div>
            )}
            {potentialSavings > 0 && isUpcoming && (
                <>
                    <div className='mb-2 text-sm text-gray-500'>We can save you ${potentialSavings} on this stay!</div>
                    <Button
                        className='mt-4 w-full rounded-full bg-[#1DC167] font-bold text-white'
                        onClick={handleRepriceClick}>
                        Reprice and get {getCurrencyAndAmountText(trip.payload.potential_savings_cents)}
                    </Button>
                </>
            )}
        </motion.div>
    );
}

// format as feb 28, 2025
function getNiceFormattedDate(date: string) {
    return format(new Date(date), 'MMM d, yyyy');
}
