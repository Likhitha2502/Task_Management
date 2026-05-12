// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';

import authReducer from '../features/auth/authSlice';
import profileReducer from '../features/profile/profileSlice';
import progressReducer from '../features/progress/progressSlice';
import { rootEpic } from '../features/rootEpic';
import tasksReducer from '../features/tasks/tasksSlice';
import toastReducer from '../features/toast/toastSlice';

// Typed action/state for epicMiddleware
const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    progress: progressReducer,
    tasks: tasksReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-observable handles async side effects, thunk not needed
      thunk: false,
    }).concat(epicMiddleware),
});

// Run root epic AFTER store is created
epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Break the http → store circular dep by injecting dispatch after store init
import { injectStore } from '../services/http';
injectStore(store.dispatch);
