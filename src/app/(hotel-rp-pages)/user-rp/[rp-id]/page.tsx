import { redirect } from 'next/navigation';

import UserRpView, { RpViewState } from './_components/UserRpView';

type UserRpPageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ [key: string]: string }>;
};

const UserRpPage = async (props: UserRpPageProps) => {
    const searchParams = await props.searchParams;
    const viewState = searchParams['view-state'];
    const params = await props.params;

    // if no view state redirect to confirm user info
    if (!viewState) {
        return redirect(`/user-rp/${params['rp-id']}?view-state=ConfirmUserInfo`);
    }

    return <UserRpView viewState={(viewState as RpViewState) || 'ConfirmUserInfo'} rpId={params['rp-id']} />;
};

export default UserRpPage;
