'use client';

import { useEffect, useState } from 'react';

import { Trip } from '@/app/api/rp-trips/route';
import { useTripsRp } from '@/contexts/TripsRpContext';

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
        <div className='flex flex-col items-center justify-center gap-4'>
            <div>UpcomingTrips</div>
        </div>
    );
}
