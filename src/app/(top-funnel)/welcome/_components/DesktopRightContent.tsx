'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

// Ensure you have installed react-globe.gl
import { csvParseRows } from 'd3-dsv';
// Ensure you have installed d3-dsv
import indexBy from 'index-array-by';
import Globe, { GlobeMethods } from 'react-globe.gl';

// Ensure you have installed index-array-by

const AIRPORTS_DATA_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat';
const ROUTES_DATA_URL = 'https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat';

const TARGET_COUNTRY = 'United States';
const ARC_OPACITY = 0.22;

// Camera Animation Parameters
const START_CAMERA_POV = { lat: 0, lng: 0, altitude: 3.5 }; // Zoomed out, centered view
const TARGET_CAMERA_POV = { lat: 39.6, lng: -98.5, altitude: 1.5 }; // Focused on continental US
const POV_ANIMATION_DURATION_MS = 2500;
const INITIAL_ANIMATION_DELAY_MS = 500;

const SLOW_ROTATION_SPEED = 0.3; // Degrees per second (adjust as needed)

// Helper types for data parsing (based on example)
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
    srcAirport?: Airport; // Populated after processing
    dstAirport?: Airport; // Populated after processing
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
    // Partial initially as src/dstAirport are added later
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

export default function DesktopRightContent() {
    const globeRef = useRef<GlobeMethods | undefined>(undefined);
    const rotationTimerIdRef = useRef<NodeJS.Timeout | null>(null);

    const [airports, setAirports] = useState<Airport[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
    const [isGlobeReady, setIsGlobeReady] = useState(false);

    useEffect(() => {
        // Load data
        Promise.all([
            fetch(AIRPORTS_DATA_URL)
                .then((res) => res.text())
                .then((d) => csvParseRows(d, airportParse as (row: string[]) => Airport)),
            fetch(ROUTES_DATA_URL)
                .then((res) => res.text())
                .then((d) => csvParseRows(d, routeParse as (row: string[]) => Route))
        ])
            .then(([loadedAirports, loadedRoutes]) => {
                const byIata = indexBy(loadedAirports, 'iata', false) as { [key: string]: Airport };

                const filteredRoutes = loadedRoutes
                    .filter(
                        (d) =>
                            Object.prototype.hasOwnProperty.call(byIata, d.srcIata!) &&
                            Object.prototype.hasOwnProperty.call(byIata, d.dstIata!)
                    ) // Exclude unknown airports
                    .filter((d) => d.stops === '0') // Non-stop flights only
                    .map((d) =>
                        Object.assign(d, {
                            srcAirport: byIata[d.srcIata!],
                            dstAirport: byIata[d.dstIata!]
                        })
                    )
                    .filter(
                        (d) => d.srcAirport?.country === TARGET_COUNTRY && d.dstAirport?.country !== TARGET_COUNTRY
                    ); // International routes from country

                setAirports(loadedAirports);
                setRoutes(filteredRoutes as Route[]);

                return null; // Satisfy linter rule: Each then() should return a value or throw
            })
            .catch((error) => console.error('Error loading flight data:', error));
    }, []);

    useEffect(() => {
        let animationTimerId: NodeJS.Timeout | undefined;
        // rotationTimerIdRef.current is managed by the main useEffect cleanup

        if (globeRef.current && isGlobeReady) {
            // Set initial camera without animation
            globeRef.current.pointOfView(START_CAMERA_POV, 0);

            animationTimerId = setTimeout(() => {
                if (globeRef.current) {
                    globeRef.current.pointOfView(TARGET_CAMERA_POV, POV_ANIMATION_DURATION_MS);
                    if (rotationTimerIdRef.current) clearTimeout(rotationTimerIdRef.current); // Clear previous before setting new
                    rotationTimerIdRef.current = setTimeout(() => {
                        setIsInitialAnimationComplete(true);
                    }, POV_ANIMATION_DURATION_MS);
                }
            }, INITIAL_ANIMATION_DELAY_MS);
        }

        return () => {
            if (animationTimerId) clearTimeout(animationTimerId);
            if (rotationTimerIdRef.current) clearTimeout(rotationTimerIdRef.current);
        };
    }, [isGlobeReady]); // Depend on isGlobeReady

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

    // New useEffect to configure controls once globe is ready
    useEffect(() => {
        if (globeRef.current && isGlobeReady) {
            const controls = globeRef.current.controls();
            controls.enableZoom = true;
            controls.enableRotate = true;
            // react-globe.gl uses minDistance/maxDistance for zoom limits with OrbitControls
            controls.minDistance = 100; // Corresponds to minZoomRadius
            controls.maxDistance = 500; // Corresponds to maxZoomRadius
        }
    }, [isGlobeReady]);

    const handleGlobeReady = useCallback(() => {
        setIsGlobeReady(true);
        console.log('Globe is ready.');
    }, []);

    return (
        <div
            className='fixed inset-0 z-0 backdrop-blur-md'
            // LIGHT MODE
            style={{ backgroundColor: '#00356B' }} // Set the desired background color
            // DARK MODE
            // style={{ backgroundColor: 'black' }} // Set the desired background color
        >
            <Globe
                ref={globeRef}
                // LIGHT MODE
                globeImageUrl='/earth-day.jpg'
                // DARK MODE
                // globeImageUrl='/earth-night.jpg'
                backgroundColor='rgba(0,0,0,0)' // Transparent background for the globe canvas
                onGlobeReady={handleGlobeReady}
                atmosphereColor='lightblue' // Color of the atmosphere/halo
                atmosphereAltitude={0.25} // Thickness of the atmosphere/halo
                arcsData={routes}
                arcLabel={(d: any) => `${d.airline} </br>${d.srcIata} &rarr; ${d.dstIata}`}
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
                // Airport points (optional, can be performance intensive with many points)
                // pointsData={airports.filter(ap => ap.country === TARGET_COUNTRY)} // Example: only US airports
                // pointColor={() => 'gold'}
                // pointAltitude={0.01} // Slight altitude to avoid z-fighting if globe is not perfectly smooth
                // pointRadius={0.05}
                // pointsMerge={true}

                // controlsOptions prop is removed, settings are applied via useEffect
            />
        </div>
    );
}
