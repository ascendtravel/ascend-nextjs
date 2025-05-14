'use client';

import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { OnboardingSteps } from '../_types';
import { AnimatePresence, motion } from 'framer-motion';

interface OnboardingHeaderProps {
    step: OnboardingSteps;
}

// List of 30 different saving examples with various amounts and airport pairs
const savingExamples = [
    { amount: '$289', route: 'JFK to CDG' },
    { amount: '$217', route: 'LAX to LHR' },
    { amount: '$175', route: 'SFO to NRT' },
    { amount: '$312', route: 'ORD to FCO' },
    { amount: '$149', route: 'MIA to MEX' },
    { amount: '$236', route: 'SEA to SYD' },
    { amount: '$193', route: 'BOS to DUB' },
    { amount: '$278', route: 'ATL to AMS' },
    { amount: '$204', route: 'DFW to MAD' },
    { amount: '$169', route: 'DEN to YVR' },
    { amount: '$325', route: 'IAD to BKK' },
    { amount: '$183', route: 'PHX to CUN' },
    { amount: '$295', route: 'EWR to HKG' },
    { amount: '$157', route: 'MSP to YYZ' },
    { amount: '$276', route: 'CLT to BCN' },
    { amount: '$224', route: 'SLC to LIM' },
    { amount: '$342', route: 'DTW to ICN' },
    { amount: '$188', route: 'LGA to MBJ' },
    { amount: '$267', route: 'PHL to MUC' },
    { amount: '$213', route: 'BWI to PVR' },
    { amount: '$308', route: 'TPA to CPH' },
    { amount: '$179', route: 'PDX to YYC' },
    { amount: '$253', route: 'MCO to BOG' },
    { amount: '$198', route: 'AUS to PTY' },
    { amount: '$327', route: 'SAN to SIN' },
    { amount: '$245', route: 'RDU to ZRH' },
    { amount: '$172', route: 'MCI to PVG' },
    { amount: '$286', route: 'CLE to ATH' },
    { amount: '$235', route: 'STL to KEF' },
    { amount: '$301', route: 'IND to VIE' }
];

// Fixed saving example with index 0 to avoid hydration mismatch
const defaultSaving = savingExamples[0];

export default function OnboardingHeader({ step }: OnboardingHeaderProps) {
    const [currentStep, setCurrentStep] = useState<OnboardingSteps>(step);
    const [direction, setDirection] = useState(0);

    // Use state for randomSaving with client-side initialization
    const [randomSaving, setRandomSaving] = useState(defaultSaving);
    const isInitialRender = useRef(true);

    // Set up client-side only randomization
    useEffect(() => {
        if (isInitialRender.current && step === OnboardingSteps.Step3) {
            // Only randomize on client-side after initial render
            const randomIndex = Math.floor(Math.random() * savingExamples.length);
            setRandomSaving(savingExamples[randomIndex]);
            isInitialRender.current = false;
        }
    }, [step]);

    // Initial setup and attribute observer
    useEffect(() => {
        // Determine direction based on step change
        if (currentStep !== step) {
            const currentStepNumber = getStepNumber(currentStep);
            const newStepNumber = getStepNumber(step);
            setDirection(newStepNumber > currentStepNumber ? 1 : -1);
        }

        setCurrentStep(step);

        // Set up the initial class for querySelector to work
        const headerElement = document.querySelector('.onboarding-header');
        if (headerElement) {
            headerElement.classList.add('onboarding-header');
            headerElement.setAttribute('data-step', step);
        }

        // Set up a mutation observer to watch for data-step attribute changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-step' && headerElement) {
                    const newStep = headerElement.getAttribute('data-step') as OnboardingSteps;
                    if (newStep && newStep !== currentStep) {
                        // Determine direction when step changes via attribute
                        const currentStepNumber = getStepNumber(currentStep);
                        const newStepNumber = getStepNumber(newStep);
                        setDirection(newStepNumber > currentStepNumber ? 1 : -1);
                        setCurrentStep(newStep);

                        // Only randomize when stepping into step 3
                        if (newStep === OnboardingSteps.Step3 && currentStep !== OnboardingSteps.Step3) {
                            const randomIndex = Math.floor(Math.random() * savingExamples.length);
                            setRandomSaving(savingExamples[randomIndex]);
                        }
                    }
                }
            });
        });

        if (headerElement) {
            observer.observe(headerElement, { attributes: true });
        }

        return () => {
            observer.disconnect();
        };
    }, [step, currentStep]);

    // Helper function to get numeric value of step for direction calculation
    const getStepNumber = (stepValue: OnboardingSteps): number => {
        switch (stepValue) {
            case OnboardingSteps.Step1:
                return 1;
            case OnboardingSteps.Step2:
                return 2;
            case OnboardingSteps.Step3:
                return 3;
            default:
                return 0;
        }
    };

    // Animation variants with direction awareness
    const headerVariants = {
        initial: (direction: number) => ({
            x: direction > 0 ? 100 : direction < 0 ? -100 : 0,
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
            x: direction < 0 ? 100 : direction > 0 ? -100 : 0,
            opacity: 0,
            transition: {
                x: { duration: 0.2 },
                opacity: { duration: 0.2 }
            }
        })
    };

    return (
        <div className='z-30 flex h-14 w-full flex-col items-center justify-center overflow-hidden bg-[#00345A]'>
            <AnimatePresence initial={false} mode='wait' custom={direction}>
                {currentStep === OnboardingSteps.Step1 && (
                    <motion.div
                        key='step1-header'
                        className='flex w-full flex-row items-center justify-center gap-2 p-2 py-3 text-white'
                        custom={direction}
                        variants={headerVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <h1 className='text-figtree text-lg font-bold'>Ascend is Backed by </h1>
                        <Image
                            src='/images/img-assets/Y-Comb.png'
                            alt='Y Combinator Logo'
                            width={120}
                            height={120}
                            quality={100}
                            className='object-contain'
                            priority
                        />
                    </motion.div>
                )}

                {currentStep === OnboardingSteps.Step2 && (
                    <motion.div
                        key='step2-header'
                        className='flex w-full flex-row items-center justify-center gap-2 p-2 py-3 text-white'
                        custom={direction}
                        variants={headerVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <h1 className='text-figtree text-lg font-bold'>Trusted by 10,000+ travelers</h1>
                    </motion.div>
                )}

                {currentStep === OnboardingSteps.Step3 && (
                    <motion.div
                        key='step3-header'
                        className='flex w-full flex-row items-center justify-center gap-2 p-2 py-3 text-white'
                        custom={direction}
                        variants={headerVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'>
                        <h1 className='text-figtree text-lg font-bold'>
                            {randomSaving.amount} saved on a trip from {randomSaving.route}
                        </h1>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
