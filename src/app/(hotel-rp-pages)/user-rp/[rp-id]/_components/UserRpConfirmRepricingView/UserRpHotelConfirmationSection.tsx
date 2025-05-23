'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Booking, HotelPayload } from '@/app/api/rp-trips/route';
import { useUser } from '@/contexts/UserContext';
import { trackLuckyOrangeEvent } from '@/lib/analytics';
import { getCurrencyAndAmountText } from '@/lib/money';

import UserRpHotelDetailsList from './UserRpHotelDetailsList';
import { toast } from 'sonner';

interface UserRpHotelConfirmationSectionProps {
    trip: Booking & { type: 'hotel' };
}

export default function UserRpHotelConfirmationSection({ trip }: UserRpHotelConfirmationSectionProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const hotelPayload = trip.payload as HotelPayload;
    const { getToken, getImpersonateUserId } = useUser();
    const router = useRouter();

    async function handleConfirmBooking() {
        setIsSubmitting(true);

        if (trip.is_fake) {
            router.push(`/rp-success/${trip.import_session_id}`);

            return;
        }

        try {
            const impersonateUserId = getImpersonateUserId();
            const url = new URL('/api/hotel-rp/approved', window.location.origin);

            if (impersonateUserId) {
                url.searchParams.set('impersonationId', impersonateUserId);
            }

            const approveResponse = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    repricing_session_id: trip.payload.repricing_session_id
                })
            });

            if (!approveResponse.ok) {
                const errorData = await approveResponse.json();
                throw new Error(errorData.error || 'Failed to approve booking');
            }
            toast.success('Booking approved!');
            trackLuckyOrangeEvent('hotel-rebook-me-btn-clicked', {
                View: 'hotel_rp_confirmation_section',
                TripId: trip.import_session_id,
                TripType: trip.type,
                Description: 'User clicked rebook me button on hotel rp confirmation section'
            });
            // Navigate to payment view or next step
        } catch (error) {
            console.error('Error approving booking:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to approve booking');
        } finally {
            // TODO: DONT LIKE THIS, WE SHOULD AT LEAST RAISE A SENTRY ERROR
            router.push(`/rp-success/${trip.import_session_id}`);
        }
    }

    return (
        <div className='flex flex-col pb-16'>
            <div className='px-6 text-lg font-semibold'>
                Review the details below, and confirm your new booking. We'll handle cancelling your old, more expensive
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
                nightlyPriceCurrency={hotelPayload.price_per_night_cents.currency || 'USD'}
                localTaxesAndFees={getCurrencyAndAmountText(hotelPayload.local_tax_and_fees_cents, true, true)}
                totalPrice={getCurrencyAndAmountText(hotelPayload.total_price_cents, true, true)}
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
                nights={hotelPayload.nights}
                quoteData={
                    hotelPayload.booking_id === 'fake'
                        ? {
                              quote_id: '',
                              quote_room_type: 'Deluxe Fake Room For Test'
                          }
                        : hotelPayload.quote_props
                }
                savings={getCurrencyAndAmountText(hotelPayload.potential_savings_cents, true, true)}
            />
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
