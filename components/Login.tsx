
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
           <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6 rotate-12 hover:rotate-0 transition-transform duration-500">
             <i className="fa-solid fa-bolt-lightning text-4xl text-white"></i>
           </div>
           <h1 className="text-5xl font-black text-white tracking-tighter mb-2">RELENT</h1>
           <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Persistent Objective Management</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Identification</label>
              <input 
                required
                type="email" 
                defaultValue="admin@relent.app"
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                placeholder="User identifier..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Security Key</label>
              <input 
                required
                type="password" 
                defaultValue="password"
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                placeholder="••••••••"
              />
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-400 hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50"
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Authorize Access'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
          Version 1.0.4 • Secure Environment
        </p>
      </div>
    </div>
  );
};

export default Login;
