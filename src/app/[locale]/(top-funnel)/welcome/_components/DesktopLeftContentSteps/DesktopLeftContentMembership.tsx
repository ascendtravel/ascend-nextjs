'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import OnboardingMembershipCardRow from '../OnboardingMembershipCardRow';
import { Separator } from '@/components/ui/separator';
import { EventLists, trackLuckyOrangeEvent } from '@/lib/analytics';

import { OnboardingSteps } from '../../_types';
import { popReferralCode } from '../../_utils/onboarding.ultis';
import OnboardingStepper from '../OnboardingStepper';
import StripePaymentIntegration from '../StripePaymentIntegration/StripePaymentIntegration';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function DesktopLeftContentMembership() {
    const [isFlipped, setIsFlipped] = useState(false);
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');
    const referral_code = searchParams.get('referral_code');
    const [clientSecret, setClientSecret] = useState<string | null>(null);

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

    const cardVariants = {
        front: {
            rotateY: 0,
            scale: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
        },
        back: {
            rotateY: 180,
            scale: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
        },
        hidden: {
            rotateY: -180,
            scale: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
    };

    useEffect(() => {
        if (state_id && !clientSecret) {
            fetchClientSecret();
        }
    }, [state_id, clientSecret]);

    const fetchClientSecret = async (): Promise<string> => {
        try {
            const response = await fetch('/api/checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    state_id,
                    live_mode: true, // Set to true for production
                    return_url: `${window.location.origin}/welcome?step=4&state_id=${state_id}`,
                    ...(referral_code ? { referral_code } : {})
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const data = await response.json();

            if (!data.checkout_session_client_secret) {
                throw new Error('No client secret received');
            }

            setClientSecret(data.checkout_session_client_secret);

            return data.checkout_session_client_secret;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to initialize payment';
            throw new Error(errorMessage);
        }
    };

    const handleStartSaving = () => {
        trackLuckyOrangeEvent(EventLists.payment_layover.name, {
            description: EventLists.payment_layover.description
        });
        setIsFlipped(true);

        // Scroll down 200px to focus on the payment card and hide header
        setTimeout(() => {
            window.scrollBy({
                top: 200,
                behavior: 'smooth'
            });
        }, 200); // Small delay to let the flip animation start
    };

    const handlePaymentSuccess = () => {
        console.log('Payment successful!');
        // Handle successful payment - maybe redirect or show success state
    };

    const handlePaymentError = (error: any) => {
        console.error('Payment failed:', error);
        // Handle payment error
    };

    const handleBackToMembership = () => {
        setIsFlipped(false);
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
                    <div className='flex w-full flex-col items-start justify-start px-6'>
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
                                <div className='perspective-1000 relative w-full'>
                                    <AnimatePresence mode='wait'>
                                        {!isFlipped ? (
                                            <motion.div
                                                key='membership-front'
                                                className='w-full'
                                                variants={cardVariants}
                                                initial='front'
                                                animate='front'
                                                exit='hidden'
                                                style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
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
                                                        title='Flight Repricings'
                                                        description='We average $64 back per flight, harassing the airline to make sure you get your money back.'
                                                    />
                                                    <div className='mt-1' />
                                                    <OnboardingMembershipCardRow
                                                        title='Hotel Repricings'
                                                        description='We average $116 back per hotel, rebooking you automatically when you could get the same room for less.'
                                                    />
                                                    <div className='mt-1' />
                                                    <OnboardingMembershipCardRow
                                                        title='Book anywhere, no restrictions'
                                                        description='Expedia, Kayak, airline sites. If the price drops, we catch it and you get paid.'
                                                    />
                                                    <button
                                                        onClick={handleStartSaving}
                                                        className='mt-4 rounded-full bg-[#17AA59] px-16 py-4 text-base font-medium text-white shadow-md transition-colors hover:bg-[#17AA59]/80'>
                                                        Start saving now
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key='payment-back'
                                                className='w-full'
                                                variants={cardVariants}
                                                initial='hidden'
                                                animate='front'
                                                exit='back'
                                                style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}>
                                                <div className='flex w-full flex-col gap-4 rounded-2xl bg-neutral-50 p-6'>
                                                    <div className='h-fit overflow-hidden'>
                                                        {state_id && (
                                                            <StripePaymentIntegration
                                                                state_id={state_id}
                                                                referral_code={referral_code || undefined}
                                                                clientSecret={clientSecret}
                                                                onPaymentSuccess={handlePaymentSuccess}
                                                                onPaymentError={handlePaymentError}
                                                                desktop
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
