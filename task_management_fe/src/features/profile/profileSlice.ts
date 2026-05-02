import { createDraftSafeSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { RootState } from '../../app/store';
import { api } from '@/constants/api';
import { User, ProfilePayload } from '../../models';
import http from '../../services/http';
import { getResponseError } from '@/utils/response';
import { profileFile } from '@/utils/profileFile';

export interface ProfileState {
  userProfile: User | null;
  imageIcon: User['profilePictureUrl'] | null;
  error: string | null;
  loading: {
    fetch: boolean;
    image: boolean;
    update: boolean;
  }
  status: 'updated' | null;
};

const initialState: ProfileState = {
  userProfile: null,
  imageIcon: null,
  error: null,
  loading: {
    fetch: false,
    image: false,
    update: false,
  },
  status: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    fetchUserProfileRequest(state) {
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

    fetchUserProfilePictureRequest(state) {
      state.loading.image = true;
      state.error = null;
    },
    fetchUserProfilePictureSuccess(state, action: PayloadAction<User['profilePictureUrl']>) {
      state.loading.image = false;
      state.imageIcon = action.payload;
      state.error = null;
    },
    fetchUserProfilePictureFailure(state, action: PayloadAction<string>) {
      state.loading.image = false;
      state.error = action.payload;
    },

    updateUserProfileRequest(state, _action: PayloadAction<{ values: ProfilePayload }>) {
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
  userIcon: createDraftSafeSelector(selectProfileState, (profile) => profile.imageIcon),
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
    switchMap(({}) =>
      from(http.get<User>(api.profile.userInfo)).pipe(
        map((response) => profileSliceActions.fetchUserProfileSuccess(response.data)),
        catchError((error) => {
          const message = getResponseError(error) || 'Failed to fetch user profile.';
          return of(profileSliceActions.fetchUserProfileFailure(String(message)));
        })
      )
    )
  );

const fetchUserProfilePictureEpic: Epic = (action$) =>
  action$.pipe(
    ofType(profileSliceActions.fetchUserProfilePictureRequest.type),
    switchMap(() =>
      from(http.get(api.profile.userIcon, { responseType: 'blob' })).pipe(
        switchMap((response) =>
          from(
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror  = reject;
              reader.readAsDataURL(response.data);
            })
          )
        ),
        map((base64String) => profileSliceActions.fetchUserProfilePictureSuccess(base64String)),
        catchError((error) => of(profileSliceActions.fetchUserProfilePictureFailure(error.message)))
      )
    )
  );

const updateUserProfileEpic: Epic = (action$) =>
  action$.pipe(
    ofType(profileSliceActions.updateUserProfileRequest.type),
    switchMap(({ payload }: { type: string; payload: { values: ProfilePayload } }) => {
      const formData = new FormData();
      formData.append('firstName', payload.values.firstName);
      formData.append('lastName', payload.values.lastName);

      const file = profileFile.get();
      if (file instanceof File) {
        formData.append('profilePicture', file, file.name); // ← raw File, BE gets proper binary
      } else if (file === null) {
        formData.append('profilePicture', '');              // ← signal deletion
      }

      profileFile.clear();
      return from(
        http.put<User>(api.profile.userInfo, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, // ← override JSON default
        })
      ).pipe(
        mergeMap((response) => of (profileSliceActions.updateUserProfileSuccess(response.data), profileSliceActions.fetchUserProfileRequest())),
        catchError((error) => {
          const message = getResponseError(error) || 'Failed to update user profile.';
          return of(profileSliceActions.updateUserProfileFailure(String(message)));
        })
      );
    })
  );

export const profileEpics = combineEpics(fetchUserProfileEpic, fetchUserProfilePictureEpic, updateUserProfileEpic);
