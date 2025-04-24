const BASE_URL = process.env.WEBAPP_BFF_URL || 'https://webapp-bff.onrender';

export async function UserRelatedFetch(
    url: string,
    options: RequestInit,
    authParams: { token?: string; impersonationId?: string } = {}
) {
    const { headers = {}, ...rest } = options;
    const { token, impersonationId } = authParams;

    const fullUrl = `${BASE_URL}${url}`;

    const requestHeaders = {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.PICKS_BACKEND_API_KEY!,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(impersonationId ? { 'login-as': impersonationId } : {}),
        ...headers
    };

    return fetch(fullUrl, {
        ...rest,
        headers: requestHeaders
    });
}
