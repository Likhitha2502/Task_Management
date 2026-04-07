import { combineEpics } from 'redux-observable';
import { authEpics } from './auth/authSlice';
import { profileEpics } from './profile/profileSlice';

export const rootEpic = combineEpics(
  authEpics,
  profileEpics,
);
