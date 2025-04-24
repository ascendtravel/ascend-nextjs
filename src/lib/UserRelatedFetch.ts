type UserFetchOptions = RequestInit & {
    token?: string;
    impersonationId?: string;
};

const BASE_URL = process.env.WEBAPP_BFF_URL || 'https://webapp-bff.onrender';

export async function UserRelatedFetch(url: string, options: UserFetchOptions = {}) {
    const { token, impersonationId = '818f0cbf-0f7b-4de3-93da-2343844b2caa', headers = {}, ...rest } = options;

    const fullUrl = `${BASE_URL}${url}`;

    return fetch(fullUrl, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(impersonationId ? { 'login-as': impersonationId } : {}),
            ...headers
        }
    });
}
