import { PhoneLoginView } from '../_components/PhoneLoginView';

type PhoneLoginPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PhoneLoginPage({ searchParams }: PhoneLoginPageProps) {
    const params = await searchParams;
    const redirectUrl = params.redirect as string;

    return (
        <div className='flex h-full w-full flex-1 flex-col items-center justify-center p-4'>
            <PhoneLoginView redirectUrl={redirectUrl} />
        </div>
    );
}
