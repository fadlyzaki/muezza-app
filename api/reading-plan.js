import { fetchQuranFoundationContent } from './_quranFoundation.js';

const ALLOWED_MODES = new Set(['page', 'juz', 'range']);

function resolvePath(mode, value) {
  if (mode === 'page') return `/verses/by_page/${value}`;
  if (mode === 'juz') return `/verses/by_juz/${value}`;
  if (mode === 'range') return `/verses/by_range/${encodeURIComponent(value)}`;
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const {
    mode = 'page',
    value = '1',
    page = '1',
    perPage = '20',
    translationId = '20',
    reciterId = '2',
  } = req.query;

  if (!ALLOWED_MODES.has(mode)) {
    return res.status(400).json({ error: 'Unsupported reading-plan mode.' });
  }

  const pathname = resolvePath(mode, value);
  const searchParams = {
    language: 'en',
    words: 'false',
    fields: 'text_uthmani,chapter_id,verse_number,page_number,juz_number',
    page,
    per_page: perPage,
    translations: translationId,
    audio: reciterId,
  };

  try {
    const data = await fetchQuranFoundationContent(pathname, { searchParams });
    return res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch reading plan:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch reading plan.' });
  }
}
