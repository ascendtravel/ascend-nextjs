'use client';

import { useEffect, useState } from 'react';

import { Booking, FlightPayload } from '@/app/api/rp-trips/route';
import { Airport } from '@/types/flight-types';

import DashDivider from './DashDivider';
import { formatInTimeZone } from 'date-fns-tz';
import { PlaneIcon } from 'lucide-react';

interface FlightSegmentCardProps {
    trip: Booking & { type: 'flight' };
}

export default function FlightSegmentCard({ trip }: FlightSegmentCardProps) {
    const [airports, setAirports] = useState<Airport[]>([]);
    const flightPayload = trip.payload as FlightPayload;

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                const response = await fetch('/api/airport', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        airport_iata_codes: [
                            flightPayload.departure_airport_iata_code,
                            flightPayload.arrival_airport_iata_code
                        ]
                    })
                });

                if (!response.ok) throw new Error('Failed to fetch airports');
                const data = await response.json();
                setAirports(data);
            } catch (error) {
                console.error('Error fetching airports:', error);
            }
        };

        fetchAirports();
    }, [flightPayload.departure_airport_iata_code, flightPayload.arrival_airport_iata_code]);

    // Helper functions
    const getAirportTimezone = (iataCode: string): string => {
        const airport = airports.find((a) => a.iataCode === iataCode);

        return airport?.timezone || 'UTC';
    };

    const formatTime = (time: string | null, timezone: string) => {
        if (!time) return '--:--';
        try {
            return formatInTimeZone(new Date(), timezone, 'hh:mm a');
        } catch (error) {
            console.error('Error formatting time:', error);

            return '--:--';
        }
    };

    const getTimezoneOffset = (datetime: string, timezone: string) => {
        return formatInTimeZone(datetime, timezone, 'X');
    };

    const isNextDay = (departure: string, arrival: string) => {
        const depDate = new Date(departure);
        const arrDate = new Date(arrival);

        return depDate.toISOString().slice(0, 10) !== arrDate.toISOString().slice(0, 10);
    };

    const getDuration = (departure: string, arrival: string) => {
        const depDate = new Date(departure);
        const arrDate = new Date(arrival);
        const durationMs = arrDate.getTime() - depDate.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours} hr ${minutes} min`;
    };

    const departureTz = getAirportTimezone(flightPayload.departure_airport_iata_code);
    const arrivalTz = getAirportTimezone(flightPayload.arrival_airport_iata_code);

    return (
        <div className='mx-2 flex flex-col gap-4 rounded-lg bg-neutral-200/40 p-4'>
            <div className='flex flex-row items-center justify-between'>
                <div className='flex w-full flex-col'>
                    <div className='flex w-full flex-row justify-between'>
                        <div className='text-lg font-semibold'>
                            {formatTime(flightPayload.departure_time, departureTz)}
                            <span className='text-xs text-neutral-600'>
                                ({getTimezoneOffset(flightPayload.departure_date, departureTz)})
                            </span>
                        </div>
                        <div className='text-lg font-semibold'>
                            {formatTime(flightPayload.arrival_time, arrivalTz)}
                            <span className='text-xs text-neutral-600'>
                                ({getTimezoneOffset(flightPayload.arrival_date || '', arrivalTz)})
                            </span>
                            {isNextDay(flightPayload.departure_date, flightPayload.arrival_date || '') && (
                                <span className='text-xs text-neutral-500'>+1</span>
                            )}
                        </div>
                    </div>

                    <div className='relative flex w-full flex-row items-center justify-between'>
                        <div className='text-xs text-neutral-500'>{flightPayload.departure_airport_iata_code}</div>
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                            <PlaneIcon className='h-4 w-4 text-neutral-700/50' />
                        </div>
                        <DashDivider />
                        <div className='text-sm text-neutral-500'>{flightPayload.arrival_airport_iata_code}</div>
                    </div>
                </div>
            </div>

            <div className='flex w-fit items-center gap-2 text-sm text-neutral-500'>
                <img
                    src={`https://www.skyscanner.net/images/airlines/small/${flightPayload.airline_iata_id.toLowerCase()}.png`}
                    alt={flightPayload.airline}
                    className='h-8 rounded-md'
                />
                <div>Non-stop</div>
                <div className='mb-2'>•</div>
                <div>{getDuration(flightPayload.departure_date, flightPayload.arrival_date || '')}</div>
            </div>
        </div>
    );
}
