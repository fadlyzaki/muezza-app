let cachedToken = null;
let cachedTokenExpiry = 0;
let cachedTafsirId = null;

function inferEnvironment(authBase) {
  return authBase.includes('prelive') ? 'prelive' : 'production';
}

export function getQuranFoundationConfig() {
  const authBaseUrl =
    process.env.QURAN_AUTH_BASE ||
    process.env.VITE_QURAN_AUTH_BASE ||
    process.env.VITE_QURAN_API_BASE ||
    'https://oauth2.quran.foundation';
  const envName = process.env.QF_ENV || inferEnvironment(authBaseUrl);
  const apiBaseUrl =
    process.env.QURAN_CONTENT_API_BASE ||
    process.env.QURAN_USER_API_BASE ||
    process.env.VITE_QURAN_USER_API_BASE ||
    (envName === 'prelive'
      ? 'https://apis-prelive.quran.foundation'
      : 'https://apis.quran.foundation');
  const clientId = process.env.QF_CLIENT_ID || process.env.VITE_QURAN_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET || process.env.QURAN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing Quran Foundation credentials for server-side API access.');
  }

  return { authBaseUrl, apiBaseUrl, clientId, clientSecret };
}

async function fetchAccessToken() {
  const { authBaseUrl, clientId, clientSecret } = getQuranFoundationConfig();
  const now = Date.now();

  if (cachedToken && cachedTokenExpiry > now + 30_000) {
    return cachedToken;
  }

  const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;

  const tokenResponse = await fetch(`${authBaseUrl}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authHeader,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'content',
    }),
  });

  const payload = await tokenResponse.json();

  if (!tokenResponse.ok) {
    throw new Error(payload?.error_description || payload?.error || 'Failed to fetch content token.');
  }

  cachedToken = payload.access_token;
  cachedTokenExpiry = now + (payload.expires_in || 300) * 1000;
  return cachedToken;
}

export async function fetchQuranFoundationContent(pathname, options = {}) {
  const { apiBaseUrl, clientId } = getQuranFoundationConfig();
  const search = options.searchParams
    ? `?${new URLSearchParams(options.searchParams).toString()}`
    : '';
  const url = `${apiBaseUrl}/content/api/v4${pathname}${search}`;

  const attempt = async (token) =>
    fetch(url, {
      method: options.method || 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token,
        'x-client-id': clientId,
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

  let token = await fetchAccessToken();
  let response = await attempt(token);

  if (response.status === 401) {
    cachedToken = null;
    cachedTokenExpiry = 0;
    token = await fetchAccessToken();
    response = await attempt(token);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || data?.error || 'Quran Foundation request failed.');
  }

  return data;
}

export async function resolveDefaultTafsirId() {
  if (cachedTafsirId) {
    return cachedTafsirId;
  }

  const configuredId = Number(process.env.QURAN_TAFSIR_ID);
  if (configuredId) {
    cachedTafsirId = configuredId;
    return cachedTafsirId;
  }

  const data = await fetchQuranFoundationContent('/resources/tafsirs', {
    searchParams: { language: 'en' },
  });

  const tafsir =
    data?.tafsirs?.find((item) => item.slug?.includes('ibn-kathir')) ||
    data?.tafsirs?.find((item) => item.name?.toLowerCase().includes('ibn kathir')) ||
    data?.tafsirs?.[0];

  cachedTafsirId = tafsir?.id || 169;
  return cachedTafsirId;
}
