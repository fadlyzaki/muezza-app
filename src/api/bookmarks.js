const API_BASE = `${import.meta.env.VITE_QURAN_API_BASE || 'https://apis.quran.foundation'}/auth/v1`;

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
    // Assuming data is an array or has a standard pagination structure
    // Depends on specific payload structure, defaulting to data mapping
    return data;
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
