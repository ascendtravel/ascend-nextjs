'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import OnboardingFooterWithLock from '@/app/(top-funnel)/welcome/_components/OnboardingFooterWithLock';
import OnboardingGmailCheckCta from '@/app/(top-funnel)/welcome/_components/OnboardingGmailCheckCta';
import { EventLists, trackLuckyOrangeEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';

import { LINK_FAILURE_PARAM, OnboardingSteps, PERMISSIONS_FAILURE_PARAM } from '../../_types';
import { motion } from 'framer-motion';

export default function DesktopLeftContentGmailLink() {
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    const isLinkFailure = searchParams.get(LINK_FAILURE_PARAM) === 'true';
    const isPermissionsFailure = searchParams.get(PERMISSIONS_FAILURE_PARAM) === 'true';

    let headerKey: OnboardingSteps.Step1 | typeof LINK_FAILURE_PARAM | typeof PERMISSIONS_FAILURE_PARAM =
        OnboardingSteps.Step1;
    if (isLinkFailure) {
        headerKey = LINK_FAILURE_PARAM;
    } else if (isPermissionsFailure) {
        headerKey = PERMISSIONS_FAILURE_PARAM;
    }

    const HeadersContent = {
        [OnboardingSteps.Step1]: {
            title: 'Use Gmail to automatically import your reservations',
            description: "We'll only import your existing and upcoming travel reservations"
        },
        [LINK_FAILURE_PARAM]: {
            title: 'Looks like something went wrong!',
            description: 'Sometimes the connection attempt fails, but worry not! Just click below to try again:'
        },
        [PERMISSIONS_FAILURE_PARAM]: {
            title: 'We need additional permissions to continue!',
            description:
                'It looks like you missed a checkbox for us to import your bookings. Just click below to try again:'
        }
    };

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
        <div className='relative z-10 flex w-1/2 items-center justify-start rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] px-[2%] py-8 pl-14 backdrop-blur-md'>
            <div className='flex h-full flex-col items-center justify-between gap-4'>
                <motion.div
                    className='flex flex-1 flex-col items-center justify-center gap-4 pt-12'
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'>
                    <div>
                        <div className='mb-4 flex flex-col items-start justify-center gap-4'>
                            <p className='font-figtree max-w-md text-left text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                                {HeadersContent[headerKey].title}
                            </p>
                            <p className='font-figtree max-w-xs text-left text-[14px] leading-[20px] font-medium text-white'>
                                {HeadersContent[headerKey].description}
                            </p>
                        </div>

                        <div
                            className={cn(
                                '-ml-26 flex flex-1 items-center justify-center',
                                isPermissionsFailure && '-ml-26',
                                isLinkFailure && '-ml-10'
                            )}>
                            <OnboardingGmailCheckCta />
                        </div>

                        <Link href={`https://gmail.heyascend.com/gmail/import/start/${state_id || ''}`}>
                            <div
                                onClick={() => {
                                    trackLuckyOrangeEvent(EventLists.gmail_layover.name, {
                                        description: EventLists.gmail_layover.description
                                    });
                                }}
                                className='font-figtree mt-8 ml-2 flex w-fit items-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-neutral-900 transition-all hover:bg-white/90'>
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
