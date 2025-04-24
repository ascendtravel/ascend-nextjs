'use client';

import { useEffect, useRef, useState } from 'react';

import * as turf from '@turf/turf';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Types
export interface Airport {
    latitude: number;
    longitude: number;
    iataCode: string;
}

export interface FlightMapSegment {
    from: Airport;
    to: Airport;
}

interface FlightMapProps {
    segments: FlightMapSegment[];
    zoom?: number;
    showResetBtn?: boolean;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function FlightMap({ segments, zoom = 2, showResetBtn = true }: FlightMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);
    const animationFrameId = useRef<number | null>(null);

    // Set Mapbox token
    mapboxgl.accessToken = mapboxToken;

    // Helper functions
    const calculateArcForSegment = (segment: FlightMapSegment): number[][] => {
        const steps = 900;
        const arc = [];
        const from = [segment.from.longitude, segment.from.latitude];
        const to = [segment.to.longitude, segment.to.latitude];

        for (let i = 0; i <= steps; i++) {
            const interpolated = [from[0] + (to[0] - from[0]) * (i / steps), from[1] + (to[1] - from[1]) * (i / steps)];
            arc.push(interpolated);
        }

        return arc;
    };

    const removeExistingMarkers = () => {
        markers.current.forEach((marker) => marker.remove());
        markers.current = [];
    };

    const removeExistingLayersAndSources = () => {
        if (!map.current || !map.current.isStyleLoaded()) return;

        try {
            const existingLayers = map.current.getStyle().layers?.map((layer) => layer.id);
            existingLayers?.forEach((id) => {
                if (id.startsWith('segment-') || id === 'planeLayer' || id.endsWith('-layer')) {
                    if (map.current!.getLayer(id)) {
                        map.current!.removeLayer(id);
                    }
                }
            });

            const existingSources = Object.keys(map.current.getStyle().sources);
            existingSources.forEach((id) => {
                if (id.startsWith('segment-') || id === 'plane') {
                    if (map.current!.getSource(id)) {
                        map.current!.removeSource(id);
                    }
                }
            });
        } catch (error) {
            console.warn('Map style not fully loaded yet');
        }
    };

    const cancelPlaneAnimation = () => {
        if (animationFrameId.current !== null) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
    };

    // Map functions
    const resetMap = () => {
        if (!map.current) return;
        if (segments.length === 0) {
            // US center 39.8283° N, 98.5795° W
            map.current.setCenter([-98.5795, 39.8283]);
            map.current.setZoom(1);

            return;
        }
        const bounds = new mapboxgl.LngLatBounds();
        segments.forEach((segment) => {
            bounds.extend([segment.from.longitude, segment.from.latitude]);
            bounds.extend([segment.to.longitude, segment.to.latitude]);
        });
        map.current.fitBounds(bounds, { padding: 10, zoom: 3 });
    };

    const drawSegments = (segments: FlightMapSegment[]) => {
        if (!map.current) return;

        segments.forEach((segment, index) => {
            const arc = calculateArcForSegment(segment);
            const routeGeoJSON = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: arc
                }
            };

            const sourceId = `segment-${index}`;
            map.current!.addSource(sourceId, {
                type: 'geojson',
                data: routeGeoJSON as any
            });

            map.current!.addLayer({
                id: `${sourceId}-layer`,
                type: 'line',
                source: sourceId,
                paint: {
                    'line-width': 2,
                    'line-color': '#1DC167'
                }
            });
        });
    };

    const addMarkers = (segments: FlightMapSegment[]) => {
        if (!map.current) return;
        removeExistingMarkers();

        const uniquePoints = new Map();
        segments.forEach((segment) => {
            const fromKey = `${segment.from.latitude},${segment.from.longitude}`;
            const toKey = `${segment.to.latitude},${segment.to.longitude}`;

            if (!uniquePoints.has(fromKey)) {
                uniquePoints.set(fromKey, segment.from);
            }
            if (!uniquePoints.has(toKey)) {
                uniquePoints.set(toKey, segment.to);
            }
        });

        let index = 0;
        uniquePoints.forEach((point) => {
            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';

            const labelElement = document.createElement('div');
            labelElement.className = 'marker-pill';
            labelElement.innerText = (point as Airport).iataCode;

            markerElement.appendChild(labelElement);

            const verticalOffset = -(20 * index);

            const marker = new mapboxgl.Marker({
                element: markerElement,
                offset: [0, verticalOffset]
            })
                .setLngLat([point.longitude, point.latitude])
                .addTo(map.current!);

            markers.current.push(marker);
            index++;
        });
    };

    const animatePlane = (segments: FlightMapSegment[]) => {
        if (!map.current) return;
        if (segments.length === 0) return;

        let currentSegmentIndex = 0;
        let counter = 0;
        let currentArc = calculateArcForSegment(segments[currentSegmentIndex]);

        map.current.addSource('plane', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: currentArc[0]
                },
                properties: {}
            }
        });

        map.current.addLayer({
            id: 'planeLayer',
            source: 'plane',
            type: 'symbol',
            layout: {
                'icon-image': 'airport',
                'icon-size': 1.5,
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map'
            }
        });

        function animate() {
            if (!map.current) return;
            if (segments.length === 0) return;

            if (counter < currentArc.length - 1) {
                const start = turf.point(currentArc[counter]);
                const end = turf.point(currentArc[counter + 1]);
                const bearing = turf.bearing(start, end);

                const source = map.current.getSource('plane') as mapboxgl.GeoJSONSource;
                source.setData({
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: currentArc[counter]
                    },
                    properties: {
                        bearing: bearing
                    }
                });

                counter++;
                animationFrameId.current = requestAnimationFrame(animate);
            } else if (currentSegmentIndex < segments.length - 1) {
                currentSegmentIndex++;
                counter = 0;
                currentArc = calculateArcForSegment(segments[currentSegmentIndex]);
                animationFrameId.current = requestAnimationFrame(animate);
            } else {
                currentSegmentIndex = 0;
                counter = 0;
                currentArc = calculateArcForSegment(segments[currentSegmentIndex]);
                animationFrameId.current = requestAnimationFrame(animate);
            }
        }

        animate();
    };

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            // if no cneter go to center of US 39.8283° N, 98.5795° W
            center:
                segments.length > 0
                    ? [
                          (segments[0].from.longitude + segments[0].to.longitude) / 2,
                          (segments[0].from.latitude + segments[0].to.latitude) / 2
                      ]
                    : [-98.5795, 39.8283],
            zoom: segments.length > 0 ? zoom : 1
        });

        map.current.on('style.load', () => {
            drawSegments(segments);
            addMarkers(segments);
            resetMap();
            animatePlane(segments);
        });

        return () => {
            cancelPlaneAnimation();
            if (map.current) {
                map.current.remove();
            }
        };
    }, []);

    // Watch for segment changes
    useEffect(() => {
        if (!map.current) return;

        if (map.current.isStyleLoaded()) {
            removeExistingLayersAndSources();
            removeExistingMarkers();
            cancelPlaneAnimation();
            drawSegments(segments);
            addMarkers(segments);
            resetMap();
            animatePlane(segments);
        } else {
            map.current.once('style.load', () => {
                removeExistingLayersAndSources();
                removeExistingMarkers();
                cancelPlaneAnimation();
                drawSegments(segments);
                addMarkers(segments);
                resetMap();
                animatePlane(segments);
            });
        }
    }, [segments]);

    return (
        <div ref={mapContainer} className='relative h-full w-full'>
            {showResetBtn && (
                <button
                    className='absolute right-4 bottom-4 z-10 rounded bg-neutral-50 px-2 py-1 text-neutral-700 shadow-lg hover:bg-green-100 focus:outline-none'
                    onClick={resetMap}>
                    Reset
                </button>
            )}
            <style jsx global>{`
                .mapboxgl-ctrl-logo,
                .mapboxgl-ctrl-bottom-right {
                    display: none !important;
                }
            `}</style>
            <style jsx>{`
                .custom-marker {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    background-color: black;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .custom-marker::before {
                    content: '';
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background-color: white;
                    border-radius: 50%;
                }

                .marker-pill {
                    position: absolute;
                    top: -25px;
                    background-color: black;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    padding: 2px 8px;
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
