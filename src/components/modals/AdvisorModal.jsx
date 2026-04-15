import React, { useState } from 'react';
import { X, Sparkles, Heart, MessageSquare, Quote, BookOpen, Star } from 'lucide-react';
import CatSVG from '../CatSVG';
import { ADVISOR_MOODS } from '../../constants/muezza_data';

export function AdvisorModal({ isOpen, onClose, onSeekAdvice, adviceResult, isThinking }) {
  const [selectedMood, setSelectedMood] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md z-50 flex items-center justify-center p-6 sm:p-12 overflow-hidden transition-all duration-500">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-12 zoom-in-95 duration-700 ease-out border border-white/20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400"></div>
        
        <div className="p-8 flex items-center justify-between border-b border-slate-50 relative shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Consult Muezza</h3>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Spiritual Advisor System</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
          {!adviceResult && !isThinking ? (
            <>
              <div className="text-center">
                <div className="bg-[#FAF8F4] p-10 rounded-[3rem] mb-8 border border-slate-100 flex flex-col items-center">
                  <CatSVG awake={true} equipped={['glasses_smart', 'turban_cream']} className="w-32 h-32 mb-6 drop-shadow-xl" />
                  <h4 className="text-xl font-bold text-slate-800 mb-2 font-serif italic">"Assalamualaikum, seeker."</h4>
                  <p className="text-xs text-slate-500 font-medium max-w-[240px] leading-relaxed">
                    I have been reading the scrolls. How is your heart feeling in this substrate today?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {ADVISOR_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-6 rounded-[2rem] border-2 transition-all text-left group relative overflow-hidden ${
                      selectedMood === mood.id 
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-600/20 scale-[0.98]' 
                        : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30'
                    }`}
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{mood.icon}</div>
                    <p className={`font-black tracking-tight ${selectedMood === mood.id ? 'text-white' : 'text-slate-800'}`}>{mood.label}</p>
                    <p className={`text-[10px] uppercase tracking-widest font-black opacity-60 ${selectedMood === mood.id ? 'text-emerald-50' : 'text-slate-400'}`}>{mood.sub}</p>
                  </button>
                ))}
              </div>

              <button
                disabled={!selectedMood}
                onClick={() => onSeekAdvice(selectedMood)}
                className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center space-x-3 active:scale-[0.98] ${
                  selectedMood 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <MessageSquare className={`w-5 h-5 ${selectedMood ? 'text-amber-400' : ''}`} />
                <span>Begin Reflection</span>
              </button>
            </>
          ) : isThinking ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-500">
               <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                  <CatSVG awake={true} equipped={['glasses_smart', 'turban_cream', 'lantern_gold']} className="w-48 h-48 relative z-10" />
               </div>
               <div className="flex flex-col items-center space-y-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tighter">Muezza is Reflecting...</h4>
                  <p className="text-xs text-slate-400 font-mono uppercase tracking-[0.3em]">Querying Core Script...</p>
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8 pb-4">
              <div className="bg-[#FAF8F4] p-8 rounded-[3rem] border border-emerald-100 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Quote className="w-20 h-20 text-emerald-900" />
                </div>
                <div className="flex items-center space-x-4 mb-6 relative z-10">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-emerald-50">
                      <CatSVG awake={true} equipped={['glasses_smart', 'turban_cream']} className="w-12 h-12" />
                   </div>
                   <div className="bg-emerald-600 text-white px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                      <p className="text-xs font-bold leading-relaxed">{adviceResult.muezza_advice}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 px-2">
                   <div className="h-px bg-slate-100 flex-1"></div>
                   <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Quranic Grounding</span>
                   <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-amber-100 shadow-sm shadow-amber-900/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
                   <p className="text-2xl font-bold text-slate-800 italic leading-relaxed text-center mb-6 relative z-10">
                     "{adviceResult.verse}"
                   </p>
                   <div className="flex flex-col items-center">
                      <div className="flex items-center space-x-2 bg-amber-50 px-4 py-2 rounded-xl mb-6">
                        <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                        <span className="text-[11px] font-black text-amber-700 uppercase tracking-widest">{adviceResult.reference}</span>
                      </div>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl w-full border border-slate-100">
                        <div className="flex items-center space-x-2 mb-3">
                           <BookOpen className="w-4 h-4 text-emerald-600" />
                           <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tafsir Context</h5>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{adviceResult.tafsir}</p>
                      </div>
                   </div>
                </div>
              </div>

              <button
                 onClick={onClose}
                 className="w-full py-5 bg-slate-900 text-white font-black rounded-[2rem] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98]"
              >
                 Barakallahu Feek
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
