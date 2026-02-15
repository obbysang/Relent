
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Task, TaskStatus, ReminderLog } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
  reminderLogs: ReminderLog[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, reminderLogs }) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === TaskStatus.DONE).length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    pings: reminderLogs.length
  };

  const chartData = [
    { name: 'Mon', tasks: 12, pings: 45 },
    { name: 'Tue', tasks: 19, pings: 52 },
    { name: 'Wed', tasks: 15, pings: 38 },
    { name: 'Thu', tasks: 22, pings: 65 },
    { name: 'Fri', tasks: 30, pings: 48 },
    { name: 'Sat', tasks: 10, pings: 20 },
    { name: 'Sun', tasks: 8, pings: 15 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Performance Metrics</h1>
          <p className="text-slate-500 font-medium">Tracking objective completion velocity and system persistence.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatItem label="Throughput" value={stats.total} icon="fa-chart-simple" color="text-slate-900" />
        <StatItem label="Finalized" value={stats.completed} icon="fa-check-double" color="text-emerald-600" />
        <StatItem label="Relentless Pings" value={stats.pings} icon="fa-satellite-dish" color="text-rose-600" />
        <StatItem label="Active Threads" value={stats.pending} icon="fa-bolt" color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
          <h3 className="text-lg font-bold mb-8">System Activity (Weekly)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="pings" stroke="#10B981" fillOpacity={1} fill="url(#colorPings)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200">
          <h3 className="text-lg font-bold mb-8">Task Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="tasks" fill="#0F172A" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem: React.FC<{ label: string; value: number | string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-5">
    <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${color}`}>
      <i className={`fa-solid ${icon} text-xl`}></i>
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  </div>
);

export default AnalyticsView;
