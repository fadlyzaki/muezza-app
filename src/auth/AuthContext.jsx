import React, { useState } from 'react';
import { generateRandomString, generateCodeChallenge } from './pkce';
import { AuthContext } from './auth-context';
import { getQuranAuthBaseUrl, getQuranAuthScopes } from '../lib/quranFoundation';
import { decodeJwtPayload } from './jwt';

const FALLBACK_USER = {
  first_name: 'Quran.com',
  email: null,
  source: 'oauth_access_token',
};

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('qf_access_token'));
  const [user, setUser] = useState(() => {
    const idToken = localStorage.getItem('qf_id_token');
    if (!idToken) {
      if (!localStorage.getItem('qf_access_token')) return null;

      try {
        return JSON.parse(localStorage.getItem('qf_user')) || FALLBACK_USER;
      } catch {
        return FALLBACK_USER;
      }
    }

    try {
      return decodeJwtPayload(idToken);
    } catch (error) {
      console.error('Failed to parse id_token', error);
      return null;
    }
  });
  const [isLoading] = useState(false);

  const login = async () => {
    const state = generateRandomString(32);
    const scopes = getQuranAuthScopes();
    const isOpenIdConnect = scopes.split(/\s+/).includes('openid');
    const nonce = isOpenIdConnect ? generateRandomString(32) : null;
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
    
    // Derive redirect URI dynamically based on current origin for maximum flexibility
    const appUrl = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '');
    const redirectUri = `${appUrl}/callback`;

    // Store parameters for the callback route
    localStorage.setItem('pkce_code_verifier', codeVerifier);
    localStorage.setItem('oauth_state', state);
    if (nonce) {
      localStorage.setItem('oauth_nonce', nonce);
    } else {
      localStorage.removeItem('oauth_nonce');
    }

    const authUrl = new URL(`${getQuranAuthBaseUrl()}/oauth2/auth`);
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('state', state);
    if (nonce) authUrl.searchParams.append('nonce', nonce);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('scope', scopes);

    window.location.href = authUrl.toString();
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('qf_access_token');
    localStorage.removeItem('qf_id_token');
    localStorage.removeItem('qf_refresh_token');
    localStorage.removeItem('qf_user');
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, isLoading, login, logout, setAccessToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
