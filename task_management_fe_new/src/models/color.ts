import type { TasksPriority,TaskStatus } from "./task";

export const CORAL       = '#D35F55';
export const CORAL_LIGHT = '#fdf1f0';

export const STATUS_COLORS: Record<TaskStatus, { bg: string; color: string }> = {
  'DONE':        { bg: '#e8f5e9', color: '#2e7d32' },
  'IN_PROGRESS': { bg: '#e3f2fd', color: '#1565c0' },
  'REVIEW':      { bg: '#f3e5f5', color: '#6a1b9a' },
  'TODO':       { bg: '#f5f5f5', color: '#757575' },
};

export const PIE_COLORS: Record<string, string> = {
  // Count API keys
  toDoTasks:        '#90A4AE',
  inProgressTasks:  '#2196F3',
  inReviewTasks:    '#9C27B0',
  completedTasks:   '#4CAF50',
  // Percent API keys
  toDoPercent:      '#90A4AE',
  inProgressPercent:'#2196F3',
  inReviewPercent:  '#9C27B0',
  completedPercent: '#4CAF50',
  // Direct TaskStatus keys (fallback)
  TODO:             '#90A4AE',
  IN_PROGRESS:      '#2196F3',
  REVIEW:           '#9C27B0',
  DONE:             '#4CAF50',
};

export const PIE_FALLBACK_PALETTE = [
  '#FF7043', '#26C6DA', '#FFCA28', '#EC407A',
  '#78909C', '#8D6E63', '#66BB6A', '#FFA726',
];

export const PRIORITY_COLORS: Record<TasksPriority, { bg: string; color: string }> = {
  'CRITICAL': { bg: '#ffebee', color: '#c62828' },
  'HIGH':     { bg: '#fff3e0', color: '#e65100' },
  'MEDIUM':   { bg: '#fffde7', color: '#f9a825' },
  'LOW':      { bg: '#e8f5e9', color: '#2e7d32' },
};
