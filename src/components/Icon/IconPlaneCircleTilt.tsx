import * as React from 'react';

const SvgIcon = ({ fill = '#fff' }: { fill?: string }) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' fill='none' viewBox='0 0 37 38'>
        <g filter='url(#filter0_ddd_9277_482)'>
            <rect width='20.925' height='20.925' x='8.037' y='5.038' fill={fill} rx='10.463'></rect>
            <path
                fill='#2A2A2A'
                d='M23.528 19.085a.44.44 0 0 1-.102.46l-1.319 1.319a.44.44 0 0 1-.676-.064l-2.421-3.632-1.168 1.166v1.34a.44.44 0 0 1-.129.311s-.769.772-.872.872a.44.44 0 0 1-.725-.136l-.003-.008-.807-2.019-2.023-.809a.44.44 0 0 1-.148-.718l.879-.88a.44.44 0 0 1 .312-.128h1.34l1.169-1.168-3.632-2.421a.44.44 0 0 1-.067-.677l1.319-1.318a.44.44 0 0 1 .46-.102l4.721 1.716 1.732-1.732a1.538 1.538 0 1 1 2.175 2.175l-1.732 1.732z'></path>
        </g>
        <defs>
            <filter
                id='filter0_ddd_9277_482'
                width='35.805'
                height='36.735'
                x='0.597'
                y='0.388'
                colorInterpolationFilters='sRGB'
                filterUnits='userSpaceOnUse'>
                <feFlood floodOpacity='0' result='BackgroundImageFix'></feFlood>
                <feColorMatrix
                    in='SourceAlpha'
                    result='hardAlpha'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'></feColorMatrix>
                <feOffset dy='1.86'></feOffset>
                <feGaussianBlur stdDeviation='1.674'></feGaussianBlur>
                <feComposite in2='hardAlpha' operator='out'></feComposite>
                <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'></feColorMatrix>
                <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_9277_482'></feBlend>
                <feColorMatrix
                    in='SourceAlpha'
                    result='hardAlpha'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'></feColorMatrix>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation='2.325'></feGaussianBlur>
                <feComposite in2='hardAlpha' operator='out'></feComposite>
                <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'></feColorMatrix>
                <feBlend in2='effect1_dropShadow_9277_482' result='effect2_dropShadow_9277_482'></feBlend>
                <feColorMatrix
                    in='SourceAlpha'
                    result='hardAlpha'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'></feColorMatrix>
                <feOffset dy='3.72'></feOffset>
                <feGaussianBlur stdDeviation='3.72'></feGaussianBlur>
                <feComposite in2='hardAlpha' operator='out'></feComposite>
                <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'></feColorMatrix>
                <feBlend in2='effect2_dropShadow_9277_482' result='effect3_dropShadow_9277_482'></feBlend>
                <feBlend in='SourceGraphic' in2='effect3_dropShadow_9277_482' result='shape'></feBlend>
            </filter>
        </defs>
        <script></script>
    </svg>
);

export default SvgIcon;
