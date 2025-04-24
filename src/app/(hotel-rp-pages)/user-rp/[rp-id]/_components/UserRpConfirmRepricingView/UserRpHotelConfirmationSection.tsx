'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Booking, HotelPayload } from '@/app/api/rp-trips/route';
import { useUser } from '@/contexts/UserContext';

import UserRpHotelDetailsList from './UserRpHotelDetailsList';
import { toast } from 'sonner';

interface UserRpHotelConfirmationSectionProps {
    trip: Booking & { type: 'hotel' };
}

export default function UserRpHotelConfirmationSection({ trip }: UserRpHotelConfirmationSectionProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hotelPayload = trip.payload as HotelPayload;
    const { user } = useUser();

    async function handleConfirmBooking() {
        setIsSubmitting(true);

        const redirectUrl = `${window.location.origin}/rp-success/${trip.import_session_id}`;

        try {
            console.log('submitting approval info', {
                repricing_session_id: trip.payload.repricing_session_id,
                first_name: user?.first_name || '',
                last_name: user?.last_name || '',
                birthday: user?.date_of_birth || '',
                citizenship: user?.citizenship || '',
                redirect_url: redirectUrl.toString()
            });

            const response = await fetch('/api/hotel-rp/submit-approval-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    repricing_session_id: trip.payload.repricing_session_id,
                    first_name: user?.first_name || '',
                    last_name: user?.last_name || '',
                    birthday: user?.date_of_birth || '',
                    citizenship: user?.citizenship || '',
                    redirect_url: redirectUrl.toString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to confirm booking');
            }

            const responseData = await response.json();

            if (!responseData.stripe_link_url) {
                throw new Error('No payment link received');
            }

            toast.success('Booking confirmed!');

            // Redirect to Stripe
            window.location.href = responseData.stripe_link_url;
        } catch (error) {
            console.error('Error confirming booking:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to confirm booking');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='flex flex-col pb-16'>
            <div className='px-6 text-lg font-semibold'>
                Review the details below, and pay to confirm your new booking. We'll handle cancelling your current
                reservation.
            </div>
            <div className='relative mt-4 ml-[5%] flex h-[200px] w-[90%] flex-row items-center justify-between overflow-hidden rounded-lg'>
                <Image
                    src={hotelPayload.image_url || '/placeholder-hotel.jpg'}
                    alt={hotelPayload.hotel_name}
                    fill
                    className='absolute object-cover'
                />
            </div>
            <UserRpHotelDetailsList
                checkInDate={hotelPayload.check_in_date}
                checkOutDate={hotelPayload.check_out_date}
                nightlyPrice={
                    hotelPayload.price_per_night_cents.amount ? hotelPayload.price_per_night_cents.amount / 100 : 0
                }
                localTaxesAndFees={
                    hotelPayload.local_tax_and_fees_cents.amount
                        ? hotelPayload.local_tax_and_fees_cents.amount / 100
                        : 0
                }
                totalPrice={hotelPayload.total_price_cents.amount ? hotelPayload.total_price_cents.amount / 100 : 0}
                // These fields aren't in the new API, so using defaults or removing
                totalGuests={1}
                roomsPersonCombos={[
                    {
                        roomType: hotelPayload.room_type,
                        adults: 1,
                        children: 0
                    }
                ]}
                guests={[
                    {
                        name: hotelPayload.guest_name,
                        isChild: false
                    }
                ]}
            />
            <div className='mt-4 flex w-full flex-col items-center justify-center px-8'>
                <div
                    className={`mt-4 w-full cursor-pointer rounded-full bg-[#1DC167] py-2 text-center text-sm font-bold text-white ${
                        isSubmitting ? 'opacity-50' : ''
                    }`}
                    onClick={() => {
                        if (!isSubmitting) handleConfirmBooking();
                    }}>
                    {isSubmitting ? 'Processing...' : 'My booking details are correct'}
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
