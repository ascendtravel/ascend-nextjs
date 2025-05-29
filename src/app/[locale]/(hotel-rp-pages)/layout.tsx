import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { Booking } from '@/app/api/rp-trips/route';
import IconNewWhite from '@/components/Icon/IconNewWhite';
import { TripsRpProvider } from '@/contexts/TripsRpContext';

// Move data fetching to a separate server function
async function getInitialTrips(
    token: string | null,
    impersonateUserId: string | null | undefined
): Promise<{ trips: Booking[] | null; redirect?: string }> {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    try {
        const url = new URL(`${protocol}://${host}/api/rp-trips`);
        if (impersonateUserId) {
            url.searchParams.set('impersonationId', impersonateUserId);
        }

        console.log('Layout fetching data with token:', token ? 'Present' : 'Missing');

        // Properly format the Authorization header
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url.toString(), {
            cache: 'no-store',
            headers
        });

        const data = await response.json();

        if (response.status === 401) {
            console.log('Layout received 401 from API, redirecting to:', data.redirect);

            return { trips: null, redirect: data.redirect };
        }

        if (!response.ok) {
            console.error('Error fetching initial trips:', response.status);

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
    let token = cookieStore.get('authToken')?.value || null;

    // Decode the token if it exists (since it's URI encoded in the cookie)
    if (token) {
        try {
            token = decodeURIComponent(token);
        } catch (e) {
            console.error('Error decoding token from cookie:', e);
            // Keep the token as is if decoding fails
        }
    }

    // Get impersonation ID and decode it if needed
    let impersonateUserId = cookieStore.get('impersonateUserId')?.value;
    if (impersonateUserId) {
        try {
            impersonateUserId = decodeURIComponent(impersonateUserId);
        } catch (e) {
            console.error('Error decoding impersonateUserId from cookie:', e);
            // Keep the value as is if decoding fails
        }
    }

    console.log('Layout detected auth state:', {
        hasToken: !!token,
        hasImpersonation: !!impersonateUserId
    });

    const { trips, redirect: redirectUrl } = await getInitialTrips(token, impersonateUserId);

    if (redirectUrl) {
        console.log('Layout redirecting to:', redirectUrl);
        redirect(redirectUrl);
    }

    return (
        <TripsRpProvider initialTrips={trips || []}>
            <div className='h-full bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC]'>
                {children}
            </div>
        </TripsRpProvider>
    );
}
