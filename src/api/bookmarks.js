import { getQuranUserApiBaseUrl } from '../lib/quranFoundation';
import { SURAH_NAMES_SIMPLE } from '../constants/muezza_data';

const API_BASE = `${getQuranUserApiBaseUrl()}/auth/v1`;
const MUSHAF_ID = 4;

function normalizeBookmarksResponse(payload) {
  const bookmarks = Array.isArray(payload)
    ? payload
    : payload?.bookmarks || payload?.data || [];

  if (!Array.isArray(bookmarks)) return [];

  return bookmarks
    .map(normalizeBookmark)
    .filter((bookmark) => bookmark.verse_key)
    .sort(sortNewestFirst);
}

function normalizeBookmark(bookmark) {
  const rawSurahId =
    bookmark?.surah_id ||
    bookmark?.surahId ||
    bookmark?.chapter_id ||
    bookmark?.chapterId ||
    bookmark?.key;
  const rawAyahNumber =
    bookmark?.ayah_number ||
    bookmark?.ayahNumber ||
    bookmark?.verse_number ||
    bookmark?.verseNumber;
  const surahId = Number(rawSurahId);
  const ayahNumber = Number(rawAyahNumber);
  const verseKey =
    bookmark?.verse_key ||
    bookmark?.verseKey ||
    bookmark?.ayah_key ||
    (surahId && ayahNumber ? `${surahId}:${ayahNumber}` : null);
  const createdAt =
    bookmark?.createdAt ||
    bookmark?.created_at ||
    bookmark?.insertedAt ||
    bookmark?.inserted_at ||
    bookmark?.created ||
    bookmark?.dateAdded ||
    bookmark?.date_added ||
    null;

  return {
    ...bookmark,
    verse_key: verseKey,
    surah_id: surahId || bookmark?.surah_id,
    surah_name:
      bookmark?.surah_name ||
      bookmark?.surahName ||
      bookmark?.chapter_name ||
      bookmark?.chapterName ||
      SURAH_NAMES_SIMPLE[surahId] ||
      (surahId ? `Surah ${surahId}` : 'Saved Ayah'),
    ayah_number: ayahNumber || bookmark?.ayah_number,
    created_at: createdAt,
  };
}

function getBookmarkTimestamp(bookmark) {
  const value = bookmark?.created_at || bookmark?.createdAt || bookmark?.date_added || bookmark?.dateAdded;
  const time = value ? new Date(value).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function sortNewestFirst(a, b) {
  return getBookmarkTimestamp(b) - getBookmarkTimestamp(a);
}

export async function getBookmarks(accessToken) {
  const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
  if (!accessToken || !clientId) return [];
  
  try {
    const url = new URL(`${API_BASE}/bookmarks`);
    url.searchParams.set('type', 'ayah');
    url.searchParams.set('mushafId', String(MUSHAF_ID));
    url.searchParams.set('first', '20');

    const res = await fetch(url.toString(), {
      headers: {
        'x-auth-token': accessToken,
        'x-client-id': clientId
      }
    });
    if (res.status === 401 || res.status === 403) {
      window.dispatchEvent(new CustomEvent('qf_unauthorized'));
    }
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.message || data?.error || 'Failed to fetch bookmarks');
    }
    return normalizeBookmarksResponse(data);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export async function addBookmark(accessToken, verseKey) {
   const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
   if (!accessToken || !clientId || !verseKey) return false;
   
   try {
     // Quran.com-style bookmarks are stored in the __default__ collection
     const endpoint = `${API_BASE}/collections/__default__/bookmarks`;
     
     // Parse "1:5" into surah (key) and ayah (verseNumber)
     const [surahNum, ayahNum] = verseKey.split(':').map(Number);
     if (!surahNum || !ayahNum) return false;

     const res = await fetch(endpoint, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'x-auth-token': accessToken,
         'x-client-id': clientId
       },
       // Payload aligned with Quran Foundation 'ayah' item schema
       body: JSON.stringify({ 
         type: 'ayah',
         key: surahNum,
         verseNumber: ayahNum,
         mushaf: MUSHAF_ID
       })
     });
     if (res.status === 401 || res.status === 403) {
       window.dispatchEvent(new CustomEvent('qf_unauthorized'));
     }
     return res.ok;
   } catch (error) {
     console.error("Error adding bookmark:", error);
     return false;
   }
}
