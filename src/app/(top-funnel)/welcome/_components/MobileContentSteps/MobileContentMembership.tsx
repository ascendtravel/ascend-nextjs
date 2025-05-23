import { useCallback, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { Separator } from '@/components/ui/separator';

import OnboardingMembershipCardRow from '../OnboardingMembershipCardRow';

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
        if (windowHeight >= 900) {
            return [true, true, true]; // All open
        } else if (windowHeight >= 800) {
            return [true, true, false]; // First two open
        }

        return [false, false, false]; // All collapsed
    }, [windowHeight]);

    const [openStates, setOpenStates] = useState(getOpenStates());

    useEffect(() => {
        setOpenStates(getOpenStates());
    }, [getOpenStates]);

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

    const handleStripeSignup = () => {
        if (stripeUrl) {
            window.location.href = stripeUrl;
        }
    };

    return (
        <div className='flex h-screen w-full flex-col items-center justify-start bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC] pt-20 sm:pt-36'>
            {/* Scrollable content area */}
            <div className='mt-8 flex h-[calc(100vh-8rem)] flex-col items-center justify-start overflow-y-auto'>
                <div className='flex flex-col items-center justify-center px-4 py-4 pt-[1vh]'>
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
                        <div className='flex w-full flex-col gap-2 border-b border-neutral-200 drop-shadow-md'>
                            <OnboardingMembershipCardRow
                                title='Flight Refunds'
                                description='We get airlines to give you the credits you are entitled to based on their policy.'
                                isInitiallyOpen={openStates[0]}
                            />
                        </div>
                        <div className='flex w-full flex-col gap-2 border-b border-neutral-200 drop-shadow-md'>
                            <OnboardingMembershipCardRow
                                title='Hotel Refunds'
                                description="Tell us where you're going, we'll find you the best price."
                                isInitiallyOpen={openStates[1]}
                            />
                        </div>
                        <div className='flex w-full flex-col gap-2 border-b border-neutral-200 drop-shadow-md'>
                            <OnboardingMembershipCardRow
                                title='Members-Only Deals'
                                description='We get members-only deals on travel.'
                                isInitiallyOpen={openStates[2]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
