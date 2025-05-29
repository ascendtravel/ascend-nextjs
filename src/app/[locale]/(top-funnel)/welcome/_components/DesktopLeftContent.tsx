'use client';

import { ReactNode, useEffect, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

import {
    LINK_FAILURE_PARAM,
    OnboardingSteps,
    PERMISSIONS_FAILURE_PARAM,
    mapNumberToStep,
    mapStepToNumbers
} from '../_types';
import DesktopLeftContentGmailLink from './DesktopLeftContentSteps/DesktopLeftContentGmailLink';
import DesktopLeftContentMembership from './DesktopLeftContentSteps/DesktopLeftContentMembership';
import DesktopLeftContentPhoneRegister from './DesktopLeftContentSteps/DesktopLeftContentPhoneRegister';
import DesktopLeftContentTrips from './DesktopLeftContentSteps/DesktopLeftContentTrips';
import DesktopLeftContentWelcome from './DesktopLeftContentSteps/DesktopLeftContentWelcome';
import OnboardingStepper from './OnboardingStepper';
import { AnimatePresence, motion } from 'framer-motion';
import ReactConfetti from 'react-confetti';

const getStepFromQuery = (searchParams: URLSearchParams): OnboardingSteps => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
        const stepParamLower = stepParam.toLowerCase();
        if (stepParamLower === '1') return OnboardingSteps.Step1;
        if (stepParamLower === '2') return OnboardingSteps.Step2;
        if (stepParamLower === '3') return OnboardingSteps.Step3;
        if (stepParamLower === '4') return OnboardingSteps.Step4;
        // Add other steps if necessary
    }

    return OnboardingSteps.Step0; // Default step
};

const getStepString = (step: OnboardingSteps): string => {
    if (step === OnboardingSteps.Step1) return '1';
    if (step === OnboardingSteps.Step2) return '2';
    if (step === OnboardingSteps.Step3) return '3';
    if (step === OnboardingSteps.Step4) return '4';
    // Add other steps if necessary

    return '0'; // Default for Step0 or if no explicit string
};

export default function DesktopLeftContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [currentStep, setCurrentStep] = useState<OnboardingSteps>(() => getStepFromQuery(searchParams));
    const [direction, setDirection] = useState<number>(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [stateId, setStateId] = useState<string | null>(null);

    useEffect(() => {
        const stateId = searchParams.get('state_id');
        if (stateId) {
            setStateId(stateId);
        }
    }, [searchParams]);

    useEffect(() => {
        if (currentStep === OnboardingSteps.Step4) {
            setTimeout(() => {
                setShowWelcome(false);
            }, 8000);
        }
    }, [currentStep]);

    useEffect(() => {
        if (currentStep === OnboardingSteps.Step4) {
            setShowConfetti(true);
            setTimeout(() => {
                setShowConfetti(false);
            }, 3000);
        }
    }, [currentStep]);

    useEffect(() => {
        const stepFromQuery = getStepFromQuery(searchParams);
        if (stepFromQuery !== currentStep) {
            setDirection(stepFromQuery > currentStep ? 1 : -1);
            setCurrentStep(stepFromQuery);
        }
    }, [searchParams]);

    // Function to determine failed steps based on URL parameters
    const getFailedSteps = (): OnboardingSteps[] => {
        if (currentStep === OnboardingSteps.Step0) return []; // No steps to fail at step 0

        const permissionsFailure = searchParams.get(PERMISSIONS_FAILURE_PARAM) === 'true';
        const linkFailure = searchParams.get(LINK_FAILURE_PARAM) === 'true';

        // If on Step 1 and either failure parameter is true, mark Step 1 as failed
        if (currentStep === OnboardingSteps.Step1 && (permissionsFailure || linkFailure)) {
            return [OnboardingSteps.Step1];
        }
        // Add logic for other steps if they can also have distinct failure states reflected in the stepper

        return []; // No failed steps by default
    };

    // Helper function to safely get previous step
    const getPreviousStep = (step: OnboardingSteps): OnboardingSteps => {
        const currentStepNumber = mapStepToNumbers[step];
        const prevStepNumber = currentStepNumber - 1;

        return prevStepNumber >= 1 ? mapNumberToStep[prevStepNumber as keyof typeof mapNumberToStep] : step;
    };

    // Helper function to safely get next step
    const getNextStep = (step: OnboardingSteps): OnboardingSteps => {
        const currentStepNumber = mapStepToNumbers[step];
        const nextStepNumber = currentStepNumber + 1;

        return nextStepNumber <= Object.keys(mapNumberToStep).length
            ? mapNumberToStep[nextStepNumber as keyof typeof mapNumberToStep]
            : step;
    };

    // Handle step changes with direction tracking
    // const handlePrevStep = () => {
    //     const prevStep = getPreviousStep(currentStep);
    //     if (prevStep !== currentStep) {
    //         const newParams = new URLSearchParams(searchParams.toString());
    //         const stepString = getStepString(prevStep);
    //         if (prevStep === OnboardingSteps.Step0) {
    //             newParams.delete('step');
    //         } else {
    //             newParams.set('step', stepString);
    //         }
    //         router.replace(`${pathname}${newParams.toString() ? '?' : ''}${newParams.toString()}`, { scroll: false });
    //     }
    // };

    // const handleNextStep = () => {
    //     if (currentStep === OnboardingSteps.Step4) {
    //         return;
    //     }
    //     const nextStep = getNextStep(currentStep);
    //     if (nextStep !== currentStep) {
    //         const newParams = new URLSearchParams(searchParams.toString());
    //         const stepString = getStepString(nextStep);
    //         newParams.set('step', stepString);
    //         router.replace(`${pathname}${newParams.toString() ? '?' : ''}${newParams.toString()}`, { scroll: false });
    //     }
    // };

    const bannerVariants = {
        hidden: { y: '-100%', opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }
        },
        exit: { y: '-100%', opacity: 0, transition: { duration: 0.2 } }
    };

    return (
        <>
            {/* Fixed navigation controls */}
            {/* <div className='fixed inset-x-3 top-4 z-50 flex flex-row justify-between'>
                <div
                    className={cn(
                        'size-7 cursor-pointer rounded-full bg-neutral-50 p-1.5 drop-shadow-xl',
                        currentStep === OnboardingSteps.Step0 && 'opacity-50'
                    )}
                    onClick={handlePrevStep}>
                    <ArrowLeftIcon className='size-4 text-neutral-900' />
                </div>
                <div
                    className={cn(
                        'size-7 cursor-pointer rounded-full bg-neutral-50 p-1.5 drop-shadow-xl',
                        currentStep === OnboardingSteps.Step4 && 'opacity-50'
                    )}
                    onClick={handleNextStep}>
                    <ArrowRightIcon className='size-4 text-neutral-900' />
                </div>
            </div> */}

            {currentStep !== OnboardingSteps.Step0 &&
                currentStep !== OnboardingSteps.Step4 &&
                currentStep !== OnboardingSteps.Step3 && (
                    <div className='fixed inset-x-3 top-8 z-20 flex flex-row justify-between pl-8'>
                        <OnboardingStepper
                            steps={[OnboardingSteps.Step1, OnboardingSteps.Step2, OnboardingSteps.Step3]}
                            currentStep={
                                currentStep as OnboardingSteps.Step1 | OnboardingSteps.Step2 | OnboardingSteps.Step3
                            }
                            failedSteps={getFailedSteps()}
                        />
                    </div>
                )}

            {currentStep === OnboardingSteps.Step4 && (
                <div className='fixed inset-x-3 z-20 flex flex-row justify-center px-4'>
                    <ReactConfetti
                        recycle={showConfetti}
                        numberOfPieces={800}
                        width={window.innerWidth}
                        height={window.innerHeight}
                    />
                </div>
            )}

            <AnimatePresence mode='wait'>
                {currentStep === OnboardingSteps.Step4 && showWelcome && (
                    <motion.div
                        key='step4Banner'
                        className='fixed top-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#003A64] px-12 py-4 text-center text-lg font-semibold text-white shadow-lg'
                        variants={bannerVariants}
                        initial='hidden'
                        animate='visible'
                        exit='exit'>
                        Welcome to Ascend!
                    </motion.div>
                )}
            </AnimatePresence>

            {currentStep === OnboardingSteps.Step0 && <DesktopLeftContentWelcome />}
            {currentStep === OnboardingSteps.Step1 && <DesktopLeftContentGmailLink />}
            {currentStep === OnboardingSteps.Step2 && (
                <DesktopLeftContentPhoneRegister
                    onVerify={() => {
                        const newParams = new URLSearchParams(searchParams.toString());
                        newParams.set('step', getStepString(OnboardingSteps.Step3));
                        newParams.set('state_id', stateId || '');

                        router.replace(`${pathname}${newParams.toString() ? '?' : ''}${newParams.toString()}`, {
                            scroll: false
                        });
                    }}
                />
            )}
            {currentStep === OnboardingSteps.Step3 && <DesktopLeftContentMembership />}
            {currentStep === OnboardingSteps.Step4 && <DesktopLeftContentTrips />}
        </>
    );
}
