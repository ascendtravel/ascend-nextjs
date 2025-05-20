import { useEffect } from 'react';

import { useUser } from '@/contexts/UserContext';
import Intercom from '@intercom/messenger-js-sdk';

import IntercomIcon from '../IntercomIcon';
import WelcomeGreenBedIcon from '../WelcomeGreenBedIcon';
import { WelcomeWhatsNext } from '../WelcomeWhatsNext';

export default function DesktopLeftContentTrips() {
    const { user } = useUser();

    useEffect(() => {
        Intercom({
            app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? '',
            user_id: user?.id ?? '',
            name: user?.first_name ?? 'Traveler',
            ...(user?.main_email && { email: user?.main_email })
        });
    }, [user]);

    return (
        <div className='relative z-10 flex w-1/2 items-center justify-center rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] px-[2%] py-8 backdrop-blur-md'>
            <div className='flex h-full flex-col items-center justify-between gap-4'>
                <div className='flex h-full flex-col items-center justify-center gap-4'>
                    <WelcomeWhatsNext
                        componenHeader="Here's what to expect next:"
                        rowsInfo={[
                            {
                                content:
                                    "Keep traveling exactly how you do. We'll automatically monitor your bookings for opportunities to save you money."
                            },
                            {
                                content:
                                    "We'll notify you when we find an opportunity, and our team will keep you posted as we work to get a refund."
                            },
                            {
                                content: "You'll get your money back"
                            }
                        ]}
                    />
                    <div className='flex max-w-md flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-50 p-6'>
                        <WelcomeGreenBedIcon />
                        <div className='text-lg font-semibold'>Members-Only Deals</div>
                        <div className='text-center text-sm text-neutral-800'>
                            Your membership includes members-only deals on hotels and flights, just message us your
                            destination and we'll handle the rest!
                        </div>
                        {/* <Link href='https://wa.me/14257280395' target='_blank'>
                            <Button className='rounded-full bg-[#1DC167] !px-12 py-3'>Message Us</Button>
                        </Link> */}
                        <div className='flex max-w-md flex-row items-center justify-center gap-2 rounded-2xl bg-neutral-50 p-6'>
                            <div className='rounded-full bg-[#006DBC] p-2'>
                                <IntercomIcon className='size-4 text-white' />
                            </div>
                            <div className='rounded-full py-3 text-left text-sm font-semibold text-neutral-700 drop-shadow-md'>
                                Touch the chat icon in the bottom right corner to message us!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
