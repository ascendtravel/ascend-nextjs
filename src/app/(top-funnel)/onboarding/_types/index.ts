export enum OnboardingSteps {
    Step1 = 'gmail-link',
    Step2 = 'phone-confirmation',
    Step3 = 'subscription'
}

export const mapStepToNumbers = {
    [OnboardingSteps.Step1]: 1,
    [OnboardingSteps.Step2]: 2,
    [OnboardingSteps.Step3]: 3
};

export const mapNumberToStep = {
    1: OnboardingSteps.Step1,
    2: OnboardingSteps.Step2,
    3: OnboardingSteps.Step3
};
