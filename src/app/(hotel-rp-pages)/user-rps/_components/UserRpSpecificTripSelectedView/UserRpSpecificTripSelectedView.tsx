'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Booking } from '@/app/api/rp-trips/route';
import BackGreenButton from '@/components/BackGreenButton';

import UserSpecificTripCard from './UserSpecificTripCard';

interface UserRpSpecificTripSelectedViewProps {
    trip?: Booking;
    handleBackClick: () => void;
}

export default function UserRpSpecificTripSelectedView({ trip, handleBackClick }: UserRpSpecificTripSelectedViewProps) {
    // const { trips } = useTripsRp();
    // const [upcomingTrips, setUpcomingTrips] = useState<Booking[]>([]);
    // const [pastTrips, setPastTrips] = useState<Booking[]>([]);

    // useEffect(() => {
    //     if (trips && trips.length > 0) {
    //         setUpcomingTrips([trips[0], trips[1]]);
    //         setPastTrips([trips[2], trips[3]]);
    //     }
    // }, [trips]);

    return (
        <div className='-mt-2 flex flex-col items-center justify-start px-2'>
            <BackGreenButton onClick={handleBackClick} className='w-full px-4 py-0' />
            <UserSpecificTripCard trip={trip} />
            {/* <div className='w-full pl-4 text-left text-sm uppercase'>Upcoming Trips ({upcomingTrips.length})</div>
            {upcomingTrips.map((trip) => (
                <UserSpecificTripCard key={trip.id} trip={trip} />
            ))}
            <div>PastTrips ({pastTrips.length})</div>
            <Separator className='w-full' />
            {pastTrips.map((trip) => (
                <UserSpecificTripCard key={trip.id} trip={trip} />
            ))} */}
        </div>
    );
}
