import React from 'react';
import { Flame, Star, Sparkles, RefreshCw, Bookmark as BookmarkIcon, CheckCircle2, LogOut, CloudOff, Shield, BookOpen, Target, MessageCircle, Send, Lock } from 'lucide-react';
import LoginButton from '../../auth/LoginButton';
import { COMMUNITY_REFLECTION_PROMPTS } from '../../constants/muezza_data';

const NOOR_STAGES = [
  { id: 'spark', label: 'The Spark', range: 'Day 1–3', icon: '🔥', desc: 'A flicker of spiritual intent.' },
  { id: 'fanoos', label: 'The Fanoos', range: 'Day 4–10', icon: '🏮', desc: 'The light begins to guide your path.' },
  { id: 'najm', label: 'The Najm', icon: '⭐', range: 'Day 11–29', desc: 'A celestial witness to your consistency.' },
  { id: 'badr', label: 'The Badr', icon: '🌕', range: 'Day 30+', desc: 'Complete spiritual luminosity.' }
];

function formatBookmarkDate(bookmark) {
  const value = bookmark?.created_at || bookmark?.createdAt || bookmark?.date_added || bookmark?.dateAdded;
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function NoorTab({ 
  streak, 
  user, 
  onRefresh, 
  isSyncing, 
  syncCapabilities = [],
  bookmarks, 
  onOpenSurahByBookmark,
  onLogout,
  // New mission props
  onCreateBookmarkHabit,
  communityOptIn,
  onToggleCommunityOptIn,
  reflectionDrafts,
  onUpdateReflection,
  onSaveReflection,
  onPublishReflection,
  dailyAyah
}) {
  const currentStageIdx = 
    streak >= 30 ? 3 :
    streak >= 11 ? 2 :
    streak >= 4 ? 1 : 0;
  
  const currentStage = NOOR_STAGES[currentStageIdx];

  const userName = user?.username || user?.preferred_username
    ? `@${user.username || user.preferred_username}`
    : user?.name
    ? user.name
    : user?.first_name 
    ? `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`
    : user?.email || null;

  const userInitial = (user?.username || user?.preferred_username || user?.name || user?.first_name || user?.email || 'U').charAt(0).toUpperCase();

  const latestBookmark = bookmarks?.[0];
  const bookmarkVerseKey = latestBookmark?.verse_key;

  return (
    <div className="px-4 sm:px-6 py-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cloud Sync Status Card */}
      <div className="mb-6 sm:mb-8">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-3 sm:mb-4 flex items-center justify-between">
          <span>Cloud Sync</span>
          <Shield className="w-3 h-3" />
        </h4>
        
        {user ? (
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-emerald-100 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg shadow-emerald-600/20">
                    {userInitial}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800 tracking-tight truncate">
                    {userName || 'Quran.com User'}
                  </p>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Synced with Quran Foundation</p>
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2.5 sm:p-3 bg-slate-50 hover:bg-rose-50 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-rose-200 text-slate-400 hover:text-rose-500 transition-all active:scale-95 shrink-0 ml-3"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
              <div className="bg-emerald-50/50 rounded-xl p-3 text-center border border-emerald-100/50">
                <p className="text-lg sm:text-xl font-black text-emerald-700">{bookmarks.length}</p>
                <p className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest">Bookmarks</p>
              </div>
              <div className="bg-amber-50/50 rounded-xl p-3 text-center border border-amber-100/50">
                <p className="text-lg sm:text-xl font-black text-amber-700">{streak}</p>
                <p className="text-[9px] font-black text-amber-600/60 uppercase tracking-widest">Day Streak</p>
              </div>
            </div>

            {syncCapabilities.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Health</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    {syncCapabilities.filter((capability) => capability.status === 'active').length}/{syncCapabilities.length} active
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {syncCapabilities.map((capability) => {
                    const isActive = capability.status === 'active';
                    const isAttention = capability.status === 'limited' || capability.status === 'unknown';

                    return (
                      <div
                        key={capability.id}
                        className={`rounded-xl border p-3 flex items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-emerald-50/60 border-emerald-100 text-emerald-800'
                            : isAttention
                              ? 'bg-amber-50/70 border-amber-100 text-amber-800'
                              : 'bg-slate-50 border-slate-100 text-slate-500'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-widest truncate">{capability.label}</p>
                          <p className="text-[9px] font-bold opacity-70 truncate">{capability.detail}</p>
                        </div>
                        {isActive ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 text-center border-2 border-dashed border-slate-800 animate-in fade-in duration-700">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
              <CloudOff className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
            </div>
            <h4 className="text-white text-base sm:text-lg font-black tracking-tight mb-2">Cloud Sync Inactive</h4>
            <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed max-w-[220px] mx-auto mb-6 sm:mb-8 font-medium">Connect with Quran Foundation to synchronize your spiritual evolution across all substrates.</p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#1A1A1A] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full translate-y-24 -translate-x-24 blur-3xl"></div>

        <div className="flex flex-col items-center relative z-10">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-[9px] sm:text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-3 sm:mb-4">Noor Atmospheric Status</p>
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full scale-150 animate-pulse opacity-50"></div>
              <div className="text-[4rem] sm:text-[5rem] mb-2 leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-700">
                {currentStage.icon}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tighter mb-1">{currentStage.label}</h3>
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6 flex-wrap justify-center gap-y-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">{currentStage.range}</span>
              <div className="h-1 w-6 sm:w-8 bg-white/10 rounded-full hidden sm:block"></div>
              <div className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
                <span className="text-xs sm:text-sm font-black text-rose-400">{streak} Day Cycle</span>
              </div>
            </div>
            
            <p className="text-center text-slate-400 text-[11px] sm:text-xs leading-relaxed max-w-[200px] mb-6 sm:mb-8 font-medium">
              {currentStage.desc}
            </p>

            <button 
              onClick={onRefresh}
              disabled={isSyncing}
              className={`flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5 backdrop-blur-sm active:scale-95 ${isSyncing ? 'opacity-50' : ''}`}
            >
              <RefreshCw className={`w-3 h-3 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Synchronizing Protocol...' : 'Refresh Atmospheric Data'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-3 sm:mb-4 flex items-center justify-between">
          <span>Evolution Path</span>
          <Star className="w-3 h-3 text-amber-500" />
        </h4>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {NOOR_STAGES.map((stage, idx) => (
             <div 
              key={stage.id} 
              className={`p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] border transition-all ${
                idx <= currentStageIdx 
                  ? 'bg-white border-emerald-100 shadow-sm' 
                  : 'bg-slate-50 border-slate-100 opacity-60'
              }`}
             >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{stage.icon}</div>
                <p className="text-[9px] sm:text-[10px] font-black text-slate-800 uppercase tracking-wider mb-0.5 sm:mb-1">{stage.label}</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold opacity-60">{stage.range}</p>
             </div>
          ))}
        </div>
      </div>

      {/* Spiritual Archives (Bookmarks) */}
      {user && (
        <div className="mb-8 sm:mb-10">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-3 sm:mb-4">Spiritual Archives</h4>
          <div className="space-y-3">
            {bookmarks.length === 0 ? (
              <div className="p-8 sm:p-10 text-center bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-[2rem]">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Archive Empty</p>
                <p className="text-[10px] text-slate-400 font-medium">Bookmark verses in the reader to build your archive.</p>
              </div>
            ) : (
              bookmarks.map((bookmark) => {
                const bookmarkDate = formatBookmarkDate(bookmark);

                return (
                  <button
                    key={bookmark.id || bookmark.verse_key}
                    onClick={() => onOpenSurahByBookmark(bookmark)}
                    className="w-full bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-all shadow-sm group"
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                      <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl group-hover:bg-emerald-50 transition-colors shrink-0">
                        <BookmarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="font-black text-slate-800 truncate tracking-tight text-sm">{bookmark.surah_name}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          Ayah {bookmark.ayah_number || bookmark.verse_key}
                        </p>
                        {bookmarkDate && (
                          <p className="text-[9px] sm:text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1">
                            Added {bookmarkDate}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <RefreshCw className="w-4 h-4 text-slate-500" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Bookmark Prompt — create habit from saved ayah */}
      <section className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 tracking-tight">Bookmark Prompt</h3>
          <BookOpen className="w-5 h-5 text-sky-500" />
        </div>
        {latestBookmark ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4">
              <p className="text-sm font-black text-slate-800">{latestBookmark.surah_name}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-sky-700 mt-1">Ayah {latestBookmark.ayah_number || bookmarkVerseKey}</p>
            </div>
            <button
              onClick={() => onCreateBookmarkHabit(latestBookmark)}
              className="w-full py-3 rounded-2xl bg-slate-900 text-white text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Target className="w-4 h-4 text-emerald-300" />
              Create Habit
            </button>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 text-center">
            <p className="text-xs font-bold text-slate-400">Bookmark an ayah to unlock personalized prompts.</p>
          </div>
        )}
      </section>

      {/* Community */}
      <section className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900 tracking-tight">Community</h3>
          <MessageCircle className="w-5 h-5 text-indigo-500" />
        </div>
        <button
          onClick={() => onToggleCommunityOptIn(!communityOptIn)}
          className={`w-full rounded-2xl p-4 border text-left transition-all active:scale-[0.98] ${
            communityOptIn ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-slate-50 border-slate-100 text-slate-500'
          }`}
        >
          <p className="text-xs font-black uppercase tracking-widest">{communityOptIn ? 'Opted in' : 'Private mode'}</p>
          <p className="text-xs font-bold mt-2 leading-relaxed">Only reflections you publish are shared. Prayers and habits stay private.</p>
        </button>
      </section>

      {/* Reflection */}
      <section className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-1">Reflection</p>
            <h3 className="text-xl font-black tracking-tighter text-slate-900">{COMMUNITY_REFLECTION_PROMPTS[0]}</h3>
          </div>
          <MessageCircle className="w-5 h-5 text-indigo-500 shrink-0" />
        </div>
        <textarea
          value={reflectionDrafts?.daily || ''}
          onChange={(event) => onUpdateReflection('daily', event.target.value)}
          className="w-full min-h-28 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 transition-all"
          placeholder="Write a private note from today's ayah..."
        />
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <button onClick={() => onSaveReflection('daily', dailyAyah?.verse_key)} className="py-3 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all">
            <Shield className="w-4 h-4" /> Save Private Note
          </button>
          <button
            onClick={() => onPublishReflection('daily', dailyAyah?.verse_key)}
            disabled={!communityOptIn}
            className="py-3 rounded-2xl bg-slate-900 text-white text-xs font-black flex items-center justify-center gap-2 active:scale-95 transition-all disabled:bg-slate-100 disabled:text-slate-400"
          >
            <Send className="w-4 h-4" /> Publish Reflection
          </button>
        </div>
      </section>
    </div>
  );
}
