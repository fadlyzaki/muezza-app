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

export async function addStreak(accessToken) {
  const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
  if (!accessToken || !clientId) return false;
  
  try {
    // Determine user's timezone for accurate streak calculation (recommended by QF docs)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const res = await fetch(`${API_BASE}/activity-days`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': clientId,
        'x-timezone': timezone
      },
      // Per pre-live docs, QURAN type uses seconds and ranges to power streaks
      body: JSON.stringify({
        type: 'QURAN',
        seconds: 60, // Minimum activity to maintain/bump streak
        ranges: '1:1-1:1', // Placeholder activity range
        mushafId: 4 // Standard Uthmani Mushaf
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}
