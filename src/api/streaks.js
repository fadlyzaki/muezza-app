import { getQuranUserApiBaseUrl } from '../lib/quranFoundation';

const API_BASE = `${getQuranUserApiBaseUrl()}/auth/v1`;

export async function getStreaks(accessToken) {
  const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
  if (!accessToken || !clientId) return null;
  
  try {
    const res = await fetch(`${API_BASE}/streaks`, {
      headers: {
        'x-auth-token': accessToken,
        'x-client-id': clientId
      }
    });
    if (!res.ok) throw new Error('Failed to fetch streaks');
    return await res.json();
  } catch (error) {
    console.error("Error fetching streaks:", error);
    return null;
  }
}
