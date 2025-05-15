import { YcombBanner } from '@/components/YcombBanner/YcombBanner';

import { OnboardingSteps } from './_types';
import OnboardingMainView from './_views/OnboardingMainView';

export default async function Page(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    // Get step from query params and validate it
    let initialStep: OnboardingSteps | undefined;
    const params = await props.searchParams;

    const stepParam = params['step'] as string;
    const stateId = params['stateId'] as string;
    // Map query param values to OnboardingSteps enum values
    if (stepParam) {
        // Check if the step is a valid OnboardingSteps value
        const stepParamLower = stepParam.toLowerCase();
        if (stepParamLower === 'gmail-link' || stepParamLower === '1') {
            initialStep = OnboardingSteps.Step1;
        } else if (stepParamLower === 'phone-confirmation' || stepParamLower === '2') {
            initialStep = OnboardingSteps.Step2;
        } else if (stepParamLower === 'subscription' || stepParamLower === '3') {
            initialStep = OnboardingSteps.Step3;
        }
    }

    return <OnboardingMainView predefinedStep={initialStep} stateId={stateId} />;
}
