export default function OnboardingLandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative min-h-screen overflow-x-hidden bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC]'>
            {/* Main content area - allows scrolling */}
            <div id='onboarding-landing-container' className='relative w-full'>
                {children}
            </div>
        </div>
    );
}
