import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repricing_session_id, otp_code } = body;

        if (!repricing_session_id) {
            return NextResponse.json({ error: 'Missing repricing_session_id' }, { status: 400 });
        }

        if (!otp_code) {
            return NextResponse.json({ error: 'Missing otp_code' }, { status: 400 });
        }

        console.log('Validating OTP for hotel RP with session ID:', repricing_session_id);

        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';
        const response = await fetch(`${baseUrl}/verify-otp-for-hotel-rp`, {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                repricing_session_id,
                token: otp_code
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error validating OTP:', errorData);

            // Return specific error for invalid OTP
            if (response.status === 401) {
                return NextResponse.json(
                    {
                        error: 'Invalid verification code',
                        success: false
                    },
                    { status: 401 }
                );
            }

            throw new Error('Failed to validate OTP');
        }

        const data = await response.json();
        console.log('OTP validated successfully, response:', JSON.stringify(data, null, 2));

        if (!data.success) {
            return NextResponse.json(
                {
                    error: data.message || 'Failed to verify OTP',
                    success: false
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: data.message || 'OTP verified successfully',
            token: data.token,
            customer_id: data.customer_id
        });
    } catch (error: any) {
        console.error('Error validating OTP:', error);

        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                success: false
            },
            { status: 500 }
        );
    }
}
