'use client';

import { useEffect, useState } from 'react';

import { Separator } from '@/components/ui/separator';

import OnboardingHeader from '../_components/OnboardingHeader';
import OnboardingMembershipCardRow from '../_components/OnboardingMembershipCardRow';
import { OnboardingSteps } from '../_types';

export default function OnboardingSubscriptionView({ state_id }: { state_id?: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [stripeUrl, setStripeUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const handleStripeSignup = () => {
        if (stripeUrl) {
            window.location.href = stripeUrl;
        }
    };

    return (
        <div className='mt-12 h-full w-full'>
            {/* Scrollable content area */}
            <div className='flex h-[calc(100vh-6rem)] flex-col items-center justify-start overflow-y-auto'>
                <div className='flex flex-col items-center justify-center px-4 py-4 pt-6'>
                    <p className='font-figtree max-w-md px-6 text-center text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                        Ascend works for you, not Big Travel
                    </p>
                    <p className='font-figtree mb-4 max-w-xs px-2 text-center text-[14px] leading-[20px] font-medium text-white'>
                        This is how we keep the lights on.
                    </p>
                </div>

                <div className='flex w-full max-w-lg justify-center px-4 pb-24'>
                    <div className='flex w-full flex-col items-start justify-center gap-4 rounded-2xl bg-neutral-50 p-6'>
                        <h2 className='text-2xl font-bold'>Ascend Membership</h2>
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

                        <div className='flex flex-row gap-3'>
                            <div className='flex items-start justify-start gap-1'>
                                <span className='font-figtree -mr-1 pt-2 text-xl font-bold text-neutral-900'>$</span>
                                <span className='text-3xl font-bold'>25</span>
                                <span className='-ml-1 pt-2 text-xl font-bold'>/year</span>
                            </div>
                        </div>
                        <div className='text-neutral-1000 -mt-3 flex flex-row items-center gap-2 text-sm'>
                            <span className='font-semibold'>Less than $2.99 per month</span>
                        </div>

                        <button
                            onClick={handleStripeSignup}
                            disabled={isLoading || !!error}
                            className='w-full rounded-full bg-[#1DC167] py-3 font-semibold text-white transition-all hover:bg-[#1DC167]/90 disabled:opacity-50'>
                            {error ? (
                                <a href='mailto:hey@ascend.travel' className='text-white hover:text-white/90'>
                                    Contact hey@ascend.travel
                                </a>
                            ) : isLoading ? (
                                'Loading...'
                            ) : (
                                'Start Saving Money'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
