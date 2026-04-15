import { fetchQuranFoundationContent, resolveDefaultTafsirId } from './_quranFoundation.js';

function cleanTafsirText(text) {
  // Strip HTML
  let cleaned = text.replace(/<[^>]+>/g, ' ');
  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  // Truncate to keep it punchy (approx 600 chars)
  if (cleaned.length > 600) {
    cleaned = cleaned.slice(0, 597) + '...';
  }
  return cleaned;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { verseKey, translationText, surahName } = req.body || {};

  if (!verseKey) {
    return res.status(400).json({ error: 'Missing required verseKey.' });
  }

  try {
    const tafsirId = await resolveDefaultTafsirId();
    const data = await fetchQuranFoundationContent(`/tafsirs/${tafsirId}/by_ayah/${verseKey}`);
    const tafsirRecord = data?.tafsir;

    if (!tafsirRecord?.text) {
      return res.status(404).json({ error: 'No tafsir available for this verse yet.' });
    }

    return res.status(200).json({
      verse: translationText || `Verse ${verseKey}`,
      reference: surahName ? `Surah ${surahName} ${verseKey}` : verseKey,
      tafsir: cleanTafsirText(tafsirRecord.text),
      source: `Tafsir ${tafsirRecord.resource_name || 'Al-Jalalayn'}`,
      live: true,
    });
  } catch (error) {
    console.error('Failed to fetch tafsir:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch tafsir.' });
  }
}
