import { TaskStatus, TasksPriority } from "./task";

export const CORAL       = '#D35F55';
export const CORAL_LIGHT = '#fdf1f0';

export const STATUS_COLORS: Record<TaskStatus, { bg: string; color: string }> = {
  'DONE':        { bg: '#e8f5e9', color: '#2e7d32' },
  'IN_PROGRESS': { bg: '#e3f2fd', color: '#1565c0' },
  'REVIEW':      { bg: '#f3e5f5', color: '#6a1b9a' },
  'TODO':       { bg: '#f5f5f5', color: '#757575' },
};

export const PRIORITY_COLORS: Record<TasksPriority, { bg: string; color: string }> = {
  'CRITICAL': { bg: '#ffebee', color: '#c62828' },
  'HIGH':     { bg: '#fff3e0', color: '#e65100' },
  'MEDIUM':   { bg: '#fffde7', color: '#f9a825' },
  'LOW':      { bg: '#e8f5e9', color: '#2e7d32' },
};
