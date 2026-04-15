import { fetchQuranFoundationContent } from './_quranFoundation.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    chapter,
    page = '1',
    perPage = '20',
    translationId = '20',
    reciterId = '2',
  } = req.query;

  if (!chapter) {
    return res.status(400).json({ error: 'Missing required chapter parameter.' });
  }

  try {
    const data = await fetchQuranFoundationContent(`/verses/by_chapter/${chapter}`, {
      searchParams: {
        language: 'en',
        words: 'false',
        fields: 'text_uthmani',
        page,
        per_page: perPage,
        translations: translationId,
        audio: reciterId,
      },
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch verses:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch verses.' });
  }
}
