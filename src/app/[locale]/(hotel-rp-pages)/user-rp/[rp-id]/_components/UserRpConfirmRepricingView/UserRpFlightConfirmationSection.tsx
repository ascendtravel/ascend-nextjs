'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Booking, FlightPayload } from '@/app/api/rp-trips/route';
import { useUser } from '@/contexts/UserContext';
import { trackLuckyOrangeEvent } from '@/lib/analytics';
import { getCurrencyAndAmountText } from '@/lib/money';
import { Airport } from '@/types/flight-types';

import { toast } from 'sonner';

interface UserRpFlightConfirmationSectionProps {
    trip: Booking & { type: 'flight' };
}

export default function UserRpFlightConfirmationSection({ trip }: UserRpFlightConfirmationSectionProps) {
    const router = useRouter();
    const { getToken, user, getImpersonateUserId } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const flightPayload = trip.payload as FlightPayload;
    const [airports, setAirports] = useState<Airport[]>([]);

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

    const getDepartureAirport = () => airports.find((a) => a.iataCode === flightPayload.departure_airport_iata_code);
    const getArrivalAirport = () => airports.find((a) => a.iataCode === flightPayload.arrival_airport_iata_code);

    async function handleConfirmBooking() {
        setIsSubmitting(true);

        if (trip.is_fake) {
            router.push(`/rp-success/${trip.import_session_id}`);

            return;
        }

        const impersonationId = getImpersonateUserId();

        try {
            const response = await fetch('/api/flight-rp/approval_info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    repricing_session_id: flightPayload.repricing_session_id,
                    // citizenship: user?.citizenship || 'US' // TODO: Get from user
                    citizenship: 'US', // Mock citizenship for demo
                    impersonate_user_id: impersonationId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to confirm booking');
            }

            trackLuckyOrangeEvent('flight-rebook-me-btn-clicked', {
                View: 'flight_rp_confirmation_section',
                TripId: trip.import_session_id,
                TripType: trip.type,
                Description: 'User clicked rebook me button on flight rp confirmation section'
            });

            toast.success('Booking confirmed!');
        } catch (error) {
            console.error('Error confirming booking:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to confirm booking');
        } finally {
            // TODO: DONT LIKE THIS, WE SHOULD AT LEAST RAISE A SENTRY ERROR
            router.push(`/rp-success/${trip.import_session_id}`);
        }
    }

    return (
        <div className='space-y-4'>
            <div className='px-6 text-lg font-semibold'>
                Review the details below, and click on continue to confirm your flight updates:
            </div>

            <div className='flex flex-row items-center justify-between px-4'>
                <div>
                    <span className='font-medium'>Flight </span>
                    <span>{flightPayload.outbound_flight_numbers[0]}</span>
                </div>
                <div>
                    <span className='font-medium'>Departure </span>
                    <span>{flightPayload.departure_date.split('T')[0].split('-').reverse().join('/')}</span>
                </div>
            </div>

            <div className='flex w-full flex-row items-center justify-between px-6 text-sm text-neutral-700'>
                <div className='font-medium'>From</div>
                <div>
                    {getDepartureAirport()?.city} ({flightPayload.departure_airport_iata_code})
                </div>
            </div>

            <div className='flex w-full flex-row items-center justify-between px-6 text-sm text-neutral-700'>
                <div className='font-medium'>To</div>
                <div>
                    {getArrivalAirport()?.city} ({flightPayload.arrival_airport_iata_code})
                </div>
            </div>

            <div className='flex w-full flex-row items-center justify-between px-6 text-sm text-neutral-700'>
                <div className='font-medium'>Passenger(s)</div>
                <div>{flightPayload.passenger_name}</div>
            </div>

            <div className='flex w-full flex-row items-center justify-between px-6 text-sm text-neutral-700'>
                <div className='font-medium'>Seat Class</div>
                <div>
                    {flightPayload.seat_class.split('_').join(' ').charAt(0).toUpperCase() +
                        flightPayload.seat_class.split('_').join(' ').slice(1)}
                </div>
            </div>

            <div className='flex w-full flex-row items-center justify-between px-6 text-sm text-neutral-700'>
                <div className='font-medium'>Seat Number</div>
                <div>{flightPayload.seat_number || '--'}</div>
            </div>

            <div className='flex w-full flex-row items-center justify-between px-6 text-sm text-neutral-700'>
                <div className='font-medium'>Total Price</div>
                <div>{getCurrencyAndAmountText(flightPayload.current_price_cents)}</div>
            </div>

            <div className='mt-4 flex w-full flex-col items-center justify-center px-8'>
                <div
                    className={`mt-4 w-full cursor-pointer rounded-full bg-[#1DC167] py-2 text-center text-sm font-bold text-white ${
                        isSubmitting ? 'opacity-50' : ''
                    }`}
                    onClick={() => {
                        if (!isSubmitting) handleConfirmBooking();
                    }}>
                    {isSubmitting ? 'Processing...' : 'Rebook Me'}
                </div>
                <div className='mt-4 mb-8 flex flex-row items-center justify-center gap-2 text-xs text-neutral-700'>
                    Need Help?{' '}
                    <a href='mailto:help@ascend.travel' className='text-neutral-900 underline'>
                        help@ascend.travel
                    </a>
                </div>
            </div>
        </div>
    );
}
