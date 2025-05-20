'use client';

import React, { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { OnboardingSteps } from '../_types';
import GoogleWhiteIcon from './GoogleWhiteIcon';
import MobileContentGmailLink from './MobileContentSteps/MobileContentGmailLink';
import MobileContentMembership from './MobileContentSteps/MobileContentMembership';
import MobileContentTrips from './MobileContentSteps/MobileContentTrips';
import MobileContentWelcome from './MobileContentSteps/MobileContentWelcome';
import MobilePhoneVerificationCard from './MobilePhoneVerificationCard';
// Step 0 full screen
import MobileStepContentAnimator from './MobileStepContentAnimator';
import OnboardingHeader from './OnboardingHeader';
import OnboardingStepper from './OnboardingStepper';

// The new animator bar
const MobileSheetStep0Content = ({ onNext }: { onNext?: () => void }) => (
    <div className='flex h-full flex-col items-center justify-center rounded-full p-4 text-center'>
        <div
            className='w-full max-w-xs rounded-full bg-[#1DC167] px-12 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#1D70B8]/90'
            onClick={onNext}>
            Import my travel bookings
        </div>
    </div>
);

// Placeholder Content Components for inside the animator bar (Steps 1, 2, 3)
const MobileSheetStep1Content = ({ onNext }: { onNext?: () => void }) => {
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');

    return (
        <div className='flex h-full flex-col items-center justify-center p-4 text-center'>
            <Link href={`https://gmail.heyascend.com/gmail/import/start/${state_id}`}>
                <div
                    onClick={onNext}
                    className='flex w-full max-w-xs flex-row items-center justify-center gap-2 rounded-full bg-[#1DC167] px-12 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#1D70B8]/90'>
                    <GoogleWhiteIcon /> Continue with Google
                </div>
            </Link>
        </div>
    );
};

const MobileSheetStep2Content = ({
    onNext,
    onPrev,
    forceHeight
}: {
    onNext?: () => void;
    onPrev?: () => void;
    forceHeight: (height: number | null) => void;
}) => (
    <div className='flex h-full flex-col items-center justify-center p-4 text-center'>
        <MobilePhoneVerificationCard onVerify={onNext} forceHeight={forceHeight} />
    </div>
);

const MobileSheetStep3Content = ({ onPrev, onNext }: { onPrev?: () => void; onNext?: () => void }) => {
    const searchParams = useSearchParams();
    const state_id = searchParams.get('state_id');
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
        <div className='flex h-full flex-col items-center justify-center rounded-full p-4 text-center'>
            <button
                onClick={handleStripeSignup}
                disabled={isLoading || !!error}
                className='w-full rounded-full bg-[#1DC167] px-12 py-3 font-semibold text-white transition-all hover:bg-[#1DC167]/90 disabled:opacity-50'>
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
    );
};

const getStepFromQuery = (searchParams: URLSearchParams): OnboardingSteps => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
        const stepParamLower = stepParam.toLowerCase();
        if (stepParamLower === '1') return OnboardingSteps.Step1;
        if (stepParamLower === '2') return OnboardingSteps.Step2;
        if (stepParamLower === '3') return OnboardingSteps.Step3;
        if (stepParamLower === '4') return OnboardingSteps.Step4;
    }

    return OnboardingSteps.Step0;
};

const getStepString = (step: OnboardingSteps): string => {
    if (step === OnboardingSteps.Step1) return '1';
    if (step === OnboardingSteps.Step2) return '2';
    if (step === OnboardingSteps.Step3) return '3';
    if (step === OnboardingSteps.Step4) return '4';

    return '0';
};

interface MobileWelcomeViewProps {
    predefinedStep?: OnboardingSteps;
}

export default function MobileWelcomeView({ predefinedStep }: MobileWelcomeViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [forceSheetHeight, setForceSheetHeight] = useState<number | null>(0);

    const [currentStep, setCurrentStep] = useState<OnboardingSteps>(() =>
        predefinedStep !== undefined ? predefinedStep : getStepFromQuery(searchParams)
    );
    const [animationDirection, setAnimationDirection] = useState<number>(0);
    // isSheetOpen and handleSheetOpenChange are no longer needed

    // Effect 1: Update internal step state when URL (searchParams) changes
    useEffect(() => {
        const stepFromQuery = getStepFromQuery(searchParams);
        if (stepFromQuery !== currentStep) {
            // Determine animation direction based on the change. This assumes enum values are ordered.
            // A more robust way might be to store previous step if complex non-linear flow is needed.
            setAnimationDirection(stepFromQuery > currentStep ? 1 : -1);
            setCurrentStep(stepFromQuery);
        }
    }, [searchParams]); // Only depends on searchParams

    // Effect 2: Update URL when internal currentStep state changes
    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        const stepStringForUrl = getStepString(currentStep);
        const currentStepInUrl = searchParams.get('step');

        let shouldUpdateUrl = false;

        if (currentStep === OnboardingSteps.Step0) {
            // For Step0, ensure 'step' param is removed or is '0' (if you prefer ?step=0 for Step0)
            // Let's aim to remove it for a cleaner URL for Step0.
            if (currentStepInUrl !== null) {
                // If any step param exists
                newParams.delete('step');
                shouldUpdateUrl = true;
            }
        } else {
            // For Steps 1, 2, 3, ensure URL reflects the step number
            if (currentStepInUrl !== stepStringForUrl) {
                newParams.set('step', stepStringForUrl);
                shouldUpdateUrl = true;
            }
        }

        const newQueryString = newParams.toString();

        if (shouldUpdateUrl) {
            // Check current full query string to avoid pushing same URL
            if (searchParams.toString() !== newQueryString) {
                router.replace(`${pathname}${newQueryString ? '?' : ''}${newQueryString}`, { scroll: false });
            }
        }
    }, [currentStep, pathname, router, searchParams]);

    const handleStepChange = (newStep: OnboardingSteps, direction: number) => {
        setAnimationDirection(direction);
        setCurrentStep(newStep);
    };

    const goToNextStep = () => {
        let nextS = currentStep;
        if (currentStep === OnboardingSteps.Step0) nextS = OnboardingSteps.Step1;
        else if (currentStep === OnboardingSteps.Step1) nextS = OnboardingSteps.Step2;
        else if (currentStep === OnboardingSteps.Step2) nextS = OnboardingSteps.Step3;
        if (nextS !== currentStep) handleStepChange(nextS, 1);
    };

    const goToPrevStep = () => {
        let prevS = currentStep;
        if (currentStep === OnboardingSteps.Step3) prevS = OnboardingSteps.Step2;
        else if (currentStep === OnboardingSteps.Step2) prevS = OnboardingSteps.Step1;
        else if (currentStep === OnboardingSteps.Step1) prevS = OnboardingSteps.Step0;
        if (prevS !== currentStep) handleStepChange(prevS, -1);
    };

    let stepContentInAnimator: React.ReactNode = null;
    if (currentStep === OnboardingSteps.Step0) {
        stepContentInAnimator = <MobileSheetStep0Content onNext={goToNextStep} />;
    } else if (currentStep === OnboardingSteps.Step1) {
        stepContentInAnimator = <MobileSheetStep1Content onNext={goToNextStep} />;
    } else if (currentStep === OnboardingSteps.Step2) {
        stepContentInAnimator = (
            <MobileSheetStep2Content
                onNext={goToNextStep}
                onPrev={goToPrevStep}
                forceHeight={(height: number | null) => {
                    setForceSheetHeight(height);
                    console.log('forceSheetHeight', height);
                }}
            />
        );
    } else if (currentStep === OnboardingSteps.Step3) {
        stepContentInAnimator = <MobileSheetStep3Content onPrev={goToPrevStep} onNext={goToNextStep} />;
    }

    return (
        <div className='md:hidden'>
            {currentStep !== OnboardingSteps.Step0 && currentStep !== OnboardingSteps.Step4 && (
                <div className='fixed inset-x-0 top-0 z-10 flex flex-col items-center justify-center'>
                    <OnboardingHeader step={currentStep} />
                    <OnboardingStepper
                        steps={[OnboardingSteps.Step1, OnboardingSteps.Step2, OnboardingSteps.Step3]}
                        currentStep={currentStep}
                    />
                </div>
            )}

            {currentStep === OnboardingSteps.Step0 && (
                // Pass goToNextStep to MobileContentWelcome for its CTA button
                <MobileContentWelcome predefinedStep={OnboardingSteps.Step0} onNextStep={goToNextStep} />
            )}
            {(currentStep === OnboardingSteps.Step1 || currentStep === OnboardingSteps.Step2) && (
                <MobileContentGmailLink />
            )}
            {currentStep === OnboardingSteps.Step3 && <MobileContentMembership />}

            {currentStep === OnboardingSteps.Step4 && <MobileContentTrips />}

            {currentStep !== OnboardingSteps.Step4 && (
                <MobileStepContentAnimator
                    currentStep={currentStep}
                    direction={animationDirection}
                    {...(forceSheetHeight ? { forceHeight: forceSheetHeight } : {})}>
                    {stepContentInAnimator}
                </MobileStepContentAnimator>
            )}
        </div>
    );
}
