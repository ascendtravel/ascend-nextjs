'use client';

import { useEffect, useRef, useState } from 'react';

import * as turf from '@turf/turf';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Types from FlightMap
export interface Airport {
    latitude: number;
    longitude: number;
    iataCode: string;
}

export interface FlightMapSegment {
    from: Airport;
    to: Airport;
}

export interface FlightSegmentBasic {
    from: string; // IATA code
    to: string; // IATA code
}

// Types from HotelMap
export interface Hotel {
    id: string;
    lat: number;
    lon: number;
    price: string;
}

interface RpMapProps {
    hotels?: Hotel[];
    flightSegments?: FlightSegmentBasic[];
    onHotelClick?: (hotel: Hotel) => void;
    highlightedHotelIds?: string[];
    showResetBtn?: boolean;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function RpMap({
    hotels = [],
    flightSegments = [],
    onHotelClick,
    highlightedHotelIds = [],
    showResetBtn = true
}: RpMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);
    const animationFrameId = useRef<number | null>(null);
    const [airportsMap, setAirportsMap] = useState<Map<string, Airport>>(new Map());
    const [processedSegments, setProcessedSegments] = useState<FlightMapSegment[]>([]);

    mapboxgl.accessToken = mapboxToken;

    // Flight-related helper functions
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

    // Cleanup functions
    const removeExistingMarkers = () => {
        markers.current.forEach((marker) => marker.remove());
        markers.current = [];
    };

    const removeExistingLayersAndSources = () => {
        if (!map.current?.isStyleLoaded()) return;

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

    // Map control functions
    const resetMap = () => {
        if (!map.current) return;

        const bounds = new mapboxgl.LngLatBounds();
        let hasPoints = false;

        // Add flight segments to bounds
        processedSegments.forEach((segment) => {
            bounds.extend([segment.from.longitude, segment.from.latitude]);
            bounds.extend([segment.to.longitude, segment.to.latitude]);
            hasPoints = true;
        });

        // Add hotels to bounds
        hotels.forEach((hotel) => {
            bounds.extend([hotel.lon, hotel.lat]);
            hasPoints = true;
        });

        if (hasPoints && flightSegments.length > 0) {
            map.current.fitBounds(bounds, { padding: 50 });
        } else if (hasPoints && hotels.length > 0) {
            map.current.fitBounds(bounds, { padding: 100, zoom: 16 });
        } else {
            // Default view (centered on US)
            map.current.setCenter([-98.5795, 39.8283]);
            map.current.setZoom(1);
        }
    };

    // Drawing functions
    const drawFlightSegments = (segments: FlightMapSegment[]) => {
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

    const addAirportMarkers = (segments: FlightMapSegment[]) => {
        if (!map.current) return;

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

        uniquePoints.forEach((point) => {
            const el = document.createElement('div');
            el.className = 'airport-marker';

            const label = document.createElement('div');
            label.className = 'airport-label';
            label.innerText = point.iataCode;

            el.appendChild(label);

            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([point.longitude, point.latitude])
                .addTo(map.current!);

            markers.current.push(marker);
        });
    };

    const addHotelMarkers = (hotels: Hotel[]) => {
        if (!map.current) return;

        hotels.forEach((hotel) => {
            const el = document.createElement('div');
            el.className = 'airport-marker';

            const label = document.createElement('div');
            label.className = 'airport-label';
            label.innerText = hotel.price;

            // priceLabel.className = `hotel-price ${highlightedHotelIds.includes(hotel.id) ? 'highlighted' : ''}`;
            // priceLabel.innerText = hotel.price;

            el.appendChild(label);

            const marker = new mapboxgl.Marker({ element: el }).setLngLat([hotel.lon, hotel.lat]).addTo(map.current!);

            if (onHotelClick) {
                el.addEventListener('click', () => onHotelClick(hotel));
            }

            markers.current.push(marker);
        });
    };

    const animatePlane = (segments: FlightMapSegment[]) => {
        if (!map.current || segments.length === 0) return;

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
            if (!map.current || segments.length === 0) return;

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

    // Fetch airport data
    useEffect(() => {
        async function fetchAirportsInfo(iataCodes: string[]): Promise<Map<string, Airport>> {
            const response = await fetch('/api/airport', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ airport_iata_codes: iataCodes })
            });

            if (!response.ok) return new Map();

            const airports = await response.json();

            return new Map(
                airports.map((airport: any) => [
                    airport.iataCode,
                    {
                        iataCode: airport.iataCode,
                        latitude: airport.latitude,
                        longitude: airport.longitude
                    }
                ])
            );
        }

        async function processFlightSegments() {
            const uniqueIataCodes = Array.from(new Set(flightSegments.flatMap((seg) => [seg.from, seg.to])));

            // Only fetch if we have new airports to fetch
            const missingCodes = uniqueIataCodes.filter((code) => !airportsMap.has(code));
            if (missingCodes.length === 0) {
                // Process segments with existing airport data
                const newProcessedSegments = flightSegments
                    .filter((seg) => airportsMap.has(seg.from) && airportsMap.has(seg.to))
                    .map((seg) => ({
                        from: airportsMap.get(seg.from)!,
                        to: airportsMap.get(seg.to)!
                    }));
                setProcessedSegments(newProcessedSegments);

                return;
            }

            try {
                const newAirportsData = await fetchAirportsInfo(missingCodes);
                const updatedAirportsMap = new Map(airportsMap);

                // Merge new airports data with existing
                newAirportsData.forEach((airport, code) => {
                    updatedAirportsMap.set(code, airport);
                });

                setAirportsMap(updatedAirportsMap);

                // Process all segments with updated airport data
                const newProcessedSegments = flightSegments
                    .filter((seg) => updatedAirportsMap.has(seg.from) && updatedAirportsMap.has(seg.to))
                    .map((seg) => ({
                        from: updatedAirportsMap.get(seg.from)!,
                        to: updatedAirportsMap.get(seg.to)!
                    }));

                setProcessedSegments(newProcessedSegments);
            } catch (error) {
                console.error('Failed to fetch airports:', error);
            }
        }

        if (flightSegments.length > 0) {
            processFlightSegments();
        } else {
            setProcessedSegments([]);
        }
    }, [flightSegments, airportsMap]);

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-98.5795, 39.8283],
            zoom: 1
        });

        map.current.on('style.load', () => {
            removeExistingLayersAndSources();
            removeExistingMarkers();
            drawFlightSegments(processedSegments);
            addAirportMarkers(processedSegments);
            addHotelMarkers(hotels);
            resetMap();
            if (processedSegments.length > 0) {
                animatePlane(processedSegments);
            }
        });

        return () => {
            cancelPlaneAnimation();
            map.current?.remove();
        };
    }, [flightSegments, processedSegments, hotels]);

    // Watch for changes in data
    useEffect(() => {
        if (!map.current?.isStyleLoaded()) return;

        removeExistingLayersAndSources();
        removeExistingMarkers();
        cancelPlaneAnimation();

        drawFlightSegments(processedSegments);
        addAirportMarkers(processedSegments);
        addHotelMarkers(hotels);
        resetMap();

        if (processedSegments.length > 0) {
            animatePlane(processedSegments);
        }
    }, [processedSegments, hotels, highlightedHotelIds]);

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

                .airport-marker,
                .hotel-marker {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    background-color: black;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .hotel-marker::before,
                .airport-marker::before {
                    content: '';
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background-color: white;
                    border-radius: 50%;
                }

                .airport-label {
                    position: absolute;
                    top: -25px;
                    background-color: black;
                    color: white;
                    font-size: 12px;
                    font-weight: bold;
                    padding: 2px 8px;
                    border-radius: 10px;
                    text-wrap: nowrap;
                }

                .hotel-price {
                    padding: 2px 8px;
                    background-color: white;
                    border: 1px solid #666;
                    border-radius: 12px;
                    font-size: 12px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .hotel-price.highlighted {
                    background-color: #1dc167;
                    color: white;
                    border-color: #1dc167;
                }
            `}</style>
        </div>
    );
}
