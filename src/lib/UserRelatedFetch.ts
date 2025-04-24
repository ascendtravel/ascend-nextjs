const BASE_URL = process.env.WEBAPP_BFF_URL || 'https://webapp-bff.onrender';

export async function UserRelatedFetch(
    url: string,
    options: RequestInit,
    authParams: { token?: string; impersonationId?: string } = {}
) {
    const { headers = {}, ...rest } = options;
    const { token, impersonationId } = authParams;

    const fullUrl = `${BASE_URL}${url}`;
    console.log('body', {
        auth: token ? `Bearer ${token}` : undefined,
        impersonationId
    });

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
