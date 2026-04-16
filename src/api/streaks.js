import { getQuranUserApiBaseUrl } from '../lib/quranFoundation';

const API_BASE = `${getQuranUserApiBaseUrl()}/auth/v1`;
const MUSHAF_ID = 4;

function normalizeStreakDays(payload) {
  const streaks = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.streaks)
      ? payload.streaks
      : [];

  if (Number.isFinite(payload?.streak)) {
    return payload.streak;
  }

  const activeStreak = streaks.find((streak) => streak?.status === 'ACTIVE');
  const latestStreak = activeStreak || streaks[0];
  return Number.isFinite(latestStreak?.days) ? latestStreak.days : null;
}

function getUserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export async function getStreaks(accessToken) {
  const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
  if (!accessToken || !clientId) return null;
  
  try {
    const url = new URL(`${API_BASE}/streaks`);
    url.searchParams.set('type', 'QURAN');
    url.searchParams.set('first', '20');

    const res = await fetch(url.toString(), {
      headers: {
        'x-auth-token': accessToken,
        'x-client-id': clientId,
        'x-timezone': getUserTimezone()
      }
    });
    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('qf_unauthorized'));
    }
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Failed to fetch streaks');
    }
    return normalizeStreakDays(data);
  } catch (error) {
    console.error("Error fetching streaks:", error);
    return null;
  }
}

export async function addStreak(accessToken) {
  const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
  if (!accessToken || !clientId) return false;
  
  try {
    const res = await fetch(`${API_BASE}/activity-days`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': clientId,
        'x-timezone': getUserTimezone()
      },
      // Per pre-live docs, QURAN type uses seconds and ranges to power streaks
      body: JSON.stringify({
        type: 'QURAN',
        seconds: 60, // Minimum activity to maintain/bump streak
        ranges: ['1:1-1:1'], // Placeholder activity range
        mushafId: MUSHAF_ID // Standard Uthmani Mushaf
      })
    });
    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('qf_unauthorized'));
    }
    return res.ok;
  } catch {
    return false;
  }
}
