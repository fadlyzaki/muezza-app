import { qfUserRequest } from './quranUserRequest';
import { SURAH_NAMES_SIMPLE } from '../constants/muezza_data';

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
    translated_name: bookmark?.translated_name || bookmark?.translatedName || null,
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
  if (!accessToken) return [];
  
  try {
    const result = await qfUserRequest(accessToken, '/bookmarks', {
      searchParams: {
        type: 'ayah',
        mushafId: MUSHAF_ID,
        first: 20,
      },
    });
    if (!result.ok) {
      throw new Error(result.error || 'Failed to fetch bookmarks');
    }
    return normalizeBookmarksResponse(result.data);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export async function addBookmark(accessToken, verseKey) {
   if (!accessToken || !verseKey) return false;
   
   try {
     // Parse "1:5" into surah (key) and ayah (verseNumber)
     const [surahNum, ayahNum] = verseKey.split(':').map(Number);
     if (!surahNum || !ayahNum) return false;

     const result = await qfUserRequest(accessToken, '/collections/__default__/bookmarks', {
       method: 'POST',
       // Payload aligned with Quran Foundation 'ayah' item schema
       body: {
         type: 'ayah',
         key: surahNum,
         verseNumber: ayahNum,
         mushaf: MUSHAF_ID
       }
     });
     return result.ok;
   } catch (error) {
     console.error("Error adding bookmark:", error);
     return false;
   }
}
