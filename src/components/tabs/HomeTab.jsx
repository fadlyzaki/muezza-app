import React from 'react';
import { Sparkles, MapPin, Search, CheckCircle2, Circle, Pencil, Plus, Trash2, X, Activity, ArrowRight } from 'lucide-react';
import CatSVG from '../CatSVG';
import { PRAYER_ICONS } from '../../constants/muezza_data';

export function HomeTab({ 
  energy, 
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
  prayerTimes
}) {
  return (
    <div className="px-6 py-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[4rem] p-12 mb-12 shadow-xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full -translate-y-40 translate-x-40 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full translate-y-40 -translate-x-40 blur-3xl group-hover:bg-amber-500/10 transition-colors duration-700"></div>

        <div className="flex flex-col items-center relative z-10">
          <div className="relative cursor-pointer select-none group/mascot" onClick={onPet}>
            <div className={`absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full scale-110 transition-all duration-1000 ${isPetting ? 'opacity-100 scale-125' : 'opacity-0'}`}></div>
            <CatSVG 
              awake={energy > 0} 
              className={`w-48 h-48 transition-all duration-500 relative z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)] group-hover/mascot:drop-shadow-[0_20px_20px_rgba(0,0,0,0.15)] group-hover/mascot:-translate-y-2 ${isPetting ? 'scale-110' : ''}`}
              isPetting={isPetting} 
              equipped={inventory} 
              stage={catStage}
            />
          </div>
          
          <div className="mt-8 w-full max-w-[220px]">
            <div className="flex justify-between items-center mb-2.5 px-1">
              <div className="flex items-center space-x-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Energy Matrix</p>
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">{energy}%</span>
            </div>
            <div className="h-4 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)] relative"
                style={{ width: `${energy}%` }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-shimmer"></div>
              </div>
            </div>
            
            </div>
          </div>

          {energy >= 100 ? (
             <button 
              onClick={onStartJourney}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group"
             >
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="text-lg tracking-tight">Morning Reflection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
             </button>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center space-x-3 bg-slate-50/80 px-5 py-3.5 rounded-2xl border border-slate-100 w-full justify-center">
                <p className="text-[11px] text-slate-500 leading-relaxed font-bold text-center italic">
                   &quot;Complete daily tasks to unlock spiritual reflections.&quot;
                </p>
              </div>
            </div>
          )}
        </div>

      <div className="mb-14 space-y-6">
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
                  </div>
                  <h4 className={`text-sm font-black tracking-tight ${habit.completed ? 'text-slate-400 line-through' : 'text-slate-800 font-bold'}`}>
                    {habit.title}
                  </h4>
                </div>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center space-y-2 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
               <Plus className="w-6 h-6 text-slate-300 group-hover:text-emerald-600" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-700 transition-colors">Add Performance Habit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
