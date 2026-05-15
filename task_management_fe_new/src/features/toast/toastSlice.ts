import { createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { filter, map } from 'rxjs/operators';

import type { RootState } from '../../app/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Epic } from 'redux-observable';

export type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

export interface ToastState {
  open:     boolean;
  message:  string;
  severity: ToastSeverity;
}

const initialState: ToastState = {
  open:     false,
  message:  '',
  severity: 'info',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<{ message: string; severity: ToastSeverity }>) {
      state.open     = true;
      state.message  = action.payload.message;
      state.severity = action.payload.severity;
    },
    hideToast(state) {
      state.open = false;
    },
  },
});

export const toastSliceActions = toastSlice.actions;
export default toastSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

const selectToastState = (state: RootState): ToastState => state.toast;

export const toastSelectors = {
  open:     createDraftSafeSelector(selectToastState, (s) => s.open),
  message:  createDraftSafeSelector(selectToastState, (s) => s.message),
  severity: createDraftSafeSelector(selectToastState, (s) => s.severity),
};

// ─── Toast map ────────────────────────────────────────────────────────────────
// Uses RTK's generated type strings ('sliceName/actionName') to avoid
// importing other slices here, which would create a circular dependency via
// toastSlice → authSlice → http → store → rootEpic → toastSlice.

type ToastConfig = { message: string | null; severity: ToastSeverity };

const TOAST_MAP: Record<string, ToastConfig> = {
  // Auth
  'auth/loginSuccess':          { message: 'Logged in successfully',         severity: 'success' },
  'auth/loginFailure':          { message: null,                             severity: 'error'   },
  'auth/registerSuccess':       { message: 'Account created successfully',   severity: 'success' },
  'auth/registerFailure':       { message: null,                             severity: 'error'   },
  'auth/forgotPasswordSuccess': { message: 'Password reset email sent',      severity: 'success' },
  'auth/forgotPasswordFailure': { message: null,                             severity: 'error'   },
  'auth/changePasswordSuccess': { message: 'Password changed successfully',  severity: 'success' },
  'auth/changePasswordFailure': { message: null,                             severity: 'error'   },
  'auth/logoutSuccess':         { message: 'Logged out successfully',         severity: 'success' },
  'auth/logoutFailure':         { message: null,                             severity: 'error'   },

  // Tasks
  'tasks/createTaskSuccess':    { message: 'Task created',                   severity: 'success' },
  'tasks/createTaskFailure':    { message: null,                             severity: 'error'   },
  'tasks/updateTaskSuccess':    { message: 'Task updated',                   severity: 'success' },
  'tasks/updateTaskFailure':    { message: null,                             severity: 'error'   },
  'tasks/deleteTaskSuccess':    { message: 'Task deleted',                   severity: 'success' },
  'tasks/deleteTaskFailure':    { message: null,                             severity: 'error'   },
  'tasks/fetchTasksFailure':    { message: null,                             severity: 'error'   },

  // Profile
  'profile/updateUserProfileSuccess': { message: 'Profile updated successfully', severity: 'success' },
  'profile/updateUserProfileFailure': { message: null,                           severity: 'error'   },

  // Progress
  'progress/fetchCountFailure':   { message: null, severity: 'error' },
  'progress/fetchPercentFailure': { message: null, severity: 'error' },

  // Focus Timer
  'focusTimer/startFocusTimerSuccess': { message: 'Focus timer activated',   severity: 'success' },
  'focusTimer/startFocusTimerFailure': { message: null,                      severity: 'error'   },
  'focusTimer/focusTimerDeactivated':  { message: 'Focus timer session ended', severity: 'info'  },
};

// ─── Epic ─────────────────────────────────────────────────────────────────────

export const toastEpic: Epic = (action$) =>
  action$.pipe(
    filter((action): action is PayloadAction<string> =>
      typeof action === 'object' && action !== null && 'type' in action &&
      (action as PayloadAction).type in TOAST_MAP
    ),
    map((action) => {
      const config  = TOAST_MAP[action.type];
      const message = config.message ?? (action.payload || 'Something went wrong.');
      return toastSliceActions.showToast({ message, severity: config.severity });
    })
  );
