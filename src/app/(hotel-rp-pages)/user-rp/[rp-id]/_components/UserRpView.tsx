'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { UserProfile, useUser } from '@/contexts/UserContext';

import UserRpConfirmRepricingView from './UserRpConfirmRepricingView/UserRpConfirmRepricingView';
import UserRpUserInfoInputView from './UserRpUserInfoInputView';

export type RpViewState = 'ConfirmUserInfo' | 'ConfirmRepricing' | 'UpdateTripInfo';

type UserRpViewProps = {
    viewState: RpViewState;
    rpId: string;
};

function ValidateProfileCompleted(user: UserProfile) {
    return (
        user.last_name &&
        user.last_name !== '' &&
        user.first_name &&
        user.first_name !== '' &&
        user.citizenship &&
        user.citizenship !== '' &&
        user.date_of_birth &&
        user.date_of_birth !== ''
    );
}

export default function UserRpView({ viewState, rpId }: UserRpViewProps) {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user && ValidateProfileCompleted(user)) {
            router.push(`/user-rp/${rpId}?view-state=ConfirmRepricing`);
        }
    }, [user]);

    return (
        <>
            {viewState === 'ConfirmUserInfo' && (
                <div>
                    <UserRpUserInfoInputView rpId={rpId} />
                </div>
            )}
            {viewState === 'ConfirmRepricing' && (
                <div>
                    <UserRpConfirmRepricingView rpId={rpId} />
                </div>
            )}

            {viewState === 'UpdateTripInfo' && (
                <div>
                    <h1>Update Trip Info</h1>
                </div>
            )}
        </>
    );
}
