'use client';

import { useEffect, useState } from 'react';

import { Trip } from '@/app/api/rp-trips/route';
import { Separator } from '@/components/ui/separator';
import { useTripsRp } from '@/contexts/TripsRpContext';

import UserSpecificTripCard from './UserSpecificTripCard';

interface UserRpSpecificTripSelectedViewProps {
    trip?: Trip;
}

export default function UserRpSpecificTripSelectedView({ trip }: UserRpSpecificTripSelectedViewProps) {
    const { trips } = useTripsRp();
    const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
    const [pastTrips, setPastTrips] = useState<Trip[]>([]);

    useEffect(() => {
        if (trips && trips.length > 0) {
            setUpcomingTrips([trips[0], trips[1]]);
            setPastTrips([trips[2], trips[3]]);
        }
    }, [trips]);

    return (
        <div className='-mt-2 flex flex-col items-center justify-center gap-4 px-2'>
            <div className='w-full pl-4 text-left text-sm uppercase'>Upcoming Trips ({upcomingTrips.length})</div>
            {upcomingTrips.map((trip) => (
                <UserSpecificTripCard key={trip.id} trip={trip} />
            ))}
            <div>PastTrips ({pastTrips.length})</div>
            <Separator className='w-full' />
            {pastTrips.map((trip) => (
                <UserSpecificTripCard key={trip.id} trip={trip} />
            ))}
        </div>
    );
}
