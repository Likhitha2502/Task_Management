// src/store/boundActions.ts
import { bindActionCreators } from '@reduxjs/toolkit';
import { store } from './store';

// ── Import all slice actions here ─────────────────────────────────────────────
import {
    authSliceActions
} from '../features/auth/authSlice';
import {
    profileSliceActions
} from '../features/profile/profileSlice';

// Add more slice imports as your app grows:
// import { createTask, deleteTask, updateTask } from './slices/taskSlice';

// ─── Bound Actions ────────────────────────────────────────────────────────────
// Each key matches the slice name so you call:
// boundActions.auth.registerRequest(payload)
// boundActions.tasks.createTask(payload)

export const boundActions = {
    auth: bindActionCreators(
        authSliceActions,
        store.dispatch
    ),
    profile: bindActionCreators(
        profileSliceActions,
        store.dispatch
    ),

    // tasks: bindActionCreators(
    //   { createTask, deleteTask, updateTask },
    //   store.dispatch
    // ),
};
