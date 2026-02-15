
import React, { useState } from 'react';
import { parseTaskWithAI } from '../services/geminiService';

interface TaskModalProps {
  onClose: () => void;
  onAdd: (task: any) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ onClose, onAdd }) => {
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    reminderInterval: 60
  });

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    const parsed = await parseTaskWithAI(aiInput);
    if (parsed) {
      setFormData({
        title: parsed.title,
        description: parsed.description,
        deadline: new Date(parsed.deadline).toISOString().slice(0, 16),
        reminderInterval: parsed.reminderInterval
      });
    }
    setIsAiLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Add New Project</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <div className="mb-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
            <label className="block text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3">
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
              AI Smart Add (Natural Language)
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g. 'Workout at 6pm today remind me every 30 mins'"
                className="flex-1 bg-white border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <button 
                onClick={handleAiParse}
                disabled={isAiLoading}
                className="bg-emerald-900 text-white px-4 rounded-xl font-bold text-sm disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isAiLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
                Parse
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Enter project title"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px]"
                  placeholder="Task details..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deadline</label>
                <input 
                  required
                  type="datetime-local" 
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reminder Interval (min)</label>
                <input 
                  required
                  type="number" 
                  value={formData.reminderInterval}
                  onChange={e => setFormData({...formData, reminderInterval: parseInt(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="60"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-emerald-900/10 hover:bg-emerald-800 transition-all"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
