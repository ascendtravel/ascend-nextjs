'use client';

import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

import OnboardingHeader from '../_components/OnboardingHeader';
import OnboardingStepper from '../_components/OnboardingStepper';
import { OnboardingSteps, mapNumberToStep, mapStepToNumbers } from '../_types';
import OnboardingGmailLinkView from './OnboardingGmailLinkView';
import OnboardingPhoneConfirmationView from './OnboardingPhoneConfirmationView';
import OnboardingSubscriptionView from './OnboardingSubscriptionView';
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';

export default function OnboardingMainView({
    predefinedStep,
    stateId: initialStateId
}: {
    predefinedStep?: OnboardingSteps;
    stateId: string;
}) {
    // Get initial direction based on predefinedStep
    const getInitialDirection = (): number => {
        if (!predefinedStep || predefinedStep === OnboardingSteps.Step1) {
            return 0; // No direction for default step
        }

        const stepNumber = mapStepToNumbers[predefinedStep];

        return stepNumber > 1 ? 1 : -1; // Direction based on step number
    };

    const [currentStep, setCurrentStep] = useState(predefinedStep || OnboardingSteps.Step1);
    const [direction, setDirection] = useState(getInitialDirection()); // 1 for forward, -1 for backward
    const [stateId, setStateId] = useState(initialStateId);
    const searchParams = useSearchParams();

    // Update URL query parameter when step changes without page reload
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            const currentParams = new URLSearchParams(url.search);

            // Update the step parameter
            if (currentStep) {
                currentParams.set('step', currentStep);
            } else {
                currentParams.delete('step');
            }

            // Construct the new URL with updated parameters
            const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

            // Update the URL without reloading the page
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    }, [currentStep]);

    const getUtmParams = () => {
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
            const [key, value] = param.split('=');
            utmParamsObject[key] = value;
        });
        console.log(utmParamsObject);

        return utmParamsObject;
    };

    useEffect(() => {
        async function getStateId() {
            const fbp = Cookies.get('_fbp');
            const fbc = Cookies.get('_fbc');

            const utmParams = getUtmParams();

            const response = await fetch('/api/gmail/state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...(fbp ? { fbp } : {}),
                    ...(fbc ? { fbc } : {}),
                    ...(utmParams ? { utm_params: utmParams } : {})
                })
            });

            if (!response.ok) throw new Error('Failed to get state ID');
            const data = await response.json();
            setStateId(data.state_id);
        }

        getStateId();
    }, []);

    // Update the header in the layout when the step changes
    useEffect(() => {
        // Find the header element and update its step prop
        const headerElement = document.querySelector('.onboarding-header');
        if (headerElement) {
            // This is a workaround since we can't directly update props
            // In a real solution, you'd use context or state management
            headerElement.setAttribute('data-step', currentStep);
        }
    }, [currentStep]);

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
    const handlePrevStep = () => {
        const prevStep = getPreviousStep(currentStep);
        if (prevStep !== currentStep) {
            setDirection(-1);
            setCurrentStep(prevStep);
        }
    };

    const handleNextStep = () => {
        if (currentStep === OnboardingSteps.Step3) {
            return;
        }
        const nextStep = getNextStep(currentStep);
        if (nextStep !== currentStep) {
            setDirection(1);
            setCurrentStep(nextStep);
        }
    };

    // Animation variants
    const pageVariants = {
        initial: (direction: number) => ({
            x: direction > 0 ? '100%' : direction < 0 ? '-100%' : 0,
            opacity: 0
        }),
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 }
            }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : direction > 0 ? '-100%' : 0,
            opacity: 0,
            transition: {
                x: { duration: 0.3 },
                opacity: { duration: 0.2 }
            }
        })
    };

    return (
        <div className='flex h-screen w-full flex-col'>
            <OnboardingHeader step={currentStep} />

            {/* Fixed navigation controls */}
            {/* <div className='fixed inset-x-3 top-4 z-50 flex flex-row justify-between'>
                <div
                    className={cn(
                        'size-7 cursor-pointer rounded-full bg-neutral-50 p-1.5 drop-shadow-xl',
                        currentStep === OnboardingSteps.Step1 && 'opacity-50'
                    )}
                    onClick={handlePrevStep}>
                    <ArrowLeftIcon className='size-4 text-neutral-900' />
                </div>
                <div
                    className={cn(
                        'size-7 cursor-pointer rounded-full bg-neutral-50 p-1.5 drop-shadow-xl',
                        currentStep === OnboardingSteps.Step3 && 'opacity-50'
                    )}
                    onClick={handleNextStep}>
                    <ArrowRightIcon className='size-4 text-neutral-900' />
                </div>
            </div> */}

            {/* Fixed stepper that stays visible while scrolling */}
            <div className='fixed inset-x-0 top-14 z-30 flex flex-row items-center justify-center bg-gradient-to-t px-4 sm:top-24'>
                <OnboardingStepper
                    steps={Object.values(OnboardingSteps).map((step, index) => '')}
                    currentStep={mapStepToNumbers[currentStep]}
                />
            </div>

            {/* Content area with top padding to account for header and stepper */}
            <div className='relative flex flex-1 items-center justify-center overflow-hidden pt-[8rem] sm:pt-[10rem]'>
                <AnimatePresence initial={false} mode='wait' custom={direction}>
                    {currentStep === OnboardingSteps.Step1 && (
                        <motion.div
                            key='step1'
                            className='absolute inset-0'
                            custom={direction}
                            variants={pageVariants}
                            initial='initial'
                            animate='animate'
                            exit='exit'>
                            <OnboardingGmailLinkView stateId={stateId} />
                        </motion.div>
                    )}

                    {currentStep === OnboardingSteps.Step2 && (
                        <motion.div
                            key='step2'
                            className='absolute inset-0'
                            custom={direction}
                            variants={pageVariants}
                            initial='initial'
                            animate='animate'
                            exit='exit'>
                            <OnboardingPhoneConfirmationView onVerify={handleNextStep} />
                        </motion.div>
                    )}

                    {currentStep === OnboardingSteps.Step3 && (
                        <motion.div
                            key='step3'
                            className='absolute inset-0'
                            custom={direction}
                            variants={pageVariants}
                            initial='initial'
                            animate='animate'
                            exit='exit'>
                            <OnboardingSubscriptionView state_id={stateId} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
