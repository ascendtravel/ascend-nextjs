export default function DollarDealBanner() {
    return (
        <div className='flex flex-row items-center justify-center gap-2 text-neutral-50'>
            <div className='flex flex-col items-center justify-center'>
                <span className='text-sm leading-none font-bold'>Limited Offer</span>
                <span className='text-xs leading-none font-bold uppercase'>Ends on 4/8</span>
            </div>
            <div>|</div>
            <div className='flex flex-row items-center justify-center gap-2'>
                <div className='flex flex-row items-center justify-center'>
                    <div className='pt-1 text-xl font-bold'>$</div>
                    <div className='text-3xl font-bold'>1</div>
                </div>

                <div className='flex flex-col items-start justify-start text-xs leading-none font-bold'>
                    <div>For your</div>
                    <div>first month</div>
                </div>
            </div>
        </div>
    );
}
