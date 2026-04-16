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
   if (!accessToken || !clientId) return false;
   
   try {
     const res = await fetch(`${API_BASE}/bookmarks`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'x-auth-token': accessToken,
         'x-client-id': clientId
       },
       // Adjust payload per specific Quran.com API signature
       body: JSON.stringify({ verse_key: verseKey })
     });
     return res.ok;
   } catch {
     return false;
   }
}
