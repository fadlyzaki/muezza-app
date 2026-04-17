import React from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  WifiOff, 
  ChevronLeft, 
  Check, 
  Play, 
  Pause, 
  BookOpen, 
  Star, 
  Bookmark as BookmarkIcon,
  Book,
  AlertCircle,
  Plus,
  RefreshCw
} from 'lucide-react';
import CatSVG from '../CatSVG';
import { ErrorState } from '../common/ErrorState';

export function QuranTab({ 
  selectedSurah, 
  surahs, 
  onOpenSurah, 
  onCloseSurah, 
  isLoadingQuran, 
  quranError, 
  fetchSurahs,
  verses,
  isLoadingMore,
  hasMoreVerses,
  onLoadMore,
  onToggleVerseAudio,
  activeAudioVerseKey,
  isAudioPlaying,
  onToggleBookmark,
  bookmarkedVerseKeys,
  onVerseTafsir,
  isJourneying,
  journeyResult,
  journeyError,
  onCloseJourney,
  journeyMode,
  onHardResetJourney,
  quranReadingHabit,
  onToggleHabit,
  getVerseAudioUrl,
  getTranslationText
}) {
  if (selectedSurah) {
    return (
       <div className="flex flex-col h-full bg-[#FAF8F4] animate-in slide-in-from-right-10 duration-500 overflow-hidden">
          <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center p-4 px-6 justify-between shadow-sm">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onCloseSurah}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5 text-slate-800" />
              </button>
              <div>
                <h3 className="font-black text-slate-900 tracking-tight">{selectedSurah.name_simple || `Surah ${selectedSurah.id}`}</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  {selectedSurah.translated_name?.name || selectedSurah.name_simple || 'Quran'}
                </p>
              </div>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-black text-sm border border-emerald-100/50">
              {selectedSurah.id}
            </div>
          </div>

          <div id="main-scroll-container" className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-6 py-4 space-y-6">
              {!quranReadingHabit?.completed && quranReadingHabit && (
                <div className="bg-emerald-600 p-4 rounded-2xl flex items-center justify-between shadow-md text-white mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-500 p-2 rounded-full hidden sm:block">
                      <CatSVG awake={true} equipped={['glasses_smart']} className="w-10 h-10" isPetting={false} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{quranReadingHabit.title}</p>
                      <p className="text-xs text-emerald-200 opacity-90">Daily Habit Pending</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleHabit(quranReadingHabit.id)}
                    className="bg-white text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-50 transition shrink-0 ml-2"
                  >
                    Mark Done
                  </button>
                </div>
              )}

              {isLoadingQuran && verses.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 animate-pulse">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                        <div className="h-10 w-48 bg-slate-100 rounded-xl"></div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                        <div className="h-3 w-16 bg-slate-100 rounded"></div>
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                        <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : quranError ? (
                <ErrorState 
                  title="Script Delivery Failed" 
                  message="We couldn't retrieve the verses for this Surah. Check your connection and try again." 
                  onRetry={() => fetchSurahs()} 
                  icon={AlertCircle}
                />
              ) : (
                <>
                  {verses.map((verse) => {
                    const audioUrl = getVerseAudioUrl(verse);
                    const translationText = getTranslationText(verse);
                    const isBookmarked = bookmarkedVerseKeys.has(verse.verse_key);
                    const isActiveAudio = activeAudioVerseKey === verse.verse_key;

                    return (
                      <div key={verse.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-4 gap-3">
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                            {verse.verse_key}
                          </span>

                          <div className="flex items-center gap-2">
                            {audioUrl && (
                              <button
                                onClick={() => onToggleVerseAudio(verse)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border flex items-center space-x-1.5 transition-colors shadow-sm ${
                                  isActiveAudio && isAudioPlaying
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300'
                                }`}
                              >
                                {isActiveAudio && isAudioPlaying ? (
                                  <>
                                    <Pause className="w-3 h-3 fill-white" />
                                    <span>Playing</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className={`w-3 h-3 ${isActiveAudio ? 'fill-emerald-600 text-emerald-600' : 'fill-slate-400 text-slate-400'}`} />
                                    <span>Stream</span>
                                  </>
                                )}
                              </button>
                            )}
                            
                            <button
                              onClick={() => onToggleBookmark(verse)}
                              className={`p-1.5 rounded-lg border transition-all shadow-sm ${
                                isBookmarked ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-slate-200 text-slate-300 hover:text-emerald-500 hover:border-emerald-300'
                              }`}
                            >
                              <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <p 
                            className="text-right text-2xl font-bold text-slate-800 leading-[2] sm:leading-[2.5] quran-font"
                            dir="rtl"
                          >
                            {verse.text_uthmani}
                          </p>

                          {translationText ? (
                            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                              <p
                                className="text-slate-600 text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: translationText || '' }}
                              />
                            </div>
                          ) : (
                            <div className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>
                          )}

                          <button
                            onClick={() => onVerseTafsir(verse)}
                            className="w-full bg-slate-50 hover:bg-emerald-50 py-3 rounded-xl text-xs font-bold text-slate-600 transition-all border border-slate-100 hover:border-emerald-200 flex items-center justify-center space-x-2 group-hover:bg-slate-100"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Ask Muezza (Tafsir Insight)</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {hasMoreVerses && (
                    <div className="flex justify-center p-8">
                      <button
                        onClick={onLoadMore}
                        disabled={isLoadingMore}
                        className="bg-white border-2 border-slate-100 text-slate-900 px-8 py-3 rounded-2xl text-xs font-bold hover:border-emerald-500/50 hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {isLoadingMore ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                        ) : (
                          <Plus className="w-4 h-4 text-emerald-500" />
                        )}
                        <span>{isLoadingMore ? 'Streaming verses...' : 'Load more script'}</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
       </div>
    );
  }

  return (
    <div className="px-6 py-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[#F9F6F0] p-6 rounded-3xl mb-6 flex flex-col items-center text-center border border-slate-100">
        <CatSVG awake={true} equipped={['glasses_smart']} className="w-24 h-24 mb-2 drop-shadow-sm" isPetting={false} />
        <h2 className="text-xl font-bold text-slate-800">The Holy Quran</h2>
        <p className="text-sm text-slate-500 mt-1">Read with Muezza</p>

        <div className="mt-4 flex gap-2 flex-wrap justify-center invisible h-0 overflow-hidden">
          {/* Translation selection disabled as per request to focus on English only */}
        </div>
      </div>

      {isLoadingQuran ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
                  <div className="h-3 w-16 bg-slate-200 rounded-md"></div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="h-6 w-20 bg-slate-200 rounded-md"></div>
                <div className="h-2 w-12 bg-slate-100 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      ) : quranError ? (
        <ErrorState 
          title="Content Engine Offline" 
          message={quranError} 
          onRetry={fetchSurahs} 
          icon={WifiOff}
        />
      ) : (
        <div className="space-y-3">
          {surahs.length > 0 ? (
            surahs.map((surah) => (
              <button
                key={surah.id}
                onClick={() => onOpenSurah(surah)}
                className="w-full bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between hover:border-emerald-300 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-bold shrink-0">
                    {surah.id}
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-800">{surah.name_simple}</h3>
                    <p className="text-xs text-slate-500">{surah.translated_name?.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-800 quran-font">{surah.name_arabic}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{surah.verses_count} Ayah</p>
                </div>
              </button>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center opacity-40">
               <Book className="w-12 h-12 text-slate-300 mb-4" />
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Library initialized</p>
            </div>
          )}
        </div>
      )}

      {/* Journey Modal handled by App Level orchestrator */}
    </div>
  );
}
