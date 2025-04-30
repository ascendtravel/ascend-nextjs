import IconNewWhite from '@/components/Icon/IconNewWhite';
import { YcombBanner } from '@/components/YcombBanner/YcombBanner';

import { PhoneRegisterView } from '../_components/PhoneRegisterView';

type PhoneLoginPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PhoneLoginPage({ searchParams }: PhoneLoginPageProps) {
    const params = await searchParams;
    const redirectUrl = params.redirect as string;
    const state_id = params.state_id as string;

    if (!state_id) {
        return (
            <div className='flex h-full w-full flex-col items-center justify-center'>
                <p className='text-2xl font-bold'>Invalid URL parameters</p>
            </div>
        );
    }

    return (
        <>
            <div className='fixed top-0 left-0 w-full'>
                <YcombBanner />
            </div>
            <div className='fixed top-0 left-1/2 flex w-full max-w-[150px] -translate-x-1/2 flex-col items-center justify-center pt-18'>
                <IconNewWhite />
            </div>
            <div className='flex h-full w-full flex-1 flex-col items-center justify-center p-4'>
                <PhoneRegisterView redirectUrl={redirectUrl} state_id={state_id} />
            </div>
        </>
    );
}
