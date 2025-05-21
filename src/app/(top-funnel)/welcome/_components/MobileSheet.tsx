'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';

import { OnboardingSteps } from '../_types';
import { AnimatePresence, motion } from 'framer-motion';

// For potential close/nav buttons inside sheet

interface MobileSheetProps {
    currentStep: OnboardingSteps; // The current active step
    children: React.ReactNode; // The content for the current step to be rendered inside the sheet
    isOpen: boolean; // To control sheet visibility
    onOpenChange: (open: boolean) => void; // To handle sheet close (e.g., swipe down)
    direction?: number; // For animation: 1 for next, -1 for prev
}

export default function MobileSheet({
    currentStep,
    children,
    isOpen,
    onOpenChange,
    direction = 0 // Default direction if not specified
}: MobileSheetProps) {
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 60, damping: 15 }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            transition: { type: 'spring', stiffness: 60, damping: 15 }
        })
    };

    // Determine a title or leave it generic
    let sheetTitle = "Let's get you set up";
    if (currentStep === OnboardingSteps.Step1) sheetTitle = 'Link your Gmail';
    if (currentStep === OnboardingSteps.Step2) sheetTitle = 'Verify your Phone';
    if (currentStep === OnboardingSteps.Step3) sheetTitle = "You're All Set!";

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            {/* SheetTrigger might not be needed if controlled externally by isOpen */}
            {/* <SheetTrigger asChild><Button variant="outline">Open Sheet</Button></SheetTrigger> */}
            <SheetContent
                side='bottom'
                className='flex h-[75vh] flex-col p-0' // Example height, adjust as needed; remove default padding
                onInteractOutside={(e) => e.preventDefault()} // Prevent closing on outside click if desired
            >
                <SheetHeader className='p-6 pb-2 text-left'>
                    <SheetTitle>{sheetTitle}</SheetTitle>
                    {/* Optional: <SheetDescription>Make changes to your profile here.</SheetDescription> */}
                </SheetHeader>

                <div className='relative flex-grow overflow-hidden p-6 pt-2'>
                    {' '}
                    {/* Container for animated content */}
                    <AnimatePresence initial={false} custom={direction} mode='wait'>
                        <motion.div
                            key={currentStep.toString()} // Key by step to trigger animation
                            custom={direction}
                            variants={variants}
                            initial='enter'
                            animate='center'
                            exit='exit'
                            className='absolute inset-0 p-6 pt-2' // Ensure motion.div fills its container
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
                {/* Optional: Footer for common actions like close or primary step action */}
                {/* <SheetFooter className="p-6 pt-2">
                    <SheetClose asChild>
                        <Button type="button" variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter> */}
            </SheetContent>
        </Sheet>
    );
}
