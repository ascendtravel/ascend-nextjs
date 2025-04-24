import * as React from 'react';

const SvgIcon = ({ fill = '#fff' }: { fill?: string }) => (
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' fill='none' viewBox='0 0 37 38'>
        <g filter='url(#filter0_ddd_9276_2083)'>
            <rect width='20.925' height='20.925' x='8.037' y='5.038' fill={fill} rx='10.463'></rect>
            <path
                fill='#2A2A2A'
                d='M22.775 12.507h-9.832v-1.282a.427.427 0 1 0-.855 0v8.55a.428.428 0 0 0 .855 0v-1.71h11.115v1.71a.428.428 0 0 0 .855 0v-5.13a2.14 2.14 0 0 0-2.138-2.138m-9.832.855h3.847v3.848h-3.847z'></path>
        </g>
        <defs>
            <filter
                id='filter0_ddd_9276_2083'
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
                <feBlend in2='BackgroundImageFix' result='effect1_dropShadow_9276_2083'></feBlend>
                <feColorMatrix
                    in='SourceAlpha'
                    result='hardAlpha'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'></feColorMatrix>
                <feOffset></feOffset>
                <feGaussianBlur stdDeviation='2.325'></feGaussianBlur>
                <feComposite in2='hardAlpha' operator='out'></feComposite>
                <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'></feColorMatrix>
                <feBlend in2='effect1_dropShadow_9276_2083' result='effect2_dropShadow_9276_2083'></feBlend>
                <feColorMatrix
                    in='SourceAlpha'
                    result='hardAlpha'
                    values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'></feColorMatrix>
                <feOffset dy='3.72'></feOffset>
                <feGaussianBlur stdDeviation='3.72'></feGaussianBlur>
                <feComposite in2='hardAlpha' operator='out'></feComposite>
                <feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'></feColorMatrix>
                <feBlend in2='effect2_dropShadow_9276_2083' result='effect3_dropShadow_9276_2083'></feBlend>
                <feBlend in='SourceGraphic' in2='effect3_dropShadow_9276_2083' result='shape'></feBlend>
            </filter>
        </defs>
        <script></script>
    </svg>
);

export default SvgIcon;
