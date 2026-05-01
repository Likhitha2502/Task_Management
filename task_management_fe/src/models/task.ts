export type TaskStatus   = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type TasksPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type SortField     = 'title' | 'status' | 'priority' | 'dueDate';
export type SortDirection = 'asc' | 'desc';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  priority: TasksPriority;
  dueDate: string; // ISO date string
}
export interface UpdateTaskPayload {
  id: number;
  data: Partial<Omit<Task, 'id'>>;
}
export interface CreateTaskPayload {
  title: string;
  status: TaskStatus;
  priority: TasksPriority;
  dueDate: string;
}

export interface TaskFilters {
  status:      TaskStatus[];
  priority:    TasksPriority[];
  dueDateFrom: string | null;
  dueDateTo:   string | null;
}

export const STATUSES:   TaskStatus[]   = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
export const PRIORITIES: TasksPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
