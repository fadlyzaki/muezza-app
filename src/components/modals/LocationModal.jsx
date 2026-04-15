import React from 'react';
import { X, Search, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react';

export function LocationModal({ 
  onClose, 
  onDetect, 
  onSearch, 
  searchQuery, 
  setSearchQuery, 
  isSearching, 
  searchResults, 
  onSelectResult 
}) {
  return (
    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-[2rem] w-full max-w-[22rem] shadow-2xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-500 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-black text-slate-800 tracking-tight">Set Location</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          <button
            onClick={onDetect}
            className="w-full flex items-center justify-center space-x-2 bg-slate-900 text-white p-4 rounded-2xl font-bold mb-6 shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Detect Current Location</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search city (e.g., Mecca)"
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            />
            {searchQuery && (
              <button
                onClick={onSearch}
                className="absolute right-2 top-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                disabled={isSearching}
              >
                {isSearching ? '...' : 'Find'}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {isSearching ? (
              <div className="flex flex-col items-center py-8 space-y-3">
                <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-bold animate-pulse">Searching maps...</p>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((result, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectResult(result)}
                  className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group flex items-start gap-3"
                >
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{result.city}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate">{result.country}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity self-center" />
                </button>
              ))
            ) : searchQuery && !isSearching ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-400 font-medium">No locations found</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
