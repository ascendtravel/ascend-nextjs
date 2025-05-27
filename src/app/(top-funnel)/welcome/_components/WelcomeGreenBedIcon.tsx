import * as React from 'react';

const SvgIcon = ({ size, color, bgColor, isMask }: { size?: number, color?: string, bgColor?: string, isMask?: boolean }) => (
    <svg xmlns='http://www.w3.org/2000/svg' width={size ?? 33} height={size ?? 33} fill='none' viewBox='0 0 33 33'>
        {isMask ? (
            <>
                <defs>
                    <mask id="bedMask">
                        <rect width="100%" height="100%" fill="white"/>
                        <path
                            fill="black"
                            d='M23.242 11.78H7.735V9.759a.674.674 0 1 0-1.348 0v13.484a.674.674 0 1 0 1.348 0v-2.697h17.53v2.697a.674.674 0 1 0 1.348 0v-8.09a3.37 3.37 0 0 0-3.371-3.371M7.735 13.13h6.068v6.067H7.735z'
                        />
                    </mask>
                </defs>
                <rect 
                    width='33.001' 
                    height='33.001' 
                    fill={bgColor ?? '#1DC167'} 
                    rx='16.5' 
                    mask="url(#bedMask)"
                />
            </>
        ) : (
            <>
                <rect width='33.001' height='33.001' fill={bgColor ?? '#1DC167'} rx='16.5'></rect>
                <path
                    fill={color ?? '#fff'}
                    d='M23.242 11.78H7.735V9.759a.674.674 0 1 0-1.348 0v13.484a.674.674 0 1 0 1.348 0v-2.697h17.53v2.697a.674.674 0 1 0 1.348 0v-8.09a3.37 3.37 0 0 0-3.371-3.371M7.735 13.13h6.068v6.067H7.735z'
                />
            </>
        )}
    </svg>
);

export default SvgIcon;
