'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import type { Trip } from '@/app/api/rp-trips/route';

interface TripsRpContextType {
    trips: Trip[];
    isLoading: boolean;
    error: string | null;
    getTrip: (id: string) => Trip | undefined;
    refreshTrips: () => Promise<void>;
}

const TripsRpContext = createContext<TripsRpContextType | undefined>(undefined);

export function TripsRpProvider({ children, initialTrips }: { children: React.ReactNode; initialTrips?: Trip[] }) {
    const [trips, setTrips] = useState<Trip[]>(initialTrips || []);
    const [isLoading, setIsLoading] = useState(!initialTrips);
    const [error, setError] = useState<string | null>(null);

    const fetchTrips = async () => {
        try {
            const response = await fetch('/api/rp-trips');
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
        return trips.find((trip) => trip.id === id);
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
