import { NextRequest, NextResponse } from 'next/server';

import { UserRelatedFetch } from '@/lib/UserRelatedFetch';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repricing_session_id, redirect_url } = body;
        const token = request.headers.get('Authorization')?.split(' ')[1];

        if (!repricing_session_id || !redirect_url) {
            return NextResponse.json(
                { error: 'Missing required fields: repricing_session_id or redirect_url' },
                { status: 400 }
            );
        }

        const impersonate_user_id = request.nextUrl.searchParams.get('impersonationId') || undefined;

        const response = await UserRelatedFetch(
            '/hotel_rp_payment_link',
            {
                method: 'POST',
                body: JSON.stringify({
                    repricing_session_id,
                    redirect_url
                })
            },
            {
                token,
                impersonationId: impersonate_user_id
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Payment link error response:', errorData);

            return NextResponse.json(
                { error: errorData.error || 'Failed to generate payment link' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Payment link success response:', data);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in hotel-rp/payment-link:', error);

        return NextResponse.json({ error: 'Failed to generate payment link' }, { status: 500 });
    }
}
