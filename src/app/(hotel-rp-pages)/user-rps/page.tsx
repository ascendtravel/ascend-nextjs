'use client';

import React from 'react';

import UserRpsView from './_components/UserRpsView';

type UserRpsPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function UserRpsPage(props: UserRpsPageProps) {
    const searchParams = await props.searchParams;
    const selectedTripId = searchParams['selected'];

    return (
        <div className='h-full w-full'>
            <UserRpsView initialSelectedTripId={selectedTripId as string} />
        </div>
    );
}
