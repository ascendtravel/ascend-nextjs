'use client';

import Link from 'next/link';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import { FRAMER_LINKS } from '@/config/navigation';

import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function DesktopLeftContentWelcome() {
    const panelVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 60,
                damping: 20,
                duration: 0.7,
                delay: 1.3
            }
        }
    };

    return (
        <motion.div
            className='relative z-10 flex w-1/2 items-center justify-center rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] px-[2%] py-8 backdrop-blur-md'
            variants={panelVariants}
            initial='hidden'
            animate='visible'>
            <div className='flex h-full w-full flex-col justify-between gap-4'>
                <div className='flex w-full items-center justify-between px-8'>
                    <div className='size-24'>
                        <IconNewWhite />
                    </div>
                    <Link href='/auth/phone-login'>
                        <div className='cursor-pointer rounded-full px-6 py-2 text-base font-semibold text-white hover:bg-gray-200/20'>
                            Login
                        </div>
                    </Link>
                </div>
                <div className='flex max-w-2xl flex-col items-start justify-center gap-4'>
                    <div className='flex flex-row items-center justify-start gap-2 p-2 py-3 text-white'>
                        <h1 className='text-figtree text-lg font-bold'>Backed by </h1>
                        <div className='flex flex-row items-center justify-center gap-1'>
                            <div className='size-7 bg-[#f26522] text-center text-xl font-bold'>Y</div>
                        </div>
                    </div>
                    <h1 className='text-figtree text-6xl font-bold text-white drop-shadow-xl xl:text-8xl'>
                        Smart travelers don't overpay
                    </h1>
                    <h2 className='text-figtree max-w-md text-base font-semibold text-white drop-shadow-sm'>
                        Ascend watches your bookings and gets you money back when <b>Big Travel</b> drops prices. Get
                        start in just 3 steps.
                    </h2>
                    <div className='my-[2rem] flex flex-col items-start justify-center gap-2 text-white'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <div className='size-6'>📧</div>
                            <div>Connect your email to import travel bookings</div>
                        </div>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <div className='size-6'>☎️</div>
                            <div>Add your phone number to get notified</div>
                        </div>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <div className='size-6'>🎉</div>
                            <div>Become a member to start saving</div>
                        </div>
                    </div>
                    <Link href='/onboarding'>
                        <div className='text-md my-[2rem] gap-6 rounded-full bg-white px-8 py-3 text-center font-bold text-neutral-700 shadow-lg'>
                            Import my travel bookings
                        </div>
                    </Link>
                </div>
                <div className='flex flex-wrap items-center justify-center text-white/60 transition-colors'>
                    <div className='flex flex-row items-center justify-center gap-2'>
                        <a
                            href={FRAMER_LINKS.privacy}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-figtree text-base transition-colors hover:text-white'>
                            Privacy Policy
                        </a>
                        <span className='font-figtree ml-2 pb-2 text-base'>.</span>
                        <a
                            href={FRAMER_LINKS.terms}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-figtree text-base transition-colors hover:text-white'>
                            Terms of Service
                        </a>
                    </div>
                    <div className='flex flex-row items-center justify-center gap-2'>
                        <span className='font-figtree base pb-2 font-bold'>.</span>
                        <p className='font-figtree text-sm'>
                            Copyright {format(new Date(), 'yyyy')} © Ascend. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
