let cachedToken = null;
let cachedTokenExpiry = 0;
let cachedTafsirId = null;

function inferEnvironment(authBase) {
  return authBase.includes('prelive') ? 'prelive' : 'production';
}

export function getQuranFoundationConfig() {
  const env = process.env.QF_ENV || process.env.VITE_QF_ENV || 'production';
  const isPreLive = env === 'prelive';

  const authBaseUrl =
    process.env.QF_AUTH_BASE ||
    process.env.VITE_QURAN_AUTH_BASE ||
    (isPreLive
      ? 'https://prelive-oauth2.quran.foundation'
      : 'https://oauth2.quran.foundation');

  const apiBaseUrl =
    process.env.QF_USER_API_BASE ||
    process.env.VITE_QURAN_USER_API_BASE ||
    (isPreLive
      ? 'https://apis-prelive.quran.foundation'
      : 'https://apis.quran.foundation');

  // Client ID can be shared between frontend/backend
  const clientId = process.env.QF_CLIENT_ID || process.env.VITE_QURAN_CLIENT_ID;
  
  // Client Secret MUST stay server-side
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

/**
 * Implement Authorization Code token exchange for Quran Foundation OAuth2.
 * Strictly follows the technical requirement prompt for Muezza.
 */
export async function exchangeAuthorizationCode({ code, redirectUri, codeVerifier, isConfidential = true }) {
  const { authBaseUrl, clientId, clientSecret } = getQuranFoundationConfig();
  
  if (isConfidential && !clientSecret) {
    throw new Error('Failed to exchange authorization code for tokens');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);
  params.append('code_verifier', codeVerifier);

  // For public clients, the client_id is included in the body
  if (!isConfidential) {
    params.append('client_id', clientId);
  }

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  // For confidential server clients, authenticate the client on the server
  if (isConfidential) {
    headers['Authorization'] = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
  }

  try {
    const response = await fetch(`${authBaseUrl}/oauth2/token`, {
      method: 'POST',
      headers,
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      // As per prompt: On failure, throw a clear error: "Failed to exchange authorization code for tokens"
      throw new Error('Failed to exchange authorization code for tokens');
    }

    // Precise output shape as required by the prompt
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      id_token: data.id_token,
      expires_in: data.expires_in,
      scope: data.scope,
      token_type: data.token_type,
    };
  } catch (error) {
    // Enforce the strict error message requirement
    if (error.message !== 'Failed to exchange authorization code for tokens') {
       throw new Error('Failed to exchange authorization code for tokens');
    }
    throw error;
  }
}
