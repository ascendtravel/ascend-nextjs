import Image from 'next/image';

export const YcombBanner = () => {
    return (
        <div className='flex flex-row items-center justify-center gap-2 bg-[#00345A] p-2 py-3 text-white'>
            <h1 className='text-figtree text-lg font-bold'>Ascend is Backed by </h1>
            <div className='flex flex-row items-center justify-center gap-1'>
                <div className='size-7 bg-[#f26522] text-center text-xl font-bold'>Y</div>
                <div className='text-figtree text-lg font-semibold text-[#f26522]'>Combinator</div>
            </div>
        </div>
    );
};
