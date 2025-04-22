'use client';

import { FlightTrip } from '@/app/api/rp-trips/route';
import FlightSegmentCard from '@/components/FlightSegmentCard';

interface UserRpFlightConfirmationSectionProps {
    trip: FlightTrip;
}

export default function UserRpFlightConfirmationSection({ trip }: UserRpFlightConfirmationSectionProps) {
    if (!trip) return null;

    return (
        <div className='space-y-4'>
            <div className='px-6 text-lg font-semibold'>
                Review the details below, and click on continue to confirm your flight updates:
            </div>

            <div className='mx-6 flex flex-row items-center justify-between'>
                {/* Airline Info */}
                <div>
                    <img
                        src={`https://www.skyscanner.net/images/airlines/small/${trip.airline.toLowerCase()}.png`}
                        alt={trip.airline}
                    />
                </div>
                {/* Airline Info */}
            </div>

            <FlightSegmentCard trip={trip} />
            {/* Additional flight confirmation content */}
        </div>
    );
}
