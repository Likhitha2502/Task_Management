import { combineEpics } from 'redux-observable';
import { authEpics } from './auth/authSlice';

export const rootEpic = combineEpics(
  authEpics,
);
