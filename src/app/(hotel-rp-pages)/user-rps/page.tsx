import React from 'react';

import UserRpsView from './_components/UserRpsView';

interface UserRpsPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UserRpsPage(props: UserRpsPageProps) {
    const searchParams = await props.searchParams;
    const rp_id = searchParams.rp_id as string | null;
    console.log('rp_id', rp_id);

    return <UserRpsView {...(rp_id ? { preselectedRpId: rp_id } : {})} />;
}
