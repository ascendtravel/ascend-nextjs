import Image from 'next/image';

import { Booking, HotelPayload } from '@/app/api/rp-trips/route';

import UserRpHotelDetailsList from './UserRpHotelDetailsList';

interface UserRpHotelConfirmationSectionProps {
    trip: Booking & { type: 'hotel' };
}

export default function UserRpHotelConfirmationSection({ trip }: UserRpHotelConfirmationSectionProps) {
    const hotelPayload = trip.payload as HotelPayload;

    function handleConfirmBooking() {
        throw new Error('Function not implemented.');
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
                    className='mt-4 w-full cursor-pointer rounded-full bg-[#1DC167] py-2 text-center text-sm font-bold text-white'
                    onClick={() => {
                        handleConfirmBooking();
                    }}>
                    My booking details are correct
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
