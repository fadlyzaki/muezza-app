import { Sparkles, CheckCircle2, Circle, Pencil, Plus, Trash2, X, Activity, ArrowRight, BookOpen, Coins, Target } from 'lucide-react';
import CatSVG from '../CatSVG';
import { PRAYER_ICONS, EVERGREEN_MISSION_TASKS } from '../../constants/muezza_data';

const accentClasses = {
  emerald: 'border-emerald-100 bg-emerald-50/40 text-emerald-700',
  amber: 'border-amber-100 bg-amber-50/60 text-amber-700',
  indigo: 'border-indigo-100 bg-indigo-50/60 text-indigo-700',
  sky: 'border-sky-100 bg-sky-50/60 text-sky-700',
};

function taskKey(bundleId, taskId) {
  return `${bundleId}:${taskId}`;
}

function getBundleProgress(bundle, completedTasks) {
  const done = bundle.tasks.filter((task) => completedTasks[taskKey(bundle.id, task.id)]).length;
  return {
    done,
    total: bundle.tasks.length,
    percent: Math.round((done / Math.max(bundle.tasks.length, 1)) * 100),
  };
}

function RewardChip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-amber-700 border border-amber-100">
      <Coins className="w-3 h-3" />
      {children}
    </span>
  );
}

export function HomeTab({ 
  energy, 
  pendingWisdom,
  onStartMorningReflection,
  prayers, 
  habits, 
  onPet,
  isPetting,
  inventory,
  catStage,
  onTogglePrayer,
  onToggleMissedPrayer,
  onToggleHabit,
  onEditHabit,
  onDeleteHabit,
  onAddHabitClick,
  onStartJourney,
  onOpenInfoModal,
  prayerTimes,
  onOpenQuran,
  // Mission props
  featuredBundle,
  activeBundles,
  missionProgress,
  onCompleteMissionTask,
  onOpenVerse
}) {
  const completedTasks = missionProgress?.completedTasks || {};
  const badges = missionProgress?.badges || [];
  const featuredProgress = featuredBundle ? getBundleProgress(featuredBundle, completedTasks) : null;

  return (
    <div className="px-4 pt-4 pb-32 sm:px-6 sm:py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2rem] sm:rounded-[4rem] p-4 sm:p-12 mb-6 sm:mb-12 shadow-xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-80 sm:h-80 bg-emerald-500/5 rounded-full -translate-y-20 translate-x-20 sm:-translate-y-40 sm:translate-x-40 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-amber-500/5 rounded-full translate-y-20 -translate-x-20 sm:translate-y-40 sm:-translate-x-40 blur-3xl group-hover:bg-amber-500/10 transition-colors duration-700"></div>

        <div className="grid grid-cols-[6rem_1fr] sm:grid-cols-1 items-center gap-4 sm:gap-0 relative z-10">
          <div className="relative cursor-pointer select-none group/mascot justify-self-center" onClick={onPet}>
            <div className={`absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full scale-110 transition-all duration-1000 ${isPetting ? 'opacity-100 scale-125' : 'opacity-0'}`}></div>
            <CatSVG 
              awake={energy > 0} 
              className={`w-24 h-24 sm:w-48 sm:h-48 transition-all duration-500 relative z-10 drop-shadow-[0_10px_12px_rgba(0,0,0,0.1)] sm:drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)] group-hover/mascot:drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] group-hover/mascot:-translate-y-1 sm:group-hover/mascot:-translate-y-2 ${isPetting ? 'scale-110' : ''}`}
              isPetting={isPetting} 
              equipped={inventory} 
              stage={catStage}
            />
          </div>
          
          <div className="w-full min-w-0 sm:mt-8 sm:max-w-[220px] sm:mx-auto">
            <div className="flex justify-between items-center mb-2 px-1 sm:mb-2.5">
              <div className="flex items-center space-x-2">
                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.16em] sm:tracking-[0.2em]">Energy Matrix</p>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">{energy}%</span>
            </div>
            <div className="h-3 sm:h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)] relative"
                style={{ width: `${energy}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-shimmer"></div>
              </div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 mt-1 sm:mt-8 w-full">
            {pendingWisdom ? (
               <button 
                onClick={onStartMorningReflection}
                className="w-full bg-indigo-900 text-white font-black py-3.5 sm:py-5 rounded-2xl sm:rounded-[2rem] shadow-xl shadow-indigo-900/20 hover:bg-indigo-800 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group animate-pulse"
               >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                  <span className="text-sm sm:text-lg tracking-tight">Morning Reflection</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform" />
               </button>
            ) : energy >= 100 ? (
               <button 
                onClick={onStartJourney}
                className="w-full bg-amber-500 text-white font-black py-3.5 sm:py-5 rounded-2xl sm:rounded-[2rem] shadow-xl shadow-amber-500/30 hover:bg-amber-600 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group"
               >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100 animate-pulse" />
                  <span className="text-sm sm:text-lg tracking-tight text-white drop-shadow-sm">Muezza's Counsel</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100 group-hover:translate-x-1.5 transition-transform" />
               </button>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-3 bg-slate-50/80 px-4 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl border border-slate-100 w-full justify-center">
                  <p className="text-[10px] sm:text-[11px] text-slate-500 leading-relaxed font-bold text-center italic">
                     &quot;Complete daily tasks to unlock spiritual reflections.&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10 sm:mb-14 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Obligatory Rituals</h4>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Live Timing</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {prayers.map((prayer) => {
            const IconComp = PRAYER_ICONS[prayer.id];
            const prayerTime = prayerTimes ? prayerTimes[prayer.name] : '--:--';
            return (
              <div key={prayer.id} className="relative group">
                <button
                  onClick={() => onTogglePrayer(prayer.id)}
                  className={`w-full flex flex-col items-center p-3 rounded-3xl border-2 transition-all relative overflow-hidden ${
                    prayer.completed
                      ? 'bg-emerald-50 border-emerald-100 shadow-sm'
                      : prayer.missed
                      ? 'bg-rose-50/50 border-rose-100 opacity-80'
                      : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`p-2.5 rounded-2xl mb-2 transition-colors ${
                    prayer.completed 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : prayer.missed 
                      ? 'bg-rose-100/50 text-rose-400' 
                      : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'
                  }`}>
                    {IconComp && <IconComp className="w-4 h-4" />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-tight mb-1 ${
                    prayer.completed ? 'text-emerald-700' : prayer.missed ? 'text-rose-400' : 'text-slate-500'
                  }`}>
                    {prayer.name}
                  </span>
                  <span className={`text-[8px] font-bold font-mono tracking-tighter opacity-80 ${
                    prayer.missed ? 'text-rose-300 line-through' : 'text-slate-400'
                  }`}>
                    {prayerTime}
                  </span>
                  
                  {prayer.completed && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 fill-white" />
                    </div>
                  )}
                  
                  {prayer.missed && (
                    <div className="absolute top-1.5 right-1.5">
                      <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </button>

                {/* Manual Skip Button */}
                {!prayer.completed && !prayer.missed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMissedPrayer(prayer.id);
                    }}
                    className="absolute -top-1 -left-1 w-5 h-5 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                
                {prayer.missed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMissedPrayer(prayer.id);
                    }}
                    className="absolute -top-1 -left-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Mission Banner */}
      {featuredBundle && (
        <section className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-slate-950 text-white p-5 sm:p-8 mb-8 shadow-2xl shadow-slate-900/20 border border-slate-800">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.28),transparent_32%),radial-gradient(circle_at_80%_30%,rgba(245,158,11,0.24),transparent_30%)]" />
          <div className="relative z-10 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300 mb-3">Today's Mission</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl sm:text-4xl leading-none">{featuredBundle.icon}</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black tracking-tighter">{featuredBundle.title}</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {featuredBundle.season}
                    {featuredBundle._status === 'upcoming' && (
                      <span className="ml-2 text-amber-400">• Coming Soon</span>
                    )}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">{featuredBundle.summary}</p>
            </div>
            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
              <CatSVG awake={true} equipped={['glasses_smart', featuredBundle.rewardItemId]} className="w-20 h-20 sm:w-24 sm:h-24" isPetting={false} />
              {featuredProgress && (
                <div className="min-w-[120px]">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <span>Today</span>
                    <span>{featuredProgress.percent}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-white/10">
                    <div className="h-full rounded-full bg-emerald-400 transition-all duration-700" style={{ width: `${featuredProgress.percent}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold mt-2">{featuredProgress.done}/{featuredProgress.total} tasks complete</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Habit Matrix</h4>
          <button 
            onClick={onOpenInfoModal}
            className="text-[9px] font-black text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest flex items-center space-x-1"
          >
            <span>Glossary</span>
            <Activity className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className={`group bg-white rounded-3xl p-5 border shadow-sm transition-all flex items-center justify-between ${
                habit.completed ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-100 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onToggleHabit(habit.id)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    habit.completed
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-50 border border-slate-100 text-slate-300 hover:border-emerald-500 hover:text-emerald-500'
                  }`}
                >
                  {habit.completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6 stroke-[1.5px]" />
                  )}
                </button>
                <div className="text-left">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${
                      habit.category === 'Ruh' ? 'bg-indigo-50 text-indigo-500 border border-indigo-100' :
                      habit.category === 'Aql' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      habit.category === 'Jasad' ? 'bg-rose-50 text-rose-500 border border-rose-100' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    }`}>
                      {habit.category}
                    </span>
                    {habit.kind === 'quran_reading' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onOpenQuran(); }}
                        className="flex items-center justify-center bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md hover:bg-emerald-500 hover:text-white transition-all active:scale-95 group/quran"
                        title="Resume Reading"
                      >
                         <BookOpen className="w-2 h-2 mr-1 group-hover/quran:animate-pulse" /> Read
                      </button>
                    )}
                  </div>
                  <h4 className={`text-sm font-black tracking-tight ${habit.completed ? 'text-slate-400 line-through' : 'text-slate-800 font-bold'}`}>
                    {habit.title}
                  </h4>
                </div>
              </div>
              <div className="flex items-center space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEditHabit(habit)}
                  className="p-2.5 text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 rounded-xl border border-slate-100"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-2.5 text-slate-400 hover:text-rose-600 transition-colors bg-slate-50 rounded-xl border border-slate-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={onAddHabitClick}
            className="w-full py-4 border-2 border-dashed border-slate-100 rounded-[1.5rem] flex items-center justify-center space-x-2 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
          >
            <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
               <Plus className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-700 transition-colors">Add Habit</span>
          </button>
        </div>
      </div>

      {/* Active Seasonal Bundles — only shown when near Islamic event */}
      {activeBundles && activeBundles.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between px-2 mb-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.35em]">Seasonal Missions</h4>
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">{badges.length} Badges</span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {activeBundles.map((bundle) => {
              const progress = getBundleProgress(bundle, completedTasks);
              const isUpcoming = bundle._status === 'upcoming';
              return (
                <div key={bundle.id} className={`bg-white rounded-[2rem] p-5 border shadow-sm transition-all ${isUpcoming ? 'border-amber-100 opacity-90' : 'border-slate-100'}`}>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{bundle.icon}</span>
                      <div>
                        <h3 className="font-black text-slate-900 tracking-tight">{bundle.title}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{progress.done}/{progress.total} complete</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest rounded-full border px-2.5 py-1 ${
                      isUpcoming 
                        ? 'border-amber-200 bg-amber-50 text-amber-600' 
                        : (accentClasses[bundle.accent] || accentClasses.emerald)
                    }`}>
                      {isUpcoming ? 'Coming Soon' : 'Active'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {bundle.tasks.map((task) => {
                      const done = completedTasks[taskKey(bundle.id, task.id)];
                      return (
                        <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
                          <button
                            onClick={() => onCompleteMissionTask(bundle, task)}
                            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                              done ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-100 text-slate-300 hover:text-emerald-600'
                            }`}
                            title={done ? 'Completed' : 'Complete task'}
                          >
                            {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                          </button>
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-black tracking-tight ${done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                            <RewardChip>+{task.reward || 10}</RewardChip>
                          </div>
                          {task.quran?.verseKey && (
                            <button
                              onClick={() => onOpenVerse(task.quran.verseKey)}
                              className="shrink-0 p-2.5 rounded-xl bg-white border border-slate-100 text-emerald-600 hover:bg-emerald-50 transition-all"
                              title="Open ayah"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Evergreen Quests */}
      <section className="mb-8">
        <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-900 tracking-tight">Evergreen Quests</h3>
            <Sparkles className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="space-y-2">
            {EVERGREEN_MISSION_TASKS.map((task) => {
              const done = completedTasks[taskKey('evergreen', task.id)];
              return (
                <button
                  key={task.id}
                  onClick={() => onCompleteMissionTask({ id: 'evergreen', badgeId: 'badge_daily_light', rewardItemId: null, tasks: EVERGREEN_MISSION_TASKS }, task)}
                  className={`w-full text-left rounded-2xl p-3 border transition-all active:scale-[0.98] ${
                    done ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black">{task.title}</span>
                    {done ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <RewardChip>+{task.reward}</RewardChip>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
