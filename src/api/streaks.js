import { qfUserRequest } from './quranUserRequest';

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

export async function getStreaks(accessToken) {
  if (!accessToken) return null;
  
  try {
    const result = await qfUserRequest(accessToken, '/streaks', {
      searchParams: {
        type: 'QURAN',
        first: 20,
      },
    });
    if (!result.ok) {
      throw new Error(result.error || 'Failed to fetch streaks');
    }
    return normalizeStreakDays(result.data);
  } catch (error) {
    console.error("Error fetching streaks:", error);
    return null;
  }
}

export async function addStreak(accessToken) {
  if (!accessToken) return false;
  
  try {
    const result = await qfUserRequest(accessToken, '/activity-days', {
      method: 'POST',
      // Per pre-live docs, QURAN type uses seconds and ranges to power streaks
      body: {
        type: 'QURAN',
        seconds: 60, // Minimum activity to maintain/bump streak
        ranges: ['1:1-1:1'], // Placeholder activity range
        mushafId: MUSHAF_ID // Standard Uthmani Mushaf
      }
    });
    return result.ok;
  } catch {
    return false;
  }
}
