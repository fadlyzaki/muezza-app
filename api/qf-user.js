import { getQuranFoundationConfig } from './_quranFoundation.js';

const ALLOWED_PATHS = [
  '/activity-days',
  '/bookmarks',
  '/collections',
  '/goals',
  '/notes',
  '/posts',
  '/preferences',
  '/reading-sessions',
  '/streaks',
  '/users/profile',
];

function getBearerToken(req) {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(/\s+/);
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

function isAllowedPath(pathname) {
  return ALLOWED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function getBody(req) {
  if (req.method === 'GET' || req.method === 'HEAD') return undefined;
  if (!req.body) return undefined;
  return typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
}

export default async function handler(req, res) {
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const accessToken = getBearerToken(req);
  if (!accessToken) {
    return res.status(401).json({ error: 'Missing Quran Foundation access token' });
  }

  const rawPath = Array.isArray(req.query.path) ? req.query.path[0] : req.query.path;
  if (!rawPath) {
    return res.status(400).json({ error: 'Missing Quran Foundation path' });
  }

  const upstreamPath = new URL(rawPath, 'https://qf.local');
  if (!isAllowedPath(upstreamPath.pathname)) {
    return res.status(400).json({ error: 'Unsupported Quran Foundation path' });
  }

  try {
    const { apiBaseUrl, clientId } = getQuranFoundationConfig();
    const upstreamUrl = `${apiBaseUrl}/auth/v1${upstreamPath.pathname}${upstreamPath.search}`;

    const upstreamResponse = await fetch(upstreamUrl, {
      method: req.method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': clientId,
        ...(req.headers['x-timezone'] ? { 'x-timezone': req.headers['x-timezone'] } : {}),
      },
      body: getBody(req),
    });

    const payload = await upstreamResponse.text();
    res.status(upstreamResponse.status);
    res.setHeader('Content-Type', upstreamResponse.headers.get('content-type') || 'application/json');
    return res.send(payload);
  } catch {
    return res.status(500).json({ error: 'Quran Foundation User API request failed' });
  }
}
