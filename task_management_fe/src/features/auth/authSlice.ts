import { createDraftSafeSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RootState } from '../../app/store';
import { api } from '@/constants/api';
import { User, RegisterPayload, RequestStatus, LoginPayload, ChangePassword, LoginResponse } from '../../models/index';
import http from '../../services/http';
import { getResponseError } from '@/utils/response';
import { tempAuthService } from '@/utils/storage';

export interface AuthState {
  currentUser: User | null;
  loggedInUser: LoginResponse | null;
  isAuthorized: boolean | null;
  register: boolean;
  mustChangePassword: boolean;
  loading: {
    forgotPassword: boolean;
    changePassword: boolean;
  };
  accessToken: string | null;
  error: string | null;
  statuses: {
    register:  RequestStatus;
    login: RequestStatus;
    logout: RequestStatus;
    passwordChangeStatus: RequestStatus;
  };
}

const initialState: AuthState = {
  currentUser: null,
  loggedInUser: null,
  isAuthorized: false,
  register: false,
  mustChangePassword: false,
  loading: {
    forgotPassword: false,
    changePassword: false,
  },
  accessToken: null,
  error: null,
  statuses: {
    register: RequestStatus.Idle,
    login: RequestStatus.Idle,
    logout: RequestStatus.Idle,
    passwordChangeStatus: RequestStatus.Idle,
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
      state.statuses.register = RequestStatus.Idle;
      state.error = null;
    },
    registerSuccess(state) {
      state.register = false;
      state.statuses.register = RequestStatus.Success;
      state.error = null;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.register = false;
      state.error = action.payload;
      state.statuses.register = RequestStatus.Failure;
    },

    // Login
    loginRequest(state, _action: PayloadAction<LoginPayload>) {
      state.isAuthorized = null;
      state.error = null;
      state.statuses.login = RequestStatus.Pending;
    },
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.loggedInUser = action.payload;
      state.isAuthorized = true;
      state.statuses.login = RequestStatus.Success;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.statuses.login = RequestStatus.Failure;
    },

    forgotPasswordRequest(state, action: PayloadAction<{ email: string }>) {
      state.loading.forgotPassword = true;
      state.error = null;
    },
    forgotPasswordSuccess(state) {
      state.loading.forgotPassword = false;
      state.error = null;
    },
    forgotPasswordFailure(state, action: PayloadAction<string>) {
      state.loading.forgotPassword = false;
      state.error = action.payload;
    },

    changePasswordRequest(state, _action: PayloadAction<ChangePassword>) {
      state.error = null;
      state.loading.changePassword = true;
      state.statuses.passwordChangeStatus = RequestStatus.Idle;
    },
    changePasswordSuccess(state) {
      state.loading.changePassword = false;
      state.statuses.passwordChangeStatus = RequestStatus.Success;
      state.mustChangePassword = false;
      state.error = null;
    },
    changePasswordFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading.changePassword = false;
      state.statuses.passwordChangeStatus = RequestStatus.Failure;
    },

    setChangePasswordFlag(state, action: PayloadAction<boolean>) {
      state.mustChangePassword = action.payload;
    },

    clearPasswordStatus(state) {
      state.mustChangePassword = false;
      state.statuses.passwordChangeStatus = RequestStatus.Idle;
    },

    logout(state) {
      state.currentUser = null;
      state.error = null;
      state.statuses.logout = RequestStatus.Idle;
    },

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
  registrationSuccess: createDraftSafeSelector(selectAuthState, (auth) => auth.statuses.register === RequestStatus.Success),
  isLoginSuccess:    createDraftSafeSelector(selectAuthState, (auth) => auth.statuses.login === RequestStatus.Success),
  isError:           createDraftSafeSelector(selectAuthState, (auth) => auth.error),
  loggedInUser:    createDraftSafeSelector(selectAuthState, (auth) => auth.loggedInUser),
  authLoaders:    createDraftSafeSelector(selectAuthState, (auth) => auth.loading),
  passwordChanged: createDraftSafeSelector(selectAuthState, (auth) => auth.statuses.passwordChangeStatus === RequestStatus.Success),
  mustChangePassword: createDraftSafeSelector(selectAuthState, (auth) => auth.mustChangePassword),
};

// Epics

const registerEpic: Epic = (action$) =>
  action$.pipe(
    ofType(authSliceActions.registerRequest.type),
    switchMap((action: { type: string; payload: RegisterPayload }) =>
      from(http.post<User>(api.auth.register, action.payload)).pipe(
        map(() => authSliceActions.registerSuccess()),
        catchError((error) => {
          const message = getResponseError(error) || 'Registration failed. Please try again.';
          return of(authSliceActions.registerFailure(String(message)));
        })
      )
    )
  );

const loginEpic: Epic = (action$) =>
  action$.pipe(
    ofType(authSliceActions.loginRequest.type),
    switchMap((action: { type: string; payload: LoginPayload }) =>
      from(http.post<LoginResponse>(api.auth.login, action.payload)).pipe(
        mergeMap((response) => {
          const { requiresPasswordReset } = response.data;  // ← check flag on login
          return [
            authSliceActions.loginSuccess(response.data),
            authSliceActions.setChangePasswordFlag(requiresPasswordReset) // ← push to Redux state
          ];
        }),
        catchError((error) => {
          const message = getResponseError(error) || 'Login failed. Please check your credentials.';
          return of(authSliceActions.loginFailure(String(message)));
        })
      )
    )
  );

const forgotPasswordEpic: Epic = (action$) =>
  action$.pipe(
    ofType(authSliceActions.forgotPasswordRequest.type),
    switchMap(({ payload }: { type: string; payload: { email: string } }) =>
      from(http.post(api.auth.forgotPassword, { email: payload.email })).pipe(
        map(() => {
          tempAuthService.setTempPasswordFlag(); 
          return authSliceActions.forgotPasswordSuccess();
        }),
        catchError((error) => {
          const message = getResponseError(error) || 'Password Reset failed. Please try again.';
          return of(authSliceActions.forgotPasswordFailure(String(message)));
        })
      )
    )
  );

const changePasswordEpic: Epic = (action$) =>
  action$.pipe(
    ofType(authSliceActions.changePasswordRequest.type),
    switchMap(({ payload }: { type: string; payload: ChangePassword }) =>
      from(http.put(api.profile.changePassword, payload)).pipe(
        map(() => authSliceActions.changePasswordSuccess()),
        catchError((error) => {
          const message = getResponseError(error) || 'Failed to change password.';
          return of(authSliceActions.changePasswordFailure(String(message)));
        })
      )
    )
  );

export const authEpics = combineEpics(registerEpic, loginEpic, forgotPasswordEpic, changePasswordEpic);
