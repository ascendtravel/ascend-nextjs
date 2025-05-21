'use client';

import React, { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { YcombBanner } from '@/components/YcombBanner/YcombBanner';

import { LINK_FAILURE_PARAM, OnboardingSteps, PERMISSIONS_FAILURE_PARAM } from '../_types';
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
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';
import ReactConfetti from 'react-confetti';

// The new animator bar
const MobileSheetStep0Content = ({ onNext }: { onNext?: (stateId: string) => void }) => {
    const searchParams = useSearchParams();
    const [stateId, setStateId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const getUtmParams = useCallback(() => {
        const utmParams = new URLSearchParams();
        const utmParamsObject: { [key: string]: string } = {};

        searchParams.forEach((value, key) => {
            if (key.startsWith('utm_')) {
                utmParams.append(key, value);
            }
        });

        const utmParamsString = utmParams.toString();
        const utmParamsArray = utmParamsString.split('&');

        utmParamsArray.forEach((param) => {
            if (param) {
                const [key, value] = param.split('=');
                if (key) {
                    utmParamsObject[key] = value;
                }
            }
        });
        console.log(utmParamsObject);

        return utmParamsObject;
    }, [searchParams]);

    const getStateId = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const fbp = Cookies.get('_fbp');
            const fbc = Cookies.get('_fbc');
            const utmParams = getUtmParams();

            const response = await fetch('/api/gmail/state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...(fbp ? { fbp } : {}),
                    ...(fbc ? { fbc } : {}),
                    ...(Object.keys(utmParams).length > 0 ? { utm_params: utmParams } : {})
                })
            });

            if (!response.ok) throw new Error('Failed to get state ID');
            const data = await response.json();
            setStateId(data.state_id);
        } catch (err) {
            setError('Failed to initialize. Please try again.');
            setStateId(null); // Clear stateId on error
        } finally {
            setIsLoading(false);
        }
    }, [getUtmParams, setIsLoading, setError, setStateId]);

    useEffect(() => {
        getStateId();
    }, [getStateId]);

    const handleNextClick = () => {
        if (onNext && stateId && !isLoading && !error) {
            onNext(stateId);
        } else if (error) {
            // Retry fetching stateId if there was an error
            getStateId();
        }
    };

    return (
        <div className='flex h-full flex-col items-center justify-center rounded-full p-4 text-center'>
            <div
                className='w-full max-w-xs rounded-full bg-[#17AA59] px-12 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#17AA59]/80 disabled:cursor-not-allowed disabled:opacity-50'
                onClick={handleNextClick}>
                Import my travel bookings
            </div>
        </div>
    );
};

// Placeholder Content Components for inside the animator bar (Steps 1, 2, 3)
const MobileSheetStep1Content = ({ onNext, stateId }: { onNext?: () => void; stateId: string }) => {
    return (
        <div className='flex h-full flex-col items-center justify-center p-4 text-center'>
            {stateId ? (
                <Link href={`https://gmail.heyascend.com/gmail/import/start/${stateId}`}>
                    <div className='flex w-full max-w-xs flex-row items-center justify-center gap-2 rounded-full bg-[#17AA59] px-12 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#1D70B8]/90'>
                        <GoogleWhiteIcon /> Continue with Google
                    </div>
                </Link>
            ) : (
                <p className='text-sm text-neutral-600'>Initializing link...</p>
            )}
        </div>
    );
};

const MobileSheetStep2Content = ({
    onNext,
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
    const state_id = searchParams.get('state_id'); // This should be correctly populated by the URL sync logic
    const [isLoading, setIsLoading] = useState(true);
    const [stripeUrl, setStripeUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getStripeUrl() {
            if (!state_id) {
                setError('Session ID missing. Please go back and try again.');
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

                if (response.ok && data?.signup_link_code) {
                    setStripeUrl(`https://payments.heyascend.com/${data.signup_link_code}`);
                } else {
                    setError('');
                }
            } catch (err) {
                console.error('Error getting Stripe signup URL:', err);
                setError('An error occurred. Please contact support.');
            } finally {
                setIsLoading(false);
            }
        }

        getStripeUrl();
    }, [state_id]);

    const handleStripeSignup = () => {
        if (stripeUrl) {
            window.location.href = stripeUrl;
        }
    };

    return (
        <div className='flex h-full flex-col items-center justify-center rounded-full p-4 text-center'>
            <button
                type='button'
                onClick={handleStripeSignup}
                disabled={isLoading || !!error || !stripeUrl}
                className='w-full rounded-full bg-[#17AA59] px-24 py-3 font-semibold text-nowrap text-white shadow-2xl transition-all hover:bg-[#17AA59]/90 disabled:cursor-not-allowed disabled:opacity-50'>
                {error ? (
                    <a href='mailto:hey@ascend.travel' className='text-white hover:text-white/90'>
                        {error} (Contact Support)
                    </a>
                ) : isLoading ? (
                    'Loading Payment Link...'
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

    return '0'; // For Step0 or default
};

interface MobileWelcomeViewProps {
    predefinedStep?: OnboardingSteps;
}

export default function MobileWelcomeView({ predefinedStep }: MobileWelcomeViewProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [showWelcome, setShowWelcome] = useState(true);
    const [forceSheetHeight, setForceSheetHeight] = useState<number | null>(0);
    const [showConfetti, setShowConfetti] = useState(true);

    const initialStepFromQueryOrProp = predefinedStep !== undefined ? predefinedStep : getStepFromQuery(searchParams);
    const [currentStep, setCurrentStep] = useState<OnboardingSteps>(initialStepFromQueryOrProp);
    const [appStateId, setAppStateId] = useState<string | null>(() => searchParams.get('state_id'));
    const [animationDirection, setAnimationDirection] = useState<number>(0);

    // Effect 1: Sync currentStep and appStateId with URL searchParams
    useEffect(() => {
        const stepFromQuery = getStepFromQuery(searchParams);
        const stateIdFromQuery = searchParams.get('state_id');

        if (stepFromQuery !== currentStep) {
            setAnimationDirection(stepFromQuery > currentStep ? 1 : -1);
            setCurrentStep(stepFromQuery);
        }
        // Ensure appStateId is also synced from URL if it changes there
        if (stateIdFromQuery !== appStateId) {
            setAppStateId(stateIdFromQuery);
        }
    }, [searchParams]); // Rerun when searchParams change

    useEffect(() => {
        if (currentStep === OnboardingSteps.Step4) {
            setTimeout(() => {
                setShowWelcome(false);
                setShowConfetti(false);
            }, 5000);
        }
    }, [currentStep]);

    // Effect 2: Update URL to reflect currentStep and appStateId
    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString());
        const stepStringForUrl = getStepString(currentStep);
        const currentStepInUrl = searchParams.get('step');
        const currentStateIdInUrl = searchParams.get('state_id');

        let shouldUpdateUrl = false;

        // Handle 'step' parameter
        if (currentStep === OnboardingSteps.Step0) {
            // For Step0, remove 'step' param for a cleaner URL, or ensure it is '0' if preferred.
            // Current behavior: remove if not '0'.
            if (currentStepInUrl && currentStepInUrl !== '0') {
                newParams.delete('step');
                shouldUpdateUrl = true;
            } else if (!currentStepInUrl && stepStringForUrl !== '0') {
                // If no step param, but we want step=0 (or just clean), this logic might need adjustment
                // For now, if it's step 0, we try to remove `step` or ensure it is `0`.
            }
        } else {
            if (currentStepInUrl !== stepStringForUrl) {
                newParams.set('step', stepStringForUrl);
                shouldUpdateUrl = true;
            }
        }

        // Handle 'state_id' parameter
        if (currentStep === OnboardingSteps.Step0 || currentStep === OnboardingSteps.Step4) {
            // Remove state_id for Step0 (before it's generated) and Step4 (after it's used)
            if (currentStateIdInUrl) {
                newParams.delete('state_id');
                shouldUpdateUrl = true;
            }
        } else {
            // For steps 1, 2, 3, ensure state_id is in URL if appStateId has it
            if (appStateId && currentStateIdInUrl !== appStateId) {
                newParams.set('state_id', appStateId);
                shouldUpdateUrl = true;
            } else if (!appStateId && currentStateIdInUrl) {
                // If URL has state_id but app doesn't (e.g. direct nav to /welcome?step=1&state_id=XXX)
                // The other useEffect (Effect 1) should set appStateId from URL.
                // So, no action needed here for this specific sub-case.
            }
        }

        const newQueryString = newParams.toString();

        if (shouldUpdateUrl) {
            if (searchParams.toString() !== newQueryString) {
                router.replace(`${pathname}${newQueryString ? '?' : ''}${newQueryString}`, { scroll: false });
            }
        }
    }, [currentStep, appStateId, pathname, router, searchParams]);

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
        stepContentInAnimator = (
            <MobileSheetStep0Content
                onNext={(generatedStateId) => {
                    setAppStateId(generatedStateId);
                    goToNextStep();
                }}
            />
        );
    } else if (currentStep === OnboardingSteps.Step1) {
        stepContentInAnimator = appStateId ? (
            <MobileSheetStep1Content onNext={goToNextStep} stateId={appStateId} />
        ) : (
            <div className='flex h-full items-center justify-center p-4 text-sm text-neutral-600'>
                Loading session details...
            </div>
        );
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

    const bannerVariants = {
        hidden: { y: '-100%', opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }
        },
        exit: { y: '-100%', opacity: 0, transition: { duration: 0.4 } }
    };

    // Variants for main content area sliding in from bottom
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

    const getFailedSteps = () => {
        if (currentStep === OnboardingSteps.Step0) return [];

        const PermissionsFailure = searchParams.get(PERMISSIONS_FAILURE_PARAM);
        const LinkFailure = searchParams.get(LINK_FAILURE_PARAM);

        if (currentStep === OnboardingSteps.Step1 && (PermissionsFailure || LinkFailure))
            return [OnboardingSteps.Step1];

        return [];
    };

    return (
        <div className='md:hidden'>
            {currentStep === OnboardingSteps.Step4 && showWelcome && (
                <>
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key='step4Banner'
                            className='fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-[#003A64] px-12 py-4 text-center text-lg font-semibold text-nowrap text-white shadow-lg'
                            variants={bannerVariants}
                            initial='hidden'
                            animate='visible'
                            exit='exit'>
                            Welcome to Ascend!
                        </motion.div>
                    </AnimatePresence>
                    <div className='fixed inset-0 z-50 flex flex-row justify-center px-4'>
                        <ReactConfetti
                            recycle={showConfetti}
                            numberOfPieces={800}
                            width={window.innerWidth}
                            height={window.innerHeight}
                        />
                    </div>
                </>
            )}

            {currentStep !== OnboardingSteps.Step0 && currentStep !== OnboardingSteps.Step4 && (
                <div className='fixed inset-x-0 top-0 z-10 flex flex-col items-center justify-center'>
                    <OnboardingHeader />
                    <OnboardingStepper
                        steps={[OnboardingSteps.Step1, OnboardingSteps.Step2, OnboardingSteps.Step3]}
                        currentStep={currentStep}
                        failedSteps={getFailedSteps()}
                    />
                </div>
            )}

            {/* Wrap conditional content rendering with AnimatePresence */}
            {currentStep === OnboardingSteps.Step0 && (
                <div className='fixed inset-x-0 top-0 z-50 flex w-full flex-row items-center justify-center bg-[#00345A]'>
                    <YcombBanner />
                </div>
            )}
            <AnimatePresence mode='wait'>
                {currentStep === OnboardingSteps.Step0 && (
                    <motion.div
                        key='content-step0'
                        variants={mainContentVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <MobileContentWelcome predefinedStep={OnboardingSteps.Step0} onNextStep={goToNextStep} />
                    </motion.div>
                )}
                {(currentStep === OnboardingSteps.Step1 || currentStep === OnboardingSteps.Step2) && (
                    <motion.div
                        key='content-step1or2' // Key changes if the condition changes too drastically
                        variants={mainContentVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <MobileContentGmailLink />
                    </motion.div>
                )}
                {currentStep === OnboardingSteps.Step3 && (
                    <motion.div
                        key='content-step3'
                        variants={mainContentVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <MobileContentMembership />
                    </motion.div>
                )}
                {currentStep === OnboardingSteps.Step4 && (
                    <motion.div
                        key='content-step4'
                        variants={mainContentVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <MobileContentTrips />
                    </motion.div>
                )}
            </AnimatePresence>

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
