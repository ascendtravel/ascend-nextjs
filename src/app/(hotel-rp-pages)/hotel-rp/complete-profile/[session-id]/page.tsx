import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import IconNewWhite from '@/components/Icon/IconNewWhite';
import { YcombBanner } from '@/components/YcombBanner/YcombBanner';

import CompleteProfileView, { ApprovalInfoProp } from './CompleteProfileView';

interface ApprovalInfo {
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
}

export default async function CompleteProfilePage({ params }: { params: Promise<{ [key: string]: string }> }) {
    const allParams = await params;
    const sessionId = allParams['session-id'];

    console.log('sessionId', sessionId);

    if (!sessionId) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center'>
                <div className='text-2xl font-bold'>U need to provide session ID</div>
            </div>
        );
    }

    let approvalInfo: ApprovalInfo | null = null;

    try {
        const headersList = await headers();
        const host = headersList.get('host') || 'localhost:3003';
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const baseUrl = `${protocol}://${host}`;

        const response = await fetch(`${baseUrl}/api/hotel-rp/ask-approval-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: sessionId
            }),
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch approval info');
        }

        approvalInfo = await response.json();
        console.log('Server-side approval info:', approvalInfo);
    } catch (err) {
        console.error('Error fetching approval info on server:', err);
    }

    const parsedApprovalInfo: ApprovalInfoProp = {
        first_name: approvalInfo?.first_name || '',
        last_name: approvalInfo?.last_name || '',
        bday: approvalInfo?.birthday || '',
        citizenship: approvalInfo?.citizenship || ''
    };

    return (
        <div className='flex min-h-screen flex-col items-center justify-start'>
            {/* Ycomb Banner */}
            <div className='flex w-full flex-row items-center justify-center gap-2 bg-[#00345A]'>
                <YcombBanner />
            </div>

            {/* Logo */}
            <div className='flex flex-row items-center justify-center gap-2 py-6'>
                <IconNewWhite className='h-12 w-auto' />
            </div>
            <CompleteProfileView initialData={parsedApprovalInfo} sessionId={sessionId} />
        </div>
    );
}
