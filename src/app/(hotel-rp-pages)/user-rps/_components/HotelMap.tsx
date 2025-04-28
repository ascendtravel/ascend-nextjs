'use client';

import { useEffect, useRef } from 'react';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Types
export interface RoomInfo {
    total_price_usd: number;
}

export interface Pick {
    id: string;
    lat: number;
    lon: number;
    pickType: PickTypeV3;
    roomInfo: RoomInfo;
}

export enum PickTypeV3 {
    InsaneODeal = 'INSANE_O_DEAL',
    NormalDeal = 'NORMAL_DEAL'
}

interface HotelMapProps {
    picks: Pick[];
    highlightedPicks: Pick[];
    showedInsanoDeal: boolean;
    onPickClick?: (pick: Pick) => void;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function HotelMap({ picks, highlightedPicks, showedInsanoDeal, onPickClick }: HotelMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);

    mapboxgl.accessToken = mapboxToken;

    const getInsanoHtml = (pick: Pick) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer';
        el.innerHTML = `
          <div class="animate-wiggle2 flex flex-col items-center ${
              highlightedPicks.map((p) => p.id).includes(pick.id) ? '' : ''
          }">
            <div
                class="px-2 py-1 text-xs rounded-full whitespace-nowrap shadow-lg z-30 text-xxs !bg-[#1DC167] !text-neutral-50
                    ${pick.pickType === PickTypeV3.InsaneODeal && !showedInsanoDeal ? 'animate-wiggle2' : 'animate-none'}
                "
            >
              <div>$${pick.roomInfo.total_price_usd}</div>
            </div>
            <div class="w-3 h-3 -mt-2 z-10 !bg-[#1DC167] !text-neutral-50 rotate-45" />
          </div>`;

        return el;
    };

    const getNormalDeal = (pick: Pick) => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer';
        el.innerHTML = `
          <div class="flex flex-col items-center ${highlightedPicks.map((p) => p.id).includes(pick.id) ? '' : ''}">
            <div
                class="px-2 py-1 text-xs rounded-full whitespace-nowrap shadow-lg z-30
                    ${
                        highlightedPicks.map((p) => p.id).includes(pick.id)
                            ? 'bg-neutral-1000 text-white'
                            : 'text-xxs bg-neutral-100/70 border border-neutral-600 text-neutral-1000'
                    }
                "
            >
              <div>$${pick.roomInfo.total_price_usd}</div>
            </div>
            <div class="w-3 h-3 rotate-45 -mt-2 z-10
                ${highlightedPicks.map((p) => p.id).includes(pick.id) ? 'bg-neutral-1000' : 'bg-neutral-400'}
            " />
          </div>`;

        return el;
    };

    const updateMap = () => {
        if (!map.current) return;

        // Remove old markers
        markers.current.forEach((m) => m.remove());
        markers.current = [];

        if (picks.length === 0) return;

        const bounds = new mapboxgl.LngLatBounds();

        picks.forEach((pick) => {
            if (pick.lat && pick.lon) {
                bounds.extend([pick.lon, pick.lat]);

                const el = pick.pickType === PickTypeV3.InsaneODeal ? getInsanoHtml(pick) : getNormalDeal(pick);

                const marker = new mapboxgl.Marker({ element: el }).setLngLat([pick.lon, pick.lat]).addTo(map.current!);

                el.addEventListener('click', () => {
                    onPickClick?.(pick);
                });

                markers.current.push(marker);
            }
        });

        if (!bounds.isEmpty()) {
            map.current.fitBounds(bounds, { padding: 50 });
        }
    };

    const recenterMap = (pick: Pick) => {
        if (!map.current || !pick.lat || !pick.lon) return;
        map.current.flyTo({
            center: [pick.lon, pick.lat],
            animate: true,
            zoom: 15
        });
    };

    // Initialize map
    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [0, 0],
            zoom: 2
        });

        map.current.addControl(new mapboxgl.NavigationControl());

        map.current.on('load', () => {
            updateMap();
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    // Watch for changes in picks and highlightedPicks
    useEffect(() => {
        if (map.current?.isStyleLoaded()) {
            updateMap();
        }
    }, [picks, highlightedPicks]);

    return (
        <div id='full-map-picks' ref={mapContainer} className='relative h-full w-full'>
            <style jsx>{`
                .size-full {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </div>
    );
}
