'use client';

import React from 'react';

import { cn } from '@/lib/utils';

import { OnboardingSteps } from '../_types';
// Adjust path if necessary
import { AnimatePresence, motion } from 'framer-motion';

interface MobileStepContentAnimatorProps {
    currentStep: OnboardingSteps; // To key the animation
    children: React.ReactNode; // The content for the current step
    direction?: number; // For animation: 1 for next, -1 for prev
    forceHeight?: null | string; // This is a patch for second part of step 2 for OTP verification
}

export default function MobileStepContentAnimator({
    currentStep,
    children,
    direction = 0,
    forceHeight = null
}: MobileStepContentAnimatorProps) {
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%', // Enters from right if next, from left if prev
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 60, damping: 15, duration: 0.3 }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%', // Exits to right if next (direction was 1), to left if prev (direction was -1)
            opacity: 0,
            transition: { type: 'spring', stiffness: 60, damping: 15, duration: 0.3 }
        })
    };

    // Variants for the sheet itself when it's Step 0
    const sheetStep0Variants = {
        initial: { y: '100%', opacity: 0 }, // Start off-screen bottom
        animate: {
            y: '0%',
            opacity: 1,
            transition: { delay: 2, type: 'spring', stiffness: 70, damping: 20 }
        }
        // No exit needed here as it doesn't unmount, just its content/style changes
    };

    // Determine if this is the initial appearance of Step 0 for mount animation
    // This simple check works if currentStep starts at something other than Step0 and then transitions to it.
    // If it can load directly onto Step0, the animation will apply on mount.
    const isStep0InitialMount = currentStep === OnboardingSteps.Step0;

    return (
        <>
            {/* Create a shwwt only for step 2, its special will only be used in this step and shoudl darken the BG  */}
            {currentStep === OnboardingSteps.Step2 && <div className='fixed inset-0 z-10 bg-black opacity-50' />}

            <motion.div
                className={cn(
                    'shadow-t-2xl fixed right-0 bottom-0 left-0 z-20 overflow-hidden rounded-t-2xl bg-white p-2 drop-shadow-2xl transition-all md:hidden',
                    currentStep === OnboardingSteps.Step0 && 'h-[70px]',
                    currentStep === OnboardingSteps.Step1 && 'h-[70px]',
                    currentStep === OnboardingSteps.Step2 && 'h-[350px]',
                    currentStep === OnboardingSteps.Step3 && 'h-[70px]'
                )}
                style={{ height: forceHeight ? forceHeight : '' }}
                // Apply animation only for Step 0 initial appearance
                initial={isStep0InitialMount ? 'initial' : false} // 'false' prevents initial animation for non-Step0
                animate={isStep0InitialMount ? 'animate' : 'center'} // Use 'center' or a static state for non-Step0
                variants={isStep0InitialMount ? sheetStep0Variants : { center: { y: '0%', opacity: 1 } }} // Provide variants
            >
                <div className='relative h-full w-full'>
                    {/* Relative container for absolute positioning of motion.div */}
                    <AnimatePresence initial={false} custom={direction} mode='wait'>
                        <motion.div
                            key={currentStep.toString()} // Key by step to trigger animation
                            custom={direction}
                            variants={variants}
                            initial='enter'
                            animate='center'
                            exit='exit'
                            className='absolute inset-0 flex flex-col items-center justify-center' // Fill parent, center content
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </>
    );
}
