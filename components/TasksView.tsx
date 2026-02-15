
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
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">All Tasks</h2>
        <div className="flex gap-2">
          {['all', TaskStatus.PENDING, TaskStatus.DONE].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === f ? 'bg-emerald-900 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center">
            <i className="fa-solid fa-clipboard-list text-4xl text-slate-200 mb-4"></i>
            <p className="text-slate-500">No tasks found in this category.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between group hover:shadow-lg hover:shadow-slate-200/50 transition-all">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onToggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.status === TaskStatus.DONE 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 text-transparent hover:border-emerald-500'
                  }`}
                >
                  <i className="fa-solid fa-check text-xs"></i>
                </button>
                <div>
                  <h4 className={`font-bold text-slate-900 ${task.status === TaskStatus.DONE ? 'line-through text-slate-400' : ''}`}>
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <i className="fa-regular fa-calendar text-emerald-500"></i>
                      Due: {new Date(task.deadline).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <i className="fa-regular fa-clock text-emerald-500"></i>
                      Remind: {task.reminderInterval}m
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
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
