import React from 'react';
import { ShoppingBag, Coins, CheckCircle2 } from 'lucide-react';
import CatSVG from '../CatSVG';
import { SHOP_ITEMS } from '../../constants/muezza_data';

export function SouqTab({ dinar, inventory, onBuy }) {
  return (
    <div className="px-6 py-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-8 relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
            <CatSVG 
              awake={true} 
              className="w-32 h-32 relative z-10 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" 
              isPetting={false} 
              equipped={inventory}
            />
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Coins className="w-5 h-5 text-amber-900" />
            </div>
            <span className="text-2xl font-black text-white">{dinar}</span>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">Balance</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-emerald-100 rounded-2xl">
          <ShoppingBag className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Muezza's Souq</h3>
          <p className="text-sm text-slate-500 font-medium tracking-tight">Equip your substrate with divine modules and sustenance</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {SHOP_ITEMS.map((item) => {
          const isOwned = inventory.includes(item.id);
          const canAfford = dinar >= item.price;

          return (
            <div
              key={item.id}
              className={`group bg-white rounded-[2rem] p-5 border-2 transition-all relative overflow-hidden flex flex-col items-center text-center shadow-sm ${
                isOwned
                  ? 'border-emerald-100 bg-emerald-50/10'
                  : canAfford
                  ? 'border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-1'
                  : 'border-slate-100 opacity-80'
              }`}
            >
              {isOwned && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-white" />
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-all shadow-inner ${
                isOwned ? 'bg-emerald-100' : 'bg-slate-50 group-hover:bg-emerald-50'
              }`}>
                {item.icon}
              </div>

              <h4 className="text-sm font-black text-slate-800 mb-1">{item.name}</h4>
              <p className="text-[10px] text-slate-500 font-medium mb-4 h-8 overflow-hidden line-clamp-2">{item.desc}</p>

              {isOwned ? (
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  Acquired
                </span>
              ) : (
                <button
                  onClick={() => onBuy(item)}
                  disabled={!canAfford}
                  className={`w-full py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                    canAfford
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 active:scale-95'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Coins className={`w-3.5 h-3.5 ${canAfford ? 'text-amber-400' : 'text-slate-300'}`} />
                  <span>{item.price}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
