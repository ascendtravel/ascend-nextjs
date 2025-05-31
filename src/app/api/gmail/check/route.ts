import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const state_id = url.searchParams.get('state_id');
        const baseUrl = url.searchParams.get('baseUrl');

        if (!state_id) {
            return NextResponse.json({ error: 'state_id is required' }, { status: 400 });
        }

        const BASE_URL = 'https://frontend-repricing-email-import.onrender.com';

        const response = await fetch(`${BASE_URL}/v2/gmail/import/get_email_status/${state_id}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!
            }
        });

        const data = await response.json();

        // Check if email is linked (success) or not (failure)
        const isLinked = data.email_linked === true;

        if (isLinked) {
            // Email is linked (success), redirect to phone step
            console.log('[GmailCheck] Gmail linking successful, redirecting to phone step');

            return NextResponse.json({
                success: true,
                redirect: `${baseUrl}/welcome?step=2&state_id=${state_id}`,
                email_linked: true
            });
        } else {
            // Email is not linked (failure), carry on with current flow
            console.log('[GmailCheck] Gmail linking failed, continuing current flow');

            return NextResponse.json({
                success: false,
                email_linked: false
            });
        }
    } catch (error) {
        console.error('[GmailCheck] Error:', error);

        return NextResponse.json({ error: 'Failed to check Gmail link status' }, { status: 500 });
    }
}
