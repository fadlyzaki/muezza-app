import React from 'react';
import { CloudOff, RefreshCw } from 'lucide-react';

export function ErrorState({ title, message, onRetry, icon: Icon = CloudOff }) {
  const iconElement = React.createElement(Icon, { className: 'w-8 h-8 text-rose-500' });

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 text-center animate-in fade-in zoom-in-95 duration-300 shadow-sm mx-4">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100 shadow-inner">
        {iconElement}
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed max-w-[240px] mx-auto font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg active:scale-95 group"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
