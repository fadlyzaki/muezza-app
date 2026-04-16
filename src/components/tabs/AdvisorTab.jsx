import React, { useState } from 'react';
import { Sparkles, MessageSquare, Quote, BookOpen, Star, Heart, History, TrendingUp } from 'lucide-react';
import CatSVG from '../CatSVG';
import { ADVISOR_MOODS, MOOD_RESPONSES } from '../../constants/muezza_data';

export function AdvisorTab({ onSeekAdvice, adviceResult, isThinking, onResetAdvice, inventory, catStage }) {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <div className="px-4 sm:px-6 py-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-8 mb-6 sm:mb-8 shadow-xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
        
        <div className="flex items-center justify-between mb-6 sm:mb-10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 bg-emerald-50 rounded-xl sm:rounded-2xl shadow-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter">Advisor Portal</h3>
              <p className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mt-0.5 sm:mt-1">Grounded Wisdom Engine</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
             <div className="p-1 px-2.5 sm:px-3 text-[8px] sm:text-[9px] font-black text-emerald-700 bg-white rounded-lg shadow-sm">Active</div>
          </div>
        </div>

        <div className="relative z-10">
          {!adviceResult && !isThinking ? (
            <div className="space-y-5 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col items-center">
                <div className="bg-[#FAF8F4] w-full p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] border border-slate-100 flex flex-col items-center relative group/mascot mb-5 sm:mb-8 overflow-hidden shadow-sm">
                  <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full scale-150 animate-pulse"></div>
                  <CatSVG awake={true} equipped={inventory} stage={catStage} className="w-32 h-32 sm:w-52 sm:h-52 mb-4 sm:mb-8 drop-shadow-2xl relative z-10" />
                  <h4 className="text-xl sm:text-3xl font-black text-slate-800 mb-2 sm:mb-4 font-serif italic tracking-tight">"Assalamu'alaikum"</h4>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-[280px] leading-relaxed text-center">
                    I have prepared my scrolls to reflect on your heart's current state. How are you feeling, seeker?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {ADVISOR_MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border-2 transition-all duration-500 text-left group relative overflow-hidden ${
                      selectedMood === mood.id 
                        ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-900/10' 
                        : 'bg-white border-slate-50 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:drop-shadow-md transition-all duration-500">{mood.icon}</div>
                    <p className={`font-black text-sm sm:text-base tracking-tight ${selectedMood === mood.id ? 'text-white' : 'text-slate-800'}`}>{mood.label}</p>
                    <p className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-black opacity-60 ${selectedMood === mood.id ? 'text-slate-300' : 'text-slate-400'}`}>{mood.sub}</p>
                  </button>
                ))}
              </div>

              <button
                disabled={!selectedMood}
                onClick={() => onSeekAdvice(selectedMood)}
                className={`w-full py-4 sm:py-6 rounded-2xl sm:rounded-[2.5rem] font-black text-base sm:text-lg shadow-xl shadow-slate-900/10 transition-all flex items-center justify-center space-x-3 active:scale-[0.98] ${
                  selectedMood 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                <MessageSquare className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedMood ? 'text-amber-400' : ''}`} />
                <span>Begin Reflection</span>
              </button>
            </div>
          ) : isThinking ? (
            <div className="py-12 sm:py-20 flex flex-col items-center justify-center space-y-6 sm:space-y-10 animate-in fade-in zoom-in duration-700">
               <div className="relative">
                 <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                 <CatSVG awake={true} equipped={inventory} stage={catStage} className="w-36 h-36 sm:w-56 sm:h-56 relative z-10" />
               </div>
               <div className="flex flex-col items-center space-y-4 sm:space-y-5 text-center">
                 <div className="flex space-x-3">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce shadow-lg shadow-emerald-500/30"></div>
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-150 shadow-lg shadow-emerald-500/30"></div>
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-300 shadow-lg shadow-emerald-500/30"></div>
                 </div>
                 <h4 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter">Muezza is Reflecting...</h4>
                 <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono uppercase tracking-[0.3em] sm:tracking-[0.4em] animate-pulse">Querying Sacred Archetypes</p>
               </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6 sm:space-y-12 pb-4 sm:pb-8">
              <div className="bg-slate-900 p-6 sm:p-10 rounded-[2rem] sm:rounded-[4rem] relative group overflow-hidden shadow-2xl shadow-slate-900/20">
                <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10">
                  <Quote className="w-16 h-16 sm:w-32 sm:h-32 text-white" />
                </div>
                <div className="flex flex-col items-center relative z-10 text-center">
                   <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-5 sm:mb-8">
                      <CatSVG awake={true} equipped={inventory} stage={catStage} className="w-10 h-10 sm:w-16 sm:h-16" />
                   </div>
                   <div className="space-y-3 sm:space-y-4">
                      <p className="text-[9px] sm:text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] sm:tracking-[0.4em]">Muezza's Counsel</p>
                      <p className="text-base sm:text-xl font-bold leading-relaxed text-white">{adviceResult.muezza_advice}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-5 sm:space-y-8">
                <div className="flex items-center space-x-4 sm:space-x-6 px-2 sm:px-4">
                   <div className="h-px bg-slate-100 flex-1"></div>
                   <span className="text-[10px] sm:text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] sm:tracking-[0.5em]">The Source</span>
                   <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <div className="bg-white p-6 sm:p-12 rounded-[2rem] sm:rounded-[4rem] border border-amber-100 shadow-xl shadow-amber-900/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-50 rounded-full blur-3xl -translate-y-24 sm:-translate-y-32 translate-x-24 sm:translate-x-32"></div>
                   
                   <div className="relative z-10 flex flex-col items-center">
                     <div className="flex items-center space-x-2 sm:space-x-3 bg-amber-50 border border-amber-100 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full mb-6 sm:mb-10">
                        <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 fill-amber-600" />
                        <span className="text-[10px] sm:text-[11px] font-black text-amber-900 uppercase tracking-widest">{adviceResult.reference}</span>
                      </div>

                      <p className="text-xl sm:text-3xl font-black text-slate-800 italic leading-relaxed text-center mb-6 sm:mb-12 font-serif tracking-tight">
                        "{adviceResult.verse}"
                      </p>
                      
                      <div className="bg-[#F8F9FB] p-5 sm:p-10 rounded-2xl sm:rounded-[3.5rem] w-full border border-slate-100">
                        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                           <div className="p-2 sm:p-2.5 bg-emerald-100 rounded-xl sm:rounded-2xl">
                              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
                           </div>
                           <h5 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em]">Deep Wisdom Insight</h5>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold italic tracking-tight">{adviceResult.tafsir}</p>
                      </div>
                   </div>
                </div>
              </div>

              <button
                 onClick={() => {
                   setSelectedMood(null);
                   onResetAdvice();
                 }}
                 className="w-full py-4 sm:py-6 bg-slate-100 text-slate-800 font-extrabold rounded-2xl sm:rounded-[3rem] hover:bg-emerald-50 hover:text-emerald-700 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 sm:space-x-3 border-2 border-transparent hover:border-emerald-100 text-sm sm:text-base"
              >
                 <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                 <span>Barakallahu Feek · Seek Another Path</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 flex items-center justify-between">
            <span>Session Analytics</span>
            <TrendingUp className="w-3 h-3 font-black" />
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 border border-slate-100 shadow-sm flex items-center justify-between group/stat">
               <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="p-2.5 sm:p-3 bg-rose-50 rounded-xl sm:rounded-2xl group-hover/stat:bg-rose-100 transition-colors">
                     <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500" />
                  </div>
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">Heart Resonance</p>
                    <p className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight">Synchronized</p>
                  </div>
               </div>
               <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-50 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
                  Active
               </div>
            </div>

            {selectedMood && (
              <div className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 border border-emerald-100 shadow-sm flex items-center justify-between animate-in zoom-in duration-300">
                <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="p-2.5 sm:p-3 bg-emerald-50 rounded-xl sm:rounded-2xl">
                       <History className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5 sm:mb-1">Emotion Logged</p>
                      <p className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-tight">
                        {ADVISOR_MOODS.find(m => m.id === selectedMood)?.label}
                      </p>
                    </div>
                </div>
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-lg sm:rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                   Buffered
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
