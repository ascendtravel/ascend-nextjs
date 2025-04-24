import UserRpConfirmRepricingView from './UserRpConfirmRepricingView/UserRpConfirmRepricingView';
import UserRpUserInfoInputView from './UserRpUserInfoInputView';

export type RpViewState = 'ConfirmUserInfo' | 'ConfirmRepricing' | 'UpdateTripInfo';

type UserRpViewProps = {
    viewState: RpViewState;
    rpId: string;
};

export default function UserRpView({ viewState, rpId }: UserRpViewProps) {
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
