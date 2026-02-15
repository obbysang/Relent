
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TasksView from './components/TasksView';
import { Task, TaskStatus, ReminderLog } from './types';
import { v4 as uuidv4 } from 'uuid';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('donezo_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => {
    const saved = localStorage.getItem('donezo_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('donezo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('donezo_reminders', JSON.stringify(reminderLogs));
  }, [reminderLogs]);

  // Simulated Reminder Logic (Scheduler)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTasks(prevTasks => {
        const updatedTasks = [...prevTasks];
        let logsUpdated = false;
        const newLogs: ReminderLog[] = [];

        updatedTasks.forEach((task, idx) => {
          if (task.status === TaskStatus.PENDING) {
            const deadline = new Date(task.deadline);
            const lastReminder = task.lastReminderSent ? new Date(task.lastReminderSent) : null;
            
            // Logic: Remind if current time is >= deadline and enough time has passed since last reminder
            const minutesSinceLast = lastReminder 
              ? (now.getTime() - lastReminder.getTime()) / (1000 * 60)
              : (now.getTime() - deadline.getTime()) / (1000 * 60);

            if (now >= deadline && (!lastReminder || minutesSinceLast >= task.reminderInterval)) {
              updatedTasks[idx] = { ...task, lastReminderSent: now.toISOString() };
              newLogs.push({
                id: uuidv4(),
                taskId: task.id,
                taskTitle: task.title,
                timestamp: now.toISOString(),
                type: 'telegram'
              });
              logsUpdated = true;
            }
          }
        });

        if (logsUpdated) {
          setReminderLogs(prev => [...newLogs, ...prev].slice(0, 50));
          return updatedTasks;
        }
        return prevTasks;
      });
    }, 10000); // Check every 10 seconds for demo purposes

    return () => clearInterval(interval);
  }, []);

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
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 text-slate-800">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={
                <Dashboard 
                  tasks={tasks} 
                  reminderLogs={reminderLogs} 
                  onAddTask={addTask}
                  onToggleTask={toggleTaskStatus}
                  onDeleteTask={deleteTask}
                />
              } />
              <Route path="/tasks" element={
                <TasksView 
                  tasks={tasks} 
                  onToggleTask={toggleTaskStatus} 
                  onDeleteTask={deleteTask}
                />
              } />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
