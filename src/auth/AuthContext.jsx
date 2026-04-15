import React, { useState } from 'react';
import { generateRandomString, generateCodeChallenge } from './pkce';
import { AuthContext } from './auth-context';
import { getQuranAuthBaseUrl } from '../lib/quranFoundation';

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('qf_access_token'));
  const [user, setUser] = useState(() => {
    const idToken = localStorage.getItem('qf_id_token');
    if (!idToken) return null;

    try {
      return JSON.parse(atob(idToken.split('.')[1]));
    } catch (error) {
      console.error('Failed to parse id_token', error);
      return null;
    }
  });
  const [isLoading] = useState(false);

  const login = async () => {
    const state = generateRandomString(32);
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
    
    // Derive redirect URI dynamically based on current origin for maximum flexibility
    const appUrl = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '');
    const redirectUri = `${appUrl}/callback`;

    // Store verifier for the callback route
    localStorage.setItem('pkce_code_verifier', codeVerifier);
    localStorage.setItem('oauth_state', state);

    const authUrl = new URL(`${getQuranAuthBaseUrl()}/oauth2/auth`);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('scope', 'openid user bookmark streak');

    window.location.href = authUrl.toString();
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('qf_access_token');
    localStorage.removeItem('qf_id_token');
    localStorage.removeItem('qf_refresh_token');
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, isLoading, login, logout, setAccessToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
