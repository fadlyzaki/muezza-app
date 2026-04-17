import { getQuranUserApiBaseUrl } from '../lib/quranFoundation';

const API_BASE = `${getQuranUserApiBaseUrl()}/auth/v1`;

function normalizeUserProfile(profile) {
  if (!profile) return null;

  return {
    id: profile.id,
    username: profile.username,
    first_name: profile.firstName || profile.first_name || profile.username,
    last_name: profile.lastName || profile.last_name || '',
    email: profile.email || null,
    avatar_urls: profile.avatarUrls || profile.avatar_urls || null,
    source: 'quran_foundation_profile',
  };
}

export async function getUserProfile(accessToken) {
  const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
  if (!accessToken || !clientId) return null;

  try {
    const url = new URL(`${API_BASE}/users/profile`);
    url.searchParams.set('qdc', 'true');

    const res = await fetch(url.toString(), {
      headers: {
        'x-auth-token': accessToken,
        'x-client-id': clientId,
      },
    });

    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('qf_unauthorized'));
    }

    if (!res.ok) return null;

    const data = await res.json();
    return normalizeUserProfile(data);
  } catch {
    return null;
  }
}
