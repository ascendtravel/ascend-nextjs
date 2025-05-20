import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { Separator } from '@/components/ui/separator';

import OnboardingMembershipCardRow from '../OnboardingMembershipCardRow';

export default function MobileContentMembership() {
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

    const handleStripeSignup = () => {
        if (stripeUrl) {
            window.location.href = stripeUrl;
        }
    };

    return (
        <div className='flex h-screen w-full flex-col items-center justify-start bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] pt-20 sm:pt-36'>
            {/* Scrollable content area */}
            <div className='flex h-[calc(100vh-6rem)] flex-col items-center justify-start overflow-y-auto'>
                <div className='flex flex-col items-center justify-center px-4 py-4 pt-6 sm:pt-24'>
                    <p className='font-figtree max-w-md px-6 text-center text-[24px] leading-[28px] font-extrabold tracking-[-0.02em] text-white'>
                        Ascend works for you, not Big Travel
                    </p>
                    <p className='font-figtree mt-4 mb-4 max-w-[250px] px-2 text-center text-[16px] leading-[20px] font-medium text-white'>
                        You get the best deals on travel. We get $25. It's that simple!
                    </p>
                </div>

                <div className='flex w-full max-w-lg justify-center px-4 pb-24'>
                    <div className='flex w-full flex-col items-start justify-center gap-4 rounded-2xl bg-neutral-50 p-6'>
                        <h2 className='text-2xl font-bold'>Ascend Membership</h2>
                        <OnboardingMembershipCardRow title='Flight Refunds' />
                        <Separator className='w-full' />
                        <OnboardingMembershipCardRow title='Hotel Refunds' />
                        <Separator className='w-full' />
                        <OnboardingMembershipCardRow title='Members-Only Deals' />

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

                        {/* <button
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
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
