'use client';

import React, { useEffect, useState } from 'react';

import { Booking, FlightPayload, HotelPayload } from '@/app/api/rp-trips/route';
import { useTripsRp } from '@/contexts/TripsRpContext';
import { getCurrencyAndAmountText } from '@/lib/money';

// import { cn } from '@/lib/utils';

// import AddTripCard from './AddTripCard';
import { FlightSegmentBasic } from './FlightMap';
import FlightTripRpGridCard from './FlightTripRpGridCard';
import HotelStayRPGridCard from './HotelStayRPGridCard';
import RpFooterSection from './RpFooterSection';
import RpGridCardWrapper from './RpGridCardWrapper';
import RpMap, { Hotel } from './RpMap';
import UserRpNoTripsCard from './UserRpNoTripsCard';
import UserRpNoUpcomingTripsFound from './UserRpNoUpcomingTripsFound';
import UserRpSpecificTripSelectedView from './UserRpSpecificTripSelectedView/UserRpSpecificTripSelectedView';
import { AnimatePresence, motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';

interface UserRpsViewProps {
    initialSelectedTripId?: string;
}

export default function UserRpsView({ initialSelectedTripId }: UserRpsViewProps) {
    const { filteredTrips, isLoading, error, selectedYear, setSelectedYear, allYears } = useTripsRp();
    const [selectedTrip, setSelectedTrip] = useState<Booking | null>(null);
    const [showSpecificTrip, setShowSpecificTrip] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    // Map Data and Types
    const [flightSegments, setFlightSegments] = useState<FlightSegmentBasic[]>([]);
    const [hotelsMapDetails, setHotelsMapDetails] = useState<Hotel[]>([]);
    // Handle initial selected trip
    useEffect(() => {
        if (initialSelectedTripId && filteredTrips.length > 0) {
            const trip = filteredTrips.find((t) => t.import_session_id === initialSelectedTripId);
            if (trip) {
                handleTripClick(trip);
            }
        }
    }, [initialSelectedTripId, filteredTrips]);

    useEffect(() => {
        setFlightSegments([]);
        setHotelsMapDetails([]);
    }, [filteredTrips]);

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <div>Loading...</div>
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className='flex h-full w-full items-center justify-center'>
    //             <div>Error: {error}</div>
    //         </div>
    //     );
    // }

    const handleTripClick = (trip: Booking) => {
        setTimeout(() => {
            // Target the main content wrapper with overflow-scroll
            const mainContent = document.querySelector('#rp-main-content');
            if (mainContent) {
                mainContent.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setShowSpecificTrip(true);
        }, 1000);

        if (trip.payload.potential_savings_cents?.amount && trip.payload.potential_savings_cents.amount > 0) {
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
            }, 8000);
        }

        setSelectedTrip(trip);
        if (trip.type === 'flight') {
            const segment = {
                from: (trip.payload as FlightPayload).departure_airport_iata_code,
                to: (trip.payload as FlightPayload).arrival_airport_iata_code
            };
            // Then set the new segment in the next tick
            setTimeout(() => {
                setFlightSegments([segment]);
            }, 0);
            setHotelsMapDetails([]);
        } else if (trip.type === 'hotel') {
            setHotelsMapDetails([
                {
                    id: trip.id.toString(),
                    lat: (trip.payload as HotelPayload).lat,
                    lon: (trip.payload as HotelPayload).long,
                    price: getCurrencyAndAmountText((trip.payload as HotelPayload).total_price_cents)
                }
            ]);
            // Clear segments when clicking a hotel
            setFlightSegments([]);
        } else {
            setHotelsMapDetails([]);
            setFlightSegments([]);
        }
    };

    useEffect(() => {
        if (selectedTrip) {
            setTimeout(() => {
                // Target the main content wrapper with overflow-scroll
                const mainContent = document.querySelector('#rp-main-content');
                if (mainContent) {
                    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
                }
                setShowSpecificTrip(true);
            }, 500);
        }
    }, [selectedTrip]);

    return (
        <div className='mt-2 h-full w-full rounded-t-xl bg-neutral-50 transition-all duration-300'>
            {showConfetti && (
                <ReactConfetti
                    className='fixed inset-0 z-50'
                    numberOfPieces={400}
                    recycle={showConfetti}
                    gravity={0.1}
                    colors={['#1DC167', '#006DBC', '#5AA6DA', '#FFD700', '#FF69B4']}
                    tweenDuration={200}
                />
            )}
            {/* <UserRpsView /> */}
            <div className='relative -mt-2 h-[260px] w-full overflow-hidden rounded-t-xl md:h-[350px]'>
                {/* {JSON.stringify(flightSegments)} */}
                <RpMap hotels={hotelsMapDetails} flightSegments={flightSegments} showResetBtn={false} />
            </div>
            <AnimatePresence>
                {!selectedTrip && (
                    <motion.div
                        className='relative -mt-20 flex w-full flex-row items-center justify-start rounded-t-xl bg-neutral-50/50 px-4 pt-2 pb-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                            duration: 0.3,
                            ease: 'easeInOut'
                        }}>
                        {allYears.map((year, index) => (
                            <React.Fragment key={`${year} + ${index}`}>
                                <div
                                    onClick={() => setSelectedYear(year)}
                                    className={`flex w-fit cursor-pointer justify-center px-4 py-2 ${
                                        selectedYear === year
                                            ? 'rounded-full bg-[#1DC167] text-neutral-50'
                                            : 'font-semibold'
                                    }`}>
                                    {year}
                                </div>
                            </React.Fragment>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='relative -mt-2 w-full rounded-t-xl bg-neutral-50'>
                {/* Update no trips messaging */}
                {filteredTrips.length === 0 && selectedYear === 'Upcoming' && (
                    <UserRpNoUpcomingTripsFound totalSavings='more than $500' />
                )}

                {filteredTrips.length === 0 && selectedYear !== 'Upcoming' && <UserRpNoTripsCard />}

                <div className='grid w-full grid-cols-2 gap-2 pt-8 md:gap-8'>
                    {!showSpecificTrip ? (
                        <AnimatePresence>
                            {filteredTrips.map((trip, index) => (
                                <motion.div
                                    key={`${trip.id} + ${index}`}
                                    initial={{ opacity: 1, x: 0 }}
                                    animate={{
                                        opacity: selectedTrip ? 0 : 1,
                                        x: selectedTrip ? (index % 2 === 0 ? -100 : 100) : 0
                                    }}
                                    transition={{ duration: 0.5 }}
                                    onClick={() => handleTripClick(trip)}>
                                    {trip.type === 'flight' ? (
                                        <div
                                            className={`w-full ${
                                                index % 2 === 0 ? 'flex flex-row justify-end' : 'flex flex-row'
                                            }`}>
                                            <RpGridCardWrapper trip={trip}>
                                                <FlightTripRpGridCard
                                                    trip={trip as Booking & { type: 'flight'; payload: FlightPayload }}
                                                />
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
                                                <HotelStayRPGridCard
                                                    trip={trip as Booking & { type: 'hotel'; payload: HotelPayload }}
                                                />
                                            </RpGridCardWrapper>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {/* {filteredTrips.length % 2 === 0 && <div key='spacer-div' className='h-full w-full' />} */}
                            {/* <div
                                className={cn('flex w-full cursor-pointer', {
                                    hidden: filteredTrips.length === 0,
                                    'justify-end pr-2': filteredTrips.length % 2 === 1,
                                    'justify-start pl-2': filteredTrips.length % 2 === 2
                                })}>
                                <AddTripCard />
                            </div> */}
                        </AnimatePresence>
                    ) : null}
                </div>

                {showSpecificTrip && (
                    <UserRpSpecificTripSelectedView
                        handleBackClick={() => {
                            setShowSpecificTrip(false);
                            setSelectedTrip(null);
                            setFlightSegments([]);
                            setHotelsMapDetails([]);
                            setShowConfetti(false);
                        }}
                        trip={selectedTrip || undefined}
                    />
                )}

                <div className='relative mt-2 h-full w-full bg-neutral-50'>
                    <RpFooterSection />
                </div>
            </div>
        </div>
    );
}
