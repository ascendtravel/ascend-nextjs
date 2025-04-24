import { NextRequest, NextResponse } from 'next/server';

interface AirportResponse {
    iata_code: string;
    name: string;
    city: string;
    latitude: string;
    longitude: string;
    timezone: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { airport_iata_codes } = body;

        if (!airport_iata_codes || !Array.isArray(airport_iata_codes)) {
            return NextResponse.json({ error: 'Invalid airport codes' }, { status: 400 });
        }

        const response = await fetch('https://hotel-quote-generation.onrender.com/unified_flights/v1/airports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!
            },
            body: JSON.stringify({
                airport_iata_codes
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch airport information');
        }

        const data = (await response.json()) as AirportResponse[];

        // Map the response to match our Airport type
        const airports = data.map((airport) => ({
            iataCode: airport.iata_code,
            name: airport.name,
            city: airport.city,
            latitude: parseFloat(airport.latitude),
            longitude: parseFloat(airport.longitude),
            timezone: airport.timezone
        }));

        console.log('[/api/airport] Response:', airports);

        return NextResponse.json(airports);
    } catch (error) {
        console.error('[/api/airport] Error:', error);

        return NextResponse.json({ error: 'Failed to fetch airport information' }, { status: 500 });
    }
}
