import { createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import { api } from '../../constants/api';
import http from '../../services/http';

import type { RootState } from '../../app/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Epic } from 'redux-observable';

export interface FocusTimerStatus {
  active: boolean;
  remainingMinutes: number;
}

export interface FocusTimerState {
  timerStatus: FocusTimerStatus | null;
  loading: { get: boolean; post: boolean };
  postStatus: 'success' | null;
  error: string | null;
}

const initialState: FocusTimerState = {
  timerStatus: null,
  loading: { get: false, post: false },
  postStatus: null,
  error: null,
};

const focusTimerSlice = createSlice({
  name: 'focusTimer',
  initialState,
  reducers: {
    fetchFocusTimerRequest(state) {
      state.loading.get = true;
      state.error = null;
    },
    fetchFocusTimerSuccess(state, action: PayloadAction<FocusTimerStatus>) {
      state.loading.get = false;
      state.timerStatus = action.payload;
    },
    fetchFocusTimerFailure(state, action: PayloadAction<string>) {
      state.loading.get = false;
      state.error = action.payload;
    },

    startFocusTimerRequest(state, _action: PayloadAction<{ durationMinutes: number }>) {
      state.loading.post = true;
      state.error = null;
      state.postStatus = null;
    },
    startFocusTimerSuccess(state) {
      state.loading.post = false;
      state.postStatus = 'success';
    },
    startFocusTimerFailure(state, action: PayloadAction<string>) {
      state.loading.post = false;
      state.error = action.payload;
    },

    clearFocusTimerPostStatus(state) {
      state.postStatus = null;
    },

    focusTimerDeactivated() { /* signal-only — no state change, consumed by toastEpic */ },
  },
});

export const focusTimerSliceActions = focusTimerSlice.actions;
export default focusTimerSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

const selectFocusTimerState = (state: RootState): FocusTimerState => state.focusTimer;

export const focusTimerSelectors = {
  timerStatus: createDraftSafeSelector(selectFocusTimerState, (s) => s.timerStatus),
  isLoading:   createDraftSafeSelector(selectFocusTimerState, (s) => s.loading),
  postStatus:  createDraftSafeSelector(selectFocusTimerState, (s) => s.postStatus),
  error:       createDraftSafeSelector(selectFocusTimerState, (s) => s.error),
};

// ─── Epics ────────────────────────────────────────────────────────────────────

const fetchFocusTimerEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(focusTimerSliceActions.fetchFocusTimerRequest.type),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const prevActive = (state as RootState).focusTimer.timerStatus?.active ?? false;
      return from(http.get<FocusTimerStatus>(api.focusTimer.get)).pipe(
        mergeMap((res) => prevActive && !res.data.active
          ? of(
              focusTimerSliceActions.fetchFocusTimerSuccess(res.data),
              focusTimerSliceActions.focusTimerDeactivated(),
            )
          : of(focusTimerSliceActions.fetchFocusTimerSuccess(res.data))
        ),
        catchError((error) => of(focusTimerSliceActions.fetchFocusTimerFailure(
          error?.response?.data?.message || 'Failed to fetch timer status.'
        )))
      );
    })
  );

const startFocusTimerEpic: Epic = (action$) =>
  action$.pipe(
    ofType(focusTimerSliceActions.startFocusTimerRequest.type),
    switchMap(({ payload }: { type: string; payload: { durationMinutes: number } }) =>
      from(http.post<void>(api.focusTimer.post, payload)).pipe(
        map(() => focusTimerSliceActions.startFocusTimerSuccess()),
        catchError((error) => of(focusTimerSliceActions.startFocusTimerFailure(
          error?.response?.data?.message || 'Failed to start focus timer.'
        )))
      )
    )
  );

export const focusTimerEpics = combineEpics(fetchFocusTimerEpic, startFocusTimerEpic);
