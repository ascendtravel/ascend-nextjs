'use client';

// Keep this if StickyScrollList or its context uses client features
import React, { useCallback, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

// For footer

import FeedCard, { FeedCardData } from '@/components/FeedCard/FeedCard';
import IconNewWhite from '@/components/Icon/IconNewWhite';
import { StickyScrollList } from '@/components/StickyScrollList';
import {
    ListItem as ContextListItem,
    StickyScrollListProvider
} from '@/components/StickyScrollList/StickyScrollListContext';
import type {
    // ListItem as BaseStickyListItem, // Keep if BaseStickyListItem is distinct and used elsewhere
    StickyCardRenderProps
} from '@/components/StickyScrollList/StickyScrollListTypes';
import { EventLists, trackLuckyOrangeEvent } from '@/lib/analytics';

// import { FRAMER_LINKS } from '@/config/navigation';

import { OnboardingSteps } from '../../_types';
import DesktopRightContent from '../DesktopRightContent';
// Adjusted path for ../../_types
// import { format } from 'date-fns';

// Globe imports
import { csvParseRows } from 'd3-dsv';
import { AnimatePresence, motion } from 'framer-motion';
import indexBy from 'index-array-by';
import Globe, { GlobeMethods } from 'react-globe.gl';

// --- Globe Logic: Constants, Types, Parsers ---
const AIRPORTS_DATA_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat';
const ROUTES_DATA_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat';
const TARGET_COUNTRY = 'United States';
const ARC_OPACITY = 0.22;
const START_CAMERA_POV = { lat: 0, lng: 0, altitude: 3.5 };
const TARGET_CAMERA_POV = { lat: 39.648194, lng: -42.941194, altitude: 1.5 };
const POV_ANIMATION_DURATION_MS = 2500;
const INITIAL_ANIMATION_DELAY_MS = 500;
const SLOW_ROTATION_SPEED = 0.16;

// Animation delays for floating content
const UI_ANIMATION_BASE_DELAY_MS = 700;
const UI_ANIMATION_STAGGER_MS = 400;

// Data for the cycling steps - MOVED TO MODULE SCOPE
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
        text: 'Add your phone number',
        subtext: 'So we can text you when we find savings.'
    },
    {
        id: 'member',
        icon: '🎉',
        text: 'Become a member to start saving',
        subtext: 'Automatic refunds when prices drop for just $25/year.'
    }
];
const CYCLE_STEP_INTERVAL_MS = 3000; // Change step every 3 seconds

interface Airport {
    airportId: string;
    name: string;
    city: string;
    country: string;
    iata: string;
    icao: string;
    lat: string;
    lng: string;
    alt: string;
    timezone: string;
    dst: string;
    tz: string;
    type: string;
    source: string;
}

interface Route {
    airline: string;
    airlineId: string;
    srcIata: string;
    srcAirportId: string;
    dstIata: string;
    dstAirportId: string;
    codeshare: string;
    stops: string;
    equipment: string;
    srcAirport?: Airport;
    dstAirport?: Airport;
}

const airportParse = (row: string[]): Airport => ({
    airportId: row[0],
    name: row[1],
    city: row[2],
    country: row[3],
    iata: row[4],
    icao: row[5],
    lat: row[6],
    lng: row[7],
    alt: row[8],
    timezone: row[9],
    dst: row[10],
    tz: row[11],
    type: row[12],
    source: row[13]
});

const routeParse = (row: string[]): Partial<Route> => ({
    airline: row[0],
    airlineId: row[1],
    srcIata: row[2],
    srcAirportId: row[3],
    dstIata: row[4],
    dstAirportId: row[5],
    codeshare: row[6],
    stops: row[7],
    equipment: row[8]
});

// Sort by creationDateTime: oldest first (ascending order) so newest is at the bottom

interface MobileContentWelcomeProps {
    predefinedStep?: OnboardingSteps;
    onNextStep?: () => void;
    // Add skipInitialGlobeAnimation if needed for mobile, defaulting to false for now
    skipInitialGlobeAnimation?: boolean;
}

export default function MobileContentWelcome({
    predefinedStep,
    onNextStep,
    skipInitialGlobeAnimation = false // Default to animate on mobile welcome
}: MobileContentWelcomeProps) {
    // --- Globe State and Refs (copied from DesktopRightContent) ---
    const globeRef = useRef<GlobeMethods | undefined>(undefined);
    const rotationTimerIdRef = useRef<NodeJS.Timeout | null>(null);
    const globeContainerRef = useRef<HTMLDivElement | null>(null);
    const [globeWidth, setGlobeWidth] = useState(0);
    const [globeHeight, setGlobeHeight] = useState(0);
    const [airports, setAirports] = useState<Airport[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
    const [isGlobeReady, setIsGlobeReady] = useState(false);
    const [startUIAnimations, setStartUIAnimations] = useState(false);
    const [activeStepIndex, setActiveStepIndex] = useState(0);

    useEffect(() => {
        trackLuckyOrangeEvent(EventLists.takeoff.name, {
            description: EventLists.takeoff.description
        });
    }, []);

    // --- Globe useEffects (copied and adapted from DesktopRightContent) ---
    // Data loading effect
    useEffect(() => {
        Promise.all([
            fetch(AIRPORTS_DATA_URL)
                .then((res) => res.text())
                .then((d) => csvParseRows(d, airportParse as (row: string[]) => Airport)),
            fetch(ROUTES_DATA_URL)
                .then((res) => res.text())
                .then((d) => csvParseRows(d, routeParse as (row: string[]) => Partial<Route>))
        ])
            .then(([loadedAirports, loadedRoutes]) => {
                const byIata = indexBy(loadedAirports, 'iata', false) as { [key: string]: Airport };
                const filteredRoutes = loadedRoutes
                    .filter(
                        (route) =>
                            route.srcIata &&
                            route.dstIata &&
                            Object.prototype.hasOwnProperty.call(byIata, route.srcIata) &&
                            Object.prototype.hasOwnProperty.call(byIata, route.dstIata)
                    )
                    .filter((route) => route.stops === '0')
                    .map((route) =>
                        Object.assign({}, route, {
                            srcAirport: byIata[route.srcIata!],
                            dstAirport: byIata[route.dstIata!]
                        })
                    )
                    .filter(
                        (route) =>
                            route.srcAirport?.country === TARGET_COUNTRY && route.dstAirport?.country !== TARGET_COUNTRY
                    );
                setAirports(loadedAirports);
                setRoutes(filteredRoutes as Route[]);

                return null;
            })
            .catch((error) => console.error('Error loading globe data for mobile:', error));
    }, []);

    // Camera animation effect
    useEffect(() => {
        if (globeRef.current && isGlobeReady) {
            globeRef.current.pointOfView(TARGET_CAMERA_POV, 0);
            setIsInitialAnimationComplete(true);

            if (rotationTimerIdRef.current) {
                clearTimeout(rotationTimerIdRef.current);
                rotationTimerIdRef.current = null;
            }
        }

        return () => {};
    }, [isGlobeReady]);

    // Auto-rotation effect
    useEffect(() => {
        if (globeRef.current && isGlobeReady) {
            if (isInitialAnimationComplete) {
                globeRef.current.controls().autoRotate = true;
                globeRef.current.controls().autoRotateSpeed = SLOW_ROTATION_SPEED;
            } else {
                globeRef.current.controls().autoRotate = false;
            }
        }
    }, [isGlobeReady, isInitialAnimationComplete]);

    // Controls configuration effect
    useEffect(() => {
        if (globeRef.current && isGlobeReady) {
            const controls = globeRef.current.controls();
            controls.enableZoom = true;
            controls.enableRotate = true;
            controls.minDistance = 100;
            controls.maxDistance = 500;
        }
    }, [isGlobeReady]);

    // Resize observer effect
    useEffect(() => {
        const container = globeContainerRef.current;
        if (!container) return;
        setGlobeWidth(container.offsetWidth);
        setGlobeHeight(container.offsetHeight);
        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries || !entries.length) return;
            const { width, height } = entries[0].contentRect;
            setGlobeWidth(width);
            setGlobeHeight(height);
        });
        resizeObserver.observe(container);

        return () => {
            resizeObserver.unobserve(container);
            resizeObserver.disconnect();
        };
    }, []); // Removed globeContainerRef from deps as it should be stable

    const handleGlobeReady = useCallback(() => {
        setIsGlobeReady(true);
        console.log('Mobile globe is ready.');
        // Consider starting UI animations after globe is ready AND its container has faded in.
        // The globe container's onAnimationComplete can also be used.
    }, []);

    const onGlobeFadeInComplete = () => {
        // This will be called when the globe container's fade-in is done.
        // Now it's safer to start other UI animations.
        console.log('Globe container fade-in complete, starting UI animations.');
        setStartUIAnimations(true);
    };

    // Effect for cycling through the active step
    useEffect(() => {
        if (!startUIAnimations) return;

        const intervalId = setInterval(() => {
            setActiveStepIndex((prevIndex) => (prevIndex + 1) % cyclingStepsData.length);
        }, CYCLE_STEP_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [startUIAnimations]);

    // Variants for individual step items based on active state
    const stepItemDisplayVariants = {
        active: {
            opacity: 1,
            scale: 1,
            y: 0,
            marginLeft: 25,
            transition: { type: 'spring', stiffness: 120, damping: 15 }
        },
        inactive: {
            opacity: 0.6, // Dimmed opacity
            scale: 0.8, // Slightly smaller
            y: 0, // Optional: slightly offset inactive items
            marginLeft: 0,

            transition: { type: 'spring', stiffness: 120, damping: 15 }
        }
    };

    // --- Original MobileContentWelcome JSX modified for floating content ---
    return (
        <>
            {/* Globe Background Layer */}
            <motion.div
                ref={globeContainerRef}
                className='fixed inset-0 z-0'
                style={{ backgroundColor: '#00356B' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: globeWidth > 0 && globeHeight > 0 ? 1 : 0 }}
                transition={{ duration: 1.0, delay: 0.2 }}
                onAnimationComplete={onGlobeFadeInComplete} // Trigger UI animations after fade-in
            >
                {globeWidth > 0 && globeHeight > 0 && (
                    <>
                        <Globe
                            ref={globeRef}
                            width={globeWidth}
                            height={globeHeight}
                            globeImageUrl='/earth-day-low-res.jpg' // Ensure this path is correct
                            backgroundColor='#0B74C0'
                            onGlobeReady={handleGlobeReady}
                            atmosphereColor='lightblue'
                            atmosphereAltitude={0.25}
                            arcsData={routes}
                            arcStartLat={(d: any) => +d.srcAirport!.lat}
                            arcStartLng={(d: any) => +d.srcAirport!.lng}
                            arcEndLat={(d: any) => +d.dstAirport!.lat}
                            arcEndLng={(d: any) => +d.dstAirport!.lng}
                            arcDashLength={0.25}
                            arcDashGap={1}
                            arcDashInitialGap={() => Math.random()}
                            arcDashAnimateTime={4000}
                            arcColor={(d: any) => [`rgba(0, 255, 0, ${ARC_OPACITY})`, `rgba(255, 0, 0, ${ARC_OPACITY})`]}
                            arcsTransitionDuration={0}
                        />
                        <div className='absolute inset-0 z-10 bg-[#00000077] pointer-events-none' />
                    </>
                )}
            </motion.div>

            {/* Floating Content Overlay Layer - No pointer events on this main overlay */}
            {/* Individual interactive elements below will have pointer-events: auto */}

            {/* Top Bar (Logo/Login) - Animates from Top */}
            <motion.div
                className='pointer-events-auto fixed inset-x-0 top-2 left-3 z-50 flex w-full flex-row items-center justify-between rounded-b-2xl px-4 py-2'
                initial={{ y: '-100%', opacity: 0 }}
                animate={startUIAnimations ? { y: '0%', opacity: 1 } : { y: '-100%', opacity: 0 }}
                transition={{ delay: 0, type: 'spring', stiffness: 80, damping: 15 }} // Base delay removed, controlled by startUIAnimations
            >
                <div className='-ml-2 flex flex-col items-center justify-start'>
                    <IconNewWhite className='size-18 rounded-2xl' />
                </div>
                <Link href='/auth/phone-login' className='pointer-events-auto'>
                    <div className='cursor-pointer rounded-full px-6 py-2 text-base font-semibold text-white hover:bg-white/20'>
                        Login
                    </div>
                </Link>
            </motion.div>

            {/* Middle Content (YC, Title, Subtitle) - Animates from Bottom */}
            <motion.div
                className='fixed inset-x-[5%] top-[32%] z-30 flex h-fit flex-1 translate-y-[-50%] flex-col items-center justify-center gap-4 rounded-xl px-4 py-6 text-center'
                initial={{ y: '100vh', opacity: 0 }} // Start from bottom of viewport
                animate={startUIAnimations ? { y: '0%', opacity: 1 } : { y: '100vh', opacity: 0 }}
                transition={{
                    delay: startUIAnimations ? UI_ANIMATION_STAGGER_MS / 1000 : 0, // Stagger if animating
                    type: 'spring',
                    stiffness: 70,
                    damping: 18
                }}>
                <div className='pointer-events-auto -mt-4 flex flex-row items-center justify-start gap-1 rounded-sm px-2 text-xs font-bold text-white drop-shadow-2xl'>
                    <span>Backed by </span>
                    <span className='flex size-3 items-center justify-center bg-[#f26522] text-[10px] font-bold'>
                        Y
                    </span>
                </div>
                <h1 className='text-figtree font-extrabold mx-auto max-w-[650px] text-[2.8rem] leading-[1em] tracking-tighter text-white drop-shadow-lg'>
                    Big travel hates<br />  this app.
                </h1>
                <h2 className='text-figtree text-[1rem] mx-auto max-w-[320px] rounded-xl px-4 text-sm leading-normal font-medium text-white'>
                    Other travel sites keep your money when prices drop. We think that's wrong.
                </h2>
            </motion.div>

            {/* Bottom Steps - Container animates in, items inside have dynamic styles */}
            <motion.div
                className='pointer-events-auto fixed inset-x-0 bottom-[16%] z-40 flex flex-col items-center justify-center gap-2 text-sm font-semibold text-white'
                initial={{ opacity: 0, y: 50 }} // Container slides up and fades in
                animate={startUIAnimations ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                    delay: startUIAnimations ? (UI_ANIMATION_STAGGER_MS * 2) / 1000 : 0,
                    type: 'spring',
                    stiffness: 60,
                    damping: 18
                }}>
                <div className='-ml-8 flex w-[calc(100%-12%)] flex-col items-stretch justify-center rounded-xl'>
                    {cyclingStepsData.map((step, index) => (
                        <motion.div
                            key={step.id}
                            variants={stepItemDisplayVariants}
                            animate={index === activeStepIndex ? 'active' : 'inactive'}
                            className='flex flex-row items-center gap-3 rounded-md p-1' // Basic styling for each row
                            // Add transition prop here if needed, or rely on variant transition
                        >
                            <span className='text-2xl'>{cyclingStepsData[index].icon}</span>
                            <div className='flex flex-col text-left'>
                                {' '}
                                {/* Allow text to wrap if needed */}
                                <span className='font-bolder text-[1rem] drop-shadow-lg'>
                                    {cyclingStepsData[index].text}
                                </span>
                                {cyclingStepsData[index].subtext && (
                                    <span className='text-[0.9rem] opacity-90 drop-shadow-lg'>
                                        {cyclingStepsData[index].subtext}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}

// --- Full Interface and Function Definitions (ensure these are complete) ---
// Interface Airport (copied from DesktopRightContent)
// ... (full definition needed here if not above)
// Interface Route (copied from DesktopRightContent)
// ... (full definition needed here if not above)
// Function airportParse (copied from DesktopRightContent)
// ... (full definition needed here if not above)
// Function routeParse (copied from DesktopRightContent)
// ... (full definition needed here if not above)
