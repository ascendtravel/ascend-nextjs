type MemberInfoSectionProps = {
    memberType: 'Free' | 'Pro';
    savedAmount?: number;
    sinceDate?: string;
};

export default function MemberInfoSection({
    memberType,
    savedAmount = 0,
    sinceDate = 'January 2024'
}: MemberInfoSectionProps) {
    return memberType === 'Pro' ? (
        <div className='mt-4 flex w-full flex-row items-center justify-start gap-4 px-4'>
            <div className='rounded-md bg-[#1DC167] px-2 py-0.5 text-xs font-bold text-neutral-50 uppercase'>Pro</div>
            <div className='flex w-full flex-col items-start justify-start text-left text-xs text-[#1DC167]'>
                <div className='font-bold'>Top 1% of smart travelers</div>
                <div>You have saved ${savedAmount} so far</div>
            </div>
        </div>
    ) : (
        <div className='mt-4 flex w-full flex-row items-center justify-start gap-4 px-4'>
            <div className='rounded-md bg-neutral-900 px-2 py-0.5 text-xs font-bold text-neutral-50 uppercase'>
                Free
            </div>
            <div className='flex w-full flex-col items-start justify-start text-left text-xs text-neutral-900'>
                <div className='font-bold'>Ascend Free Member</div>
                <div>Since {sinceDate}</div>
            </div>
        </div>
    );
}
