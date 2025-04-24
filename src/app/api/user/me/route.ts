import { NextRequest, NextResponse } from 'next/server';

import { UserRelatedFetch } from '@/lib/UserRelatedFetch';

interface UserResponse {
    emails: string[];
    first_name: string | null;
    is_admin: boolean;
    last_name: string | null;
    main_email: string;
    main_phone: string;
    phones: string[];
    stats: Record<string, unknown>;
}

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        const impersonationId = request.nextUrl.searchParams.get('impersonationId');

        const response = await UserRelatedFetch(
            '/me',
            {
                method: 'GET'
            },
            {
                token,
                impersonationId: impersonationId || undefined
            }
        );

        if (response.status === 401) {
            return NextResponse.json(
                {
                    error: 'Unauthorized',
                    redirect: '/auth/phone-login?redirect=/user-rps'
                },
                { status: 401 }
            );
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const data = (await response.json()) as UserResponse;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('[/api/user/me] Error:', error);

        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';

        const response = await fetch(`${baseUrl}/user/me`, {
            method: 'PUT',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Failed to update user info');
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
