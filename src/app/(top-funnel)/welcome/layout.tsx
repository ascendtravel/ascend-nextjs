export default function OnboardingWelcomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative min-h-screen overflow-x-hidden bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC]'>
            {/* You can customize the background or add common layout elements here */}
            <div id='onboarding-welcome-container' className='relative w-full'>
                {children}
            </div>
        </div>
    );
}
