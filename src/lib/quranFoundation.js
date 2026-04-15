export function getQuranAuthBaseUrl() {
  if (import.meta.env.VITE_QURAN_AUTH_BASE) {
    return import.meta.env.VITE_QURAN_AUTH_BASE;
  }

  if (import.meta.env.VITE_QURAN_API_BASE?.includes('oauth2.quran.foundation')) {
    return import.meta.env.VITE_QURAN_API_BASE;
  }

  if (import.meta.env.VITE_QF_ENV === 'prelive') {
    return 'https://prelive-oauth2.quran.foundation';
  }

  return 'https://oauth2.quran.foundation';
}

export function getQuranUserApiBaseUrl() {
  if (import.meta.env.VITE_QURAN_USER_API_BASE) {
    return import.meta.env.VITE_QURAN_USER_API_BASE;
  }

  if (import.meta.env.VITE_QURAN_API_BASE?.includes('oauth2.quran.foundation')) {
    return import.meta.env.VITE_QURAN_API_BASE.includes('prelive')
      ? 'https://apis-prelive.quran.foundation'
      : 'https://apis.quran.foundation';
  }

  if (import.meta.env.VITE_QURAN_API_BASE) {
    return import.meta.env.VITE_QURAN_API_BASE;
  }

  if (import.meta.env.VITE_QF_ENV === 'prelive') {
    return 'https://apis-prelive.quran.foundation';
  }

  return 'https://apis.quran.foundation';
}
