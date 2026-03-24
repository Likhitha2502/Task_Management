import { configureStore } from '@reduxjs/toolkit';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from '../features/rootEpic';
import authReducer from '../features/auth/authSlice';

// 1. Initialize the middleware
const epicMiddleware = createEpicMiddleware();

// 2. Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer, // Your Reducers go here
    // tasks: taskReducer,
  },
  // We disable the built-in Thunk to use Epics instead
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
});

// 3. Start the Epic listeners
epicMiddleware.run(rootEpic);

// Types for your Hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
