import { NextRequest, NextResponse } from 'next/server';

import { UserRelatedFetch } from '@/lib/UserRelatedFetch';

interface MoneyAmount {
    amount: number | null;
    currency: string | null;
}

interface CommonBookingPayload {
    booking_id: string;
    created_at: string | null;
    id: string | null;
    image_url?: string | null;
    last_repricing_session_id: string | null;
    repricing_session_id: string | null;
    past_repricing_count: number;
    past_savings_cents: MoneyAmount;
    potential_savings_cents: MoneyAmount;
    total_price_cents: MoneyAmount;
    confirmation_number: string | null;
}

interface RoomPersonCombination {
    adult_count: number;
    child_list: number[];
}

export interface HotelPayload extends CommonBookingPayload {
    hotel_name: string;
    city: string;
    country_code: string;
    postal_code: string;
    address: string;
    lat: number;
    long: number;
    check_in_date: string;
    check_out_date: string;
    check_in_time: string | null;
    check_out_time: string | null;
    room_type: string;
    guest_name: string;
    nights: number;
    price_per_night_cents: MoneyAmount;
    local_tax_and_fees_cents: MoneyAmount;
    room_person_combinations: RoomPersonCombination[];
}

export interface FlightPayload extends CommonBookingPayload {
    airline: string;
    airline_iata_id: string;
    departure_airport_iata_code: string;
    departure_airport_name: string;
    departure_airport_terminal: string | null;
    departure_airport_timezone: string;
    departure_city: string;
    arrival_airport_iata_code: string;
    arrival_airport_name: string;
    arrival_airport_terminal: string | null;
    arrival_airport_timezone: string;
    arrival_city: string;
    departure_date: string;
    departure_time: string | null;
    arrival_date: string | null;
    arrival_time: string | null;
    outbound_flight_numbers: string[];
    return_flight_numbers: string[];
    passenger_name: string;
    seat_class: string;
    seat_number: string | null;
    baggage: string | null;
    current_price_cents: MoneyAmount;
    new_market_price_cents: MoneyAmount;
    haversine_distance_miles: number;
}

export type BookingType = 'hotel' | 'flight';

export interface Booking {
    id: number;
    customer_id: string;
    created_at: string;
    updated_at: string;
    import_session_id: string;
    is_fake: boolean;
    is_forgotten: boolean;
    metadata?: unknown;
    type: BookingType;
    payload: HotelPayload | FlightPayload;
}

function inferBookingType(payload: HotelPayload | FlightPayload): BookingType {
    if ('hotel_name' in payload) {
        return 'hotel';
    }

    return 'flight';
}

export async function GET(request: NextRequest) {
    try {
        // Get token from Authorization header OR from cookies for server-side rendering support
        let token = request.headers.get('Authorization')?.split(' ')[1];

        // If no token in authorization header, try to get from cookies
        if (!token) {
            const cookieToken = request.cookies.get('authToken')?.value;
            if (cookieToken) {
                // For cookies, we need to handle URL encoding
                try {
                    token = decodeURIComponent(cookieToken);
                } catch (e) {
                    token = cookieToken;
                }
                console.log('API route using token from cookies');
            }
        }

        // Similarly handle impersonation ID from both sources
        let impersonationId = request.nextUrl.searchParams.get('impersonationId');

        // If not in query parameters, try cookies
        if (!impersonationId) {
            const cookieImpersonationId = request.cookies.get('impersonateUserId')?.value;
            if (cookieImpersonationId) {
                try {
                    impersonationId = decodeURIComponent(cookieImpersonationId);
                } catch (e) {
                    impersonationId = cookieImpersonationId;
                }
                console.log('API route using impersonation ID from cookies');
            }
        }

        // If still no token, return unauthorized
        if (!token) {
            console.log('No auth token found, returning 401');

            return NextResponse.json(
                {
                    error: 'Unauthorized',
                    redirect: '/auth/phone-login?redirect=/user-rps'
                },
                { status: 401 }
            );
        }

        console.log('API route fetching with impersonationId:', impersonationId);

        const response = await UserRelatedFetch(
            '/me/bookings',
            {
                method: 'GET'
            },
            {
                token,
                impersonationId: impersonationId || undefined
            }
        );

        if (response.status === 401) {
            console.log('Upstream API returned 401, redirecting to login');

            return NextResponse.json(
                {
                    error: 'Unauthorized',
                    redirect: '/auth/phone-login?redirect=/user-rps'
                },
                { status: 401 }
            );
        }

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch trips' }, { status: response.status });
        }

        const rawData = await response.json();

        // Add type field to each booking
        const data = rawData.map((booking: Omit<Booking, 'type'>) => ({
            ...booking,
            type: inferBookingType(booking.payload)
        }));

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error in rp-trips API route:', error);

        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
