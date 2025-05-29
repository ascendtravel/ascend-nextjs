import { useCallback, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { Separator } from '@/components/ui/separator';

import { OnboardingSteps } from '../../_types';
import OnboardingMembershipCardRow from '../OnboardingMembershipCardRow';
import OnboardingStepper from '../OnboardingStepper';
import { motion } from 'framer-motion';

// Hook to get window height, client-side only
function useWindowHeight() {
    const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        // Set initial height again in case it was 0 from SSR
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return height;
}

export default function MobileContentMembership() {
    const [isLoading, setIsLoading] = useState(true);
    const [stripeUrl, setStripeUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');
    const windowHeight = useWindowHeight(); // Use the hook

    // Determine which items are open based on window height
    const getOpenStates = useCallback(() => {
        // if (windowHeight >= 900) {
        //     return [true, true, true]; // All open
        // } else if (windowHeight >= 800) {
        //     return [true, true, false]; // First two open
        // }

        return [true, true, true]; // All open
    }, [windowHeight]);

    const [openStates, setOpenStates] = useState(getOpenStates());

    useEffect(() => {
        setOpenStates(getOpenStates());
    }, [getOpenStates]);

    const mainContentVariants = {
        initial: {
            y: '50vh', // Start further down for a more noticeable slide
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 80,
                damping: 20,
                duration: 0.5 // Added duration for spring if needed, or rely on stiffness/damping
            }
        },
        exit: {
            y: '50vh',
            opacity: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <div className='flex h-screen w-full flex-col items-center justify-start bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] pt-14 sm:pt-36'>
            {/* Scrollable content area */}
            <div className='-mr-5 flex h-[calc(100vh)] flex-col items-center justify-start overflow-y-auto pr-5 pb-20'>
                <div className='flex flex-col items-center justify-center px-4 py-4 pt-[1vh]'>
                    <OnboardingStepper
                        steps={[OnboardingSteps.Step1, OnboardingSteps.Step2, OnboardingSteps.Step3]}
                        currentStep={OnboardingSteps.Step3}
                        failedSteps={[]}
                    />

                    <p className='font-figtree max-w-md px-6 text-center text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                        Get your money back when travel prices drop.
                    </p>
                    <p className='font-figtree mt-4 mb-4 max-w-md px-2 text-center text-[16px] leading-[20px] font-medium text-white'>
                        Ascend works for you, not Big Travel.
                    </p>
                </div>
                <motion.div
                    key='content-step4'
                    variants={mainContentVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'>
                    <div className='flex w-full max-w-lg justify-center px-4 pb-36'>
                        <div className='flex w-full flex-col items-start justify-center gap-3 rounded-2xl bg-neutral-50 p-6'>
                            <span className='text-lg font-bold'>Ascend Membership</span>
                            <div className='flex flex-row gap-3'>
                                <div className='flex items-start justify-start gap-1'>
                                    <span className='font-figtree -mr-1 pt-2 text-xl font-bold text-neutral-900'>
                                        $
                                    </span>
                                    <span className='text-3xl font-bold'>25</span>
                                    <span className='-ml-1 pt-2 text-xl font-bold'>/year</span>
                                </div>
                            </div>
                            <div className='text-neutral-1000 -mt-3 flex flex-row items-center gap-2 text-sm'>
                                <span className='font-semibold'>(just $2/month)</span>
                            </div>
                            <div className='flex w-full flex-col gap-2'>
                                <OnboardingMembershipCardRow
                                    title='Flight Repricings'
                                    description='We average $64 back per flight, harassing the airline to make sure you get your money back.'
                                    isInitiallyOpen={openStates[0]}
                                />
                            </div>
                            <div className='flex w-full flex-col gap-2'>
                                <OnboardingMembershipCardRow
                                    title='Hotel Repricings'
                                    description='We average $116 back per hotel, rebooking you automatically when you could get the same room for less.'
                                    isInitiallyOpen={openStates[1]}
                                />
                            </div>
                            <div className='flex w-full flex-col gap-2'>
                                <OnboardingMembershipCardRow
                                    title='Book anywhere, no restrictions'
                                    description='Expedia, Kayak, airline sites. If the price drops, we catch it and you get paid.'
                                    isInitiallyOpen={openStates[2]}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
