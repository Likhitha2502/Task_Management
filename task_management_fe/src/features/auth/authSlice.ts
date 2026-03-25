import { RootState } from '@/app/store';
import { User, RegisterPayload, RequestStatus, LoginPayload } from '@/models';
import { createDraftSafeSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import http from '../../services/http';

export interface AuthState {
  currentUser: User | null;
  isAuthorized: boolean | null;
  register: boolean;
  loading: boolean;
  accessToken: string | null;
  error: string | null;
  statuses: {
    login: RequestStatus;
    logout: RequestStatus;
  };
}

const initialState: AuthState = {
  currentUser: null,
  isAuthorized: false,
  register: false,
  loading: false,
  accessToken: null,
  error: null,
  statuses: {
    login: RequestStatus.Idle,
    logout: RequestStatus.Idle,
  },
};

// Slice

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Register
    registerRequest(state, action: PayloadAction<RegisterPayload>) {
      state.register = true;
      state.error = null;
    },
    registerSuccess(state, action: PayloadAction<User>) {
      state.register = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.register = false;
      state.error = action.payload;
    },

    // Login
    loginRequest(state, _action: PayloadAction<LoginPayload>) {
      state.isAuthorized = null;
      state.error = null;
      state.statuses.login = RequestStatus.Pending;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.currentUser = action.payload;
      state.statuses.login = RequestStatus.Success;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.statuses.login = RequestStatus.Failure;
    },

    // ── Logout ────────────────────────────────────────────────────────────────
    logout(state) {
      state.currentUser = null;
      state.error = null;
      state.statuses.logout = RequestStatus.Idle;
    },

    // ── Shared ────────────────────────────────────────────────────────────────
    clearError(state) {
      state.error = null;
    },
  },
});

export const authSliceActions = authSlice.actions;

export default authSlice.reducer;

// Selectors 

const selectAuthState = (state: RootState): AuthState => state.auth;

export const selectors = {
  isRegisterLoading: createDraftSafeSelector(selectAuthState, (auth) => auth.register),
  isAuthorized:      createDraftSafeSelector(selectAuthState, (auth) => auth.isAuthorized),
  isLoginSuccess:    createDraftSafeSelector(selectAuthState, (auth) => auth.statuses.login === RequestStatus.Success),
  isError:           createDraftSafeSelector(selectAuthState, (auth) => auth.error),
  getCurrentUser:    createDraftSafeSelector(selectAuthState, (auth) => auth.currentUser),
};

// Epics

const registerEpic: Epic = (action$) =>
  action$.pipe(
    ofType(authSliceActions.registerRequest.type),
    switchMap((action: { type: string; payload: RegisterPayload }) =>
      from(http.post<User>('/auth/register', action.payload)).pipe(
        map((response) => authSliceActions.registerSuccess(response.data)),
        catchError((error) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            error?.message ||
            'Registration failed. Please try again.';
          return of(authSliceActions.registerFailure(String(message)));
        })
      )
    )
  );

const loginEpic: Epic = (action$) =>
  action$.pipe(
    ofType(authSliceActions.loginRequest.type),
    switchMap((action: { type: string; payload: LoginPayload }) =>
      from(http.post<User>('/auth/login', action.payload)).pipe(
        map((response) => authSliceActions.loginSuccess(response.data)),
        catchError((error) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            error?.message ||
            'Login failed. Please check your credentials.';
          return of(authSliceActions.loginFailure(String(message)));
        })
      )
    )
  );

export const authEpics = combineEpics(registerEpic, loginEpic);
