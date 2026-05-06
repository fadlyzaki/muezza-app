import { exchangeAuthorizationCode } from './_quranFoundation.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, code_verifier, redirect_uri } = req.body;

  if (!code || !code_verifier || !redirect_uri) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const data = await exchangeAuthorizationCode({
      code,
      redirectUri: redirect_uri,
      codeVerifier: code_verifier,
      isConfidential: true // Muezza uses confidential client pattern
    });

    const { refresh_token: refreshToken, ...publicTokenData } = data;

    if (refreshToken) {
      const isLocalhost = String(req.headers.host || '').includes('localhost');
      const secureAttribute = isLocalhost ? '' : '; Secure';
      res.setHeader(
        'Set-Cookie',
        `qf_refresh_token=${encodeURIComponent(refreshToken)}; HttpOnly; SameSite=Lax; Path=/api; Max-Age=2592000${secureAttribute}`,
      );
    }

    return res.status(200).json(publicTokenData);
  } catch {
    // Ensuring we never leak secrets, codes, or tokens in logs or responses
    // and that we use the specific error message from the prompt.
    return res.status(500).json({ error: 'Failed to exchange authorization code for tokens' });
  }
}
