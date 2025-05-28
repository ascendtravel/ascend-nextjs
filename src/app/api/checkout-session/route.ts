import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { state_id, live_mode = true, referral_code, return_url } = await request.json();

        if (!state_id) {
            console.error('Missing state_id in request body');

            return NextResponse.json({ error: 'Missing state_id parameter' }, { status: 400 });
        }

        console.log('Making request to create checkout session with state_id:', state_id);

        const BASE_URL = 'https://frontend-repricing-email-import.onrender.com';
        const response = await fetch(`${BASE_URL}/v2/gmail/import/create_checkout_session`, {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                state_id,
                live_mode,
                return_url,
                ...(referral_code ? { referral_code } : {})
            })
        });

        if (!response.ok) {
            console.error('Failed to get response from checkout session service', response);
            throw new Error('Failed to get response from checkout session service');
        }

        const data = await response.json();
        console.log('Raw checkout session response:', JSON.stringify(data, null, 2));

        if (!data) {
            console.error('Empty response from checkout session service');

            return NextResponse.json({ error: 'Empty response from service' }, { status: 500 });
        }

        if (!data.checkout_session_id || !data.checkout_session_client_secret) {
            console.error('Missing required fields in response:', data);

            return NextResponse.json(
                {
                    error: 'Invalid response from checkout session service',
                    data
                },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Checkout session creation detailed error:', {
            message: error.message,
            status: error.status,
            data: error.data,
            stack: error.stack,
            response: error.response,
            request: {
                state_id: 'REDACTED',
                headers: {
                    'X-API-KEY': 'REDACTED'
                }
            }
        });

        return NextResponse.json(
            {
                error: error.message || 'Failed to create checkout session',
                data: error.data
            },
            { status: error.status || 500 }
        );
    }
}
