import { getQuranUserApiBaseUrl } from '../lib/quranFoundation';

const API_BASE = `${getQuranUserApiBaseUrl()}/auth/v1`;
const MUSHAF_ID = 4;

function normalizeBookmarksResponse(payload) {
  const bookmarks = Array.isArray(payload)
    ? payload
    : payload?.bookmarks || payload?.data || [];

  if (!Array.isArray(bookmarks)) return [];

  return bookmarks
    .map(normalizeBookmark)
    .filter((bookmark) => bookmark.verse_key);
}

function normalizeBookmark(bookmark) {
  const surahId = Number(
    bookmark?.surah_id ||
    bookmark?.surahId ||
    bookmark?.chapter_id ||
    bookmark?.chapterId ||
    bookmark?.key,
  );
  const ayahNumber = Number(
    bookmark?.ayah_number ||
    bookmark?.ayahNumber ||
    bookmark?.verse_number ||
    bookmark?.verseNumber,
  );
  const verseKey =
    bookmark?.verse_key ||
    bookmark?.verseKey ||
    bookmark?.ayah_key ||
    (surahId && ayahNumber ? `${surahId}:${ayahNumber}` : null);

  return {
    ...bookmark,
    verse_key: verseKey,
    surah_id: surahId || bookmark?.surah_id,
    surah_name:
      bookmark?.surah_name ||
      bookmark?.surahName ||
      bookmark?.chapter_name ||
      bookmark?.chapterName ||
      (surahId ? `Surah ${surahId}` : 'Saved Ayah'),
  };
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
