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

// import { FRAMER_LINKS } from '@/config/navigation';

import { OnboardingSteps } from '../../_types';
import DesktopRightContent from '../DesktopRightContent';
// Adjusted path for ../../_types
// import { format } from 'date-fns';

// Globe imports
import { csvParseRows } from 'd3-dsv';
import { motion } from 'framer-motion';
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
const UI_ANIMATION_BASE_DELAY_MS = 3000; // Base delay after globe likely starts its animation
const UI_ANIMATION_STAGGER_MS = 200; // Stagger between middle and bottom content

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
// --- End Globe Logic ---

const now = new Date();
const feedCardExampleData: FeedCardData[] = [
    {
        id: 'feed-1',
        userName: 'Josh B.',
        creationDateTime: new Date(now.getTime() - 2 * 60 * 1000),
        destination: 'Phoenix',
        type: 'hotel',
        amount: 283,
        currency: '$'
    },
    {
        id: 'feed-2',
        userName: 'Sarah K.',
        creationDateTime: new Date(now.getTime() - 30 * 60 * 1000),
        destination: 'London',
        type: 'flight',
        amount: 112,
        currency: '$'
    },
    {
        id: 'feed-3',
        userName: 'Mike P.',
        creationDateTime: new Date(now.getTime() - 60 * 60 * 1000),
        destination: 'Cancun',
        type: 'hotel',
        amount: 450,
        currency: '$'
    },
    {
        id: 'feed-4',
        userName: 'Linda H.',
        creationDateTime: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        destination: 'Paris',
        type: 'flight',
        amount: 92,
        currency: '€'
    },
    {
        id: 'feed-5',
        userName: 'David S.',
        creationDateTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        destination: 'Tokyo',
        type: 'hotel',
        amount: 305,
        currency: '¥'
    },
    {
        id: 'feed-6',
        userName: 'Emily R.',
        creationDateTime: new Date(now.getTime() - 48 * 60 * 60 * 1000),
        destination: 'Rome',
        type: 'flight',
        amount: 150,
        currency: '€'
    },
    {
        id: 'feed-7',
        userName: 'John D.',
        creationDateTime: new Date(now.getTime() - 72 * 60 * 60 * 1000),
        destination: 'Barcelona',
        type: 'hotel',
        amount: 180,
        currency: '$'
    },
    {
        id: 'feed-8',
        userName: 'Sarah K.',
        creationDateTime: new Date(now.getTime() - 30 * 60 * 1000),
        destination: 'London',
        type: 'flight',
        amount: 112,
        currency: '$'
    }
];

// Modify feedCardExampleData to serve as initial recent items and ensure ContextListItem compatibility
const initialMobileFeedItems: ContextListItem[] = feedCardExampleData.slice(0, 5).map((item, index) => {
    const minutesAgo = Math.floor(Math.random() * 30); // Within last 30 minutes
    const creationDateTime = new Date(now.getTime() - minutesAgo * 60 * 1000);

    return {
        id: item.id || `initial-mobile-${index}`,
        text: item.type === 'hotel' ? `Trip to ${item.destination}` : `Flight booking for ${item.userName}`,
        color: 'rgba(255, 255, 255, 0.05)', // Keep existing color or generate new
        userName: item.userName,
        creationDateTime: creationDateTime, // Use recent date
        destination: item.destination,
        type: item.type,
        amount: item.amount,
        currency: item.currency
        // cta is optional
    };
});

// Sort by creationDateTime: oldest first (ascending order) so newest is at the bottom
initialMobileFeedItems.sort((a, b) => (a.creationDateTime?.getTime() || 0) - (b.creationDateTime?.getTime() || 0));

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
                    <Globe
                        ref={globeRef}
                        width={globeWidth}
                        height={globeHeight}
                        globeImageUrl='/earth-day-low-Quality.jpg' // Ensure this path is correct
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
                )}
            </motion.div>

            {/* Floating Content Overlay Layer - No pointer events on this main overlay */}
            {/* Individual interactive elements below will have pointer-events: auto */}

            {/* Top Bar (Logo/Login) - Animates from Top */}
            <motion.div
                className='pointer-events-auto fixed inset-x-0 top-2 z-50 flex w-full flex-row items-center justify-between rounded-b-2xl px-4 py-2'
                initial={{ y: '-100%', opacity: 0 }}
                animate={startUIAnimations ? { y: '0%', opacity: 1 } : { y: '-100%', opacity: 0 }}
                transition={{ delay: 0, type: 'spring', stiffness: 80, damping: 15 }} // Base delay removed, controlled by startUIAnimations
            >
                <IconNewWhite className='size-24 rounded-2xl bg-[#5AA6DA]/20 px-2 backdrop-blur-sm' />
                <Link href='/auth/phone-login' className='pointer-events-auto'>
                    <div className='cursor-pointer rounded-full bg-[#5AA6DA]/20 px-6 py-2 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20'>
                        Login
                    </div>
                </Link>
            </motion.div>

            {/* Middle Content (YC, Title, Subtitle) - Animates from Bottom */}
            <motion.div
                className='fixed inset-x-[10%] top-[40%] z-30 flex h-fit flex-1 translate-y-[-50%] flex-col items-center justify-center gap-4 rounded-xl px-4 py-6 text-center'
                initial={{ y: '100vh', opacity: 0 }} // Start from bottom of viewport
                animate={startUIAnimations ? { y: '0%', opacity: 1 } : { y: '100vh', opacity: 0 }}
                transition={{
                    delay: startUIAnimations ? UI_ANIMATION_STAGGER_MS / 1000 : 0, // Stagger if animating
                    type: 'spring',
                    stiffness: 70,
                    damping: 18
                }}>
                <div className='pointer-events-auto flex flex-row items-center justify-start gap-2 rounded-sm bg-black/30 px-2 text-xs text-white backdrop-blur-sm'>
                    <span>Backed by </span>
                    <span className='flex size-6 items-center justify-center bg-[#f26522] text-[12px] font-bold'>
                        Y
                    </span>
                    <span>Combinator</span>
                </div>
                <h1 className='text-figtree mx-auto max-w-[320px] text-[40px] leading-tight font-bold tracking-tight text-white drop-shadow-lg'>
                    Smart travelers don't overpay
                </h1>
                <h2
                    className='text-figtree mx-auto max-w-[320px] rounded-xl px-4 py-2 text-[16px] leading-normal font-medium text-white'
                    style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.5)' }}>
                    Ascend watches your bookings and gets you money back when <b>Big Travel</b> drops prices. Get
                    started in 3 steps.
                </h2>
            </motion.div>

            {/* Bottom Steps - Animates from Bottom with more delay */}
            <motion.div
                className='pointer-events-auto fixed inset-x-0 bottom-[20%] z-40 flex flex-col items-start justify-center gap-1 rounded-xl p-4 pl-[10%] text-sm font-semibold text-white'
                // Removed bg/backdrop from here, apply to children if needed to avoid full width block
                initial={{ y: '100vh', opacity: 0 }}
                animate={startUIAnimations ? { y: '0%', opacity: 1 } : { y: '100vh', opacity: 0 }}
                transition={{
                    delay: startUIAnimations ? (UI_ANIMATION_STAGGER_MS * 2) / 1000 : 0, // Further stagger if animating
                    type: 'spring',
                    stiffness: 60,
                    damping: 15
                }}>
                <div className='flex flex-row items-center gap-3 rounded-sm bg-black/10 px-4 py-0.5 text-xs backdrop-blur-sm'>
                    <span className='text-lg'>📧</span>
                    <div className='text-xs'>Connect your email to import travel bookings</div>
                </div>
                <div className='flex flex-row items-center gap-3 rounded-sm bg-black/10 px-4 py-0.5 text-xs backdrop-blur-sm'>
                    <span className='text-lg'>☎️</span>
                    <div className='text-xs'>Add your phone number to get notified</div>
                </div>
                <div className='flex flex-row items-center gap-3 rounded-sm bg-black/10 px-4 py-0.5 backdrop-blur-sm'>
                    <span className='text-lg'>🎉</span>
                    <div className='text-xs'>Become a member to start saving</div>
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
