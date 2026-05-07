const PRELIVE_AUTH_BASE_URL = 'https://prelive-oauth2.quran.foundation';
const PRODUCTION_AUTH_BASE_URL = 'https://oauth2.quran.foundation';
const PRELIVE_USER_API_BASE_URL = 'https://apis-prelive.quran.foundation';
const PRODUCTION_USER_API_BASE_URL = 'https://apis.quran.foundation';
const USER_API_AUTH_SCOPES = 'user bookmark collection streak activity_day reading_session goal note preference post';
const FULL_USER_AUTH_SCOPES = `openid offline_access ${USER_API_AUTH_SCOPES}`;
const PRODUCTION_USER_AUTH_SCOPES = USER_API_AUTH_SCOPES;
const PRODUCTION_SESSION_SCOPES = new Set(['openid', 'offline_access']);
const DEFAULT_AUTH_SCOPES = {
  prelive: FULL_USER_AUTH_SCOPES,
  production: PRODUCTION_USER_AUTH_SCOPES,
};

function inferQuranEnvironment() {
  if (import.meta.env.VITE_QF_ENV) {
    return import.meta.env.VITE_QF_ENV;
  }

  const configuredBase =
    import.meta.env.VITE_QURAN_AUTH_BASE ||
    import.meta.env.VITE_QURAN_USER_API_BASE ||
    import.meta.env.VITE_QURAN_API_BASE ||
    '';

  if (configuredBase.includes('prelive')) {
    return 'prelive';
  }

  return import.meta.env.PROD ? 'production' : 'prelive';
}

export function getQuranAuthBaseUrl() {
  const env = inferQuranEnvironment();
  
  if (import.meta.env.VITE_QURAN_AUTH_BASE) {
    return import.meta.env.VITE_QURAN_AUTH_BASE;
  }

  // If using the older combined base, determine sub-service
  if (import.meta.env.VITE_QURAN_API_BASE?.includes('oauth2.quran.foundation')) {
    return import.meta.env.VITE_QURAN_API_BASE;
  }

  return env === 'prelive'
    ? PRELIVE_AUTH_BASE_URL
    : PRODUCTION_AUTH_BASE_URL;
}

export function getQuranAuthScopes() {
  const env = inferQuranEnvironment();
  const configuredScopes = import.meta.env.VITE_QURAN_AUTH_SCOPES || DEFAULT_AUTH_SCOPES[env] || DEFAULT_AUTH_SCOPES.production;
  const scopes = configuredScopes.split(/\s+/).filter(Boolean);

  if (env !== 'production' || import.meta.env.VITE_QURAN_ENABLE_OIDC === 'true') {
    return [...new Set(scopes)].join(' ');
  }

  return [...new Set(scopes)]
    .filter((scope) => !PRODUCTION_SESSION_SCOPES.has(scope))
    .join(' ');
}

export function getQuranUserApiBaseUrl() {
  const env = inferQuranEnvironment();

  if (import.meta.env.VITE_QURAN_USER_API_BASE) {
    return import.meta.env.VITE_QURAN_USER_API_BASE;
  }

  if (import.meta.env.VITE_QURAN_API_BASE) {
    if (import.meta.env.VITE_QURAN_API_BASE.includes('apis')) {
      return import.meta.env.VITE_QURAN_API_BASE;
    }

    if (import.meta.env.VITE_QURAN_API_BASE.includes('oauth2.quran.foundation')) {
      return import.meta.env.VITE_QURAN_API_BASE.includes('prelive')
        ? PRELIVE_USER_API_BASE_URL
        : PRODUCTION_USER_API_BASE_URL;
    }
  }

  return env === 'prelive'
    ? PRELIVE_USER_API_BASE_URL
    : PRODUCTION_USER_API_BASE_URL;
}
