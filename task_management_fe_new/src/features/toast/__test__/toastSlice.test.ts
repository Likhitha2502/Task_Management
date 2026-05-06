import {of } from 'rxjs';
import { toArray } from 'rxjs/operators';

import { authSliceActions } from '../../auth/authSlice';
import { profileSliceActions } from '../../profile/profileSlice';
import { taskSliceActions } from '../../tasks/tasksSlice';
import reducer, {
  toastEpic,
  toastSelectors,
  toastSliceActions
} from '../toastSlice';

import type { LoginResponse , User } from '../../../models';
import type { Task } from '../../../models/task';
import type {
  ToastState} from '../toastSlice';
import type { Observable} from 'rxjs';

import { describe, expect,it } from '@jest/globals';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockLoginResponse: LoginResponse = {
  message: 'Login successful',
  email: 'alex@example.com',
  requiresPasswordReset: false,
  token: 'jwt-token-abc',
  tokenType: 'Bearer',
};

const mockTask: Task = {
  id: 1,
  title: 'Fix login bug',
  status: 'TODO',
  priority: 'HIGH',
  dueDate: '2026-06-01',
};

const mockUser: User = {
  id: 1,
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex@example.com',
  profilePictureUrl: null,
};

const initialState: ToastState = {
  open:     false,
  message:  '',
  severity: 'info',
};

const makeRootState = (toast: Partial<ToastState> = {}) => ({
  toast: { ...initialState, ...toast },
});

// ─── Reducer tests ────────────────────────────────────────────────────────────

describe('toastSlice — reducer', () => {

  it('returns the initial state when called with undefined', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('showToast', () => {
    it('sets open to true, stores message and severity', () => {
      const state = reducer(
        initialState,
        toastSliceActions.showToast({ message: 'Task created', severity: 'success' })
      );
      expect(state.open).toBe(true);
      expect(state.message).toBe('Task created');
      expect(state.severity).toBe('success');
    });

    it('replaces an existing toast with a new one', () => {
      const existing = reducer(
        initialState,
        toastSliceActions.showToast({ message: 'Old message', severity: 'info' })
      );
      const replaced = reducer(
        existing,
        toastSliceActions.showToast({ message: 'New message', severity: 'error' })
      );
      expect(replaced.open).toBe(true);
      expect(replaced.message).toBe('New message');
      expect(replaced.severity).toBe('error');
    });

    it('correctly sets warning severity', () => {
      const state = reducer(
        initialState,
        toastSliceActions.showToast({ message: 'Watch out', severity: 'warning' })
      );
      expect(state.severity).toBe('warning');
    });
  });

  describe('hideToast', () => {
    it('sets open to false, preserving message and severity', () => {
      const open = reducer(
        initialState,
        toastSliceActions.showToast({ message: 'Task deleted', severity: 'success' })
      );
      const closed = reducer(open, toastSliceActions.hideToast());
      expect(closed.open).toBe(false);
      expect(closed.message).toBe('Task deleted');
      expect(closed.severity).toBe('success');
    });

    it('is safe to call when already closed', () => {
      const state = reducer(initialState, toastSliceActions.hideToast());
      expect(state.open).toBe(false);
    });
  });
});

// ─── Selector tests ───────────────────────────────────────────────────────────

describe('toastSelectors', () => {

  describe('open', () => {
    it('returns false in initial state', () => {
      expect(toastSelectors.open(makeRootState() as any)).toBe(false);
    });
    it('returns true when toast is open', () => {
      expect(toastSelectors.open(makeRootState({ open: true }) as any)).toBe(true);
    });
  });

  describe('message', () => {
    it('returns empty string in initial state', () => {
      expect(toastSelectors.message(makeRootState() as any)).toBe('');
    });
    it('returns the current message when set', () => {
      expect(
        toastSelectors.message(makeRootState({ message: 'Profile updated successfully' }) as any)
      ).toBe('Profile updated successfully');
    });
  });

  describe('severity', () => {
    it('returns info in initial state', () => {
      expect(toastSelectors.severity(makeRootState() as any)).toBe('info');
    });
    it('returns success when set', () => {
      expect(toastSelectors.severity(makeRootState({ severity: 'success' }) as any)).toBe('success');
    });
    it('returns error when set', () => {
      expect(toastSelectors.severity(makeRootState({ severity: 'error' }) as any)).toBe('error');
    });
  });
});

// ─── Epic tests ───────────────────────────────────────────────────────────────

const runEpic = (action: any) => {
  const action$ = of(action);
  const state$  = of({ toast: initialState }) as Observable<any>;
  return toastEpic(action$, state$, {}).pipe(toArray()).toPromise() as Promise<any[]>;
};

describe('toastEpic', () => {

  it('emits nothing for an unrelated action', async () => {
    const actions = await runEpic({ type: 'some/unrelatedAction' });
    expect(actions).toHaveLength(0);
  });

  // ── Auth ───────────────────────────────────────────────────────────────────

  describe('auth actions', () => {
    it('shows success toast on loginSuccess', async () => {
      const actions = await runEpic(authSliceActions.loginSuccess(mockLoginResponse));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Logged in successfully', severity: 'success' }),
      ]);
    });

    it('shows error toast on loginFailure using the payload as message', async () => {
      const actions = await runEpic(authSliceActions.loginFailure('Invalid credentials'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Invalid credentials', severity: 'error' }),
      ]);
    });

    it('shows success toast on registerSuccess', async () => {
      const actions = await runEpic(authSliceActions.registerSuccess());
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Account created successfully', severity: 'success' }),
      ]);
    });

    it('shows error toast on registerFailure using the payload as message', async () => {
      const actions = await runEpic(authSliceActions.registerFailure('Email already exists'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Email already exists', severity: 'error' }),
      ]);
    });

    it('shows success toast on forgotPasswordSuccess', async () => {
      const actions = await runEpic(authSliceActions.forgotPasswordSuccess());
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Password reset email sent', severity: 'success' }),
      ]);
    });

    it('shows error toast on forgotPasswordFailure using the payload as message', async () => {
      const actions = await runEpic(authSliceActions.forgotPasswordFailure('Email not found'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Email not found', severity: 'error' }),
      ]);
    });

    it('shows success toast on changePasswordSuccess', async () => {
      const actions = await runEpic(authSliceActions.changePasswordSuccess());
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Password changed successfully', severity: 'success' }),
      ]);
    });

    it('shows error toast on changePasswordFailure using the payload as message', async () => {
      const actions = await runEpic(authSliceActions.changePasswordFailure('Failed to change password.'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Failed to change password.', severity: 'error' }),
      ]);
    });

    it('shows success toast on logoutSuccess', async () => {
      const actions = await runEpic(authSliceActions.logoutSuccess());
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Logged out successfully', severity: 'success' }),
      ]);
    });

    it('shows error toast on logoutFailure using the payload as message', async () => {
      const actions = await runEpic(authSliceActions.logoutFailure('Logout failed.'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Logout failed.', severity: 'error' }),
      ]);
    });
  });

  // ── Tasks ──────────────────────────────────────────────────────────────────

  describe('task actions', () => {
    it('shows success toast on createTaskSuccess', async () => {
      const actions = await runEpic(taskSliceActions.createTaskSuccess(mockTask));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Task created', severity: 'success' }),
      ]);
    });

    it('shows error toast on createTaskFailure using the payload as message', async () => {
      const actions = await runEpic(taskSliceActions.createTaskFailure('Failed to create task.'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Failed to create task.', severity: 'error' }),
      ]);
    });

    it('shows success toast on updateTaskSuccess', async () => {
      const actions = await runEpic(taskSliceActions.updateTaskSuccess());
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Task updated', severity: 'success' }),
      ]);
    });

    it('shows error toast on updateTaskFailure using the payload as message', async () => {
      const actions = await runEpic(taskSliceActions.updateTaskFailure('Failed to update task.'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Failed to update task.', severity: 'error' }),
      ]);
    });

    it('shows success toast on deleteTaskSuccess', async () => {
      const actions = await runEpic(taskSliceActions.deleteTaskSuccess());
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Task deleted', severity: 'success' }),
      ]);
    });

    it('shows error toast on deleteTaskFailure using the payload as message', async () => {
      const actions = await runEpic(taskSliceActions.deleteTaskFailure('Failed to delete task.'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Failed to delete task.', severity: 'error' }),
      ]);
    });

    it('shows error toast on fetchTasksFailure using the payload as message', async () => {
      const actions = await runEpic(taskSliceActions.fetchTasksFailure('Failed to load tasks.'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Failed to load tasks.', severity: 'error' }),
      ]);
    });
  });

  // ── Profile ────────────────────────────────────────────────────────────────

  describe('profile actions', () => {
    it('shows success toast on updateUserProfileSuccess', async () => {
      const actions = await runEpic(profileSliceActions.updateUserProfileSuccess(mockUser));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Profile updated successfully', severity: 'success' }),
      ]);
    });

    it('shows error toast on updateUserProfileFailure using the payload as message', async () => {
      const actions = await runEpic(profileSliceActions.updateUserProfileFailure('Failed to update user profile.'));
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Failed to update user profile.', severity: 'error' }),
      ]);
    });
  });

  // ── Fallback message ───────────────────────────────────────────────────────

  describe('fallback message', () => {
    it('uses "Something went wrong." when a failure action has an empty payload', async () => {
      const action = { type: taskSliceActions.fetchTasksFailure.type, payload: '' };
      const actions = await runEpic(action);
      expect(actions).toEqual([
        toastSliceActions.showToast({ message: 'Something went wrong.', severity: 'error' }),
      ]);
    });
  });
});
