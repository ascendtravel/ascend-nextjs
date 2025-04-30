'use client';

import { useRouter } from 'next/navigation';

import { Booking, FlightPayload, HotelPayload } from '@/app/api/rp-trips/route';
import BackGreenButton from '@/components/BackGreenButton';
import { useTripsRp } from '@/contexts/TripsRpContext';

import FlightUpdateDetailsView from './FlightUpdateDetailsView';
import HotelUpdateDetailsView from './HotelUpdateDetailsView';

type RpUpdateDetailsViewProps = {
    rpId: string;
};

export default function RpUpdateDetailsView({ rpId }: RpUpdateDetailsViewProps) {
    const { getTrip } = useTripsRp();
    const router = useRouter();

    const trip = getTrip(rpId);
    const tripType = trip?.type;

    return (
        <div className='mt-2 h-full w-full rounded-t-xl bg-neutral-50 transition-all duration-300'>
            <div className='p-4'>
                <BackGreenButton
                    onClick={() => {
                        router.push(`/user-rp/${rpId}?view-state=ConfirmRepricing`);
                    }}
                />
                <div className='mt-4 text-2xl font-bold'>Update your details</div>
            </div>

            <div className='relative -mt-2 w-full rounded-t-xl bg-neutral-50'>
                {tripType === 'hotel' && <HotelUpdateDetailsView trip={trip as Booking & { payload: HotelPayload }} />}
                {tripType === 'flight' && (
                    <FlightUpdateDetailsView trip={trip as Booking & { payload: FlightPayload }} />
                )}
            </div>
        </div>
    );
}
