import { NextRequest, NextResponse } from 'next/server';

import { UserRelatedFetch } from '@/lib/UserRelatedFetch';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repricing_session_id } = body;
        const token = request.headers.get('Authorization')?.split(' ')[1];

        if (!repricing_session_id) {
            return NextResponse.json({ error: 'Missing repricing_session_id' }, { status: 400 });
        }

        const impersonate_user_id = request.nextUrl.searchParams.get('impersonationId') || undefined;

        console.log(
            'token',
            token,
            'impersonate_user_id',
            impersonate_user_id,
            'repricing_session_id',
            repricing_session_id
        );

        const response = await UserRelatedFetch(
            '/hotel_rp_approved',
            {
                method: 'POST',
                body: JSON.stringify({
                    repricing_session_id
                })
            },
            {
                token,
                impersonationId: impersonate_user_id
            }
        );

        console.log('response', response);

        if (!response.ok) {
            const errorData = await response.json();

            return NextResponse.json(
                { error: errorData.error || 'Failed to approve hotel repricing' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in hotel-rp/approved:', error);

        return NextResponse.json({ error: 'Failed to approve hotel repricing' }, { status: 500 });
    }
}
