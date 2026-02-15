
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Task, TaskStatus, ReminderLog } from '../types';
import TaskModal from './TaskModal';

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
  { name: 'W', value: 90, color: '#064E3B' },
  { name: 'T', value: 65, color: '#064E3B' },
  { name: 'F', value: 50, color: '#E2E8F0' },
  { name: 'S', value: 35, color: '#E2E8F0' },
];

const progressData = [
  { name: 'Completed', value: 41, color: '#059669' },
  { name: 'In Progress', value: 45, color: '#064E3B' },
  { name: 'Pending', value: 14, color: '#E2E8F0' },
];

const Dashboard: React.FC<DashboardProps> = ({ tasks, reminderLogs, onAddTask, onToggleTask, onDeleteTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = {
    total: tasks.length,
    ended: tasks.filter(t => t.status === TaskStatus.DONE).length,
    running: tasks.filter(t => t.status === TaskStatus.PENDING).length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING).length // Simulating 'On Discuss' for dashboard feel
  };

  const nextReminder = tasks
    .filter(t => t.status === TaskStatus.PENDING)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-500">Plan, prioritize, and accomplish your tasks with ease.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-900 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10"
          >
            <i className="fa-solid fa-plus text-sm"></i>
            Add Project
          </button>
          <button className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all">
            Import Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Projects" value={stats.total} trend="+5% Increased" color="bg-emerald-900 text-white" dark />
        <StatCard label="Ended Projects" value={stats.ended} trend="+6% Increased" color="bg-white text-slate-900" />
        <StatCard label="Running Projects" value={stats.running} trend="+2% Increased" color="bg-white text-slate-900" />
        <StatCard label="Pending Project" value={stats.pending} trend="On Discuss" color="bg-white text-slate-900" />
      </div>

      {/* Analytics and Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold mb-6">Project Analytics</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                  {analyticsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <Tooltip cursor={{fill: 'transparent'}} content={({active, payload}) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                        {payload[0].value}%
                      </div>
                    );
                  }
                  return null;
                }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 h-full flex flex-col">
            <h3 className="text-lg font-bold mb-6">Reminders</h3>
            <div className="flex-1 flex flex-col justify-center">
              {nextReminder ? (
                <>
                  <h4 className="text-xl font-bold text-emerald-950 mb-2">{nextReminder.title}</h4>
                  <p className="text-sm text-slate-400 mb-8">
                    Time: {new Date(nextReminder.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  <button className="w-full bg-emerald-900 text-white py-3.5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-800 transition-all font-semibold mt-auto">
                    <i className="fa-solid fa-video"></i>
                    Start Meeting
                  </button>
                </>
              ) : (
                <div className="text-center py-10 opacity-50">
                  <i className="fa-solid fa-calendar-check text-4xl mb-4 text-emerald-100"></i>
                  <p>No upcoming reminders</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Projects</h3>
            <button className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all">
              + New
            </button>
          </div>
          <div className="space-y-4">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                  <i className="fa-solid fa-cube text-emerald-600"></i>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{task.title}</p>
                  <p className="text-[10px] text-slate-400">Due date: {new Date(task.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Team, Progress, Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Team Collaboration</h3>
            <button className="text-slate-500 border border-slate-200 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-slate-50">
              + Add Member
            </button>
          </div>
          <div className="space-y-4">
            <TeamItem name="Alexandra Deff" role="Github Project Repository" status="Completed" statusColor="text-emerald-600 bg-emerald-50" />
            <TeamItem name="Edwin Adenike" role="Integrate User Authentication" status="In Progress" statusColor="text-amber-600 bg-amber-50" />
            <TeamItem name="Isaac Oluwatemilorun" role="Develop Search and Filter" status="Pending" statusColor="text-rose-600 bg-rose-50" />
            <TeamItem name="David Oshodi" role="Responsive Layout for Homepage" status="In Progress" statusColor="text-amber-600 bg-amber-50" />
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 relative overflow-hidden">
          <h3 className="text-lg font-bold mb-6">Project Progress</h3>
          <div className="h-64 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={progressData} 
                  innerRadius={80} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  cy="75%"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[55%] text-center">
              <span className="text-4xl font-bold block">41%</span>
              <span className="text-xs text-slate-400">Project Ended</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-[10px] font-bold mt-2">
            {progressData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: d.color}}></div>
                <span className="text-slate-500">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-emerald-500 via-transparent to-transparent"></div>
           <h3 className="text-lg font-bold relative z-10">Time Tracker</h3>
           <div className="py-8 text-center relative z-10">
             <h2 className="text-5xl font-mono tracking-widest font-light mb-8">01:24:08</h2>
             <div className="flex justify-center gap-4">
               <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all group">
                 <i className="fa-solid fa-pause text-xl group-hover:scale-110"></i>
               </button>
               <button className="w-12 h-12 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center transition-all group shadow-lg shadow-rose-900/40">
                 <i className="fa-solid fa-stop text-xl group-hover:scale-110"></i>
               </button>
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

const StatCard: React.FC<{ label: string; value: number | string; trend: string; color: string; dark?: boolean }> = ({ label, value, trend, color, dark }) => (
  <div className={`${color} p-6 rounded-3xl border ${dark ? 'border-transparent shadow-xl shadow-emerald-900/10' : 'border-slate-200'} relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
    <div className={`absolute top-4 right-4 w-8 h-8 ${dark ? 'bg-white/10' : 'bg-slate-100'} rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform`}>
      <i className={`fa-solid fa-arrow-up-right-from-square text-xs ${dark ? 'text-white' : 'text-slate-900'}`}></i>
    </div>
    <p className={`text-xs font-semibold mb-4 ${dark ? 'text-emerald-100' : 'text-slate-400'}`}>{label}</p>
    <p className="text-4xl font-bold mb-4">{value}</p>
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md inline-block ${dark ? 'bg-white/20' : 'bg-slate-100'}`}>
      <span className={`text-[10px] font-bold ${dark ? 'text-emerald-200' : 'text-slate-500'}`}>{trend}</span>
    </div>
  </div>
);

const TeamItem: React.FC<{ name: string; role: string; status: string; statusColor: string }> = ({ name, role, status, statusColor }) => (
  <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-3">
      <img src={`https://picsum.photos/seed/${name}/40/40`} className="w-10 h-10 rounded-xl object-cover" alt="" />
      <div>
        <p className="text-sm font-bold text-slate-900">{name}</p>
        <p className="text-[10px] text-slate-400">Working on <span className="text-emerald-700 font-medium">{role}</span></p>
      </div>
    </div>
    <span className={`${statusColor} px-2 py-1 rounded-lg text-[10px] font-bold`}>{status}</span>
  </div>
);

export default Dashboard;
