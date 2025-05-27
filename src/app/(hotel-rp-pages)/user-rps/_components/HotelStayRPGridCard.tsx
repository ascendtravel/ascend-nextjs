'use client';

import OnboardingMembershipCheckSvg from '@/app/(top-funnel)/welcome/_components/OnboardingMembershipCheckSvg';
import WelcomeGreenBedIcon from '@/app/(top-funnel)/welcome/_components/WelcomeGreenBedIcon';
import { Booking, HotelPayload } from '@/app/api/rp-trips/route';
import { formatDateNoTZ } from '@/lib/date-formatters';

import { DotIcon, MapPinIcon } from 'lucide-react';

interface HotelStayRPGridCardProps {
    trip: Booking & { type: 'hotel'; payload: HotelPayload };
}


const _parseDate = (dateString: string): string => {
    const parsed = formatDateNoTZ(dateString).split(',')[0];
    const date = parsed.split(' ');
    const dd = date[1].length === 1 ? `0${date[1]}` : date[1];
    
return `${date[0]} ${dd}`;
}
export default function HotelStayRPGridCard({ trip }: HotelStayRPGridCardProps) {
    const hasSavings = (trip.payload.potential_savings_cents?.amount ?? 0) > 0;

    return (
        <div className='absolute bottom-0 left-0 flex w-full flex-col p-2 text-neutral-50 shadow-sm'>
            <div className='flex flex-1 flex-col justify-between p-2'>
                <div className='flex flex-col items-start justify-start'>
                    <WelcomeGreenBedIcon size={20} isMask={!hasSavings} bgColor={hasSavings ? '#1DC167' : '#fff'}/>
                    <span className='font-semibold mt-2' style={{ lineHeight: '1.2', marginBottom: '4px', fontWeight: '700' }}>
                        {trip.payload.hotel_name}
                        {hasSavings && <span style={{
                            display: 'inline-block',
                            backgroundColor: '#1DC167',
                            borderRadius: '100%',
                            marginLeft: '6px',
                            marginBottom: '3px',
                            width: '7px',
                            height: '7px',
                            content: "-",
                        }}></span>}
                    </span>
                    <div className='text-xs text-neutral-300'>{_parseDate(trip.payload.check_in_date)} - {_parseDate(trip.payload.check_out_date)}</div>
                </div>
            </div>
        </div>
    );
}
