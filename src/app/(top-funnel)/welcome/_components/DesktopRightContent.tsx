'use client';

import { useEffect, useRef } from 'react';

import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Animation Start Parameters (Antarctica)
const ANIM_START_CENTER: LngLatLike = [0, -75];
const ANIM_START_ZOOM = 1;
const ANIM_START_PITCH = 30;
const ANIM_START_BEARING = 0;

// Final Destination Parameters: View focused on Pacific, US to rotate in
const FINAL_DESTINATION_CENTER: LngLatLike = [-150, 25]; // Initial center in the Pacific Ocean
const FINAL_DESTINATION_ZOOM = 3; // Zoom level for globe view (was 2.0, adjusted to see landmasses better)
const FINAL_DESTINATION_PITCH = 15; // Slight pitch for 3D effect
const FINAL_DESTINATION_BEARING = 0;

// Animation duration
const ANIMATION_DURATION = 1000;
const ANIMATION_DELAY = 200;
const GLOBE_SPIN_SPEED = 0.1; // Degrees of longitude per frame

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!mapboxToken) {
    console.warn(
        'Mapbox token NEXT_PUBLIC_MAPBOX_TOKEN is not configured. Map will not load correctly.' +
            ' Please add it to your .env.local file (e.g., NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here)'
    );
}

export default function DesktopRightContent() {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const shouldAutoRotateRef = useRef<boolean>(true);

    useEffect(() => {
        if (!mapboxToken || !mapContainerRef.current) {
            // Log an error or display a fallback if the token or container is missing
            if (!mapboxToken) console.error('Mapbox token is missing. Map cannot be initialized.');

            return;
        }

        mapboxgl.accessToken = mapboxToken;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            projection: { name: 'globe' },
            center: ANIM_START_CENTER,
            zoom: ANIM_START_ZOOM,
            pitch: ANIM_START_PITCH,
            bearing: ANIM_START_BEARING,
            attributionControl: false,
            dragPan: true, // Keep dragPan enabled by default
            dragRotate: true, // Keep dragRotate enabled by default
            touchZoomRotate: true // Keep touchZoomRotate enabled by default
        });
        mapRef.current = map;

        const startGlobeSpin = () => {
            if (!mapRef.current || animationFrameIdRef.current || !shouldAutoRotateRef.current) return;
            console.log('Attempting to start globe spin.');

            function spin() {
                if (!mapRef.current || !shouldAutoRotateRef.current) {
                    if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
                    animationFrameIdRef.current = null;
                    console.log('Globe spin loop stopped.');

                    return;
                }
                const currentCenter = mapRef.current.getCenter();
                let newLng = currentCenter.lng + GLOBE_SPIN_SPEED;
                // Wrap longitude
                if (newLng > 180) newLng -= 360;
                if (newLng < -180) newLng += 360;

                mapRef.current.setCenter([newLng, currentCenter.lat]);
                animationFrameIdRef.current = requestAnimationFrame(spin);
            }
            spin();
        };

        const stopGlobeSpin = (permanently = false) => {
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
                animationFrameIdRef.current = null;
                console.log('Globe spin stopped.');
            }
            if (permanently) {
                shouldAutoRotateRef.current = false;
                console.log('Globe auto-spin permanently disabled.');
            }
        };

        map.on('load', () => {
            console.log('Map loaded');
            if (!mapRef.current) return;

            // Stop globe spin on any user interaction that changes camera
            mapRef.current.on('dragstart', () => {
                stopGlobeSpin();
            });
            mapRef.current.on('zoomstart', () => {
                stopGlobeSpin();
            });
            mapRef.current.on('rotatestart', () => {
                stopGlobeSpin(true);
            }); // Permanent stop on user rotate
            mapRef.current.on('pitchstart', () => {
                stopGlobeSpin();
            });

            // Resume globe spin after drag or zoom ends, if not permanently stopped
            mapRef.current.on('dragend', () => {
                if (shouldAutoRotateRef.current) startGlobeSpin();
            });
            mapRef.current.on('zoomend', () => {
                if (shouldAutoRotateRef.current) startGlobeSpin();
            });
            mapRef.current.on('pitchend', () => {
                if (shouldAutoRotateRef.current) startGlobeSpin();
            });
            // No auto-resume after 'rotateend' as user has set a specific orientation

            setTimeout(() => {
                console.log('Starting easeTo animation to initial view.');
                mapRef.current?.easeTo({
                    center: FINAL_DESTINATION_CENTER,
                    zoom: FINAL_DESTINATION_ZOOM,
                    pitch: FINAL_DESTINATION_PITCH,
                    bearing: FINAL_DESTINATION_BEARING,
                    duration: ANIMATION_DURATION
                });

                mapRef.current?.once('moveend', (e) => {
                    console.log('easeTo initial view moveend event fired');
                    if (mapRef.current) {
                        const finalCenterArray = FINAL_DESTINATION_CENTER as [number, number];
                        const currentCenter = mapRef.current.getCenter();
                        const currentZoom = mapRef.current.getZoom();
                        const atFinalDestination =
                            Math.abs(currentCenter.lng - finalCenterArray[0]) < 0.01 &&
                            Math.abs(currentCenter.lat - finalCenterArray[1]) < 0.01 &&
                            Math.abs(currentZoom - FINAL_DESTINATION_ZOOM) < 0.1;

                        if (atFinalDestination && shouldAutoRotateRef.current) {
                            console.log('Met condition, starting initial globe spin.');
                            startGlobeSpin();
                        }
                    }
                });
            }, ANIMATION_DELAY);
        });

        return () => {
            stopGlobeSpin();
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    return (
        // This div is fixed to the viewport, covers it, and sits at z-index 0 (background)
        <div className='fixed inset-0 z-0'>
            <div ref={mapContainerRef} className='h-full w-full' />
            {/* Minimal CSS to hide the Mapbox logo if it appears despite attributionControl:false */}
            <style jsx global>{`
                .mapboxgl-ctrl-logo {
                    display: none !important;
                }
                /* Ensure map canvas is focusable to receive keyboard events for panning/zooming if needed,
                   though primary interaction here is touch/mouse. */
                .mapboxgl-canvas {
                    outline: none;
                }
            `}</style>
        </div>
    );
}
