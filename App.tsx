
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import TelegramSimulator from './components/TelegramSimulator';
import Login from './components/Login';
import AnalyticsView from './components/AnalyticsView';
import CalendarView from './components/CalendarView';
import PlaceholderView from './components/PlaceholderView';
import { Task, TaskStatus, ReminderLog } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('relent_auth') === 'true';
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('relent_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => {
    const saved = localStorage.getItem('relent_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeReminders, setActiveReminders] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('relent_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('relent_reminders', JSON.stringify(reminderLogs));
  }, [reminderLogs]);

  // Simulated Reminder Logic (Relentless Scheduler)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const now = new Date();
      setTasks(prevTasks => {
        let logsUpdated = false;
        const newLogs: ReminderLog[] = [];
        const triggeredTaskTitles: string[] = [];

        const nextTasks = prevTasks.map(task => {
          if (task.status === TaskStatus.PENDING) {
            const deadline = new Date(task.deadline);
            const lastReminder = task.lastReminderSent ? new Date(task.lastReminderSent) : null;
            
            // Logic: Remind if current time is >= deadline 
            const minutesSinceLast = lastReminder 
              ? (now.getTime() - lastReminder.getTime()) / (1000 * 60)
              : (now.getTime() - deadline.getTime()) / (1000 * 60);

            if (now >= deadline && (!lastReminder || minutesSinceLast >= task.reminderInterval)) {
              logsUpdated = true;
              newLogs.push({
                id: uuidv4(),
                taskId: task.id,
                taskTitle: task.title,
                timestamp: now.toISOString(),
                type: 'telegram'
              });
              triggeredTaskTitles.push(task.title);
              return { ...task, lastReminderSent: now.toISOString() };
            }
          }
          return task;
        });

        if (logsUpdated) {
          setReminderLogs(prev => [...newLogs, ...prev].slice(0, 50));
          setActiveReminders(prev => [...new Set([...prev, ...triggeredTaskTitles])]);
          
          if (Notification.permission === "granted") {
             triggeredTaskTitles.forEach(title => {
               new Notification("Relentless Reminder", { body: `Task "${title}" is overdue!` });
             });
          }
          return nextTasks;
        }
        return prevTasks;
      });
    }, 10000); // Check every 10s for snappier demo

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const addTask = (newTask: Partial<Task>) => {
    const task: Task = {
      id: uuidv4(),
      title: newTask.title || 'Untitled Task',
      description: newTask.description || '',
      deadline: newTask.deadline || new Date(Date.now() + 86400000).toISOString(),
      reminderInterval: newTask.reminderInterval || 60,
      status: TaskStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [task, ...prev]);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === TaskStatus.DONE ? TaskStatus.PENDING : TaskStatus.DONE } : t
    ));
    const task = tasks.find(t => t.id === id);
    if (task) {
        setActiveReminders(prev => prev.filter(title => title !== task.title));
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('relent_auth', 'true');
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('relent_auth');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 text-slate-800">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            
            {activeReminders.length > 0 && (
                <div className="fixed top-24 right-8 z-50 space-y-2 pointer-events-none">
                    {activeReminders.map(title => (
                        <div key={title} className="bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border-2 border-white/20">
                            <i className="fa-solid fa-bell"></i>
                            <span className="font-bold">RELENTLESS: {title} is overdue!</span>
                        </div>
                    ))}
                </div>
            )}

            <Routes>
              <Route path="/" element={
                <Dashboard 
                  tasks={filteredTasks} 
                  reminderLogs={reminderLogs} 
                  onAddTask={addTask}
                  onToggleTask={toggleTaskStatus}
                  onDeleteTask={deleteTask}
                />
              } />
              <Route path="/tasks" element={
                <TasksView 
                  tasks={filteredTasks} 
                  onToggleTask={toggleTaskStatus} 
                  onDeleteTask={deleteTask}
                />
              } />
              <Route path="/bot" element={
                <TelegramSimulator 
                  tasks={tasks}
                  onAddTask={addTask}
                  onToggleTask={toggleTaskStatus}
                />
              } />
              <Route path="/analytics" element={<AnalyticsView tasks={tasks} reminderLogs={reminderLogs} />} />
              <Route path="/calendar" element={<CalendarView tasks={tasks} />} />
              <Route path="/settings" element={<PlaceholderView title="Settings" icon="fa-gear" />} />
              <Route path="/help" element={<PlaceholderView title="Help Center" icon="fa-circle-question" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
