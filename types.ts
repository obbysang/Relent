
export enum TaskStatus {
  PENDING = 'pending',
  DONE = 'done'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  reminderInterval: number; // in minutes
  lastReminderSent?: string;
  status: TaskStatus;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  endedProjects: number;
  runningProjects: number;
  pendingProjects: number;
}

export interface ReminderLog {
  id: string;
  taskId: string;
  taskTitle: string;
  timestamp: string;
  type: 'telegram' | 'web';
}
