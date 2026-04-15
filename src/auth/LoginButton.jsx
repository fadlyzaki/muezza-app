import React from 'react';
import { useAuth } from './useAuth';
import { LogIn, LogOut } from 'lucide-react';

export default function LoginButton() {
  const { user, login, logout } = useAuth();

  if (user) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-slate-500 font-medium">Logged in</p>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-lg"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={login}
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-xl transition-all shadow-sm hover:shadow-md"
    >
      <LogIn className="w-4 h-4" />
      Sync with Quran.com
    </button>
  );
}
