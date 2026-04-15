import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateRandomString, generateCodeChallenge } from './pkce';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from local storage on mount
  useEffect(() => {
    const token = localStorage.getItem('qf_access_token');
    const idToken = localStorage.getItem('qf_id_token');
    
    if (token && idToken) {
      setAccessToken(token);
      try {
        const payload = JSON.parse(atob(idToken.split('.')[1]));
        setUser(payload);
      } catch (e) {
        console.error("Failed to parse id_token", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async () => {
    const state = generateRandomString(32);
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    const clientId = import.meta.env.VITE_QURAN_CLIENT_ID;
    const redirectUri = `${import.meta.env.VITE_APP_URL}/callback`;

    // Store verifier for the callback route
    localStorage.setItem('pkce_code_verifier', codeVerifier);
    localStorage.setItem('oauth_state', state);

    const apiBase = import.meta.env.VITE_QURAN_API_BASE || 'https://apis.quran.foundation';
    const authUrl = new URL(`${apiBase}/oauth2/auth`);
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

export const useAuth = () => useContext(AuthContext);
