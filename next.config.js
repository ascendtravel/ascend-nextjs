// Injected content via Sentry wizard below
const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
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

// PWA Configuration
const pwaConfig = {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching: [
        // Decision Engine API
        {
            urlPattern: ({ url }) => url.href.includes(process.env.DECISION_ENGINE_BASE_URL),
            handler: 'NetworkFirst',
            options: {
                cacheName: 'decision-engine-cache',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                },
                networkTimeoutSeconds: 10
            }
        },
        // Webapp BFF API
        {
            urlPattern: ({ url }) => url.href.includes(process.env.WEBAPP_BFF_URL),
            handler: 'NetworkFirst',
            options: {
                cacheName: 'webapp-bff-cache',
                expiration: {
                    maxEntries: 32,
                    maxAgeSeconds: 24 * 60 * 60 // 24 hours
                },
                networkTimeoutSeconds: 10
            }
        },
        // Local API routes
        {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 // 1 hour
                }
            }
        },
        // Static assets
        {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'image-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                }
            }
        },
        // Google Fonts Stylesheets
        {
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'google-fonts-stylesheets',
                expiration: {
                    maxEntries: 5,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                }
            }
        },
        // Google Fonts Webfonts
        {
            urlPattern: /^https:\/\/fonts\.gstatic\.com/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts-webfonts',
                expiration: {
                    maxEntries: 20,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        // Local Fonts
        {
            urlPattern: /\.(woff|woff2|eot|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'local-fonts',
                expiration: {
                    maxEntries: 30, // Increased for TWKLausanne variants
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        // Geist Fonts (specific handling)
        {
            urlPattern: /\/fonts\/Geist.*\.woff2?$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'geist-fonts',
                expiration: {
                    maxEntries: 4,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        },
        // TWKLausanne Fonts (specific handling)
        {
            urlPattern: /TWKLausanne.*\.(woff2?|eot|ttf|otf)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'twk-lausanne-fonts',
                expiration: {
                    maxEntries: 15, // For all weight variants
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                },
                cacheableResponse: {
                    statuses: [0, 200]
                }
            }
        }
    ]
};

// Apply configurations
const withPWAConfig = withPWA(pwaConfig);

// Export the final config
module.exports = withSentryConfig(withNextIntl(withPWAConfig(nextConfig)), {
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
