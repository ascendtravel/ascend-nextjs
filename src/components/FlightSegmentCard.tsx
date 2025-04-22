'use client';

import { FlightTrip } from '@/app/api/rp-trips/route';

import DashDivider from './DashDivider';
import { formatInTimeZone } from 'date-fns-tz';
import { PlaneIcon } from 'lucide-react';

interface FlightSegmentCardProps {
    trip: FlightTrip;
}

export default function FlightSegmentCard({ trip }: FlightSegmentCardProps) {
    if (!trip) return null;

    // Helper functions
    const isNextDay = (departure: string, arrival: string) => {
        const depDate = new Date(departure);
        const arrDate = new Date(arrival);

        return depDate.toISOString().slice(0, 10) !== arrDate.toISOString().slice(0, 10);
    };

    const formatTime = (datetime: string, timezone = 'UTC') => {
        return formatInTimeZone(datetime, timezone, 'hh:mm a');
    };

    const getTimezoneOffset = (datetime: string, timezone = 'UTC') => {
        return formatInTimeZone(datetime, timezone, 'X');
    };

    const getDuration = (departure: string, arrival: string) => {
        const depDate = new Date(departure);
        const arrDate = new Date(arrival);
        const durationMs = arrDate.getTime() - depDate.getTime();
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours} hr ${minutes} min`;
    };

    return (
        <div className='mx-2 flex flex-col gap-4 rounded-lg bg-neutral-200/40 p-4'>
            {/* Flight Times and Locations */}
            <div className='flex flex-row items-center justify-between'>
                <div className='flex w-full flex-col'>
                    <div className='flex w-full flex-row justify-between'>
                        <div className='text-lg font-semibold'>
                            {formatTime(trip.departure_date)}
                            <span className='text-xs text-neutral-600'>({getTimezoneOffset(trip.departure_date)})</span>
                        </div>
                        <div className='text-lg font-semibold'>
                            {formatTime(trip.arrival_date)}
                            <span className='text-xs text-neutral-600'>({getTimezoneOffset(trip.arrival_date)})</span>
                            {isNextDay(trip.departure_date, trip.arrival_date) && (
                                <span className='text-xs text-neutral-500'>+1</span>
                            )}
                        </div>
                    </div>

                    {/* Departure and Arrival Cities */}
                    <div className='relative flex w-full flex-row items-center justify-between'>
                        <div className='text-xs text-neutral-500'>{trip.departure_city}</div>
                        <DashDivider />
                        <div className='text-sm text-neutral-500'>{trip.arrival_city}</div>
                        <div className='absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-row items-center gap-2'>
                            <div className='scale-75 rounded-sm bg-neutral-200 px-1 py-0.5 text-sm text-neutral-600'>
                                {getDuration(trip.departure_date, trip.arrival_date)}
                            </div>
                            <div className='flex flex-row items-center gap-2'>
                                <svg
                                    width='17'
                                    height='17'
                                    viewBox='0 0 17 17'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'>
                                    <path
                                        d='M8.31445 15.5171L6.31445 15.5171C6.18184 15.5171 6.05467 15.4644 5.9609 15.3706C5.86713 15.2769 5.81445 15.1497 5.81445 15.0171C5.81438 14.9841 5.81773 14.9512 5.82445 14.919L6.75195 10.2671L5.26883 10.2671L4.1657 11.3708C4.07247 11.464 3.94623 11.5165 3.81445 11.5171L2.31445 11.5171C2.23251 11.5172 2.15178 11.4972 2.07938 11.4588C2.00698 11.4205 1.94512 11.3649 1.89925 11.297C1.85338 11.229 1.82491 11.1509 1.81633 11.0694C1.80776 10.9879 1.81935 10.9056 1.85008 10.8296L2.7757 8.51709L1.85008 6.20459C1.81935 6.12862 1.80776 6.04627 1.81633 5.96477C1.82491 5.88327 1.85338 5.80513 1.89925 5.73722C1.94512 5.66931 2.00698 5.61372 2.07938 5.57534C2.15178 5.53695 2.23251 5.51695 2.31445 5.51709L3.81445 5.51709C3.88013 5.51704 3.94518 5.52993 4.00588 5.55502C4.06658 5.58012 4.12173 5.61692 4.1682 5.66334L5.27133 6.76709L6.75195 6.76709L5.82445 2.11521C5.81773 2.08294 5.81438 2.05006 5.81445 2.01709C5.81445 1.88448 5.86713 1.7573 5.9609 1.66354C6.05467 1.56977 6.18184 1.51709 6.31445 1.51709L8.31445 1.51709C8.40734 1.51702 8.49841 1.54283 8.57746 1.59163C8.6565 1.64042 8.72039 1.71027 8.76195 1.79334L11.2482 6.76709L14.0645 6.76709C14.5286 6.76709 14.9737 6.95146 15.3019 7.27965C15.6301 7.60784 15.8145 8.05296 15.8145 8.51709C15.8145 8.98122 15.6301 9.42634 15.3019 9.75453C14.9737 10.0827 14.5286 10.2671 14.0645 10.2671L11.2482 10.2671L8.76195 15.2408C8.72038 15.3239 8.6565 15.3938 8.57746 15.4426C8.49841 15.4913 8.40734 15.5172 8.31445 15.5171Z'
                                        fill='#BEBEBE'
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Airline Info and Duration */}
            <div className='flex w-full items-center justify-between gap-2 text-sm text-neutral-500'>
                <div>
                    <span>
                        <span className='font-semibold'>GRU</span>
                        <span className='text-xs text-neutral-500'> (Sao Paulo)</span>
                    </span>
                </div>
                <div>
                    <span>
                        <span className='font-semibold'>ATX</span>
                        <span className='text-xs text-neutral-500'> (Austin)</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
