import { defineConfig, loadEnv } from 'vite'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const PRELIVE_AUTH_BASE_URL = 'https://prelive-oauth2.quran.foundation';
const PRODUCTION_AUTH_BASE_URL = 'https://oauth2.quran.foundation';
const PRELIVE_USER_API_BASE_URL = 'https://apis-prelive.quran.foundation';
const PRODUCTION_USER_API_BASE_URL = 'https://apis.quran.foundation';

function getLocalQuranAuthBaseUrl(env) {
  if (env.VITE_QURAN_AUTH_BASE) {
    return env.VITE_QURAN_AUTH_BASE;
  }

  if (env.VITE_QURAN_API_BASE?.includes('oauth2.quran.foundation')) {
    return env.VITE_QURAN_API_BASE;
  }

  const inferredEnv =
    env.VITE_QF_ENV ||
    ([
      env.VITE_QURAN_AUTH_BASE,
      env.VITE_QURAN_USER_API_BASE,
      env.VITE_QURAN_API_BASE,
    ].some((value) => value?.includes('prelive')) ? 'prelive' : 'production');

  return inferredEnv === 'prelive' ? PRELIVE_AUTH_BASE_URL : PRODUCTION_AUTH_BASE_URL;
}

function getLocalQuranUserApiBaseUrl(env) {
  if (env.VITE_QURAN_USER_API_BASE) {
    return env.VITE_QURAN_USER_API_BASE;
  }

  if (env.VITE_QURAN_API_BASE) {
    if (env.VITE_QURAN_API_BASE.includes('apis')) {
      return env.VITE_QURAN_API_BASE;
    }

    if (env.VITE_QURAN_API_BASE.includes('oauth2.quran.foundation')) {
      return env.VITE_QURAN_API_BASE.includes('prelive')
        ? PRELIVE_USER_API_BASE_URL
        : PRODUCTION_USER_API_BASE_URL;
    }
  }

  const inferredEnv =
    env.VITE_QF_ENV ||
    ([
      env.VITE_QURAN_AUTH_BASE,
      env.VITE_QURAN_USER_API_BASE,
      env.VITE_QURAN_API_BASE,
    ].some((value) => value?.includes('prelive')) ? 'prelive' : 'production');

  return inferredEnv === 'prelive' ? PRELIVE_USER_API_BASE_URL : PRODUCTION_USER_API_BASE_URL;
}

function getBearerToken(req) {
  const authorization = req.headers.authorization || '';
  const [scheme, token] = authorization.split(/\s+/);
  return scheme?.toLowerCase() === 'bearer' ? token : null;
}

function isAllowedQuranUserPath(pathname) {
  const allowedPaths = [
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

  return allowedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

// Middleware to mock the Vercel Serverless Function locally
const localTokenApiPlugin = () => ({
  name: 'local-token-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/token' && req.method === 'POST') {
        readRequestBody(req).then(async (body) => {
          try {
            const data = JSON.parse(body);
            // Load variables from .env.local natively
            const env = loadEnv('', process.cwd(), '');
            const authBaseUrl = getLocalQuranAuthBaseUrl(env);
            const clientId = env.VITE_QURAN_CLIENT_ID;
            const clientSecret = env.QF_CLIENT_SECRET || env.QURAN_CLIENT_SECRET;

            if (!clientId || !clientSecret) {
              throw new Error('Missing Quran Foundation client ID or server-side client secret.');
            }
            
            const authHeader = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`;
            
            const tokenResponse = await fetch(`${authBaseUrl}/oauth2/token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': authHeader,
              },
              body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: data.code,
                redirect_uri: data.redirect_uri,
                code_verifier: data.code_verifier,
              }),
            });
            const payload = await tokenResponse.json();
            
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = tokenResponse.status;
            res.end(JSON.stringify(payload));
          } catch (err) {
            console.error('Local API Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        }).catch((err) => {
          console.error('Local API Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        });
        return;
      }

      if (req.url?.startsWith('/api/qf-user')) {
        readRequestBody(req).then(async (body) => {
          try {
            const accessToken = getBearerToken(req);
            if (!accessToken) {
              res.statusCode = 401;
              res.end(JSON.stringify({ error: 'Missing Quran Foundation access token' }));
              return;
            }

            const requestUrl = new URL(req.url, 'http://localhost');
            const rawPath = requestUrl.searchParams.get('path');
            if (!rawPath) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing Quran Foundation path' }));
              return;
            }

            const upstreamPath = new URL(rawPath, 'https://qf.local');
            if (!isAllowedQuranUserPath(upstreamPath.pathname)) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Unsupported Quran Foundation path' }));
              return;
            }

            const env = loadEnv('', process.cwd(), '');
            const apiBaseUrl = getLocalQuranUserApiBaseUrl(env);
            const clientId = env.QF_CLIENT_ID || env.VITE_QURAN_CLIENT_ID;
            if (!clientId) {
              throw new Error('Missing Quran Foundation client ID.');
            }

            const tokenResponse = await fetch(`${apiBaseUrl}/auth/v1${upstreamPath.pathname}${upstreamPath.search}`, {
              method: req.method,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth-token': accessToken,
                'x-client-id': clientId,
                ...(req.headers['x-timezone'] ? { 'x-timezone': req.headers['x-timezone'] } : {}),
              },
              body: ['GET', 'HEAD'].includes(req.method) ? undefined : body,
            });
            const payload = await tokenResponse.text();

            res.setHeader('Content-Type', tokenResponse.headers.get('content-type') || 'application/json');
            res.statusCode = tokenResponse.status;
            res.end(payload);
          } catch (err) {
            console.error('Local API Error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        }).catch((err) => {
          console.error('Local API Error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        });
        return;
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localTokenApiPlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'https://muezza-app.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        bypass: (req) => {
          if (req.url === '/api/token' || req.url?.startsWith('/api/qf-user')) {
            return req.url; // Prevent proxying to Vercel, let our local plugin handle it
          }
        }
      },
    },
  },
})
