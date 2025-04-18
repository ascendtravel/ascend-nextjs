import { NextRequest, NextResponse } from 'next/server';

interface ApprovalInfoResponse {
    data: {
        first_name: string;
        last_name: string;
        birthday: string;
        citizenship: string;
        hotel_name: string;
        hotel_address: string;
        room_type: string;
        prior_price: number;
        new_price: number;
        expected_returned_to_customer_amount: number;
        cancelled_before: string;
        is_expired: boolean;
        faq_url: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const sessionId = body.session_id;

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
        }

        console.log('\n\nsessionId', sessionId);
        console.log('\n\nPICKS_BACKEND_API_KEY', process.env.PICKS_BACKEND_API_KEY);

        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';
        const response = await fetch(`${baseUrl}/hotel_rp_ask_approval_info`, {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                repricing_session_id: sessionId
            })
        });

        if (!response.ok) {
            console.log('response', response);
            console.log('response.body', await response.json());
            throw new Error('Failed to fetch approval info');
        }

        const responseData: ApprovalInfoResponse = await response.json();
        console.log('Approval info fetched successfully:', JSON.stringify(responseData.data, null, 2));

        return NextResponse.json(responseData.data);
    } catch (error: any) {
        console.error('Error in ask-approval-info API:', error);

        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
