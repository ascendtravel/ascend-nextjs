import { Suspense } from 'react';

import { SuccessView } from './_components/SuccessView';

export default function GmailLinkSuccess() {
    return (
        <Suspense>
            <SuccessView />
        </Suspense>
    );
}
