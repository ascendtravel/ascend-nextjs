export default function UserRpNoTripsCard() {
    return (
        <div className='flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 p-4'>
            <div className='mb-2 flex items-center justify-center'>
                <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none' viewBox='0 0 32 32'>
                    <path
                        fill='#000'
                        fillOpacity='0.1'
                        d='M21.94 26.89a.99.99 0 0 1-.99.99H3.13a.99.99 0 1 1 0-1.98h17.82a.99.99 0 0 1 .99.99m8.7-15.994L28.335 7.94l-.015-.018a4.93 4.93 0 0 0-6.346-1.129l-6.381 3.809-6.675-2.455a1 1 0 0 0-.692 0l-.887.338-.04.016a1.98 1.98 0 0 0-.56 3.275L9.44 14.4l-2.496 1.51-3.497-1.181a1 1 0 0 0-.752.05l-.372.181a1.98 1.98 0 0 0-.555 3.244l4.455 4.364.015.015a4.92 4.92 0 0 0 5.883.662l18.242-10.89a.988.988 0 0 0 .273-1.457z'></path>
                </svg>
            </div>
            <div className='text-center text-sm'>No trips found for this period</div>
            <div className='max-w-[274px] text-center text-lg font-bold'>
                Forward your travel confirmations to Ascend to start tracking your trips!
            </div>
        </div>
    );
}
