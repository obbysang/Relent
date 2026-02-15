
import React from 'react';

interface PlaceholderViewProps {
  title: string;
  icon: string;
}

const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, icon }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-white rounded-[2rem] border border-slate-200 shadow-xl flex items-center justify-center mb-6">
        <i className={`fa-solid ${icon} text-4xl text-slate-900`}></i>
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">{title}</h1>
      <p className="text-slate-500 max-w-sm">This module is part of the persistent Relent ecosystem. Currently undergoing maintenance for maximum efficiency.</p>
      <button className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all">
        Back to Dashboard
      </button>
    </div>
  );
};

export default PlaceholderView;
