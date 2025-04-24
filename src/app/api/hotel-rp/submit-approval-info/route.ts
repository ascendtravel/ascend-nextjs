import { NextRequest, NextResponse } from 'next/server';

interface ApprovalInfoPayload {
    repricing_session_id: string;
    first_name: string;
    last_name: string;
    birthday: string;
    citizenship: string;
    redirect_url?: string;
}

interface ApprovalInfoResponse {
    stripe_link_url: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        const requiredFields = ['repricing_session_id', 'first_name', 'last_name', 'birthday', 'citizenship'];
        const missingFields = requiredFields.filter((field) => !body[field]);

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    error: `Missing required fields: ${missingFields.join(', ')}`,
                    success: false
                },
                { status: 400 }
            );
        }

        const payload: ApprovalInfoPayload = {
            repricing_session_id: body.repricing_session_id,
            first_name: body.first_name,
            last_name: body.last_name,
            birthday: body.birthday,
            citizenship: body.citizenship,
            redirect_url: body.redirect_url || ''
        };

        console.log('Submitting approval info:', JSON.stringify(payload, null, 2));

        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';
        const response = await fetch(`${baseUrl}/hotel_rp_approval_info`, {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error submitting approval info:', errorData);
            throw new Error(errorData.error || 'Failed to submit approval info');
        }

        const data: ApprovalInfoResponse = await response.json();
        console.log('Approval info submitted successfully:', JSON.stringify(data, null, 2));

        // Return the Stripe link URL directly
        return NextResponse.json({
            success: true,
            stripe_link_url: data.stripe_link_url
        });
    } catch (error: any) {
        console.error('Error in submit-approval-info API:', error);

        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                success: false
            },
            { status: 500 }
        );
    }
}
