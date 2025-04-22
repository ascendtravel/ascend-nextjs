import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';
        const response = await fetch(`${baseUrl}/user/me/stats`, {
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
