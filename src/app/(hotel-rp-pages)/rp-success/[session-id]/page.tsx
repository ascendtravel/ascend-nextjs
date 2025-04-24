import UserRpSuccessView from './UserRpSuccessView';

interface PageProps {
    params: Promise<{ [key: string]: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RpSuccessPage(props: PageProps) {
    const params = await props.params;
    const sessionId = params['session-id'];

    return (
        <div className='flex h-screen flex-col items-center justify-center rounded-t-xl bg-white'>
            <UserRpSuccessView tripId={sessionId} />
        </div>
    );
}
