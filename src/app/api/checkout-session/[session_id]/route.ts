import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { session_id: string } }) {
    try {
        const { session_id } = params;

        if (!session_id) {
            console.error('Missing session_id in path parameters');

            return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 });
        }

        console.log('Making request to get checkout session status for session_id:', session_id);

        const BASE_URL = 'https://frontend-repricing-email-import.onrender.com';
        const response = await fetch(`${BASE_URL}/v2/gmail/import/checkout_session_status/${session_id}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get response from checkout session status service');
        }

        const data = await response.json();
        console.log('Raw checkout session status response:', JSON.stringify(data, null, 2));

        if (!data) {
            console.error('Empty response from checkout session status service');

            return NextResponse.json({ error: 'Empty response from service' }, { status: 500 });
        }

        if (!data.checkout_session_id || !data.checkout_session_status) {
            console.error('Missing required fields in response:', data);

            return NextResponse.json(
                {
                    error: 'Invalid response from checkout session status service',
                    data
                },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Checkout session status detailed error:', {
            message: error.message,
            status: error.status,
            data: error.data,
            stack: error.stack,
            response: error.response,
            request: {
                session_id: 'REDACTED',
                headers: {
                    'X-API-KEY': 'REDACTED'
                }
            }
        });

        return NextResponse.json(
            {
                error: error.message || 'Failed to get checkout session status',
                data: error.data
            },
            { status: error.status || 500 }
        );
    }
}
