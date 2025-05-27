'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { Booking, FlightPayload, HotelPayload } from '@/app/api/rp-trips/route';

import { useUser } from './UserContext';
import { isFuture, parseISO } from 'date-fns';

export type TripYear = number | 'Upcoming' | 'Past Years';

// Add helper for checking upcoming trips
const isTripUpcoming = (trip: Booking) => {
    const date =
        trip.type === 'flight'
            ? (trip.payload as FlightPayload).departure_date
            : (trip.payload as HotelPayload).check_in_date;

    return isFuture(parseISO(date));
};

// Add helper function for sorting
const getSavingsAmount = (trip: Booking) => trip.payload.potential_savings_cents?.amount ?? 0;
const getDate = (trip: Booking) => {
    const date =
        trip.type === 'flight'
            ? (trip.payload as FlightPayload).departure_date
            : (trip.payload as HotelPayload).check_in_date;

    return new Date(date);
};

const sortTrips = (trips: Booking[]) => {
    return [...trips].sort((a, b) => {
        // First sort by savings
        const savingsA = getSavingsAmount(a);
        const savingsB = getSavingsAmount(b);
        if (savingsA !== savingsB) {
            return savingsB - savingsA; // Higher savings first
        }

        // Then by date
        const dateA = getDate(a);
        const dateB = getDate(b);

        return dateA.getTime() - dateB.getTime(); // Earlier dates first
    });
};

interface TripsRpContextType {
    trips: Booking[];
    filteredTrips: Booking[];
    selectedYear: TripYear;
    isLoading: boolean;
    error: string | null;
    getTrip: (id: string) => Booking | undefined;
    refreshTrips: () => Promise<void>;
    setSelectedYear: (year: TripYear) => void;
    allYears: TripYear[];
}

const TripsRpContext = createContext<TripsRpContextType | undefined>(undefined);

export function TripsRpProvider({ children, initialTrips }: { children: React.ReactNode; initialTrips?: Booking[] }) {
    const [trips, setTrips] = useState<Booking[]>(initialTrips || []);
    const [filteredTrips, setFilteredTrips] = useState<Booking[]>(initialTrips || []);
    const [selectedYear, setSelectedYear] = useState<TripYear>('Upcoming');
    const [isLoading, setIsLoading] = useState(!initialTrips);
    const [error, setError] = useState<string | null>(null);
    const { getToken, getImpersonateUserId } = useUser();
    const [allYears, setAllYears] = useState<TripYear[]>([]);

    const years = useMemo(() => {
        return [...new Set(trips.map((trip) => getDate(trip).getFullYear()))];
    }, [trips]);

    // Filter trips based on selected year
    useEffect(() => {
        let filtered = [...trips];

        if (selectedYear === 'Upcoming') {
            filtered = filtered.filter(isTripUpcoming);
        } else if (selectedYear === 'Past Years') {
            const maxYear = Math.max(...years);
            filtered = filtered.filter((trip) => {
                const tripDate = getDate(trip);
                
return tripDate.getFullYear() < maxYear;
            });
        } else {
            filtered = filtered.filter((trip) => {
                const tripDate = getDate(trip);
                
return tripDate.getFullYear() === selectedYear;
            });
        }

        // Sort filtered trips
        const sortedFiltered = sortTrips(filtered);
        setFilteredTrips(sortedFiltered);
    }, [selectedYear, trips, years]);

    // When trips are fetched, sort them immediately
    const fetchTrips = async () => {
        try {
            const token = await getToken();
            const impersonationId = getImpersonateUserId();

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

            // Sort trips before setting state
            const sortedTrips = sortTrips(data);
            setTrips(sortedTrips);
            fillYears();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
            fillYears();
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

    const fillYears = () => {
        // Get unique years from trips and find the most recent year
        const maxYear = Math.max(...years);

        if (years.length > 1) {
            setAllYears(['Upcoming', maxYear, 'Past Years']);
        } else if (years.length === 1) {
            setAllYears(['Upcoming', years[0]]);
        } else {
            setAllYears(['Upcoming']);
        }
    };

    if (initialTrips && allYears.length === 0) {
        fillYears();
    }

    const value = {
        trips,
        filteredTrips,
        selectedYear,
        isLoading,
        error,
        getTrip,
        refreshTrips,
        setSelectedYear,
        allYears
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
