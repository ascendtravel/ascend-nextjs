import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import type { Booking } from '@/app/api/rp-trips/route';
import IconNewWhite from '@/components/Icon/IconNewWhite';
import { TripsRpProvider } from '@/contexts/TripsRpContext';

// Move data fetching to a separate server function
async function getInitialTrips(
    token: string | null,
    impersonateUserId: string | null | undefined,
    authRedirectUrl?: string | null
): Promise<{ trips: Booking[] | null; redirect?: string }> {
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    try {
        const url = new URL(`${protocol}://${host}/api/rp-trips`);
        if (impersonateUserId) {
            url.searchParams.set('impersonationId', impersonateUserId);
        }

        if (authRedirectUrl) {
            url.searchParams.set('redirect', authRedirectUrl);
        }

        const response = await fetch(url.toString(), {
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

interface HotelRpPagesLayoutProps {
    children: React.ReactNode;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Make the layout component server-side
export default async function HotelRpPagesLayout(props: HotelRpPagesLayoutProps) {
    // Get token from cookies on server side
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value || null;
    const impersonateUserId = cookieStore.get('impersonateUserId')?.value;

    // Safely handle searchParams - it might be undefined
    let rp_id: string | null = null;
    let user_phone: string | null = null;

    try {
        const searchParams = (await props.searchParams) || {};
        rp_id = (searchParams.rp_id as string) || null;
        user_phone = (searchParams.pn as string) || null;
    } catch (error) {
        console.error('Error accessing searchParams:', error);
    }

    debugger;

    const { trips, redirect: redirectUrl } = await getInitialTrips(
        token,
        impersonateUserId,
        `/auth/phone-login?${user_phone ? `pn=${user_phone}&` : ''}redirect=/user-rps?${rp_id ? `rp_id=${rp_id}` : ''}`
    );

    if (redirectUrl) {
        redirect(redirectUrl);
    }

    return (
        <TripsRpProvider initialTrips={trips || []}>
            <div className='h-full bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC]'>
                {props.children}
            </div>
        </TripsRpProvider>
    );
}
