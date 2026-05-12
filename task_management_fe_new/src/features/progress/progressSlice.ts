import { createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import { api } from '../../constants/api';
import http from '../../services/http';

import type { RootState } from '../../app/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Epic } from 'redux-observable';

export type TaskCountData = {
  totalTasks:      number;
  toDoTasks:       number;
  inProgressTasks: number;
  inReviewTasks:   number;
  completedTasks:  number;
};

export type TaskPercentData = {
  toDoPercent:      number;
  inProgressPercent: number;
  inReviewPercent:  number;
  completedPercent: number;
};

export interface ProgressState {
  count:   TaskCountData   | null;
  percent: TaskPercentData | null;
  loading: {
    count:   boolean;
    percent: boolean;
  };
  error: string | null;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: ProgressState = {
  count:   null,
  percent: null,
  loading: {
    count:   false,
    percent: false,
  },
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // ── Fetch Count ───────────────────────────────────────────────────────────
    fetchCountRequest(state) {
      state.loading.count = true;
      state.error         = null;
    },
    fetchCountSuccess(state, action: PayloadAction<TaskCountData>) {
      state.loading.count = false;
      state.count         = action.payload;
    },
    fetchCountFailure(state, action: PayloadAction<string>) {
      state.loading.count = false;
      state.error         = action.payload;
    },

    // ── Fetch Percent ─────────────────────────────────────────────────────────
    fetchPercentRequest(state) {
      state.loading.percent = true;
      state.error           = null;
    },
    fetchPercentSuccess(state, action: PayloadAction<TaskPercentData>) {
      state.loading.percent = false;
      state.percent         = action.payload;
    },
    fetchPercentFailure(state, action: PayloadAction<string>) {
      state.loading.percent = false;
      state.error           = action.payload;
    },
  },
});

export const progressSliceActions = progressSlice.actions;
export default progressSlice.reducer;

// ─── Selectors ────────────────────────────────────────────────────────────────

const selectProgressState = (state: RootState): ProgressState => state.progress;

export const progressSelectors = {
  getCount:   createDraftSafeSelector(selectProgressState, (s) => s.count),
  getPercent: createDraftSafeSelector(selectProgressState, (s) => s.percent),
  isLoading:  createDraftSafeSelector(selectProgressState, (s) => s.loading),
  getError:   createDraftSafeSelector(selectProgressState, (s) => s.error),
  total:      createDraftSafeSelector(selectProgressState, (s) => s.count?.totalTasks ?? 0),
};

// ─── Epics ────────────────────────────────────────────────────────────────────

const fetchCountEpic: Epic = (action$) =>
  action$.pipe(
    ofType(progressSliceActions.fetchCountRequest.type),
    switchMap(() =>
      from(http.get<TaskCountData>(api.progress.count)).pipe(
        map((res) => progressSliceActions.fetchCountSuccess(res.data)),
        catchError((error) => of(progressSliceActions.fetchCountFailure(
          error?.response?.data?.message || 'Failed to load task counts.'
        )))
      )
    )
  );

const fetchPercentEpic: Epic = (action$) =>
  action$.pipe(
    ofType(progressSliceActions.fetchPercentRequest.type),
    switchMap(() =>
      from(http.get<TaskPercentData>(api.progress.percent)).pipe(
        map((res) => progressSliceActions.fetchPercentSuccess(res.data)),
        catchError((error) => of(progressSliceActions.fetchPercentFailure(
          error?.response?.data?.message || 'Failed to load task percentages.'
        )))
      )
    )
  );

export const progressEpics = combineEpics(fetchCountEpic, fetchPercentEpic);
