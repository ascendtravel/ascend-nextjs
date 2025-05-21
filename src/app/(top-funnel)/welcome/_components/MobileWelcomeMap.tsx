'use client';

import { useEffect, useRef } from 'react';

import mapboxgl, { LngLatLike } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initial map coordinates showing globe from below
const INITIAL_CENTER: LngLatLike = [-80, -45]; // Start from further below for more dramatic rotation
const INITIAL_ZOOM = 1; // Start more zoomed out

// Final destination coordinates centered on United States
const US_CENTER: LngLatLike = [-98.5795, 39.8283]; // Center of US
const FINAL_ZOOM = 3; // Zoom level to see full US

// Animation duration in milliseconds
const ANIMATION_DURATION = 6000;

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export function MobileWelcomeMap() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const marker = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        // Initialize mapbox
        mapboxgl.accessToken = mapboxToken;

        // Create map instance
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: INITIAL_CENTER,
            zoom: INITIAL_ZOOM,
            attributionControl: false,
            pitch: 20, // Increased tilt for better visual effect
            bearing: 0
        });

        // After map style is loaded, start animation
        map.current.on('style.load', () => {
            if (!map.current) return;

            // Create a custom welcome card marker element
            const el = document.createElement('div');
            el.className = 'welcome-marker';

            // Create the marker at the US center position
            marker.current = new mapboxgl.Marker({
                element: el,
                anchor: 'bottom'
            })
                .setLngLat(US_CENTER)
                .addTo(map.current);

            // Make sure marker is visible initially
            marker.current.getElement().style.visibility = 'visible';
            marker.current.getElement().style.opacity = '1';

            // Wait a moment to start the animation
            setTimeout(() => {
                // Animate the map to center on US
                map.current!.easeTo({
                    center: US_CENTER,
                    zoom: FINAL_ZOOM,
                    pitch: 0, // End with flat view
                    duration: ANIMATION_DURATION,
                    easing: (t) => {
                        // Smooth easing function
                        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                    }
                });
            }, 1000);
        });

        // Cleanup
        return () => {
            marker.current?.remove();
            map.current?.remove();
        };
    }, []);

    return (
        <div className='relative h-full w-full rounded-t-2xl'>
            <div ref={mapContainer} className='h-full w-full' />

            {/* Hide mapbox controls */}
            <style jsx global>{`
                .mapboxgl-ctrl-logo,
                .mapboxgl-ctrl-bottom-right,
                .mapboxgl-ctrl-bottom-left {
                    display: none !important;
                }

                /* Make default markers visible */
                .mapboxgl-marker {
                    visibility: visible !important;
                }
            `}</style>
        </div>
    );
}
