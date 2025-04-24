'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { FlightTrip, HotelTrip, Trip } from '@/app/api/rp-trips/route';
import IconHotelBed from '@/components/Icon/IconHotelBed';
import IconPlaneCircleTilt from '@/components/Icon/IconPlaneCircleTilt';
import { Button } from '@/components/ui/button';

import { PlaneIcon } from 'lucide-react';
import ReactConfetti from 'react-confetti';

interface UserSpecificTripCardProps {
    trip: Trip;
}

export default function UserSpecificTripCard({ trip }: UserSpecificTripCardProps) {
    const router = useRouter();
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShowConfetti(false);
        }, 2000);
    }, []);

    const handleRepriceClick = () => {
        router.push(`/user-rp/${trip.id}?view-state=ConfirmUserInfo`);
    };

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
                <div className='relative h-[84px] w-[140px]'>
                    <Image
                        src={trip.type === 'hotel' ? (trip as HotelTrip).image_url : (trip as FlightTrip).image_url}
                        alt={`Repricing Card for ${trip.type}`}
                        width={140}
                        height={84}
                        className='absolute inset-0 rounded-lg object-cover'
                    />
                    <div className='absolute -bottom-3.5 left-0 flex size-10 items-center justify-center rounded-full opacity-70 drop-shadow-md'>
                        {trip.type === 'hotel' ? (
                            <IconHotelBed fill={trip.potential_savings ? '#1DC167' : '#fff'} />
                        ) : (
                            <IconPlaneCircleTilt fill={trip.potential_savings ? '#1DC167' : '#fff'} />
                        )}
                    </div>
                </div>
                {trip.type === 'hotel' && (
                    <div className='flex flex-col items-start justify-end'>
                        <div className='text-md'>{(trip as HotelTrip).hotel_name}</div>
                        <div className='text-xs'>{(trip as HotelTrip).check_in_date}</div>
                    </div>
                )}
                {trip.type === 'flight' && (
                    <div className='flex flex-col items-start justify-end'>
                        <div className='text-md'>
                            {(trip as FlightTrip).departure_city} to {(trip as FlightTrip).arrival_city}
                        </div>
                        <div className='text-xs'>
                            {new Date((trip as FlightTrip).departure_date).toLocaleDateString()}
                        </div>
                    </div>
                )}
            </div>
            {!!trip.past_savings && (
                <div className='my-2 text-sm text-gray-500'>
                    We've saved you ${trip.past_savings} on this {trip.type === 'hotel' ? 'stay' : 'flight'}!
                </div>
            )}
            {!!trip.potential_savings && (
                <div className='mb-2 text-sm text-gray-500'>
                    We can save you ${trip.potential_savings} on this stay!
                </div>
            )}
            {!!trip.potential_savings && (
                <Button className='w-full rounded-full bg-[#1DC167] font-bold text-white' onClick={handleRepriceClick}>
                    Reprice now to save ${trip.potential_savings}
                </Button>
            )}
        </div>
    );
}
