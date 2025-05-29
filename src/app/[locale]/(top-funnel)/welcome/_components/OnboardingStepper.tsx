'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { OnboardingSteps, mapNumberToStep, mapStepToNumbers } from '../_types';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CircleX } from 'lucide-react';

interface OnboardingStepperProps {
    steps: string[];
    currentStep: OnboardingSteps.Step1 | OnboardingSteps.Step2 | OnboardingSteps.Step3;
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    nonCompletedTextColor?: string;
    failedSteps: OnboardingSteps[];
    onChange?: (step: OnboardingSteps) => void;
}

export default function OnboardingStepper({
    steps = [OnboardingSteps.Step1, OnboardingSteps.Step2, OnboardingSteps.Step3],
    currentStep = OnboardingSteps.Step1,
    primaryColor = 'bg-blue-500',
    backgroundColor = 'bg-gray-200',
    textColor = 'text-white',
    nonCompletedTextColor = 'text-[#016DBC]',
    failedSteps = [],
    onChange
}: OnboardingStepperProps) {
    const [activeStep, setActiveStep] = useState(currentStep);
    const textColorClass = textColor;
    const nonCompletedTextColorClass = nonCompletedTextColor;
    const primaryColorClass = primaryColor;
    const backgroundColorClass = backgroundColor;

    useEffect(() => {
        setActiveStep(currentStep);
    }, [currentStep]);

    const handleStepClick = (step: OnboardingSteps) => {
        if (onChange) {
            onChange(step);
        }
    };

    const renderLine = (index: number, isCompleted: boolean) => {
        return (
            <div key={`line-${index}`} className='relative h-1 flex-1 rounded-2xl px-4'>
                <div className={`h-full rounded-2xl bg-white/20`}></div>
                <motion.div
                    className={cn('-mt-[4px] h-full rounded-2xl', isCompleted ? 'bg-white' : 'bg-white')}
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            </div>
        );
    };

    const renderStep = (stepNumber: number, isCompleted: boolean, isActive: boolean) => {
        const variants = {
            initial: {
                opacity: 0,
                scale: 0.5
            },
            animate: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 0.3,
                    ease: 'easeOut'
                }
            },
            exit: {
                opacity: 0,
                scale: 0.5,
                transition: {
                    duration: 0.2,
                    ease: 'easeIn'
                }
            }
        };

        return (
            <motion.button
                key={`step-${stepNumber}`}
                className={cn(
                    'relative z-10 flex size-6 items-center justify-center gap-2 overflow-hidden rounded-full',
                    isActive || isCompleted ? primaryColorClass : backgroundColorClass,
                    isActive || isCompleted ? textColorClass : nonCompletedTextColorClass,
                    isActive && !isCompleted && 'bg-[#016DBC]',
                    isCompleted &&
                        !failedSteps.includes(mapNumberToStep[stepNumber as keyof typeof mapNumberToStep]) &&
                        'bg-white',
                    'transition-colors duration-300',
                    failedSteps.includes(mapNumberToStep[stepNumber as keyof typeof mapNumberToStep]) && 'bg-[#F66834]'
                )}
                onClick={() => handleStepClick(mapNumberToStep[stepNumber as keyof typeof mapNumberToStep])}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}>
                <AnimatePresence mode='sync'>
                    {!isCompleted && !isActive && (
                        <motion.span
                            key='number'
                            className='absolute inset-0 flex items-center justify-center text-base font-semibold'
                            variants={variants}
                            initial='initial'
                            animate='animate'
                            exit='exit'>
                            {stepNumber}
                        </motion.span>
                    )}

                    {isCompleted && (
                        <motion.div
                            key='check'
                            className='absolute inset-0 flex items-center justify-center'
                            variants={variants}
                            initial='initial'
                            animate='animate'
                            exit='exit'>
                            <Check className='h-5 w-5 text-[#016DBC]' />
                        </motion.div>
                    )}

                    {isActive && !isCompleted && (
                        <motion.div
                            key='active'
                            className='absolute inset-0 flex size-6 items-center justify-center rounded-full bg-white text-sm'
                            variants={variants}
                            initial='initial'
                            animate='animate'
                            exit='exit'>
                            <div className='size-2 rounded-full bg-[#016DBC]' />
                        </motion.div>
                    )}

                    {failedSteps.includes(mapNumberToStep[stepNumber as keyof typeof mapNumberToStep]) && (
                        <motion.div
                            key='failed'
                            className='absolute inset-0 flex items-center justify-center bg-[#F66834]'>
                            <span className='text-lg font-bold text-white'>!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        );
    };

    return (
        <div className='w-full max-w-[250px] px-4 py-4'>
            <div className='flex items-center justify-between'>
                {steps.map((step, index) => {
                    const stepNumber = mapStepToNumbers[step as OnboardingSteps];
                    const isCompleted = stepNumber < mapStepToNumbers[activeStep];
                    const isActive = stepNumber === mapStepToNumbers[activeStep];

                    return (
                        <div key={`step-container-${index}`} className='flex flex-1 items-center last:flex-none'>
                            {renderStep(stepNumber, isCompleted, isActive)}
                            {index < steps.length - 1 && renderLine(index, isCompleted)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
