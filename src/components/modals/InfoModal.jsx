import React from 'react';
import { X, Book, Lightbulb, Activity } from 'lucide-react';

export function InfoModal({ 
  onClose, 
  activeTab: infoModalTab, 
  setActiveTab: setInfoModalTab, 
  onReset 
}) {
  return (
    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] w-full max-w-[22rem] shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-500 max-h-[78vh] flex flex-col overflow-hidden">
         <div className="p-5 pb-0">
          <div className="flex items-start justify-between gap-4 mb-4 shrink-0">
            <div>
              <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 font-mono">
                Muezza Terminal
              </p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {infoModalTab === 'guide' ? 'System Guide' : infoModalTab === 'settings' ? 'Core Settings' : 'Glossary'}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center p-1 bg-slate-50 border border-slate-100 rounded-2xl mb-6 shrink-0">
            {[
              { id: 'guide', label: 'Guide', icon: Lightbulb },
              { id: 'glossary', label: 'Glossary', icon: Book },
              { id: 'settings', label: 'Admin', icon: Activity }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setInfoModalTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  infoModalTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-100 ring-4 ring-slate-100/50' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <tab.icon className={`w-3 h-3 ${infoModalTab === tab.id ? 'text-emerald-500' : ''}`} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-2">
            {infoModalTab === 'guide' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Protocol 01: The Loop</span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Complete daily rituals to generate Energy and earn Dinar. High energy keeps Muezza active and majestic.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Protocol 02: Acquisition</span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Liquidate Dinar in the Souq to acquire equipment. These items are instantly synchronized with the mascot substrate.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Protocol 03: Reflection</span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">Use the "Ask Muezza" interface in the Reader tab to stream live reflections from authentic Tafsir databases.</p>
                </div>
              </div>
            )}

            {infoModalTab === 'glossary' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {[
                  { term: 'Ruh', def: 'Spirit/Vitality — Rituals of deep spiritual connection.' },
                  { term: 'Aql', def: 'Intellect — Rituals of knowledge and mental growth.' },
                  { term: 'Jasad', def: 'Physicality — Rituals of bodily care and movement.' },
                  { term: 'Qalb', def: 'Heart — Rituals of character and soft prostrations.' }
                ].map((item, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-4 last:border-0">
                    <p className="text-xs font-black text-slate-800 mb-1">{item.term}</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.def}</p>
                  </div>
                ))}
              </div>
            )}

            {infoModalTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                   <h4 className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-2">Hard Reset Boundary</h4>
                   <p className="text-[11px] text-rose-700/70 leading-relaxed font-medium mb-4">Clears all local progress, dinar, and equipment. This action is irreversible.</p>
                   <button 
                    onClick={onReset}
                    className="w-full py-3 bg-white text-rose-600 text-xs font-black rounded-xl border border-rose-200 hover:bg-rose-50 transition-colors shadow-sm"
                   >
                    Purge System Data
                   </button>
                </div>
                
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Architecture v1.0.4</p>
                  <p className="text-[9px] text-slate-300 font-medium uppercase tracking-[0.2em]">Fadly Uzzaki Design &copy; 2026</p>
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
