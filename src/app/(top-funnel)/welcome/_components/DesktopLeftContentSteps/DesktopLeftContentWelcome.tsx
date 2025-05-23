'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import { FRAMER_LINKS } from '@/config/navigation';
import { EventLists, trackLuckyOrangeEvent } from '@/lib/analytics';

import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import Cookies from 'js-cookie';

// Data for the cycling steps - can be the same as mobile if content matches
const cyclingStepsData = [
    {
        id: 'email',
        icon: '📧',
        text: 'Connect your Gmail',
        subtext: "We'll instantly find your past and upcoming bookings."
    },
    {
        id: 'phone',
        icon: '☎️',
        text: 'So we can text you when we find savings.',
        subtext: "We'll notify you when prices drop."
    },
    {
        id: 'member',
        icon: '🎉',
        text: 'Become a member to start saving',
        subtext: 'Automatic refunds when prices drop for just $25/year.'
    }
];
const CYCLE_STEP_INTERVAL_MS = 4000; // Same interval as mobile, adjust if needed

export default function DesktopLeftContentWelcome() {
    const [stateId, setStateId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const [activeStepIndex, setActiveStepIndex] = useState(0); // For cycling focus

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
            try {
                const fbp = Cookies.get('_fbp');
                const fbc = Cookies.get('_fbc');

                const utmParams = getUtmParams();
                const response = await fetch('/api/gmail/state', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...(fbp ? { fbp } : {}),
                        ...(fbc ? { fbc } : {}),
                        ...(utmParams && Object.keys(utmParams).length > 0 ? { utm_params: utmParams } : {}) // Ensure utmParams is not null/empty before spreading
                    })
                });

                if (!response.ok) throw new Error('Failed to get state ID');
                const data = await response.json();
                setStateId(data.state_id);
            } catch (err) {
                setError('Failed to initialize. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
        getStateId();
    }, [searchParams]); // Added getUtmParams to dependency array if it's not stable (though it reads searchParams which is a dep)

    // Effect for cycling through the active step
    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveStepIndex((prevIndex) => (prevIndex + 1) % cyclingStepsData.length);
        }, CYCLE_STEP_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, []); // Runs once on mount

    const panelVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 60,
                damping: 20,
                duration: 0.7,
                delay: 3
            }
        }
    };

    useEffect(() => {
        trackLuckyOrangeEvent(EventLists.takeoff.name, {
            description: EventLists.takeoff.description
        });
    }, []);

    // Variants for individual step items based on active state
    const stepItemDisplayVariants = {
        active: {
            opacity: 1,
            scale: 1,
            x: 0, // No x-shift for active to maintain paddingLeft from parent
            paddingLeft: 20,
            transition: { type: 'spring', stiffness: 120, damping: 15 }
        },
        inactive: {
            opacity: 0.5, // Dimmed opacity
            scale: 0.9, // Slightly smaller
            x: 0, // No x-shift for inactive to maintain paddingLeft from parent
            paddingLeft: 0,
            transition: { type: 'spring', stiffness: 120, damping: 15 }
        }
    };

    return (
        <motion.div
            className='relative z-10 flex w-1/2 items-center justify-center overflow-x-hidden rounded-r-2xl bg-gradient-to-b from-[#0B74C0] to-[#57A3D9] pt-4 pl-12'
            variants={panelVariants}
            initial='hidden'
            animate='visible'>
            <div className='-mr-6 flex h-full w-full flex-col justify-between gap-4 overflow-y-auto pb-4 pl-8'>
                <div className='flex w-full shrink-0 items-center justify-between'>
                    <div className='flex flex-col items-center justify-start gap-2'>
                        <IconNewWhite className='-ml-2 size-24' />
                        <div className='-mt-11 flex flex-row items-center justify-start gap-2 py-3 text-white'>
                            <h1 className='text-figtree text-base font-bold'>Backed by </h1>
                            <div className='flex flex-row items-center justify-center gap-1'>
                                <div className='size-5 bg-[#f26522] text-center text-sm font-bold'>Y</div>
                            </div>
                        </div>
                    </div>
                    <Link href='/auth/phone-login'>
                        <div className='mr-8 cursor-pointer rounded-full px-6 py-2 text-base font-semibold text-white hover:bg-gray-200/20'>
                            Login
                        </div>
                    </Link>
                </div>
                <div className='flex flex-col items-start justify-center gap-2'>
                    <h1 className='text-figtree pr-8 text-[68px] leading-[66px] font-bold tracking-[-2%] text-white drop-shadow-xl'>
                        Big Travel <br /> hates this app.
                    </h1>
                    <h2 className='text-figtree max-w-md pr-4 text-base font-semibold text-white drop-shadow-sm'>
                        Other travel sites keep your money when prices drop. We think that's wrong.
                    </h2>
                    <div className='my-4 -ml-3 flex flex-col items-start justify-center gap-1 text-white'>
                        <h2 className='text-figtree ml-3 max-w-md pr-4 text-base font-semibold text-white drop-shadow-sm'>
                            Let's get your money back (no matter where you booked).
                        </h2>
                        {cyclingStepsData.map((step, index) => (
                            <motion.div
                                key={step.id}
                                variants={stepItemDisplayVariants}
                                animate={index === activeStepIndex ? 'active' : 'inactive'}
                                className='flex flex-row items-center justify-start gap-2'>
                                <span className='text-2xl'>{cyclingStepsData[index].icon}</span>
                                <div className='flex flex-col text-left'>
                                    {' '}
                                    {/* Allow text to wrap if needed */}
                                    <span className='font-bolder text-[14px] drop-shadow-lg'>
                                        {cyclingStepsData[index].text}
                                    </span>
                                    {cyclingStepsData[index].subtext && (
                                        <span className='text-bold text-[14px]'>{cyclingStepsData[index].subtext}</span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <Link href={`/welcome?step=1&state_id=${stateId || ''}`}>
                        <div
                            onClick={() => {
                                trackLuckyOrangeEvent(EventLists.began_boarding.name, {
                                    description: EventLists.began_boarding.description
                                });
                            }}
                            className='text-md gap-6 rounded-full bg-white px-8 py-3 text-center font-bold text-neutral-700 shadow-lg drop-shadow-md transition-all hover:scale-105 active:scale-95'>
                            Import my travel bookings
                        </div>
                    </Link>
                </div>
                <div className='flex w-full shrink-0 flex-wrap items-center justify-start text-center text-xs text-white/60 transition-colors'>
                    <div className='flex flex-row items-center justify-center gap-x-2'>
                        <a
                            href={FRAMER_LINKS.privacy}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-figtree transition-colors hover:text-white'>
                            Privacy Policy
                        </a>
                        <span className='font-figtree hidden pb-2 sm:inline'>.</span>
                        <a
                            href={FRAMER_LINKS.terms}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='font-figtree transition-colors hover:text-white'>
                            Terms of Service
                        </a>
                    </div>
                    <div className='mt-1 flex w-full flex-row items-center justify-center gap-x-2 sm:mt-0 sm:w-auto'>
                        <span className='font-figtree hidden pb-2 sm:inline'>.</span>
                        <p className='font-figtree'>
                            Copyright {format(new Date(), 'yyyy')} © Ascend. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
