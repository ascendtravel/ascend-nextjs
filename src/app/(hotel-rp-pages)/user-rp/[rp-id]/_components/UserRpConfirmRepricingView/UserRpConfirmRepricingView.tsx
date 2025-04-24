'use client';

import { useRouter } from 'next/navigation';

import { FlightTrip, HotelTrip } from '@/app/api/rp-trips/route';
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

    // const trip = getTrip(rpId);
    // const trip = getTrip('FL001');
    // HT001
    const trip = getTrip('HT001');

    return (
        <div className='absolute inset-0 mt-[72px] flex flex-col rounded-t-xl bg-neutral-50'>
            <div className='px-6 pt-10'>
                <BackGreenButton
                    onClick={() => {
                        router.push(`/user-rp/${rpId}?view-state=ConfirmUserInfo`);
                    }}
                />
            </div>
            <div className='mb-4 px-6 text-3xl font-semibold'>Review your pricing</div>
            {trip?.type === 'flight' ? (
                <UserRpFlightConfirmationSection trip={trip as FlightTrip} />
            ) : (
                <UserRpHotelConfirmationSection trip={trip as HotelTrip} />
            )}
        </div>
    );
}
