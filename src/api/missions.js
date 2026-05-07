import { qfUserRequest } from './quranUserRequest';
import { createRangeFromVerseKey } from '../utils/muezza_utils';

const MUSHAF_ID = 4;

async function qfRequest(accessToken, pathname, options = {}) {
  if (!accessToken) return { ok: false, data: null, error: 'Missing Quran Foundation session.' };

  try {
    return await qfUserRequest(accessToken, pathname, options);
  } catch (error) {
    console.error('Quran Foundation mission sync failed:', error);
    return { ok: false, data: null, error: error.message };
  }
}

export function saveReadingSession(accessToken, verseKey) {
  const parsed = createRangeFromVerseKey(verseKey);
  const [chapterNumber, verseNumber] = String(verseKey || '').split(':').map(Number);
  if (!parsed || !chapterNumber || !verseNumber) return Promise.resolve({ ok: false });

  return qfRequest(accessToken, '/reading-sessions', {
    method: 'POST',
    body: {
      chapterNumber,
      verseNumber,
      mushafId: MUSHAF_ID,
    },
  });
}

export function creditActivityDay(accessToken, { verseKey, range, seconds = 90, date } = {}) {
  const resolvedRange = range || createRangeFromVerseKey(verseKey);
  if (!resolvedRange) return Promise.resolve({ ok: false });

  return qfRequest(accessToken, '/activity-days', {
    method: 'POST',
    body: {
      type: 'QURAN',
      seconds,
      ranges: [resolvedRange],
      mushafId: MUSHAF_ID,
      ...(date ? { date } : {}),
    },
  });
}

export function createMissionGoal(accessToken, plan) {
  if (!plan?.type) return Promise.resolve({ ok: false });

  return qfRequest(accessToken, '/goals', {
    method: 'POST',
    body: {
      type: plan.type,
      amount: plan.amount,
      duration: plan.duration,
      category: plan.category || 'QURAN',
    },
  });
}

export function saveMissionNote(accessToken, { body, verseKey, range, saveToQR = false }) {
  const resolvedRange = range || createRangeFromVerseKey(verseKey);
  const safeBody = String(body || '').trim();
  if (!safeBody || safeBody.length < 6) return Promise.resolve({ ok: false });

  return qfRequest(accessToken, '/notes', {
    method: 'POST',
    body: {
      body: safeBody,
      saveToQR,
      attachedEntity: resolvedRange
        ? {
            entityId: resolvedRange,
            entityType: 'reflection',
            entityMetadata: { ranges: [resolvedRange] },
          }
        : undefined,
    },
  });
}

export function fetchUserPreferences(accessToken) {
  return qfRequest(accessToken, '/preferences');
}

export function publishMissionReflection(accessToken, { body, verseKey, draft = false }) {
  const [chapterId, ayahNumber] = String(verseKey || '').split(':').map(Number);
  const safeBody = String(body || '').trim();
  if (!safeBody || safeBody.length < 6 || !chapterId || !ayahNumber) {
    return Promise.resolve({ ok: false });
  }

  return qfRequest(accessToken, '/posts', {
    method: 'POST',
    body: {
      post: {
        roomPostStatus: 1,
        body: safeBody,
        draft,
        references: [{ chapterId, from: ayahNumber, to: ayahNumber }],
        mentions: [],
        roomId: null,
        postAsAuthorId: null,
        publishedAt: new Date().toISOString(),
      },
    },
  });
}
