
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const menuItems = [
    { icon: 'fa-table-columns', label: 'Dashboard', path: '/' },
    { icon: 'fa-list-check', label: 'Task Board', path: '/tasks' },
    { icon: 'fa-robot', label: 'Bot Terminal', path: '/bot' },
    { icon: 'fa-chart-line', label: 'Analytics', path: '/analytics' },
  ];

  const generalItems = [
    { icon: 'fa-gear', label: 'Settings', path: '/settings' },
    { icon: 'fa-circle-question', label: 'Help', path: '/help' },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
          <i className="fa-solid fa-bolt-lightning text-xl text-emerald-400"></i>
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tighter">Relent</span>
      </div>

      <div className="mb-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Core</p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-slate-900 text-white font-medium shadow-lg shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className="flex items-center gap-3">
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span>{item.label}</span>
              </div>
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">System</p>
        <nav className="space-y-1">
          {generalItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-50 text-emerald-700 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-rose-500 hover:bg-rose-50"
          >
            <i className="fa-solid fa-right-from-bracket w-5"></i>
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto pt-6">
        <div className="bg-emerald-950 rounded-2xl p-5 text-white relative overflow-hidden group cursor-pointer">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500 opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <i className="fa-brands fa-telegram"></i>
            </div>
            <p className="text-sm font-semibold mb-1">Telegram Linked</p>
            <p className="text-[10px] text-emerald-300 mb-4 uppercase tracking-tighter">Status: Monitoring...</p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
