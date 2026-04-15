import React from 'react';
import { Sparkles, MapPin, Search, CheckCircle2, Circle, Pencil, Plus, Trash2, X, Activity } from 'lucide-react';
import CatSVG from '../CatSVG';
import { PRAYER_ICONS } from '../../constants/muezza_data';

export function HomeTab({ 
  dinar, 
  streak, 
  energy, 
  prayers, 
  habits, 
  locationLabel, 
  onOpenLocationModal,
  onPet,
  isPetting,
  inventory,
  onTogglePrayer,
  onToggleHabit,
  onEditHabit,
  onAddHabitClick,
  onStartJourney,
  journeyCooldown,
  onOpenInfoModal
}) {
  return (
    <div className="px-6 py-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-8 mb-8 shadow-xl shadow-emerald-900/5 border border-emerald-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full translate-y-16 -translate-x-16 blur-3xl group-hover:bg-amber-500/10 transition-colors duration-700"></div>

        <div className="flex justify-between items-start mb-10 relative z-10">
          <button 
            onClick={onOpenLocationModal}
            className="flex items-center space-x-3 bg-slate-50 hover:bg-emerald-50 px-5 py-3 rounded-2xl transition-all border border-slate-100 hover:border-emerald-100 group shadow-sm active:scale-95"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:text-emerald-500 transition-colors">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Sector</p>
              <p className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                {locationLabel}
                <Search className="w-3 h-3 text-slate-300 group-hover:text-emerald-400 transition-colors" />
              </p>
            </div>
          </button>

          <div className="flex flex-col items-end space-y-1.5">
            <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-2xl flex items-center space-x-2.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-black text-amber-700 font-mono tracking-tighter">{dinar} D</span>
            </div>
            <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl flex items-center space-x-2.5 shadow-sm">
              <span className="text-rose-500 text-lg font-black leading-none mt-0.5">🔥</span>
              <span className="text-sm font-black text-rose-700 font-mono tracking-tighter">{streak} Days</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mb-10 relative z-10">
          <div className="relative cursor-pointer select-none group/mascot" onClick={onPet}>
            <div className={`absolute inset-0 bg-emerald-400/10 blur-3xl rounded-full scale-110 transition-all duration-1000 ${isPetting ? 'opacity-100 scale-125' : 'opacity-0'}`}></div>
            <CatSVG 
              awake={energy > 0} 
              className={`w-40 h-40 transition-all duration-500 relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)] group-hover/mascot:drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] group-hover/mascot:-translate-y-1 ${isPetting ? 'scale-110' : ''}`}
              isPetting={isPetting} 
              equipped={inventory} 
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
            
            <button
              onClick={() => onOpenAdvisorModal()}
              className="mt-6 w-full bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-emerald-700 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 active:scale-95 group shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>Consult Muezza</span>
            </button>
          </div>
         </div>

        <div className="relative z-10 mt-6 pt-6 border-t border-slate-50">
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
      </div>

      <div className="mb-10 space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4 flex items-center justify-between">
          <span>Obligatory Rituals</span>
          <Activity className="w-3 h-3" />
        </h4>
        <div className="grid grid-cols-5 gap-3">
          {prayers.map((prayer) => {
            const IconComp = PRAYER_ICONS[prayer.id];
            return (
              <button
                key={prayer.id}
                onClick={() => onTogglePrayer(prayer.id)}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                  prayer.completed
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <div className={`p-2 rounded-xl mb-2 transition-colors ${prayer.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'}`}>
                  {IconComp && <IconComp className="w-4 h-4" />}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tight ${prayer.completed ? 'text-emerald-700' : 'text-slate-500'}`}>{prayer.name}</span>
                {prayer.completed && (
                   <div className="absolute top-1 right-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 fill-white" />
                   </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between px-2 mb-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Habit Matrix</h4>
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
             <button 
              onClick={onOpenInfoModal}
              className="p-1 px-2 text-[9px] font-black text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest"
             >
                Glossary
             </button>
          </div>
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
                    <span className="text-[8px] font-black text-slate-300 font-mono">ID_{habit.id.toString().slice(-4)}</span>
                  </div>
                  <h4 className={`text-sm font-black tracking-tight ${habit.completed ? 'text-slate-400 line-through' : 'text-slate-800 font-bold'}`}>
                    {habit.title}
                  </h4>
                </div>
              </div>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEditHabit(habit.id)}
                  className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl"
                >
                  <Pencil className="w-4 h-4" />
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
