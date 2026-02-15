
import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus } from '../types';

interface TelegramSimulatorProps {
  tasks: Task[];
  onAddTask: (task: Partial<Task>) => void;
  onToggleTask: (id: string) => void;
}

interface Message {
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({ tasks, onAddTask, onToggleTask }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Relent Bot v1.0 connected. Welcome. Use /help for commands.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCommand = (cmd: string) => {
    const args = cmd.split(' ');
    const base = args[0].toLowerCase();

    switch (base) {
      case '/help':
        return 'Available commands:\n/add [title] - Fast add task\n/list - Show pending tasks\n/done [id] - Mark task as complete\n/clear - Clear screen';
      
      case '/add':
        const title = args.slice(1).join(' ');
        if (!title) return 'Error: Please specify a task title. Usage: /add My Task Name';
        onAddTask({ title, description: 'Added via Telegram Bot', reminderInterval: 60 });
        return `✅ Objective Created: "${title}"\nDeadline set: +24h\nInterval: 60m`;

      case '/list':
        const pending = tasks.filter(t => t.status === TaskStatus.PENDING);
        if (pending.length === 0) return 'All objectives cleared. System idle.';
        return 'Active Threads:\n' + pending.map((t, i) => `${i + 1}. [${t.id.slice(0, 4)}] ${t.title}`).join('\n');

      case '/done':
        const search = args[1];
        if (!search) return 'Error: Specify a partial ID from /list. Usage: /done [id]';
        const taskToDone = tasks.find(t => t.id.startsWith(search));
        if (!taskToDone) return `Error: ID "${search}" not found.`;
        onToggleTask(taskToDone.id);
        return `🎯 Mission Success: "${taskToDone.title}" marked as DONE. Reminders terminated.`;

      case '/clear':
        setMessages([{ role: 'bot', text: 'Terminal cleared.', timestamp: new Date() }]);
        return null;

      default:
        return 'Unknown command. Use /help.';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }]);
    setInput('');

    setTimeout(() => {
      const response = handleCommand(userMsg);
      if (response) {
        setMessages(prev => [...prev, { role: 'bot', text: response, timestamp: new Date() }]);
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 font-mono">
      {/* Terminal Header */}
      <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <i className="fa-brands fa-telegram text-sky-400 text-xl"></i>
          <span className="text-slate-400 text-sm font-bold tracking-widest uppercase">Relentless_Console</span>
        </div>
        <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-emerald-500/50">ENCRYPTED_TUNNEL: OK</span>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[14px] whitespace-pre-wrap leading-relaxed ${
              m.role === 'user' 
                ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-900/50' 
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}>
              <span className="text-[10px] opacity-40 block mb-1">
                {m.role === 'user' ? 'HOST' : 'REMOTE_BOT'} @ {m.timestamp.toLocaleTimeString()}
              </span>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="flex gap-4">
          <span className="text-emerald-500 pt-2.5 font-bold">relent-bot~$</span>
          <input 
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-emerald-400 placeholder:text-emerald-900"
            placeholder="Type /help for command list..."
          />
          <button className="text-emerald-500 hover:text-emerald-400 transition-colors">
            <i className="fa-solid fa-arrow-turn-up rotate-90"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TelegramSimulator;
