import { headers } from 'next/headers';

import type { Trip } from '@/app/api/rp-trips/route';
import IconNewWhite from '@/components/Icon/IconNewWhite';
import { TripsRpProvider } from '@/contexts/TripsRpContext';
import { UserProvider } from '@/contexts/UserContext';

async function getInitialTrips(): Promise<Trip[]> {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    const response = await fetch(`${protocol}://${host}/api/rp-trips`, {
        cache: 'no-store'
    });

    if (!response.ok) {
        console.error('Error fetching initial trips');

        return [];
    }

    return response.json();
}

export default async function HotelRpPagesLayout({ children }: { children: React.ReactNode }) {
    const initialTrips = await getInitialTrips();

    return (
        <UserProvider>
            <TripsRpProvider initialTrips={initialTrips}>
                <div className='flex min-h-screen flex-col bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC]'>
                    {children}
                </div>
            </TripsRpProvider>
        </UserProvider>
    );
}
