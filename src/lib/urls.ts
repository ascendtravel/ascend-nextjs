import { RpViewState } from '@/app/[locale]/(hotel-rp-pages)/user-rp/[rp-id]/_components/UserRpView';
import {
    LINK_FAILURE_PARAM,
    OnboardingSteps,
    PERMISSIONS_FAILURE_PARAM,
    mapStepToNumbers
} from '@/app/[locale]/(top-funnel)/welcome/_types';

export const urls = {
    /**
     * @description Welcome
     * @param params - Parameters for Welcome
     * @param params.step - Step of the Welcome page Step0 (Landing) Step1 (Gmail Link) Step2 (Phone Register) Step3 (Membership) Step4 (Trips Landing)
     * @param params.isFailure - Is Failure To link gmail to the app
     * @param params.isPermissionsFailure - Is Failure To get Link Gmail permissions to the app
     * @param params.stateID - State ID of the Welcome
     * @returns Url for Welcome
     */
    welcome: (params: {
        step: OnboardingSteps;
        isFailure: boolean;
        isPermissionsFailure?: boolean;
        stateID?: string;
    }) => {
        const { step, isFailure, isPermissionsFailure, stateID } = params;

        const baseUrl = '/welcome';

        if (isFailure) {
            return `${baseUrl}?${LINK_FAILURE_PARAM}=${isFailure}&step=${mapStepToNumbers[OnboardingSteps.Step1]}${stateID ? `&stateID=${stateID}` : ''}`;
        }

        if (isPermissionsFailure) {
            return `${baseUrl}?${PERMISSIONS_FAILURE_PARAM}=${isPermissionsFailure}&step=${mapStepToNumbers[OnboardingSteps.Step1]}${stateID ? `&stateID=${stateID}` : ''}`;
        }

        if (step) {
            return `${baseUrl}?step=${mapStepToNumbers[step]}${stateID ? `&stateID=${stateID}` : ''}`;
        }

        return baseUrl;
    },

    /**
     * @description Login
     * @param redirectUrl - Redirect URL of the Login
     * @returns Url for Login
     */
    login: (redirectUrl: string) => {
        return `/auth/phone-login${redirectUrl ? `?redirectUrl=${redirectUrl}` : 'user-rps'}`;
    },

    /**
     * @description User RP
     * @param selectedTripId - Selected Trip ID of the User RP
     * @returns Url for User RP
     */
    userRps: (selectedTripId?: string) => {
        return `/user-rps${selectedTripId ? `?selected=${selectedTripId}` : ''}`;
    },

    /**
     * @description User RP
     * @param rpId - RP ID of the User RP
     * @param step - Step of the User RP (ConfirmUserInfo, ConfirmRepricing, UpdateTripInfo)
     * @returns Url for User RP
     */
    userRp: (rpId: string, step: RpViewState) => {
        return `/user-rp/${rpId}?view-state=${step}`;
    },

    /**
     * @description User RP Success
     * @param sessionId - Session ID of the User RP
     * @returns Url for User RP Success
     */
    userRpSuccess: (sessionId: string) => {
        return `/rp-success/${sessionId}`;
    },

    gmailLinkStartUrl: (stateId: string) => {
        return `https://frontend-repricing-email-import.onrender.com/v2/gmail/import/start/${stateId}`;
    }
};
