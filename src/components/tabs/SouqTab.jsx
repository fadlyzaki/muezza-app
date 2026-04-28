import React from 'react';
import { ShoppingBag, Coins, CheckCircle2, Droplets, Sparkles } from 'lucide-react';
import CatSVG from '../CatSVG';
import { SHOP_ITEMS } from '../../constants/muezza_data';

export function SouqTab({ dinar, inventory, onBuy }) {
  const equipmentItems = SHOP_ITEMS.filter(item => item.type !== 'food');
  const foodItems = SHOP_ITEMS.filter(item => item.type === 'food');

  const renderItemGrid = (items) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => {
        const isOwned = inventory.includes(item.id);
        const canAfford = dinar >= item.price;
        const isRepurchasable = item.type === 'food';
        
        // Items lose interactive hover only if they are fully acquired equipment
        const isFinished = isOwned && !isRepurchasable;

        return (
          <div
            key={item.id}
            className={`group bg-white rounded-[2rem] p-5 border-2 transition-all relative overflow-hidden flex flex-col items-center text-center shadow-sm ${
              isFinished
                ? 'border-emerald-100 bg-emerald-50/10'
                : canAfford
                ? 'border-slate-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1.5'
                : 'border-slate-100 opacity-60'
            }`}
          >
            {isOwned && (
              <div className="absolute top-3 right-3 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
              </div>
            )}

            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-4 transition-all shadow-inner ${
              isOwned ? 'bg-emerald-100/50' : 'bg-slate-50 group-hover:bg-emerald-50'
            }`}>
              {item.icon}
            </div>

            <h4 className={`text-sm font-black mb-1 ${isFinished ? 'text-emerald-900' : 'text-slate-800'}`}>{item.name}</h4>
            <p className="text-[10px] text-slate-500 font-medium mb-5 h-8 overflow-hidden line-clamp-2 leading-relaxed">{item.desc}</p>

            {isFinished ? (
              <span className="w-full text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 py-3 rounded-2xl border border-emerald-100">
                Acquired
              </span>
            ) : (
              <button
                onClick={() => onBuy(item)}
                disabled={!canAfford}
                className={`w-full py-3 rounded-2xl font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                  canAfford
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 active:scale-95 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-emerald-600/30'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Coins className={`w-3.5 h-3.5 transition-colors ${canAfford ? 'text-amber-400 group-hover:text-amber-300' : 'text-slate-300'}`} />
                <span>{isRepurchasable && isOwned ? `Refill ${item.price}` : item.price}</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="px-6 py-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-8 mb-8 relative overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -translate-y-16 translate-x-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full translate-y-16 -translate-x-16 blur-2xl"></div>
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full scale-125 animate-pulse duration-1000"></div>
            <CatSVG 
              awake={true} 
              className="w-32 h-32 relative z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]" 
              isPetting={false} 
              equipped={inventory}
            />
          </div>
          <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 flex items-center space-x-4 shadow-inner">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-300 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Coins className="w-6 h-6 text-amber-900" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-amber-300/80 uppercase tracking-widest leading-none mb-1">Treasury</span>
              <span className="text-3xl font-black text-white leading-none">{dinar}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-8">
        <div className="p-4 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-inner">
          <ShoppingBag className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Muezza's Souq</h3>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Divine Modules & Sustenance</p>
        </div>
      </div>

      <div className="mb-12">
        <div className="flex items-center space-x-2 mb-4 px-2">
           <Sparkles className="w-4 h-4 text-slate-400" />
           <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Spiritual Equipment</h4>
        </div>
        {renderItemGrid(equipmentItems)}
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-4 px-2">
           <Droplets className="w-4 h-4 text-emerald-500" />
           <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Sustenance (Energy)</h4>
        </div>
        {renderItemGrid(foodItems)}
      </div>
    </div>
  );
}
