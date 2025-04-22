import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';
        const response = await fetch(`${baseUrl}/user/me/settings`, {
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user settings');
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';

        const response = await fetch(`${baseUrl}/user/me/settings`, {
            method: 'PUT',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Failed to update user settings');
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
