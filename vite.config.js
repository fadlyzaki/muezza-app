import { defineConfig, loadEnv } from 'vite'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const PRELIVE_AUTH_BASE_URL = 'https://prelive-oauth2.quran.foundation';
const PRODUCTION_AUTH_BASE_URL = 'https://oauth2.quran.foundation';

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

// Middleware to mock the Vercel Serverless Function locally
const localTokenApiPlugin = () => ({
  name: 'local-token-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url === '/api/token' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            // Load variables from .env.local natively
            const env = loadEnv('', process.cwd(), '');
            const authBaseUrl = getLocalQuranAuthBaseUrl(env);
            const clientId = env.VITE_QURAN_CLIENT_ID;
            const clientSecret = env.QURAN_CLIENT_SECRET;
            
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
          if (req.url === '/api/token') {
            return req.url; // Prevent proxying to Vercel, let our local plugin handle it
          }
        }
      },
    },
  },
})
