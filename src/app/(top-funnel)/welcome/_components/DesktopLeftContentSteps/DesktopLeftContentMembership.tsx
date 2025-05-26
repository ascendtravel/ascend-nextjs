'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import OnboardingMembershipCardRow from '@/app/(top-funnel)/welcome/_components/OnboardingMembershipCardRow';
import { Separator } from '@/components/ui/separator';
import { EventLists, trackLuckyOrangeEvent } from '@/lib/analytics';

import { OnboardingSteps } from '../../_types';
import OnboardingStepper from '../OnboardingStepper';
import { motion } from 'framer-motion';

export default function DesktopLeftContentMembership() {
    const [isLoading, setIsLoading] = useState(true);
    const [stripeUrl, setStripeUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    useEffect(() => {
        async function getStripeUrl() {
            if (!state_id) {
                setError('Please contact hey@ascend.travel for assistance');
                setIsLoading(false);

                return;
            }

            // fetch referral code from local storage if present and clear it + send to BE stripe link builder api
            const referral_code = localStorage.getItem('referral_code');
            if (referral_code) {
                localStorage.removeItem('referral_code');
            }
            const stripe_signup_request_body = {
                state_id,
                ...(referral_code ? { referral_code } : {})
            };

            try {
                const response = await fetch('/api/stripe-signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(stripe_signup_request_body)
                });

                const data = await response.json();

                if (data?.signup_link_code) {
                    setStripeUrl(`https://payments.heyascend.com/${data.signup_link_code}`);
                } else {
                    setError('Please contact hey@ascend.travel for assistance');
                }
            } catch (err) {
                console.error('Error getting Stripe signup URL:', err);
                setError('Please contact hey@ascend.travel for assistance');
            } finally {
                setIsLoading(false);
            }
        }

        if (state_id) {
            getStripeUrl();
        } else {
            setIsLoading(false);
        }
    }, [state_id]);

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

    const handleStripeSignup = () => {
        if (stripeUrl) {
            trackLuckyOrangeEvent(EventLists.payment_layover.name, {
                description: EventLists.payment_layover.description
            });
            window.location.href = stripeUrl;
        }
    };

    return (
        <div className='relative z-10 flex h-full w-1/2 flex-col items-stretch justify-start overflow-y-hidden rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] pl-14 backdrop-blur-md transition-all'>
            <div className='-mr-12 flex h-full w-full flex-1 flex-col items-stretch justify-start overflow-x-hidden overflow-y-auto pt-12 pr-12'>
                <div className='ml-2 w-full shrink-0'>
                    <OnboardingStepper
                        steps={[OnboardingSteps.Step1, OnboardingSteps.Step2, OnboardingSteps.Step3]}
                        currentStep={OnboardingSteps.Step3}
                        failedSteps={[]}
                    />
                </div>

                <motion.div
                    className='flex flex-col items-center justify-start'
                    variants={contentVariants}
                    initial='hidden'
                    animate='visible'>
                    <div className='flex w-full flex-col items-center justify-start px-6'>
                        <div className='w-full max-w-lg'>
                            <div className='flex flex-col items-start justify-center gap-4 py-4'>
                                <p className='font-figtree max-w-md text-[36px] leading-[40px] font-extrabold tracking-[-0.02em] text-white'>
                                    Get your money back when travel prices drop.
                                </p>
                                <p className='font-figtree mb-4 text-[20px] leading-[30px] font-medium text-white'>
                                    Ascend works for you, not Big Travel.
                                </p>
                            </div>

                            <div className='flex w-full justify-center pb-12'>
                                <div className='flex w-full flex-col items-start justify-center gap-2 rounded-2xl bg-neutral-50 px-10 py-8'>
                                    <div className='flex flex-row gap-3'>
                                        <div className='flex items-start justify-start gap-1'>
                                            <span className='font-figtree -mr-1 pt-2 text-xl font-bold text-neutral-900'>
                                                $
                                            </span>
                                            <span className='text-3xl font-bold'>25</span>
                                            <span className='-ml-1 pt-2 text-xl font-bold'>/year</span>
                                        </div>
                                    </div>
                                    <div className='text-neutral-1000 -mt-1 flex flex-row items-center gap-2 text-sm'>
                                        <span className='font-semibold'> (just $2/month)</span>
                                    </div>
                                    <div className='mt-1' />
                                    <OnboardingMembershipCardRow
                                        title='Flight Refunds'
                                        description='We average $64 back per flight, harassing the airline to make sure you get your money back.'
                                    />
                                    <div className='mt-1' />
                                    <OnboardingMembershipCardRow
                                        title='Hotel Refunds'
                                        description='We average $116 back per hotel, rebooking you automatically when you could get the same room for less.'
                                    />
                                    <div className='mt-1' />
                                    <OnboardingMembershipCardRow
                                        title='Book anywhere, no restrictions'
                                        description="Expedia, Kayak, airline sites. If the price drops, we catch it and you get paid."
                                    />
                                    <button
                                        onClick={handleStripeSignup}
                                        disabled={isLoading || !!error}
                                        className='mt-4 rounded-full bg-[#17AA59] px-16 py-4 text-base font-medium text-white shadow-md transition-colors hover:bg-[#17AA59]/80 disabled:cursor-not-allowed disabled:opacity-50'>
                                        {error ? (
                                            <a
                                                href='mailto:hey@ascend.travel'
                                                className='text-white hover:text-white/90'>
                                                Contact hey@ascend.travel
                                            </a>
                                        ) : isLoading ? (
                                            'Loading...'
                                        ) : (
                                            'Start saving now'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
