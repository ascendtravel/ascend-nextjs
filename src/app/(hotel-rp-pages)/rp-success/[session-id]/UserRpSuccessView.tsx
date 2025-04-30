'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Booking, FlightPayload, HotelPayload } from '@/app/api/rp-trips/route';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTripsRp } from '@/contexts/TripsRpContext';
import { useUser } from '@/contexts/UserContext';
import { getCurrencyAndAmountText } from '@/lib/money';

import FlightSuccessView from './_components/FlightSuccessView';
import HotelSuccessView from './_components/HotelSuccessView';
import { CircleCheck } from 'lucide-react';
import Confetti from 'react-confetti';
import { toast } from 'sonner';

interface UserRpSuccessViewProps {
    tripId: string;
}

export default function UserRpSuccessView({ tripId }: UserRpSuccessViewProps) {
    const { getTrip } = useTripsRp();
    const trip = getTrip(tripId);
    const [isLoading, setIsLoading] = useState(false);
    const { getToken, getImpersonateUserId } = useUser();

    if (!trip) return null;

    const handlePayment = async () => {
        if (trip.type !== 'hotel') return;

        setIsLoading(true);
        try {
            const impersonateUserId = getImpersonateUserId();

            const url = new URL('/api/hotel-rp/payment-link', window.location.origin);

            if (impersonateUserId) {
                url.searchParams.set('impersonationId', impersonateUserId);
            }

            const redirectUrl = `${window.location.origin}/user-rps`;

            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    repricing_session_id: trip.payload.repricing_session_id,
                    redirect_url: redirectUrl
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get payment link');
            }

            const { stripe_link_url } = await response.json();
            if (!stripe_link_url) {
                throw new Error('No payment link received');
            }

            // Redirect to Stripe
            window.location.href = stripe_link_url;
        } catch (error) {
            console.error('Error getting payment link:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to process payment');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex min-h-full w-full flex-col'>
            <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={500} recycle={false} />

            {/* Header Section */}
            <div className='flex flex-col gap-2 px-6 pt-8'>
                <div className='flex w-full flex-row items-center justify-start gap-2'>
                    <CircleCheck className='size-5 text-[#2B9136]' />
                    <div className='w-full text-lg font-bold text-[#2B9136]'>Payment Confirmed!</div>
                </div>
                <div className='w-full text-left text-2xl font-bold text-neutral-900'>
                    You pocketed {trip.type === 'hotel' ? 'an extra' : ''}{' '}
                    {getCurrencyAndAmountText(trip.payload.potential_savings_cents)}!
                </div>
                <div className='text-sm text-neutral-900'>
                    <span className='font-bold'>We're now refunding your existing booking,</span>
                    <br /> and will alert you on SMS and email once it's confirmed.
                </div>
                <div className='text-sm text-neutral-900'>
                    Below are the confirmation details for you new reservation:
                </div>
            </div>

            {/* Content Section - Expands to fill available space */}
            <div className='flex flex-1 flex-col'>
                {trip.type === 'flight' && <FlightSuccessView trip={trip as Booking & { payload: FlightPayload }} />}
                {trip.type === 'hotel' && <HotelSuccessView trip={trip as Booking & { payload: HotelPayload }} />}
            </div>

            {/* Footer Section - Updated for hotels */}
            <div className='mt-auto flex w-full flex-col items-center px-6 pb-8 text-sm text-neutral-500'>
                <div className='mb-8 flex flex-row items-center justify-center gap-2'>
                    Need Help? <a href='mailto:help@ascend.travel'>help@ascend.travel</a>
                </div>
                <Separator className='w-full' />
                {trip.type === 'hotel' ? (
                    <Button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className='mt-4 w-full rounded-full bg-[#1DC167] font-bold text-white'>
                        {isLoading ? 'Processing...' : 'Pay Now'}
                    </Button>
                ) : (
                    <Link href='/user-rps' className='mt-4 w-full'>
                        <Button className='w-full rounded-full bg-[#1DC167] font-bold text-white'>
                            Back to My Trips
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
