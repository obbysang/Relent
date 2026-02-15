
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Task, TaskStatus, ReminderLog } from '../types';
import TaskModal from './TaskModal';
import { Link } from 'react-router-dom';

interface DashboardProps {
  tasks: Task[];
  reminderLogs: ReminderLog[];
  onAddTask: (task: Partial<Task>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const analyticsData = [
  { name: 'S', value: 30, color: '#E2E8F0' },
  { name: 'M', value: 45, color: '#CBD5E1' },
  { name: 'T', value: 74, color: '#10B981', highlight: true },
  { name: 'W', value: 90, color: '#0F172A' },
  { name: 'T', value: 65, color: '#0F172A' },
  { name: 'F', value: 50, color: '#E2E8F0' },
  { name: 'S', value: 35, color: '#E2E8F0' },
];

const Dashboard: React.FC<DashboardProps> = ({ tasks, reminderLogs, onAddTask, onToggleTask, onDeleteTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === TaskStatus.DONE).length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    overdue: tasks.filter(t => t.status === TaskStatus.PENDING && new Date(t.deadline) < new Date()).length
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Command Center</h1>
          <p className="text-slate-500 font-medium tracking-tight">Monitoring <span className="text-slate-900 font-bold">{stats.pending}</span> active threads. Relent mode is <span className="text-emerald-600 font-bold">ONLINE</span>.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200/50"
          >
            <i className="fa-solid fa-plus"></i>
            New Objective
          </button>
          <Link 
            to="/bot"
            className="bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-robot"></i>
            Bot Interface
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Objectives" value={stats.total} trend="Active Session" color="bg-white border-slate-200" />
        <StatCard label="Completed" value={stats.done} trend="Finalized" color="bg-emerald-50 border-emerald-100 text-emerald-900" />
        <StatCard label="Active Threads" value={stats.pending} trend="In Progress" color="bg-white border-slate-200" />
        <StatCard label="Overdue / Critical" value={stats.overdue} trend="Urgent Action" color="bg-rose-50 border-rose-100 text-rose-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-950 rounded-[2.5rem] p-8 text-emerald-400 font-mono shadow-2xl relative group overflow-hidden border border-slate-800 flex flex-col h-full min-h-[400px]">
          <div className="flex items-center justify-between mb-6 border-b border-emerald-900/30 pb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-600">Telegram_Relent_Logs</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="flex-1 space-y-3 text-[11px] overflow-y-auto no-scrollbar">
             {reminderLogs.length > 0 ? reminderLogs.slice(0, 10).map(log => (
               <div key={log.id} className="border-l-2 border-emerald-900/50 pl-3 py-1">
                 <p className="text-emerald-700">[{new Date(log.timestamp).toLocaleTimeString()}] PING_SENT</p>
                 <p className="text-emerald-300">OBJ: {log.taskTitle.toUpperCase()}</p>
                 <p className="text-[10px] text-emerald-900">DEST: telegram://user_node</p>
               </div>
             )) : (
               <div className="h-full flex items-center justify-center opacity-30 text-center flex-col gap-4">
                 <i className="fa-solid fa-radar text-3xl"></i>
                 <p>WAITING_FOR_REMINDER_TRIGGERS...</p>
               </div>
             )}
          </div>
          <Link to="/bot" className="mt-6 w-full bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-400 py-3 rounded-2xl flex items-center justify-center gap-2 border border-emerald-900/50 transition-all text-xs font-bold uppercase tracking-widest">
            Launch CLI Terminal
          </Link>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Activity Log</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Real-time Feedback</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                  {analyticsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <Tooltip cursor={{fill: 'transparent'}} content={({active, payload}) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                        {payload[0].value}% VELOCITY
                      </div>
                    );
                  }
                  return null;
                }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-xl font-black tracking-tight">Recent Objectives</h3>
             <Link to="/tasks" className="text-xs font-bold text-slate-400 uppercase hover:text-slate-900 transition-colors">View All</Link>
           </div>
           <div className="space-y-4">
             {tasks.slice(0, 4).map(task => (
               <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-all">
                 <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.status === TaskStatus.DONE ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                      <i className={`fa-solid ${task.status === TaskStatus.DONE ? 'fa-check' : 'fa-clock'}`}></i>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{task.title}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <button onClick={() => onToggleTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-900 transition-all">
                    <i className="fa-solid fa-circle-check"></i>
                 </button>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl -rotate-12 group-hover:rotate-0 transition-transform duration-700">
             <i className="fa-solid fa-fire-glow"></i>
           </div>
           <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase italic">RELENTLESS MODE</h2>
                <p className="text-slate-400 font-medium max-w-sm text-sm">The system will continue to ping your connected Telegram endpoint every interval until objectives are marked finalized. Relent does not forgive, it reminds.</p>
              </div>
              <div className="mt-8 flex gap-4">
                <Link to="/tasks" className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-xl hover:bg-emerald-400 hover:text-white transition-all text-xs uppercase tracking-widest">
                  Clear All
                </Link>
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 border border-white/10">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest">System Active</span>
                </div>
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={onAddTask} 
        />
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number | string; trend: string; color: string }> = ({ label, value, trend, color }) => (
  <div className={`${color} p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{label}</p>
    <p className="text-4xl font-black mb-4 tracking-tighter">{value}</p>
    <div className="flex items-center gap-1.5 bg-white/40 px-2 py-1 rounded-lg inline-block">
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{trend}</span>
    </div>
  </div>
);

export default Dashboard;
