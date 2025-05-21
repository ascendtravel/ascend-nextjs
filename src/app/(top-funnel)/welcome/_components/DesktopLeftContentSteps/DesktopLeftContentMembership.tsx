'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import OnboardingMembershipCardRow from '@/app/(top-funnel)/welcome/_components/OnboardingMembershipCardRow';
import { Separator } from '@/components/ui/separator';

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

            try {
                const response = await fetch('/api/stripe-signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ state_id })
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
            window.location.href = stripeUrl;
        }
    };

    return (
        <div className='relative z-10 flex w-1/2 items-center justify-center rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] px-[2%] py-8 pl-14 backdrop-blur-md transition-all'>
            <motion.div
                className='flex flex-1 flex-col items-center justify-center gap-4'
                variants={contentVariants}
                initial='hidden'
                animate='visible'>
                <div className='flex w-full flex-col items-start justify-center'>
                    <div className='flex flex-col items-start justify-center gap-4 py-4 pt-6 sm:pt-24'>
                        <p className='font-figtree max-w-md text-[36px] leading-[40px] font-extrabold tracking-[-0.02em] text-white'>
                            Ascend works for you, not Big Travel
                        </p>
                        <p className='font-figtree mb-4 text-[20px] leading-[30px] font-medium text-white'>
                            You get the best deals on travel. We get $25. It's that simple!
                        </p>
                    </div>

                    <div className='flex w-full max-w-[400px] justify-center pb-12'>
                        <div className='flex w-full flex-col items-start justify-center gap-4 rounded-2xl bg-neutral-50 p-6'>
                            <h2 className='text-2xl font-bold'>Ascend Membership</h2>
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
                                <span className='font-semibold'>Less than $2.99 per month</span>
                            </div>
                            <OnboardingMembershipCardRow
                                title='Flight Refunds'
                                description='We get airlines to give you the credits you are entitled to based on their policy.'
                            />
                            <Separator className='w-full' />
                            <OnboardingMembershipCardRow
                                title='Hotel Refunds'
                                description='We rebook you automatically when you could get the same room for less.'
                            />
                            <Separator className='w-full' />
                            <OnboardingMembershipCardRow
                                title='Members-Only Deals'
                                description="Tell us where you're going, we'll find you the best price."
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleStripeSignup}
                        disabled={isLoading || !!error}
                        className='w-fit rounded-full bg-white px-8 py-3 font-semibold text-neutral-900 transition-all hover:bg-white/90 disabled:opacity-50'>
                        {error ? (
                            <a href='mailto:hey@ascend.travel' className='text-white hover:text-white/90'>
                                Contact hey@ascend.travel
                            </a>
                        ) : isLoading ? (
                            'Loading...'
                        ) : (
                            'Start saving now'
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
