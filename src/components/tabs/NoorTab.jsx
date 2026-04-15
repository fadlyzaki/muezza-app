import React from 'react';
import { Flame, Star, Sparkles, RefreshCw, Bookmark as BookmarkIcon } from 'lucide-react';
import LoginButton from '../../auth/LoginButton';

const NOOR_STAGES = [
  { id: 'spark', label: 'The Spark', range: 'Day 1–3', icon: '🔥', desc: 'A flicker of spiritual intent.' },
  { id: 'fanoos', label: 'The Fanoos', range: 'Day 4–10', icon: '🏮', desc: 'The light begins to guide your path.' },
  { id: 'najm', label: 'The Najm', icon: '⭐', range: 'Day 11–29', desc: 'A celestial witness to your consistency.' },
  { id: 'badr', label: 'The Badr', icon: '🌕', range: 'Day 30+', desc: 'Complete spiritual luminosity.' }
];

export function NoorTab({ 
  streak, 
  user, 
  onRefresh, 
  isSyncing, 
  bookmarks, 
  onOpenSurahByBookmark 
}) {
  const currentStageIdx = 
    streak >= 30 ? 3 :
    streak >= 11 ? 2 :
    streak >= 4 ? 1 : 0;
  
  const currentStage = NOOR_STAGES[currentStageIdx];

  return (
    <div className="px-6 py-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#1A1A1A] rounded-[3rem] p-8 mb-8 relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full translate-y-24 -translate-x-24 blur-3xl"></div>

        <div className="flex flex-col items-center relative z-10">
          <div className="text-center mb-8">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Noor Atmospheric Status</p>
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full scale-150 animate-pulse opacity-50"></div>
              <div className="text-[5rem] mb-2 leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-700">
                {currentStage.icon}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{currentStage.label}</h3>
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">{currentStage.range}</span>
              <div className="h-1 w-8 bg-white/10 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-black text-rose-400">{streak} Day Cycle</span>
              </div>
            </div>
            
            <p className="text-center text-slate-400 text-xs leading-relaxed max-w-[200px] mb-8 font-medium">
              {currentStage.desc}
            </p>

            <button 
              onClick={onRefresh}
              disabled={isSyncing}
              className={`flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5 backdrop-blur-sm active:scale-95 ${isSyncing ? 'opacity-50' : ''}`}
            >
              <RefreshCw className={`w-3 h-3 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing Protocol...' : 'Refresh Atmospheric Data'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4 flex items-center justify-between">
          <span>Evolution Path</span>
          <Star className="w-3 h-3 text-amber-500" />
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {NOOR_STAGES.map((stage, idx) => (
             <div 
              key={stage.id} 
              className={`p-5 rounded-[2rem] border transition-all ${
                idx <= currentStageIdx 
                  ? 'bg-white border-emerald-100 shadow-sm' 
                  : 'bg-slate-50 border-slate-100 opacity-60'
              }`}
             >
                <div className="text-3xl mb-3">{stage.icon}</div>
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-1">{stage.label}</p>
                <p className="text-[10px] text-slate-500 font-bold opacity-60">{stage.range}</p>
             </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Spiritual Archives</h4>
        {!user ? (
          <div className="bg-slate-900 rounded-[2rem] p-8 text-center border-2 border-dashed border-slate-800 animate-in fade-in duration-700">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Sparkles className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="text-white text-lg font-black tracking-tight mb-2">Cloud Sync Inactive</h4>
            <p className="text-slate-500 text-xs leading-relaxed max-w-[200px] mx-auto mb-8 font-medium">Connect with Quran Foundation to synchronize your spiritual evolution across all substrates.</p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.length === 0 ? (
              <div className="p-10 text-center bg-slate-50 border border-slate-100 rounded-[2rem]">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Archive Empty</p>
                <p className="text-[10px] text-slate-400 font-medium">Bookmark verses in the reader to build your archive.</p>
              </div>
            ) : (
              bookmarks.map((bookmark) => (
                <button
                  key={bookmark.id}
                  onClick={() => onOpenSurahByBookmark(bookmark)}
                  className="w-full bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-all shadow-sm group"
                >
                  <div className="flex items-center space-x-4 min-w-0">
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition-colors shrink-0">
                      <BookmarkIcon className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-black text-slate-800 truncate tracking-tight">{bookmark.surah_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ayah {bookmark.verse_key}</p>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
