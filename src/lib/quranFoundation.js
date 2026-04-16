export function getQuranAuthBaseUrl() {
  const env = import.meta.env.VITE_QF_ENV || (import.meta.env.PROD ? 'production' : 'prelive');
  
  if (import.meta.env.VITE_QURAN_AUTH_BASE) {
    return import.meta.env.VITE_QURAN_AUTH_BASE;
  }

  // If using the older combined base, determine sub-service
  if (import.meta.env.VITE_QURAN_API_BASE?.includes('oauth2.quran.foundation')) {
    return import.meta.env.VITE_QURAN_API_BASE;
  }

  return env === 'prelive'
    ? 'https://prelive-oauth2.quran.foundation'
    : 'https://oauth2.quran.foundation';
}

export function getQuranUserApiBaseUrl() {
  const env = import.meta.env.VITE_QF_ENV || (import.meta.env.PROD ? 'production' : 'prelive');

  if (import.meta.env.VITE_QURAN_USER_API_BASE) {
    return import.meta.env.VITE_QURAN_USER_API_BASE;
  }

  if (import.meta.env.VITE_QURAN_API_BASE?.includes('oauth2.quran.foundation')) {
    return import.meta.env.VITE_QURAN_API_BASE.includes('prelive')
      ? 'https://apis-prelive.quran.foundation'
      : 'https://apis.quran.foundation';
  }

  return env === 'prelive'
    ? 'https://apis-prelive.quran.foundation'
    : 'https://apis.quran.foundation';
}
