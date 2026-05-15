import { taskSelectors } from '@/features/tasks/tasksSlice';

import {
  selectors as authSelectors
} from '../features/auth/authSlice';
import { focusTimerSelectors } from '../features/focusTimer/focusTimerSlice';
import {
  selectors as profileSelectors,
} from '../features/profile/profileSlice';
import { progressSelectors } from '../features/progress/progressSlice';
import { toastSelectors } from '../features/toast/toastSlice';

export const selectors = {
  auth: authSelectors,
  focusTimer: focusTimerSelectors,
  profile: profileSelectors,
  progress: progressSelectors,
  tasks: taskSelectors,
  toast: toastSelectors,
};
