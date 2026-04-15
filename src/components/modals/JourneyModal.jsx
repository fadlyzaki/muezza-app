import React from 'react';
import { X, Star, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { ErrorState } from '../common/ErrorState';

export function JourneyModal({ 
  result, 
  error, 
  isJourneying, 
  mode, 
  onClose, 
  onRetry 
}) {
  if (!result && !error && !isJourneying) return null;

  if (isJourneying) {
    return (
      <div className="absolute inset-0 bg-emerald-900/95 backdrop-blur-md z-[60] flex items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
            <div className="w-24 h-24 border-4 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin"></div>
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-300 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold animate-pulse text-emerald-50">
            {mode === 'tafsir' ? 'Loading live tafsir...' : 'Muezza is seeking knowledge...'}
          </h3>
          <div className="bg-emerald-800/50 border border-emerald-700 rounded-lg px-4 py-2 mt-4 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <p className="text-emerald-200 text-sm font-mono tracking-wide">
              {mode === 'tafsir' ? 'Fetching from Quran Foundation...' : "Preparing today's reflection..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
        <div className="flex justify-center mb-4 shrink-0">
          <div className={`p-4 rounded-full shadow-inner ${error ? 'bg-rose-100' : 'bg-amber-100'}`}>
            {error ? <X className="w-8 h-8 text-rose-500" /> : <Star className="w-8 h-8 text-amber-500 fill-amber-500" />}
          </div>
        </div>

        <h3 className="text-center text-2xl font-extrabold text-slate-800 mb-4 shrink-0">
          {error
            ? 'Refractive boundary hit'
            : mode === 'tafsir'
              ? 'Tafsir Insight'
              : 'Muezza returned!'}
        </h3>

        <div className="bg-[#F9F6F0] rounded-2xl p-6 mb-5 shadow-inner border border-slate-100 relative overflow-y-auto flex-1 custom-scrollbar">
          {error ? (
            <div className="py-4">
              <ErrorState 
                title="Insight Interrupted" 
                message={error} 
                onRetry={onRetry} 
                icon={Sparkles}
              />
            </div>
          ) : (
            <>
              {result.verse && (
                <div className="mb-4 text-center">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Grounded Verse</p>
                  <p className="text-slate-800 text-sm font-black leading-relaxed italic border-b border-slate-200 pb-4 mb-4">
                    &quot;{result.verse}&quot;
                  </p>
                  <p className="text-xs text-center text-emerald-600 font-bold uppercase tracking-widest mb-4">
                    {result.reference}
                  </p>
                  <div className="h-px w-full bg-slate-200 mb-4"></div>
                </div>
              )}
              <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                {result.tafsir || result}
              </p>
              {!error && result.source && (
                 <p className="text-[10px] font-bold text-slate-400 mt-4 not-italic uppercase tracking-widest text-center">{result.source}</p>
              )}
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 shrink-0 flex items-center justify-center space-x-2"
        >
          <span>{error ? 'Close' : mode === 'daily' ? 'Grounded' : 'Continue'}</span>
          {!error && (mode === 'daily' ? <ArrowRight className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />)}
        </button>
      </div>
    </div>
  );
}
