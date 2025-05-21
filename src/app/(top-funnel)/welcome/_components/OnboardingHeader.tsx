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
const SCROLL_SPEED_PX_PER_SEC = 50; // Adjust for desired speed

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

    const marqueeVariants = {
        animate: {
            x: [0, -marqueeWidth], // Animate from 0 to -width for left-to-right scroll of content
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: 'loop', // Loop back to start
                    duration: animationDuration,
                    ease: 'linear'
                }
            }
        }
    };

    return (
        <div className='z-30 flex h-14 w-full flex-row items-center overflow-hidden bg-[#00345A] text-white'>
            <motion.div
                className='flex flex-nowrap' // Ensure items stay in a single line
                variants={marqueeVariants}
                animate='animate'>
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
