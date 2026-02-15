
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';

interface TasksViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, onToggleTask, onDeleteTask }) => {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Objective List</h2>
          <p className="text-slate-500 text-sm font-medium">{filteredTasks.length} threads found.</p>
        </div>
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
          {['all', TaskStatus.PENDING, TaskStatus.DONE].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-300 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
               <i className="fa-solid fa-ghost text-3xl"></i>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Objectives</p>
            <p className="text-slate-300 text-xs mt-2">The system is standing by.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex items-center justify-between group hover:border-slate-400 transition-all">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                    task.status === TaskStatus.DONE 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-200 text-transparent hover:border-emerald-500 group-hover:scale-110'
                  }`}
                >
                  <i className="fa-solid fa-check"></i>
                </button>
                <div>
                  <h4 className={`text-lg font-black tracking-tight text-slate-900 ${task.status === TaskStatus.DONE ? 'line-through opacity-30' : ''}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <i className="fa-solid fa-calendar text-emerald-500 opacity-50"></i>
                      Due: {new Date(task.deadline).toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <i className="fa-solid fa-bell text-rose-500 opacity-50"></i>
                      Every {task.reminderInterval}m
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono text-slate-300">ID: {task.id.slice(0, 8)}</span>
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksView;
