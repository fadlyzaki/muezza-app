import { getQuranUserApiBaseUrl } from '../lib/quranFoundation';

const API_BASE = `${getQuranUserApiBaseUrl()}/auth/v1`;

function normalizeBookmarksResponse(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.bookmarks)) return payload.bookmarks;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export async function getBookmarks(accessToken) {
  const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
  if (!accessToken || !clientId) return [];
  
  try {
    const res = await fetch(`${API_BASE}/bookmarks`, {
      headers: {
        'x-auth-token': accessToken,
        'x-client-id': clientId
      }
    });
    if (!res.ok) throw new Error('Failed to fetch bookmarks');
    const data = await res.json();
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
         verseNumber: ayahNum
       })
     });
     return res.ok;
   } catch (error) {
     console.error("Error adding bookmark:", error);
     return false;
   }
}
