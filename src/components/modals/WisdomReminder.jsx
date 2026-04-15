import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export function WisdomReminder({ wisdom, onRenew }) {
  if (!wisdom) return null;

  return (
    <div className="absolute inset-0 bg-amber-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-6">
      <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-20 duration-700 delay-300">
         <div className="text-center mb-8">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-amber-100 shadow-inner">
              <Sparkles className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter mb-2">Morning Reflection</h3>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] bg-amber-50 inline-block px-3 py-1 rounded-full">Peace be upon you</p>
         </div>

         <div className="bg-[#FAF8F4] p-8 rounded-3xl border border-amber-100 shadow-inner relative italic text-center mb-10">
            <span className="absolute top-0 left-4 text-4xl text-amber-200 font-serif opacity-50">&quot;</span>
            <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10">
              {wisdom.text}
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-4 not-italic uppercase tracking-widest">{wisdom.source}</p>
         </div>

         <button 
          onClick={onRenew}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-5 rounded-[1.5rem] transition-all shadow-xl shadow-emerald-900/20 active:scale-[0.98] flex items-center justify-center space-x-3 group"
         >
            <span className="text-lg">Renew Niyyah</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </button>
         
         <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">Resetting your state for a new beginning.</p>
      </div>
    </div>
  );
}
