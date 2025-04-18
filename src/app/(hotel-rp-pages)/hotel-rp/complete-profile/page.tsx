import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import CompleteProfileView from './CompleteProfileView';

interface ApprovalInfo {
    first_name?: string;
    last_name?: string;
    bday?: string;
    citizenship?: string;
    [key: string]: any;
}

export default async function CompleteProfilePage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const sessionId = params.session_id as string;

    // if (!sessionId) {
    //     redirect('/hotel-rp/error?message=Missing+session+ID');
    // }

    // Mock data for development
    let approvalInfo: ApprovalInfo | null = null;

    if (process.env.NODE_ENV === 'development') {
        approvalInfo = {
            first_name: 'John',
            last_name: 'Doe',
            bday: '1990-01-01',
            citizenship: 'US'
        };
    } else {
        try {
            const headersList = await headers();
            const host = headersList.get('host') || 'localhost:3003';
            const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
            const baseUrl = `${protocol}://${host}`;

            const response = await fetch(`${baseUrl}/api/hotel-rp/ask-approval-info?session_id=${sessionId}`, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch approval info');
            }

            approvalInfo = await response.json();
            console.log('Server-side approval info:', approvalInfo);
        } catch (err) {
            console.error('Error fetching approval info on server:', err);
            // Continue with null approvalInfo - the view will handle this case
        }
    }

    return (
        <div className='flex min-h-screen flex-col items-center justify-center'>
            <CompleteProfileView initialData={approvalInfo} sessionId={sessionId} />
        </div>
    );
}
