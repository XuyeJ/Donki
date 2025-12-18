
export type TaskCategory = 'Morning' | 'Afternoon' | 'Night' | 'Safety' | 'Daily Check';

export interface CompletedTask {
  id: string;
  completedAt: string; // ISO string or simple time format
}

export interface Task {
  id: string;
  category: TaskCategory;
  text: string;
  subtext?: string;
  time?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD format
  completedTasks: CompletedTask[];
  urineCount: number;
  stoolCount: number;
  notes: string;
  photos: string[]; // Base64 strings
}

export interface EmergencyContact {
  name: string;
  phone: string;
  description: string;
}
