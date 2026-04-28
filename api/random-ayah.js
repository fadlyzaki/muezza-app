import { fetchQuranFoundationContent } from './_quranFoundation.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    chapter,
    page,
    juz,
    translationId = '20',
    reciterId = '2',
  } = req.query;

  const searchParams = {
    language: 'en',
    words: 'false',
    fields: 'text_uthmani,chapter_id,verse_number,page_number,juz_number',
    translations: translationId,
    audio: reciterId,
  };

  if (chapter) searchParams.chapter_number = chapter;
  if (page) searchParams.page_number = page;
  if (juz) searchParams.juz_number = juz;

  try {
    const data = await fetchQuranFoundationContent('/verses/random', { searchParams });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch random ayah:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch random ayah.' });
  }
}
