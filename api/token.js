import { getQuranFoundationConfig } from './_quranFoundation.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, code_verifier, redirect_uri } = req.body;

  if (!code || !code_verifier || !redirect_uri) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const { authBaseUrl, clientId, clientSecret } = getQuranFoundationConfig();
    const tokenResponse = await fetch(`${authBaseUrl}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        code_verifier,
      }),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('OAuth Token Error Response:', data);
      return res.status(tokenResponse.status).json(data);
    }

    // In a prod app, refresh_token should be set as httpOnly cookie.
    // For this MVP, we return it to the client to manage in localStorage.
    return res.status(200).json(data);
  } catch (error) {
    console.error('Oauth API Request Failed:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
