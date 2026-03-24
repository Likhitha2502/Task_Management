// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from '../features/rootEpic';
import authReducer from '../features/auth/authSlice';

// Typed action/state for epicMiddleware
const epicMiddleware = createEpicMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
