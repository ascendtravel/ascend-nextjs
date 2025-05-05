import { NextResponse } from 'next/server';

interface CompleteRegistrationRequest {
    state_id: string;
}

export async function POST(request: Request) {
    try {
        // Parse request body
        const body: CompleteRegistrationRequest = await request.json();

        // Validate request
        if (!body.state_id) {
            return NextResponse.json({ error: 'state_id is required' }, { status: 400 });
        }

        // Get Decision Engine URL and API key from environment variables
        const decisionEngineBaseUrl = process.env.DECISION_ENGINE_BASE_URL;
        const apiKey = process.env.PICKS_BACKEND_API_KEY;

        if (!decisionEngineBaseUrl || !apiKey) {
            console.error('Decision Engine URL or API key is missing');

            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }

        // Call Decision Engine API
        const response = await fetch(`${decisionEngineBaseUrl}/complete_user_registration_actions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            body: JSON.stringify({ state_id: body.state_id })
        });

        // Handle response
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Decision Engine API error:', response.status, errorData);

            return NextResponse.json({ error: 'Failed to complete registration actions' }, { status: response.status });
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in complete-registration route:', error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
