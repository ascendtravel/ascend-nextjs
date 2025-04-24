import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { Trip } from '@/app/api/rp-trips/route';
import IconNewWhite from '@/components/Icon/IconNewWhite';
import { TripsRpProvider } from '@/contexts/TripsRpContext';

// Move data fetching to a separate server function
async function getInitialTrips(token: string | null): Promise<{ trips: Trip[] | null; redirect?: string }> {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    try {
        const response = await fetch(`${protocol}://${host}/api/rp-trips`, {
            cache: 'no-store',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            return { trips: null, redirect: data.redirect };
        }

        if (!response.ok) {
            console.error('Error fetching initial trips');

            return { trips: [] };
        }

        return { trips: data };
    } catch (error) {
        console.error('Error fetching initial trips:', error);

        return { trips: [] };
    }
}

// Make the layout component server-side
export default async function HotelRpPagesLayout({ children }: { children: React.ReactNode }) {
    // Get token from cookies on server side
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value || null;
    const { trips, redirect: redirectUrl } = await getInitialTrips(token);

    if (redirectUrl) {
        redirect(redirectUrl);
    }

    return (
        <TripsRpProvider initialTrips={trips || []}>
            <div className='flex min-h-screen flex-col bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC]'>
                {children}
            </div>
        </TripsRpProvider>
    );
}
