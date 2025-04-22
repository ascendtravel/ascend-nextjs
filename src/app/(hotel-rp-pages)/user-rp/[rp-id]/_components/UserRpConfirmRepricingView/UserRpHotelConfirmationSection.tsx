import Image from 'next/image';

import { HotelTrip } from '@/app/api/rp-trips/route';

import UserRpHotelDetailsList from './UserRpHotelDetailsList';

interface UserRpHotelConfirmationSectionProps {
    trip: HotelTrip;
}

export default function UserRpHotelConfirmationSection({ trip }: UserRpHotelConfirmationSectionProps) {
    return (
        <div className='flex flex-col pb-24'>
            <div className='px-6 text-lg font-semibold'>
                Review the details below, and pay to confirm your new booking. We'll handle cancelling your current
                reservation.
            </div>
            <div className='relative mt-4 ml-[5%] flex h-[200px] w-[90%] flex-row items-center justify-between overflow-hidden rounded-lg'>
                <Image src={trip.image_url} alt={trip.hotel_name} fill className='absolute object-cover' />
            </div>
            <UserRpHotelDetailsList
                totalGuests={4}
                roomsPersonCombos={[
                    {
                        roomType: 'Single Room',
                        adults: 1,
                        children: 0
                    },
                    {
                        roomType: 'Double Room',
                        adults: 2,
                        children: 2
                    }
                ]}
                guests={[
                    {
                        name: 'John Doe',
                        age: 20,
                        isChild: false
                    },
                    {
                        name: 'Jane Doe',
                        age: 2,
                        isChild: true
                    },
                    {
                        name: 'John 1 Doe',
                        isChild: false
                    },
                    {
                        name: 'Jane 1 Doe',
                        isChild: true
                    }
                ]}
                checkInDate={'25-04-2025'}
                checkOutDate={'26-04-2025'}
                nightlyPrice={300}
                localTaxesAndFees={100}
                totalPrice={1000}
            />
        </div>
    );
}
