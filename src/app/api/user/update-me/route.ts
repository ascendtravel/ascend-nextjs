import { NextRequest, NextResponse } from 'next/server';

import { UserRelatedFetch } from '@/lib/UserRelatedFetch';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { first_name, last_name, date_of_birth, citizenship } = body;
        const token = request.headers.get('Authorization')?.split(' ')[1];

        if (!first_name || !last_name || !date_of_birth || !citizenship) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const impersonate_user_id = request.nextUrl.searchParams.get('impersonationId') || undefined;

        const response = await UserRelatedFetch(
            '/me',
            {
                method: 'POST',
                body: JSON.stringify({
                    first_name,
                    last_name,
                    citizenship,
                    date_of_birth
                })
            },
            {
                token,
                impersonationId: impersonate_user_id
            }
        );

        if (!response.ok) {
            const errorData = await response.json();

            return NextResponse.json(
                { error: errorData.error || 'Failed to update user info' },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user info' }, { status: 500 });
    }
}
