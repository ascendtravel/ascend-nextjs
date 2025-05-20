import React from 'react';

import { Separator } from '@/components/ui/separator';

type WelcomeWhatsNextProps = {
    componenHeader: string;
    rowsInfo: {
        content: string;
    }[];
};

export function WelcomeWhatsNext({ componenHeader, rowsInfo }: WelcomeWhatsNextProps) {
    return (
        <div className='flex max-w-md flex-col gap-2 rounded-2xl bg-neutral-50 py-8'>
            <div className='ml-2 flex items-center justify-center'>
                <h2 className='text-xl font-bold text-neutral-900'>{componenHeader}</h2>
            </div>
            <div className='mt-4 flex flex-col'>
                {rowsInfo.map((row, index) => (
                    <React.Fragment key={row.content}>
                        <div className='my-2 flex flex-row items-center gap-2 py-2 pr-4'>
                            <h2 className='px-8 text-2xl font-bold text-neutral-900'>{index + 1}</h2>
                            <div className='text-sm font-bold text-neutral-900'>{row.content}</div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
