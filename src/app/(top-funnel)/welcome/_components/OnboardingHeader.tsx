'use client';

import { useCallback, useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

// List of different saving examples with various amounts and airport pairs
const savingExamplesSeed = [
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

const UPDATE_INTERVAL_MS = 30000; // 30 seconds

// Function to get a random saving example from the seed
const getRandomSavingExample = () => {
    const randomIndex = Math.floor(Math.random() * savingExamplesSeed.length);

    return savingExamplesSeed[randomIndex];
};

export default function OnboardingHeader() {
    // Initialize currentSaving with a random example to avoid SSR/hydration mismatch for the very first item
    // Subsequent items will be client-side driven.
    const [currentSaving, setCurrentSaving] = useState(() => getRandomSavingExample());
    const [nextSaving, setNextSaving] = useState(() => getRandomSavingExample());
    const [animationDirection, setAnimationDirection] = useState(1); // 1 for right to left, -1 for left to right

    const updateSavingExample = useCallback(() => {
        setAnimationDirection(1); // New item comes from the right
        setCurrentSaving(nextSaving);
        setNextSaving(getRandomSavingExample());
    }, [nextSaving]);

    useEffect(() => {
        // Set up the interval to update the saving example
        const intervalId = setInterval(updateSavingExample, UPDATE_INTERVAL_MS);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, [updateSavingExample]);

    // Animation variants for the text
    const textVariants = {
        initial: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        }),
        animate: {
            x: '0%',
            opacity: 1,
            transition: {
                x: { type: 'spring', stiffness: 200, damping: 25 },
                opacity: { duration: 0.3, ease: 'easeIn' }
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-100%' : '100%', // Current item exits to the left if new comes from right
            opacity: 0,
            transition: {
                x: { type: 'spring', stiffness: 200, damping: 25 },
                opacity: { duration: 0.3, ease: 'easeOut' }
            }
        })
    };

    return (
        <div className='z-30 flex h-14 w-full flex-col items-center justify-center overflow-hidden bg-[#00345A]'>
            <AnimatePresence initial={false} mode='wait' custom={animationDirection}>
                <motion.div
                    key={currentSaving.route + currentSaving.amount} // Unique key for AnimatePresence to detect change
                    className='flex w-full flex-row items-center justify-center gap-2 p-2 py-3 text-white'
                    custom={animationDirection}
                    variants={textVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'>
                    <h1 className='text-figtree text-lg font-bold'>
                        {currentSaving.amount} saved on a trip from {currentSaving.route}
                    </h1>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
