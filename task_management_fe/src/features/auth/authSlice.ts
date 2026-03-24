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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ── Register ──────────────────────────────────────────────────────────────
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

    loginRequest(state, action: PayloadAction<LoginPayload>) {
      state.isAuthorized = null;
      //state.accessToken = null;
      state.error = null;
      state.statuses.login = RequestStatus.Pending;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      // if (action.accesstoken) {
      // state.isAuthorized = true;
      // }
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

    // ── Reset error/status ────────────────────────────────────────────────────
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = authSlice.actions;

export const authSliceActions = authSlice.actions;

export default authSlice.reducer;

const selectAuthState = (state: RootState): AuthState => state.auth;

export const selectors = {
  isRegisterLoading: createDraftSafeSelector(selectAuthState, state => state.register),
  isAuthorized: createDraftSafeSelector(selectAuthState, (auth) => auth.isAuthorized),
  isLoginSuccess: createDraftSafeSelector(selectAuthState, (auth) => auth.statuses.login === RequestStatus.Success),
  isError: createDraftSafeSelector(selectAuthState, state => state.error),
  getCurrentUser: createDraftSafeSelector(selectAuthState, (auth) => auth.currentUser),
};

export const registerEpic: Epic = (action$) =>
  action$.pipe(
    ofType(registerRequest.type),
    switchMap((action: { type: string; payload: RegisterPayload }) =>
      from(
        http.post<User>('/auth/register', action.payload)
      ).pipe(
        map((response) => {
          const user = response.data;

          // Persist JWT so http interceptor attaches it to future requests
          //commented unmtil BE modified for token
          // if (user.token) {
          //   jwtService.setToken(user.token);
          // }

          return registerSuccess(user);
        }),
        catchError((error) => {
          // Handles both Axios errors and Spring Boot error responses
          const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            error?.message ||
            'Registration failed. Please try again.';

          return of(registerFailure(String(message)));
        })
      )
    )
  );
const loginEpic: Epic = (action$) =>
  action$.pipe(
    ofType(loginRequest.type),
    switchMap((action: { type: string; payload: LoginPayload }) =>
      from(http.post<User>('/auth/login', action.payload)).pipe(
        map((response) => {
          const user = response.data;
          // if (user.token) jwtService.setToken(user.token); // uncomment when BE adds token
          return loginSuccess(user);
        }),
        catchError((error) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            error?.message ||
            'Login failed. Please check your credentials.';
          return of(loginFailure(String(message)));
        })
      )
    )
  );
// Combine all epics in this file (if you add more like signupEpic)
export const authEpics = combineEpics(registerEpic, loginEpic);
