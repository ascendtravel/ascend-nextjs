import OnboardingMembershipCheckSvg from './OnboardingMembershipCheckSvg';

export default function OnboardingMembershipCardRow({ title, description }: { title: string; description: string }) {
    return (
        <div className='flex flex-col items-start gap-2'>
            <div className='flex flex-row items-center gap-2'>
                <OnboardingMembershipCheckSvg />
                <p className='text-lg font-bold'>{title}</p>
            </div>

            <p>{description}</p>
        </div>
    );
}
