'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { UserProfile, useUser } from '@/contexts/UserContext';
import { ValidateProfileCompleted } from '@/lib/utils';

import UserRpConfirmRepricingView from './UserRpConfirmRepricingView/UserRpConfirmRepricingView';
import UserRpUserInfoInputView from './UserRpUserInfoInputView';

export type RpViewState = 'ConfirmUserInfo' | 'ConfirmRepricing' | 'UpdateTripInfo';

type UserRpViewProps = {
    viewState: RpViewState;
    rpId: string;
};

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
