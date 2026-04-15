import { fetchQuranFoundationContent } from './_quranFoundation.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = await fetchQuranFoundationContent('/chapters');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch chapters.' });
  }
}
