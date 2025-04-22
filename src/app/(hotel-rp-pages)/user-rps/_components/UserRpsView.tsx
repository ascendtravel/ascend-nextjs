'use client';

import React, { useEffect, useState } from 'react';

import { Trip } from '@/app/api/rp-trips/route';
import { useTripsRp } from '@/contexts/TripsRpContext';

import FlightMap from './FlightMap';
import FlightTripRpGridCard from './FlightTripRpGridCard';
import HotelStayRPGridCard from './HotelStayRPGridCard';
import RpFooterSection from './RpFooterSection';
import RpGridCardWrapper from './RpGridCardWrapper';
import UserRpSpecificTripSelectedView from './UserRpSpecificTripSelectedView/UserRpSpecificTripSelectedView';
import { AnimatePresence, motion } from 'framer-motion';

export default function UserRpsView() {
    const { trips, isLoading, error } = useTripsRp();
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [showSpecificTrip, setShowSpecificTrip] = useState(false);

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <div>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <div>Error: {error}</div>
            </div>
        );
    }

    // Get flight segments from trips
    const segments = trips
        .filter((trip) => trip.type === 'flight')
        .map((trip) => ({
            from: {
                iataCode: trip.departure_city,
                // You would need to add these to your trip type or fetch from a mapping
                latitude: 33.9416,
                longitude: -118.4085
            },
            to: {
                iataCode: trip.arrival_city,
                latitude: 37.7749,
                longitude: -122.4194
            }
        }));

    const handleTripClick = (trip: Trip) => {
        setSelectedTrip(trip);
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedTrip) {
            setTimeout(() => {
                setShowSpecificTrip(true);
            }, 1000);
        }
    }, [selectedTrip]);

    const years = ['Upcoming', 2025, 2024, 2023];

    return (
        <div className='h-full w-full max-w-md rounded-t-xl bg-neutral-50'>
            {/* <UserRpsView /> */}
            <div className='relative -mt-2 h-[400px] w-full overflow-hidden rounded-t-xl'>
                <FlightMap segments={[]} showResetBtn={false} />
            </div>
            <div className='relative -mt-20 flex w-full flex-row items-center justify-center rounded-t-xl bg-neutral-50/50 px-4 pt-2 pb-4'>
                {years.map((year) => (
                    <React.Fragment key={year}>
                        {year === 'Upcoming' ? (
                            <div key={year} className='flex w-full rounded-full bg-[#1DC167] px-2 text-neutral-50'>
                                {year}
                            </div>
                        ) : (
                            <div key={year} className='flex w-full px-4 py-2 font-semibold'>
                                {year}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <div className='relative -mt-2 h-full w-full rounded-t-xl bg-neutral-50'>
                <div className='grid w-full grid-cols-2 gap-2 pt-8'>
                    {!showSpecificTrip ? (
                        <AnimatePresence>
                            {trips.map((trip, index) => (
                                <motion.div
                                    key={trip.type + index}
                                    initial={{ opacity: 1, x: 0 }}
                                    animate={{
                                        opacity: selectedTrip ? 0 : 1,
                                        x: selectedTrip ? (index % 2 === 0 ? -100 : 100) : 0
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    onClick={() => handleTripClick(trip)}>
                                    {trip.type === 'flight' ? (
                                        <div
                                            className={`w-full ${
                                                index % 2 === 0 ? 'flex flex-row justify-end' : 'flex flex-row-reverse'
                                            }`}>
                                            <RpGridCardWrapper trip={trip}>
                                                <FlightTripRpGridCard trip={trip} />
                                            </RpGridCardWrapper>
                                        </div>
                                    ) : (
                                        <div
                                            className={`w-full ${
                                                index % 2 === 1
                                                    ? 'flex flex-row justify-start'
                                                    : 'flex flex-row-reverse'
                                            }`}>
                                            <RpGridCardWrapper trip={trip}>
                                                <HotelStayRPGridCard trip={trip} />
                                            </RpGridCardWrapper>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    ) : null}
                </div>

                {showSpecificTrip && <UserRpSpecificTripSelectedView trip={selectedTrip || undefined} />}

                <div className='relative mt-8 h-full w-full bg-neutral-50'>
                    <RpFooterSection email='help@ascend.travel.com' />
                </div>
            </div>
        </div>
    );
}
