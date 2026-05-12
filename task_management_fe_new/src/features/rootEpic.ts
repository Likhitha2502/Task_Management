import { combineEpics } from 'redux-observable';

import { authEpics } from './auth/authSlice';
import { profileEpics } from './profile/profileSlice';
import { progressEpics } from './progress/progressSlice';
import { taskEpics } from './tasks/tasksSlice';
import { toastEpic } from './toast/toastSlice';

export const rootEpic = combineEpics(
  authEpics,
  profileEpics,
  progressEpics,
  taskEpics,
  toastEpic,
);
