import { NextRequest, NextResponse } from 'next/server';

import { UserRelatedFetch } from '@/lib/UserRelatedFetch';

const BASE_URL = 'https://webapp-bff.onrender.com';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repricing_session_id, citizenship, impersonate_user_id } = body;
        const token = request.headers.get('Authorization')?.split(' ')[1];

        if (!repricing_session_id || !citizenship) {
            return NextResponse.json(
                { error: 'Missing required fields: repricing_session_id or citizenship' },
                { status: 400 }
            );
        }

        console.log('\n\n[/api/flight-rp/approval_info] Token:', token);
        console.log('\n\n[/api/flight-rp/approval_info] Impersonate User ID:', impersonate_user_id);

        const response = await UserRelatedFetch(
            `/flight_rp_approval_info`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    repricing_session_id,
                    citizenship
                })
            },
            {
                token: `Bearer ${token}`,
                impersonationId: impersonate_user_id
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('[/api/flight-rp/approval_info] Error response:', errorData);

            return NextResponse.json(
                { error: errorData.error || 'Failed to submit approval info' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('[/api/flight-rp/approval_info] Success response:', data);

        return NextResponse.json(data);
    } catch (error) {
        console.error('[/api/flight-rp/approval_info] Error:', error);

        return NextResponse.json({ error: 'Failed to submit approval info' }, { status: 500 });
    }
}
