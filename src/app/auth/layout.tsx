export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen min-h-screen flex-col bg-gradient-to-t from-[#5AA6DA] from-0% via-[#006DBC] via-[22.5%] to-[#006DBC]'>
            <div className='flex h-full w-full flex-col items-center justify-center'>{children}</div>
        </div>
    );
}
