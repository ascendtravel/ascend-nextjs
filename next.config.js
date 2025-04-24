// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'email.ascend.travel',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'cataas.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'example.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'cdn.worldota.net',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'pixabay.com',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

const requiredEnvs = ['NEXT_PUBLIC_FB_PIXEL_ID', 'PICKS_BACKEND_API_KEY'];

// Validate environment variables
requiredEnvs.forEach((env) => {
    if (!process.env[env]) {
        throw new Error(`Environment variable ${env} is missing`);
    }
});

module.exports = withSentryConfig(nextConfig, {
    org: 'ascend-rq',
    project: 'ascend-nextjs',
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: {
        enabled: true
    },
    disableLogger: true,
    automaticVercelMonitors: true
});
