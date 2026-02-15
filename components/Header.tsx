
import React from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="relative w-full max-w-md">
        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search objectives..." 
          className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-2.5 focus:ring-2 focus:ring-slate-900 outline-none text-sm transition-all"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 bg-white">
          ⌘ F
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors hidden md:block">
          <i className="fa-regular fa-envelope text-xl"></i>
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-900 relative transition-colors">
          <i className="fa-regular fa-bell text-xl"></i>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">System Admin</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Relentless Mode</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden ring-2 ring-transparent group-hover:ring-slate-900 transition-all">
            <i className="fa-solid fa-user-secret text-slate-600"></i>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
