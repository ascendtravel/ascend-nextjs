import { MetadataRoute } from 'next';

const BASE_URL = 'https://app.heyascend.com';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${BASE_URL}/welcome`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${BASE_URL}/welcome?step=1`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8
        }
    ];
}
