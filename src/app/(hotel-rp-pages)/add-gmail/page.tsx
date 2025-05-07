import { YcombBanner } from '@/components/YcombBanner/YcombBanner';

import AddGmailView from './_components/AddGmailView';

export default function AddGmailPage() {
    return (
        <div>
            <YcombBanner />
            <div className='flex flex-col items-center justify-center pt-4'>
                <AddGmailView />
            </div>
        </div>
    );
}
