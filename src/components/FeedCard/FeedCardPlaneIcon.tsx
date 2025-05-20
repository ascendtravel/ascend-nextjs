import * as React from 'react';

interface FeedCardIconProps {
    className?: string;
}

const FeedCardPlaneIcon = ({ className }: FeedCardIconProps) => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        width='21'
        height='21'
        fill='none'
        viewBox='0 0 21 21'
        className={className}>
        <rect width='20.348' height='20.348' x='0.604' y='0.579' fill='#17AA59' rx='10.174'></rect>
        <path
            fill='#2A2A2A'
            d='M15.667 14.239a.43.43 0 0 1-.1.448l-1.281 1.282a.427.427 0 0 1-.658-.063l-2.354-3.531-1.136 1.134v1.303a.43.43 0 0 1-.125.302s-.748.751-.849.848a.427.427 0 0 1-.705-.132l-.002-.008-.786-1.963-1.967-.787a.427.427 0 0 1-.144-.698l.855-.855a.43.43 0 0 1 .304-.125h1.303l1.136-1.136-3.53-2.355a.427.427 0 0 1-.066-.658l1.282-1.282a.43.43 0 0 1 .448-.1l4.59 1.67 1.685-1.684a1.496 1.496 0 1 1 2.115 2.115l-1.684 1.684z'></path>
    </svg>
);

export default FeedCardPlaneIcon;
