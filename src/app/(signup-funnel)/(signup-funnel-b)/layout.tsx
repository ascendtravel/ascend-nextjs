import IconNewWhite from '@/components/Icon/IconNewWhite';
import { YcombBanner } from '@/components/YcombBanner/YcombBanner';

export default function SignupFunnelBLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex min-h-screen flex-col bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC]'>
            <div className='flex flex-row items-center justify-center gap-2 bg-[#00345A]'>
                <YcombBanner />
            </div>

            {/* Content */}
            <div className='flex flex-1 flex-col items-center overflow-y-auto'>
                <div className='flex flex-row items-center justify-center gap-2 py-6'>
                    <IconNewWhite className='h-12 w-auto' />
                </div>
                {children}
            </div>
        </div>
    );
}
