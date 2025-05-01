import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { phone_number, otp_code, state_id } = body;

        if (!phone_number) {
            return NextResponse.json({ error: 'Missing phone_number' }, { status: 400 });
        }

        if (!otp_code) {
            return NextResponse.json({ error: 'Missing otp_code' }, { status: 400 });
        }

        console.log('Validating OTP for phone number:', phone_number);
        console.log('OTP code:', otp_code);

        const baseUrl = process.env.WEBAPP_BFF_URL || 'https://webapp-bff.onrender';
        const response = await fetch(`${baseUrl}/verify-otp`, {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_number: `+${phone_number}`,
                token: otp_code,
                ...(state_id ? { state_id } : {})
            })
        });

        if (!response.ok) {
            console.error('Error validating OTP:', data);

            // Handle specific error cases
            if (data.error === 'No customer ID found') {
                return NextResponse.json(
                    {
                        error: 'No customer ID found',
                        success: false,
                        shouldRedirectToGmail: true
                    },
                    { status: 404 }
                );
            }

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
