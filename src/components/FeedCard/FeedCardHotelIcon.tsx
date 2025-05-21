import * as React from 'react';

interface FeedCardIconProps {
    className?: string;
}

const FeedCardHotelIcon = ({ className }: FeedCardIconProps) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='28'
        height='28'
        fill='none'
        viewBox='0 0 28 28'
        className={className}>
        <rect width='27.161' height='27.161' x='0.832' y='0.51' fill='#FE8EC4' rx='13.581'></rect>
        <path
            fill='#000'
            d='M19.237 10.713H8.139V9.265a.483.483 0 0 0-.965 0v9.65a.483.483 0 0 0 .965 0v-1.93h12.546v1.93a.483.483 0 0 0 .965 0v-5.79a2.41 2.41 0 0 0-2.413-2.412m-11.098.965h4.343v4.343H8.139z'></path>
    </svg>
);

export default FeedCardHotelIcon;
