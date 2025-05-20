import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import UserDetailsMenu from '@/components/UserDetailsMenu';
import { useUser } from '@/contexts/UserContext';
import Intercom from '@intercom/messenger-js-sdk';

import IntercomIcon from '../IntercomIcon';
import MobileMoreFooter from '../MobileMoreFooter';
import WelcomeGreenBedIcon from '../WelcomeGreenBedIcon';
import { WelcomeWhatsNext } from '../WelcomeWhatsNext';

export default function DesktopLeftContentTrips() {
    const { user } = useUser();
    const router = useRouter();
    useEffect(() => {
        Intercom({
            app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? '',
            user_id: user?.id ?? '',
            name: user?.first_name ?? 'Traveler',
            ...(user?.main_email && { email: user?.main_email })
        });
    }, [user]);

    // useEffect(() => {
    //     if (!user?.id) {
    //         // redirect to
    //         router.push(`/auth/phone-login?redirect=/welcome?step=4`);
    //         // /auth/phone-login?redirect=/welcome?step=4
    //     }
    // }, [user]); // TODO: uncomment this when we have a way to redirect to the phone login page

    return (
        <div className='relative z-10 flex w-1/2 items-center justify-center rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] px-[2%] backdrop-blur-md'>
            <div className='flex h-full w-full flex-col'>
                <div className='z-30 mt-4 flex h-16 flex-shrink-0 flex-row items-center justify-between px-8 backdrop-blur-md'>
                    <IconNewWhite className='size-16' />
                    <UserDetailsMenu />
                </div>
                <div className='flex-grow overflow-y-auto py-4'>
                    <div className='relative flex flex-col items-center justify-start gap-4'>
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

                        <MobileMoreFooter />
                    </div>
                </div>
            </div>
        </div>
    );
}
