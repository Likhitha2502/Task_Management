import { createDraftSafeSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { RootState } from '../../app/store';
import { api } from '@/constants/api';
import { User, ProfilePayload } from '../../models';
import http from '../../services/http';
import { getResponseError } from '@/utils/response';

export interface ProfileState {
  userProfile: User | null;
  error: string | null;
  loading: {
    fetch: boolean;
    update: boolean;
  }
  status: 'updated' | null;
};

const initialState: ProfileState = {
  userProfile: null,
  error: null,
  loading: {
    fetch: false,
    update: false,
  },
  status: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchUserProfileRequest(state, _action: PayloadAction<{ email: string }>) {
      state.loading.fetch = true;
      state.error = null;
    },
    fetchUserProfileSuccess(state, action: PayloadAction<User>) {
      state.loading.fetch = false;
      state.userProfile = action.payload;
      state.error = null;
    },
    fetchUserProfileFailure(state, action: PayloadAction<string>) {
      state.loading.fetch = false;
      state.error = action.payload;
    },

    updateUserProfileRequest(state, _action: PayloadAction<{ email: string; values: ProfilePayload }>) {
      state.loading.update = true;
      state.status = null;
      state.error = null;
    },
    updateUserProfileSuccess(state, action: PayloadAction<User>) {
      state.userProfile = action.payload;
      state.loading.update = false;
      state.status = 'updated';
      state.error = null;
    },
    updateUserProfileFailure(state, action: PayloadAction<string>) {
      state.loading.update = false;
      state.error = action.payload;
    },

    clearProfileError(state) {
      state.error = null;
    },
  },
});

export const profileSliceActions = profileSlice.actions;

export default profileSlice.reducer;

const selectProfileState = (state: RootState): ProfileState => state.profile;

export const selectors = {
  userProfile: createDraftSafeSelector(selectProfileState, (profile) => profile.userProfile),
  getStatus: createDraftSafeSelector(
    selectProfileState,
    (profile) => profile.status
  ),
  getloaders: createDraftSafeSelector(
    selectProfileState,
    (profile) => profile.loading
  ),
  profileError: createDraftSafeSelector(selectProfileState, (profile) => profile.error),
};

const fetchUserProfileEpic: Epic = (action$) =>
  action$.pipe(
    ofType(profileSliceActions.fetchUserProfileRequest.type),
    switchMap(({ payload }: { type: string; payload: { email: string } }) =>
      from(http.get<User>(api.profile.userInfo(payload.email))).pipe(
        map((response) => profileSliceActions.fetchUserProfileSuccess(response.data)),
        catchError((error) => {
          const message = getResponseError(error) || 'Failed to fetch user profile.';
          return of(profileSliceActions.fetchUserProfileFailure(String(message)));
        })
      )
    )
  );

const updateUserProfileEpic: Epic = (action$) =>
  action$.pipe(
    ofType(profileSliceActions.updateUserProfileRequest.type),
    switchMap(({ payload }: { type: string; payload: { values: ProfilePayload, email: string } }) =>
      from(http.put<User>(api.profile.updateUserInfo(payload.email), payload.values)).pipe(
        map((response) => profileSliceActions.updateUserProfileSuccess(response.data)),
        catchError((error) => {
          const message = getResponseError(error) || 'Failed to update user profile.';
          return of(profileSliceActions.updateUserProfileFailure(String(message)));
        })
      )
    )
  );

export const profileEpics = combineEpics(fetchUserProfileEpic, updateUserProfileEpic);
