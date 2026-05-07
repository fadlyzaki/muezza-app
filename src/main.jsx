import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Callback from './auth/Callback.jsx'
import { PrivacyPolicy, TermsOfService } from './components/Legal.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

const path = window.location.pathname;

// eslint-disable-next-line react-refresh/only-export-components
const Router = () => {
  if (path === '/callback') return <Callback />;
  if (path === '/privacy') return <PrivacyPolicy />;
  if (path === '/terms') return <TermsOfService />;
  return <App />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Muezza service worker registration failed', error);
    });
  });
}
