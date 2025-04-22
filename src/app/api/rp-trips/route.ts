import { NextRequest, NextResponse } from 'next/server';

export interface BaseTripInfo {
    id: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    potential_savings: number;
    past_savings: number;
    image_url: string;
}

export interface FlightTrip extends BaseTripInfo {
    type: 'flight';
    passenger_name: string;
    departure_city: string;
    arrival_city: string;
    departure_date: string;
    arrival_date: string;
    flight_number: string;
    airline: string;
    price: number;
    repricing_session_id?: string;
    seat_number: string;
    seat_class: 'economy' | 'business' | 'first';
}

export interface HotelTrip extends BaseTripInfo {
    type: 'hotel';
    guest_name: string;
    hotel_name: string;
    city: string;
    check_in_date: string;
    check_out_date: string;
    room_type: string;
    price_per_night: number;
    total_price: number;
    nights: number;
    repricing_session_id?: string;
}

export type Trip = FlightTrip | HotelTrip;

const MOCKED_TRIPS: Trip[] = [
    {
        id: 'FL001',
        type: 'flight',
        status: 'confirmed',
        passenger_name: 'Jesus Frontend Wizard',
        departure_city: 'New York',
        arrival_city: 'London',
        departure_date: '2024-04-15',
        arrival_date: '2024-04-15',
        flight_number: 'BA112',
        airline: 'British Airways',
        price: 850.0,
        potential_savings: 150.0,
        repricing_session_id: 'RFL001',
        past_savings: 75.0,
        seat_number: '12A',
        seat_class: 'business',
        image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'
    },
    {
        id: 'HT001',
        type: 'hotel',
        status: 'confirmed',
        guest_name: 'Jesus Frontend Wizard',
        hotel_name: 'Grand Plaza Hotel',
        city: 'Paris',
        check_in_date: '2024-05-01',
        check_out_date: '2024-05-05',
        room_type: 'Deluxe King',
        price_per_night: 250.0,
        total_price: 1000.0,
        potential_savings: 0,
        past_savings: 100.0,
        nights: 4,
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
    },
    {
        id: 'FL002',
        type: 'flight',
        status: 'pending',
        passenger_name: 'Jesus Frontend Wizard',
        departure_city: 'Tokyo',
        arrival_city: 'Sydney',
        departure_date: '2024-06-10',
        arrival_date: '2024-06-10',
        flight_number: 'QF102',
        airline: 'Qantas',
        price: 1200.0,
        potential_savings: 250.0,
        repricing_session_id: 'RFL002',
        past_savings: 0.0,
        seat_number: '24C',
        seat_class: 'economy',
        image_url: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9'
    },
    {
        id: 'HT002',
        type: 'hotel',
        status: 'cancelled',
        guest_name: 'Jesus Frontend Wizard',
        hotel_name: 'Ocean View Resort',
        city: 'Barcelona',
        check_in_date: '2024-07-15',
        check_out_date: '2024-07-20',
        room_type: 'Ocean Suite',
        price_per_night: 350.0,
        total_price: 1750.0,
        potential_savings: 300.0,
        past_savings: 0.0,
        nights: 5,
        repricing_session_id: 'RHT002',
        image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
    },
    {
        id: 'FL003',
        type: 'flight',
        status: 'confirmed',
        passenger_name: 'Jesus Frontend Wizard',
        departure_city: 'Singapore',
        arrival_city: 'Dubai',
        departure_date: '2024-08-01',
        arrival_date: '2024-08-01',
        flight_number: 'EK353',
        airline: 'Emirates',
        price: 950.0,
        potential_savings: 0,
        past_savings: 0,
        seat_number: '1F',
        seat_class: 'first',
        image_url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c'
    }
] as const;

const MOCKED_USER_STATS = {
    total_bookings: 89,
    total_savings: 192384.12,
    total_flights: 54,
    total_hotels: 35,
    total_points: 19238.412,
    tier: 4,
    region: 'UY',
    percentile: 99.9,
    is_paid_member: true,
    member_since: '2024-01-01'
} as const;

export async function GET(request: NextRequest) {
    try {
        // Get the type from query params
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');

        // If type is stats, return stats
        if (type === 'stats') {
            return NextResponse.json(MOCKED_USER_STATS);
        }

        // Return all trips
        return NextResponse.json(MOCKED_TRIPS);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
