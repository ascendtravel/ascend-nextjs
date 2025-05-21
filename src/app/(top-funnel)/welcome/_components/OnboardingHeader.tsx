'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { motion } from 'framer-motion';

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

const NUM_ITEMS_IN_MARQUEE = 5; // Number of items to form the base of the marquee
const SCROLL_SPEED_PX_PER_SEC = 12; // Reduced speed
const INITIAL_PAUSE_DURATION_SEC = 2; // Pause for 4 seconds before scroll starts

// Function to get a random saving example from the seed
const getRandomSavingExample = () => {
    const randomIndex = Math.floor(Math.random() * savingExamplesSeed.length);

    return { ...savingExamplesSeed[randomIndex], id: Math.random().toString(36).substring(7) }; // Add unique id
};

// Function to generate an initial set of items
const generateInitialMarqueeItems = (count: number) => {
    return Array.from({ length: count }, getRandomSavingExample);
};

export default function OnboardingHeader() {
    const [marqueeItems, setMarqueeItems] = useState(() => generateInitialMarqueeItems(NUM_ITEMS_IN_MARQUEE));

    // Duplicate items for seamless looping
    const duplicatedItems = useMemo(() => [...marqueeItems, ...marqueeItems], [marqueeItems]);

    // This effect will periodically refresh the base items to introduce new content
    // For a true infinite feel with constantly new items, this logic would be more complex,
    // involving adding to one end and removing from other while animation is running.
    // This simpler version refreshes the set periodically.
    useEffect(() => {
        const intervalId = setInterval(() => {
            setMarqueeItems(generateInitialMarqueeItems(NUM_ITEMS_IN_MARQUEE));
        }, 15000); // Refresh content every 15 seconds, for example

        return () => clearInterval(intervalId);
    }, []);

    const marqueeWidth = NUM_ITEMS_IN_MARQUEE * 350; // Approximate width of one set of items (adjust itemWidth if needed)
    const animationDuration = marqueeWidth / SCROLL_SPEED_PX_PER_SEC;

    // The initial position for the pause: try to place the start of the content far right.
    // This might need to be a pixel value if percentages behave unexpectedly relative to the animated `x` values.
    // Let's use a large positive percentage to push it right, assuming parent is overflow:hidden.
    const initialXPositionForPause = 'calc(100% - 100px)'; // Example: start with first item near right edge. Adjust 100px based on item width.
    // Or, for simplicity, a large fixed value like '300px' if you know an item won't exceed that.
    // A more robust way is to measure parent width and set dynamically, but trying simpler first.

    const marqueeVariants = {
        // This animate state is for the *looping* part
        animateLoop: {
            x: [0, -marqueeWidth],
            transition: {
                x: {
                    // The delay here applies *after* it has reached the 'animateLoop' state from 'initialPauseState'
                    // So, the actual pause is handled by the transition from initialPauseState to animateLoop.
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: animationDuration,
                    ease: 'linear'
                }
            }
        },
        // This is the state for the initial pause
        initialPauseState: {
            x: 0, // Default to x:0 for the start of the strip, let parent div padding/margin handle centering for first item if needed
            opacity: 1
        }
    };

    return (
        <div className='z-30 flex h-14 w-full flex-row items-center justify-start overflow-hidden bg-[#00345A] pl-40 text-white'>
            <motion.div
                className='flex flex-nowrap'
                variants={marqueeVariants}
                initial='initialPauseState'
                animate='animateLoop'
                transition={{ delay: INITIAL_PAUSE_DURATION_SEC }}>
                {duplicatedItems.map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className='flex flex-shrink-0 flex-row items-center px-3 whitespace-nowrap'>
                        <span className='text-figtree text-lg font-bold'>
                            {item.amount} saved on a trip from {item.route}
                        </span>
                        {/* Add separator, ensuring it's not after the very last item of the duplicated list if it looks odd */}
                        {index < duplicatedItems.length - 1 && (
                            <span className='-mr-4 ml-3 text-lg text-white/80'>•</span>
                        )}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
