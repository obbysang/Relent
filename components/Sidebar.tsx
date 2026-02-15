
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: 'fa-table-columns', label: 'Dashboard', path: '/' },
    { icon: 'fa-list-check', label: 'Tasks', path: '/tasks', badge: '12+' },
    { icon: 'fa-calendar-days', label: 'Calendar', path: '/calendar' },
    { icon: 'fa-chart-line', label: 'Analytics', path: '/analytics' },
    { icon: 'fa-users', label: 'Team', path: '/team' },
  ];

  const generalItems = [
    { icon: 'fa-gear', label: 'Settings', path: '/settings' },
    { icon: 'fa-circle-question', label: 'Help', path: '/help' },
    { icon: 'fa-right-from-bracket', label: 'Logout', path: '/logout' },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
          <i className="fa-solid fa-leaf text-xl"></i>
        </div>
        <span className="text-2xl font-bold text-slate-900 tracking-tight">Donezo</span>
      </div>

      <div className="mb-10">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-emerald-50 text-emerald-700 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className="flex items-center gap-3">
                <i className={`fa-solid ${item.icon} w-5`}></i>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">General</p>
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
        </nav>
      </div>

      <div className="mt-auto pt-6">
        <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden group cursor-pointer">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-500 opacity-20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
          <div className="relative z-10">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <i className="fa-solid fa-mobile-screen-button"></i>
            </div>
            <p className="text-sm font-semibold mb-1">Download our Mobile App</p>
            <p className="text-xs text-slate-400 mb-4">Get easy in another way</p>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg text-xs font-bold transition-colors">
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
