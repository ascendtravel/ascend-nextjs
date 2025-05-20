export default function OnboardingWelcomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative min-h-screen overflow-x-hidden'>
            {/* You can customize the background or add common layout elements here */}
            <div id='onboarding-welcome-container' className='relative w-full'>
                {children}
            </div>
        </div>
    );
}
