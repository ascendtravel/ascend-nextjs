'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import UserDetailsMenu from '@/components/UserDetailsMenu';
import { useUser } from '@/contexts/UserContext';
import { EventLists, trackLuckyOrangeEvent } from '@/lib/analytics';
import Intercom from '@intercom/messenger-js-sdk';

import MessageUsBtn from '../MessageUsBtn';
import MobileMoreFooter from '../MobileMoreFooter';
import { MobileWelcomeMap } from '../MobileWelcomeMap';
import WelcomeGreenBedIcon from '../WelcomeGreenBedIcon';
import { WelcomeWhatsNext } from '../WelcomeWhatsNext';
import { motion } from 'framer-motion';

export default function MobileContentTrips() {
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
        <div className='relative h-screen overflow-hidden bg-[#006DBC] text-center'>
            <div className='fixed top-0 right-0 left-0 z-30 flex h-16 w-full flex-row items-center justify-between bg-[#006DBC]/60 px-4 backdrop-blur-md'>
                <IconNewWhite className='size-16' />
                <UserDetailsMenu />
            </div>

            <div className='fixed top-16 right-0 left-0 z-10 h-[50vh] w-full overflow-hidden'>
                <MobileWelcomeMap />
            </div>

            <div className='absolute inset-0 z-20 overflow-y-auto'>
                <div className='h-[calc(16px+50vh+16px)]'></div>

                <div className='flex min-h-[60vh] flex-col items-center justify-start gap-6 rounded-t-2xl bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] p-4 text-left'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: 0.2,
                            ease: 'easeOut'
                        }}>
                        <div className='-mt-2 mb-3 flex w-full flex-row items-center justify-center'>
                            <div className='h-1 w-1/3 rounded-full bg-neutral-50/50 drop-shadow-md' />
                        </div>
                        <WelcomeWhatsNext
                            componenHeader="We're importing your trips..."
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
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: 0.2,
                            ease: 'easeOut'
                        }}>
                        <div className='flex max-w-md flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-50 p-6'>
                            <WelcomeGreenBedIcon />
                            <div className='text-lg font-semibold'>Plan a trip!</div>
                            <div className='text-center text-sm text-neutral-800'>
                                Your membership includes members-only deals on hotels and flights, just message us your
                                destination and we'll handle the rest!
                            </div>

                            <div className='mt-8 text-center text-sm text-neutral-800'>
                                Chat with us on WhatsApp to plan itineraries and book a trip!
                            </div>

                            <MessageUsBtn />
                        </div>
                    </motion.div>

                    <MobileMoreFooter />
                </div>
            </div>
        </div>
    );
}
