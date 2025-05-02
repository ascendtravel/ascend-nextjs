import IconNewWhite from '@/components/Icon/IconNewWhite';
import UserDetailsMenu from '@/components/UserDetailsMenu';
import { useUser } from '@/contexts/UserContext';

interface RpHeaderNavProps {
    className?: string;
}

export default function RpHeaderNav({ className = '' }: RpHeaderNavProps) {
    const { isLoading, user } = useUser();

    return (
        <header className={`fixed top-0 right-0 left-0 z-50 bg-[#006DBC]/80 backdrop-blur-sm ${className}`}>
            <div className='flex w-full flex-row items-center justify-between px-4 py-2'>
                <div className='flex max-w-[60px] flex-row items-center justify-center'>
                    <IconNewWhite />
                </div>

                {user && <UserDetailsMenu />}
                {!user && <div>Loading...</div>}
            </div>
        </header>
    );
}
