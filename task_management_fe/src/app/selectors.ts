import { taskSelectors } from '@/features/tasks/tasksSlice';
import {
  selectors as authSelectors
} from '../features/auth/authSlice';
import {
  selectors as profileSelectors,
} from '../features/profile/profileSlice';

export const selectors = {
  auth: authSelectors,
  profile: profileSelectors,
  tasks: taskSelectors,
};
