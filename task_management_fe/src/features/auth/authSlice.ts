import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ajax } from 'rxjs/ajax';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ofType, combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { jwtService } from '../services/jwt';

// Define the State
interface AuthState {
  user: any | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: jwtService.getToken(),
  isLoading: false,
  error: null,
};

// --- THE SLICE ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 1. Trigger Action (Called from UI)
    loginRequest: (state, _action: PayloadAction<any>) => {
      state.isLoading = true;
      state.error = null;
    },
    // 2. Success Action (Called by Epic)
    loginSuccess: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      // Side effect: Save to local storage
      if (action.payload.accessToken) {
        jwtService.saveToken(action.payload.accessToken);
      }
    },
    // 3. Failure Action (Called by Epic)
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      jwtService.removeToken();
      state.user = null;
      state.accessToken = null;
    }
  }
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;

// --- THE EPIC (The Ajax Logic) ---
export const loginEpic = (action$: any) => action$.pipe(
  ofType(loginRequest.type),
  mergeMap((action: any) =>
    ajax({
      url: 'http://localhost:8080/api/auth/login', // Use your api.ts variable here later
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: action.payload
    }).pipe(
      map(response => loginSuccess(response.response)),
      catchError(error => {
        const message = error.response?.message || 'Login failed. Please check your credentials.';
        return of(loginFailure(message));
      })
    )
  )
);

// Combine all epics in this file (if you add more like signupEpic)
export const authEpics = combineEpics(loginEpic);

export default authSlice.reducer;
