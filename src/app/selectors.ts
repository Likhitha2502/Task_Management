import { taskSelectors } from '@/features/tasks/tasksSlice';

import {
  selectors as authSelectors
} from '../features/auth/authSlice';
import {
  selectors as profileSelectors,
} from '../features/profile/profileSlice';
import { toastSelectors } from '../features/toast/toastSlice';

export const selectors = {
  auth: authSelectors,
  profile: profileSelectors,
  tasks: taskSelectors,
  toast: toastSelectors,
};
