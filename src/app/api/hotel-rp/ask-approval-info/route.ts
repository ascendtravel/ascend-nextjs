import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';
        const response = await fetch(`${baseUrl}/hotel_rp_ask_approval_info`, {
            method: 'GET',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error fetching approval info:', errorData);
            throw new Error(errorData.message || 'Failed to fetch approval info');
        }

        const data = await response.json();
        console.log('Approval info fetched successfully:', JSON.stringify(data, null, 2));

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error in ask-approval-info API:', error);

        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                success: false
            },
            { status: 500 }
        );
    }
}
