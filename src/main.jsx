import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Callback from './auth/Callback.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'

const path = window.location.pathname;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      {path === '/callback' ? <Callback /> : <App />}
    </AuthProvider>
  </StrictMode>,
)
