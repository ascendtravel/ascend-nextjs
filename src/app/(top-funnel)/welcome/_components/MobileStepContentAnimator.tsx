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
    forceHeight?: number; // This is a patch for second part of step 2 for OTP verification
}

export default function MobileStepContentAnimator({
    currentStep,
    children,
    direction = 0,
    forceHeight = 0
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

    return (
        <>
            {/* Create a shwwt only for step 2, its special will only be used in this step and shoudl darken the BG  */}
            {currentStep === OnboardingSteps.Step2 && <div className='fixed inset-0 z-10 bg-black opacity-50' />}

            <div
                className={cn(
                    'shadow-t-2xl fixed right-0 bottom-0 left-0 z-20 overflow-hidden rounded-t-2xl bg-white p-2 drop-shadow-2xl transition-all md:hidden',
                    currentStep === OnboardingSteps.Step0 && 'h-[100px]',
                    currentStep === OnboardingSteps.Step1 && 'h-[100px]',
                    currentStep === OnboardingSteps.Step3 && 'h-[100px]'
                )}
                // This height needs to change to fit the content of the step, but this step has t 2side steps that need to be accounted for
                style={
                    currentStep === OnboardingSteps.Step2 ? { height: forceHeight ? forceHeight + 'px' : '350px' } : {}
                }>
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
            </div>
        </>
    );
}
