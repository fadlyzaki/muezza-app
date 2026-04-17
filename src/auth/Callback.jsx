import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { decodeJwtPayload } from './jwt';

const CALLBACK_CODE_PREFIX = 'qf_callback_code_status:';
const FALLBACK_USER = {
  first_name: 'Quran.com',
  email: null,
  source: 'oauth_access_token',
};

export default function Callback() {
  const { setAccessToken, setUser } = useAuth();
  const [error, setError] = useState(null);
  const hasProcessedCallbackRef = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      if (hasProcessedCallbackRef.current) {
        return;
      }

      hasProcessedCallbackRef.current = true;

      const urlParams = new URLSearchParams(window.location.search);
      const oauthError = urlParams.get('error');
      const oauthErrorDescription = urlParams.get('error_description');
      if (oauthError) {
        setError(oauthErrorDescription || oauthError);
        window.history.replaceState(null, '', '/callback');
        return;
      }

      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const callbackStatusKey = code ? `${CALLBACK_CODE_PREFIX}${code}` : null;
      
      const savedState = localStorage.getItem('oauth_state');
      const codeVerifier = localStorage.getItem('pkce_code_verifier');
      
      if (!code || state !== savedState) {
        setError('Invalid state or missing auth code parameter.');
        return;
      }

      if (!codeVerifier) {
        setError('Missing sign-in verifier. Please return to the app and sign in again.');
        return;
      }

      if (callbackStatusKey && sessionStorage.getItem(callbackStatusKey)) {
        setError('This sign-in link was already used. Please return to the app and sign in again.');
        return;
      }

      if (callbackStatusKey) {
        sessionStorage.setItem(callbackStatusKey, 'processing');
      }
      window.history.replaceState(null, '', '/callback');

      try {
        const res = await fetch('/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            // Must exactly match the redirect_uri sent in the first leg of the OAuth flow
            redirect_uri: `${(import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '')}/callback`
          })
        });

        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error_description || data.error || 'Token exchange failed. Please try again.');
        }
        if (!data.access_token) throw new Error('Token exchange did not return an access token.');

        let userPayload = FALLBACK_USER;
        if (data.id_token) {
          userPayload = decodeJwtPayload(data.id_token);
          
          // Verify nonce if it was stored
          const savedNonce = localStorage.getItem('oauth_nonce');
          if (savedNonce && userPayload.nonce !== savedNonce) {
            throw new Error('Identity verification failed (nonce mismatch).');
          }
        }

        localStorage.setItem('qf_access_token', data.access_token);
        if (data.id_token) localStorage.setItem('qf_id_token', data.id_token);
        localStorage.setItem('qf_user', JSON.stringify(userPayload));
        if (data.refresh_token) {
           localStorage.setItem('qf_refresh_token', data.refresh_token);
        }
        
        setAccessToken(data.access_token);
        setUser(userPayload);
        
        // Clean up
        localStorage.removeItem('oauth_state');
        localStorage.removeItem('oauth_nonce');
        localStorage.removeItem('pkce_code_verifier');
        
        // Redirect home and strip query string
        window.location.replace('/');
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    processCallback();
  }, [setAccessToken, setUser]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#E5E0D8] flex items-center justify-center p-6 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Failed</h2>
          <p className="text-slate-600 mb-6 text-sm">{error}</p>
          <a href="/" className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl transition-colors w-full">Return to App</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E0D8] flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium text-lg">Syncing with Quran.com...</p>
        <p className="text-slate-400 text-sm mt-2">Almost there buddy</p>
      </div>
    </div>
  );
}
