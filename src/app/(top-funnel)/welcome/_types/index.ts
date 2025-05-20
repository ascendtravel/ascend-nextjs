export enum OnboardingSteps {
    Step0 = 'welcome',
    Step1 = 'link',
    Step2 = 'phone',
    Step3 = 'subscription',
    Step4 = 'trips'
}

export const mapStepToNumbers = {
    [OnboardingSteps.Step0]: 0,
    [OnboardingSteps.Step1]: 1,
    [OnboardingSteps.Step2]: 2,
    [OnboardingSteps.Step3]: 3,
    [OnboardingSteps.Step4]: 4
};

export const mapNumberToStep = {
    0: OnboardingSteps.Step0,
    1: OnboardingSteps.Step1,
    2: OnboardingSteps.Step2,
    3: OnboardingSteps.Step3,
    4: OnboardingSteps.Step4
};
