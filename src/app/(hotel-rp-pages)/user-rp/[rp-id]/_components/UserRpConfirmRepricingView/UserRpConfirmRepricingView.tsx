'use client';

import { useRouter } from 'next/navigation';

import { Booking } from '@/app/api/rp-trips/route';
import BackGreenButton from '@/components/BackGreenButton';
import { useTripsRp } from '@/contexts/TripsRpContext';

import UserRpFlightConfirmationSection from './UserRpFlightConfirmationSection';
import UserRpHotelConfirmationSection from './UserRpHotelConfirmationSection';

interface UserRpConfirmRepricingViewProps {
    rpId: string;
}

export default function UserRpConfirmRepricingView({ rpId }: UserRpConfirmRepricingViewProps) {
    const router = useRouter();
    const { getTrip } = useTripsRp();
    const trip = getTrip(rpId);

    if (!trip) return null;

    return (
        <div className='absolute inset-0 mt-[60px] flex h-full flex-col overflow-y-auto rounded-t-xl bg-neutral-50'>
            <div className='px-6 pt-10'>
                <BackGreenButton
                    onClick={() => {
                        router.push(`/user-rp/${rpId}?view-state=ConfirmUserInfo`);
                    }}
                    preventNavigation={true}
                />
            </div>
            <div className='mb-4 px-6 text-3xl font-semibold'>Review your pricing</div>
            {trip.type === 'flight' ? (
                <UserRpFlightConfirmationSection trip={{ ...trip, type: 'flight' } as Booking & { type: 'flight' }} />
            ) : trip.type === 'hotel' ? (
                <UserRpHotelConfirmationSection trip={{ ...trip, type: 'hotel' } as Booking & { type: 'hotel' }} />
            ) : null}
        </div>
    );
}
