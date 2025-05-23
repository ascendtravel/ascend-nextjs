import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { repricing_session_id } = body;

        if (!repricing_session_id) {
            return NextResponse.json({ error: 'Missing repricing_session_id' }, { status: 400 });
        }

        console.log('Making request to send OTP for hotel RP with session ID:', repricing_session_id);

        const baseUrl = process.env.DECISION_ENGINE_BASE_URL || 'https://decision-engine.onrender.com';
        const response = await fetch(`${baseUrl}/send-otp-for-hotel-rp`, {
            method: 'POST',
            headers: {
                'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                repricing_session_id
            })
        });
        console.log('body', body);

        if (!response.ok) {
            console.log('response', response);
            const errorData = await response.json().catch(() => ({}));
            console.error('Error from OTP service:', errorData);
            throw new Error(errorData.message || 'Failed to send OTP');
        }

        const data = await response.json();
        console.log('OTP sent successfully, response:', JSON.stringify(data, null, 2));

        // Handle the nested response structure
        const success = data.send_otp_status?.success || false;
        const message = data.send_otp_status?.message || 'Unknown status';

        if (!success) {
            throw new Error(message || 'Failed to send OTP');
        }

        // Format the masked phone number
        const last4 = data.phone_number_last_4_digits || '****';
        const maskedPhone = `+1 ***-***-${last4}`;

        return NextResponse.json({
            masked_phone: maskedPhone,
            success: true,
            message: message
        });
    } catch (error: any) {
        console.error('Error sending OTP:', error);

        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                success: false
            },
            { status: 500 }
        );
    }
}

// Also handle PUT for resending OTP
export async function PUT(request: NextRequest) {
    return POST(request);
}
