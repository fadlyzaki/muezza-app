const PRELIVE_AUTH_BASE_URL = 'https://prelive-oauth2.quran.foundation';
const PRODUCTION_AUTH_BASE_URL = 'https://oauth2.quran.foundation';
const PRELIVE_USER_API_BASE_URL = 'https://apis-prelive.quran.foundation';
const PRODUCTION_USER_API_BASE_URL = 'https://apis.quran.foundation';

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
