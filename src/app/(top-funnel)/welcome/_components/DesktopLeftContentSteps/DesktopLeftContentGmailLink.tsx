'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import OnboardingFooterWithLock from '@/app/(top-funnel)/welcome/_components/OnboardingFooterWithLock';
import OnboardingGmailCheckCta from '@/app/(top-funnel)/welcome/_components/OnboardingGmailCheckCta';

import { motion } from 'framer-motion';

export default function DesktopLeftContentGmailLink() {
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    const contentVariants = {
        hidden: { x: '-50%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 50,
                damping: 18,
                duration: 0.6
            }
        }
    };

    return (
        <div className='relative z-10 flex w-1/2 items-center justify-start rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] px-[2%] py-8 backdrop-blur-md'>
            <div className='flex h-full flex-col items-center justify-between gap-4'>
                <motion.div
                    className='flex flex-1 flex-col items-center justify-center gap-4 pt-12'
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'>
                    <div>
                        <div className='mb-4 flex flex-col items-start justify-center gap-4'>
                            <p className='font-figtree max-w-md text-left text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                                Use Gmail to automatically import your reservations
                            </p>
                            <p className='font-figtree max-w-xs text-left text-[14px] leading-[20px] font-medium text-white'>
                                We'll only import your existing and upcoming travel reservations
                            </p>
                        </div>

                        <div className='-ml-26 flex flex-1 items-center justify-center'>
                            <OnboardingGmailCheckCta />
                        </div>

                        <Link href={`https://gmail.heyascend.com/gmail/import/start/${state_id || ''}`}>
                            <div className='font-figtree mt-8 ml-2 flex w-fit items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-neutral-900 transition-all hover:bg-white/90'>
                                <Image
                                    src='/images/google-icon.png'
                                    alt='Gmail icon'
                                    width={24}
                                    height={24}
                                    className='size-6'
                                />
                                Continue with Google
                            </div>
                        </Link>
                        <OnboardingFooterWithLock />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
