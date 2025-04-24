'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Booking, FlightPayload, HotelPayload } from '@/app/api/rp-trips/route';
import IconHotelBed from '@/components/Icon/IconHotelBed';
import IconPlaneCircleTilt from '@/components/Icon/IconPlaneCircleTilt';
import { Button } from '@/components/ui/button';
import { getTripSavingsString } from '@/lib/money';

import ReactConfetti from 'react-confetti';

interface UserSpecificTripCardProps {
    trip?: Booking;
}

export default function UserSpecificTripCard({ trip }: UserSpecificTripCardProps) {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShowConfetti(false);
        }, 2000);
    }, []);

    if (!trip) return null;

    const handleRepriceClick = () => {
        router.push(`/user-rp/${trip.import_session_id}?view-state=ConfirmUserInfo`);
    };

    const potentialSavings = (trip.payload.potential_savings_cents?.amount ?? 0) / 100;
    const pastSavings = (trip.payload.past_savings_cents?.amount ?? 0) / 100;

    return (
        <div className='w-full px-4'>
            <ReactConfetti
                className='fixed inset-0 z-50'
                numberOfPieces={100}
                recycle={showConfetti}
                gravity={0.1}
                colors={['#1DC167', '#006DBC', '#5AA6DA', '#FFD700', '#FF69B4']}
                tweenDuration={200}
            />
            <div className='flex flex-row gap-4 py-4'>
                <div className='relative h-[84px] w-[140px] overflow-hidden rounded-lg'>
                    <Image
                        // src={trip.payload.image_url || 'https://cataas.com/cat'}
                        src={'https://cataas.com/cat'} // TODO: remove this
                        alt={`Repricing Card for ${trip.type}`}
                        width={140}
                        height={84}
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
                        <div className='text-md'>{(trip.payload as HotelPayload).hotel_name}</div>
                        <div className='text-xs'>{(trip.payload as HotelPayload).check_in_date}</div>
                    </div>
                )}
                {trip.type === 'flight' && (
                    <div className='flex flex-col items-start justify-end'>
                        <div className='text-xl font-bold'>
                            {(trip.payload as FlightPayload).departure_airport_iata_code} to{' '}
                            {(trip.payload as FlightPayload).arrival_airport_iata_code}
                        </div>
                        <div className='text-xs'>
                            {new Date((trip.payload as FlightPayload).departure_date).toLocaleDateString()}
                        </div>
                    </div>
                )}
            </div>
            {pastSavings > 0 && (
                <div className='my-2 text-sm text-gray-500'>
                    We've saved you ${pastSavings} on this {trip.type === 'hotel' ? 'stay' : 'flight'}!
                </div>
            )}
            {potentialSavings > 0 && (
                <div className='mb-2 text-sm text-gray-500'>We can save you ${potentialSavings} on this stay!</div>
            )}
            {potentialSavings > 0 && (
                <Button className='w-full rounded-full bg-[#1DC167] font-bold text-white' onClick={handleRepriceClick}>
                    Reprice now to save {getTripSavingsString(trip, true)}
                </Button>
            )}
        </div>
    );
}
