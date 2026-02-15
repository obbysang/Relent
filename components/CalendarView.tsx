
import React from 'react';
import { Task } from '../types';

interface CalendarViewProps {
  tasks: Task[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();

  // Simple grid logic for the current month (demo)
  const daysInMonth = new Array(31).fill(0).map((_, i) => i + 1);

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => new Date(t.deadline).getDate() === day);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Deadline Calendar</h1>
          <p className="text-slate-500 font-medium">{currentMonth} {year}</p>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="grid grid-cols-7 border-b border-slate-100">
          {days.map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 grid-rows-5 h-[600px]">
          {daysInMonth.map(day => {
            const dayTasks = getTasksForDay(day);
            const isToday = day === now.getDate();
            return (
              <div key={day} className={`border-r border-b border-slate-100 p-4 hover:bg-slate-50 transition-all relative group`}>
                <span className={`text-sm font-bold ${isToday ? 'bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-400'}`}>
                  {day}
                </span>
                <div className="mt-2 space-y-1">
                  {dayTasks.map(t => (
                    <div key={t.id} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg truncate border border-emerald-100">
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
