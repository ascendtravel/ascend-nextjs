'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import type { Booking } from '@/app/api/rp-trips/route';

import { useUser } from './UserContext';

interface TripsRpContextType {
    trips: Booking[];
    isLoading: boolean;
    error: string | null;
    getTrip: (id: string) => Booking | undefined;
    refreshTrips: () => Promise<void>;
}

const TripsRpContext = createContext<TripsRpContextType | undefined>(undefined);

export function TripsRpProvider({ children, initialTrips }: { children: React.ReactNode; initialTrips?: Booking[] }) {
    const [trips, setTrips] = useState<Booking[]>(initialTrips || []);
    const [isLoading, setIsLoading] = useState(!initialTrips);
    const [error, setError] = useState<string | null>(null);
    const { getToken, getImpersonateUserId } = useUser();

    const fetchTrips = async () => {
        try {
            const token = await getToken();
            const impersonationId = getImpersonateUserId();

            // Add impersonation ID to URL if present
            const url = new URL('/api/rp-trips', window.location.origin);
            if (impersonationId) {
                url.searchParams.set('impersonationId', impersonationId);
            }

            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch trips');
            const data = await response.json();
            setTrips(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!initialTrips) {
            fetchTrips().catch((err) => {
                setError(err instanceof Error ? err.message : 'An error occurred');
            });
        }
    }, [initialTrips]);

    const getTrip = (id: string) => {
        console.log('trips', trips);

        return trips.find((trip) => trip.import_session_id === id);
    };

    const refreshTrips = async () => {
        setIsLoading(true);
        await fetchTrips();
    };

    const value = {
        trips,
        isLoading,
        error,
        getTrip,
        refreshTrips
    };

    return <TripsRpContext.Provider value={value}>{children}</TripsRpContext.Provider>;
}

export function useTripsRp() {
    const context = useContext(TripsRpContext);
    if (context === undefined) {
        throw new Error('useTripsRp must be used within a TripsRpProvider');
    }

    return context;
}
