import React from 'react';
import { X, Star, Sparkles, ArrowRight, BookOpen, Moon } from 'lucide-react';
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

  const isReflection = mode === 'reflection';
  const isCounsel = mode === 'daily';

  if (isJourneying) {
    return (
      <div className={`absolute inset-0 ${isReflection ? 'bg-indigo-900/95' : 'bg-emerald-900/95'} backdrop-blur-md z-[60] flex items-center justify-center p-6 text-center animate-in fade-in duration-500`}>
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className={`absolute inset-0 ${isReflection ? 'bg-indigo-400/20' : 'bg-emerald-400/20'} blur-3xl rounded-full scale-150 animate-pulse`}></div>
            <div className={`w-24 h-24 border-4 ${isReflection ? 'border-indigo-400/20 border-t-indigo-400' : 'border-emerald-400/20 border-t-emerald-400'} rounded-full animate-spin`}></div>
            {isReflection ? (
              <Moon className="absolute inset-0 m-auto w-8 h-8 text-indigo-300 animate-pulse" />
            ) : (
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-emerald-300 animate-bounce" />
            )}
          </div>
          <h3 className={`text-2xl font-bold animate-pulse ${isReflection ? 'text-indigo-50' : 'text-emerald-50'}`}>
            {mode === 'tafsir' 
              ? 'Loading live tafsir...' 
              : isReflection 
                ? 'Muezza waits patiently...'
                : 'Muezza is bursting with energy!'}
          </h3>
          <div className={`${isReflection ? 'bg-indigo-800/50 border-indigo-700' : 'bg-emerald-800/50 border-emerald-700'} border rounded-lg px-4 py-2 mt-4 flex items-center space-x-2`}>
            {isReflection ? (
               <Moon className="w-4 h-4 text-indigo-400" />
            ) : (
               <Sparkles className="w-4 h-4 text-emerald-400" />
            )}
            <p className={`${isReflection ? 'text-indigo-200' : 'text-emerald-200'} text-sm font-mono tracking-wide`}>
              {mode === 'tafsir' 
                ? 'Fetching from Quran Foundation...' 
                : isReflection
                  ? "Gathering spiritual dust..."
                  : "Fetching your divine reward..."}
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
          <div className={`p-4 rounded-full shadow-inner ${error ? 'bg-rose-100' : isReflection ? 'bg-indigo-50' : 'bg-amber-100'}`}>
            {error ? (
              <X className="w-8 h-8 text-rose-500" />
            ) : isReflection ? (
              <Moon className="w-8 h-8 text-indigo-500 fill-indigo-500/20" />
            ) : (
              <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
            )}
          </div>
        </div>

        <h3 className="text-center text-2xl font-extrabold text-slate-800 mb-4 shrink-0">
          {error
            ? 'Refractive boundary hit'
            : mode === 'tafsir'
              ? 'Tafsir Insight'
              : isReflection
                ? 'A Gentle Reminder'
                : "Muezza's Counsel!"}
        </h3>

        <div className={`${isReflection ? 'bg-[#F4F6FB] border-indigo-50' : 'bg-[#F9F6F0] border-slate-100'} rounded-2xl p-6 mb-5 shadow-inner border relative overflow-y-auto flex-1 custom-scrollbar`}>
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
                  <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isReflection ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {isReflection ? 'Wisdom for Today' : 'Grounded Verse'}
                  </p>
                  <p className="text-slate-800 text-sm font-black leading-relaxed italic border-b border-slate-200 pb-4 mb-4">
                    &quot;{result.verse}&quot;
                  </p>
                  <p className={`text-xs text-center font-bold uppercase tracking-widest mb-4 ${isReflection ? 'text-indigo-600' : 'text-emerald-600'}`}>
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
          className={`w-full text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 shrink-0 flex items-center justify-center space-x-2 ${
            isReflection ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-slate-900 hover:bg-slate-800'
          }`}
        >
          <span>{error ? 'Close' : isReflection ? 'Begin Again' : isCounsel ? 'Grounded' : 'Continue'}</span>
          {!error && (isCounsel || isReflection ? <ArrowRight className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />)}
        </button>
      </div>
    </div>
  );
}
