import React, { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export default function Callback() {
  const { setAccessToken, setUser } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      const savedState = localStorage.getItem('oauth_state');
      const codeVerifier = localStorage.getItem('pkce_code_verifier');
      
      if (!code || state !== savedState) {
        setError('Invalid state or missing auth code parameter.');
        return;
      }

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
        
        if (!res.ok) throw new Error(data.error || 'Token exchange failed. Please try again.');

        localStorage.setItem('qf_access_token', data.access_token);
        if (data.id_token) {
          localStorage.setItem('qf_id_token', data.id_token);
          const payload = JSON.parse(atob(data.id_token.split('.')[1]));
          setUser(payload);
        }
        if (data.refresh_token) {
           localStorage.setItem('qf_refresh_token', data.refresh_token);
        }
        
        setAccessToken(data.access_token);
        
        // Clean up
        localStorage.removeItem('oauth_state');
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
