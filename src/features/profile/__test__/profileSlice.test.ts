/// <reference types="jest" />
import { of, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { StateObservable } from 'redux-observable';

import http from '../../../services/http';
import { profileFile } from '../../../utils/profileFile';
import reducer, {
  profileEpics,
  profileSliceActions,
  selectors} from '../profileSlice';

import type { User } from '../../../models';
import type {
  ProfileState} from '../profileSlice';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../../../services/http', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock('../../../utils/profileFile');
jest.mock('../../../utils/response', () => ({
  getResponseError: (error: any) => error?.response?.data?.message || null,
}));

const mockedHttp        = http        as jest.Mocked<typeof http>;
const mockedProfileFile = profileFile as jest.Mocked<typeof profileFile>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser: User = {
  id:                1,
  firstName:         'Crysta',
  lastName:          'Stenne',
  email:             'a@gmail.com',
  profilePictureUrl: '',
};

const mockProfilePayload = {
  firstName: 'Crysta',
  lastName:  'Stenne',
};

const initialState: ProfileState = {
  userProfile: null,
  imageIcon:   null,
  error:       null,
  loading: {
    fetch:  false,
    image:  false,
    update: false,
  },
  status: null,
};

const makeRootState = (profile: Partial<ProfileState> = {}) => ({
  profile: { ...initialState, ...profile },
});

// ─── Epic runner ──────────────────────────────────────────────────────────────

const runEpic = (epic: any, action: object, state = initialState) => {
  const action$ = of(action as any);
  const state$  = new StateObservable(new Subject(), { profile: state });
  return epic(action$, state$, {}).pipe(toArray()).toPromise() as Promise<any[]>;
};

// ─── Reducer tests ────────────────────────────────────────────────────────────

describe('profileSlice — reducer', () => {

  it('returns initial state when called with undefined', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // ── fetchUserProfile ───────────────────────────────────────────────────────

  describe('fetchUserProfileRequest', () => {
    it('sets loading.fetch to true and clears error', () => {
      const state = reducer(
        { ...initialState, error: 'old error' },
        profileSliceActions.fetchUserProfileRequest()
      );
      expect(state.loading.fetch).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchUserProfileSuccess', () => {
    it('sets userProfile, clears loading and error', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, fetch: true } },
        profileSliceActions.fetchUserProfileSuccess(mockUser)
      );
      expect(state.loading.fetch).toBe(false);
      expect(state.userProfile).toEqual(mockUser);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchUserProfileFailure', () => {
    it('sets error and clears loading.fetch', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, fetch: true } },
        profileSliceActions.fetchUserProfileFailure('Failed to fetch user profile.')
      );
      expect(state.loading.fetch).toBe(false);
      expect(state.error).toBe('Failed to fetch user profile.');
    });
  });

  // ── fetchUserProfilePicture ────────────────────────────────────────────────

  describe('fetchUserProfilePictureRequest', () => {
    it('sets loading.image to true and clears error', () => {
      const state = reducer(initialState, profileSliceActions.fetchUserProfilePictureRequest());
      expect(state.loading.image).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchUserProfilePictureSuccess', () => {
    it('stores base64 image string and clears loading', () => {
      const base64 = 'data:image/jpeg;base64,abc123';
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, image: true } },
        profileSliceActions.fetchUserProfilePictureSuccess(base64)
      );
      expect(state.loading.image).toBe(false);
      expect(state.imageIcon).toBe(base64);
    });
  });

  describe('fetchUserProfilePictureFailure', () => {
    it('sets error and clears loading.image', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, image: true } },
        profileSliceActions.fetchUserProfilePictureFailure('Failed to load profile picture.')
      );
      expect(state.loading.image).toBe(false);
      expect(state.error).toBe('Failed to load profile picture.');
    });
  });

  // ── updateUserProfile ──────────────────────────────────────────────────────

  describe('updateUserProfileRequest', () => {
    it('sets loading.update to true, clears status and error', () => {
      const state = reducer(
        { ...initialState, status: 'updated', error: 'old error' },
        profileSliceActions.updateUserProfileRequest({ values: mockProfilePayload })
      );
      expect(state.loading.update).toBe(true);
      expect(state.status).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('updateUserProfileSuccess', () => {
    it('updates userProfile, sets status to updated, clears loading', () => {
      const updatedUser = { ...mockUser, firstName: 'Crystal' };
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, update: true } },
        profileSliceActions.updateUserProfileSuccess(updatedUser)
      );
      expect(state.loading.update).toBe(false);
      expect(state.userProfile).toEqual(updatedUser);
      expect(state.status).toBe('updated');
      expect(state.error).toBeNull();
    });
  });

  describe('updateUserProfileFailure', () => {
    it('sets error and clears loading.update', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, update: true } },
        profileSliceActions.updateUserProfileFailure('Failed to update user profile.')
      );
      expect(state.loading.update).toBe(false);
      expect(state.error).toBe('Failed to update user profile.');
    });
  });

  describe('clearProfileError', () => {
    it('clears error', () => {
      const state = reducer(
        { ...initialState, error: 'some error' },
        profileSliceActions.clearProfileError()
      );
      expect(state.error).toBeNull();
    });

    it('is safe to call when error is already null', () => {
      const state = reducer(initialState, profileSliceActions.clearProfileError());
      expect(state.error).toBeNull();
    });
  });
});

// ─── Selector tests ───────────────────────────────────────────────────────────

describe('profileSliceSelectors', () => {

  describe('userProfile', () => {
    it('returns null when no profile loaded', () => {
      expect(selectors.userProfile(makeRootState() as any)).toBeNull();
    });
    it('returns user profile when loaded', () => {
      expect(
        selectors.userProfile(makeRootState({ userProfile: mockUser }) as any)
      ).toEqual(mockUser);
    });
  });

  describe('userIcon', () => {
    it('returns null when no image loaded', () => {
      expect(selectors.userIcon(makeRootState() as any)).toBeNull();
    });
    it('returns base64 string when image is loaded', () => {
      const base64 = 'data:image/jpeg;base64,abc123';
      expect(
        selectors.userIcon(makeRootState({ imageIcon: base64 }) as any)
      ).toBe(base64);
    });
  });

  describe('getStatus', () => {
    it('returns null initially', () => {
      expect(selectors.getStatus(makeRootState() as any)).toBeNull();
    });
    it('returns updated after successful update', () => {
      expect(
        selectors.getStatus(makeRootState({ status: 'updated' }) as any)
      ).toBe('updated');
    });
  });

  describe('getloaders', () => {
    it('returns all loaders as false initially', () => {
      expect(selectors.getloaders(makeRootState() as any)).toEqual({
        fetch: false, image: false, update: false,
      });
    });
    it('returns correct loader state when fetch is in progress', () => {
      expect(
        selectors.getloaders(
          makeRootState({ loading: { fetch: true, image: false, update: false } }) as any
        )
      ).toEqual({ fetch: true, image: false, update: false });
    });
  });

  describe('profileError', () => {
    it('returns null when no error', () => {
      expect(selectors.profileError(makeRootState() as any)).toBeNull();
    });
    it('returns error string when error is set', () => {
      expect(
        selectors.profileError(makeRootState({ error: 'Something went wrong' }) as any)
      ).toBe('Something went wrong');
    });
  });
});

// ─── Epic tests ───────────────────────────────────────────────────────────────

describe('fetchUserProfileEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches fetchUserProfileSuccess with user data on success', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: mockUser });

    const actions = await runEpic(
      profileEpics,
      profileSliceActions.fetchUserProfileRequest()
    );

    expect(mockedHttp.get).toHaveBeenCalledWith('/profile');
    expect(actions).toEqual([profileSliceActions.fetchUserProfileSuccess(mockUser)]);
  });

  it('dispatches fetchUserProfileFailure on API error', async () => {
    mockedHttp.get.mockRejectedValueOnce({
      response: { data: { message: 'Unauthorized' } },
    });

    const actions = await runEpic(
      profileEpics,
      profileSliceActions.fetchUserProfileRequest()
    );

    expect(actions).toEqual([profileSliceActions.fetchUserProfileFailure('Unauthorized')]);
  });

  it('dispatches fetchUserProfileFailure with fallback message on network error', async () => {
    mockedHttp.get.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(
      profileEpics,
      profileSliceActions.fetchUserProfileRequest()
    );

    expect(actions).toEqual([
      profileSliceActions.fetchUserProfileFailure('Failed to fetch user profile.'),
    ]);
  });
});

describe('updateUserProfileEpic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedProfileFile.get.mockReturnValue(undefined);
  });

  it('dispatches updateUserProfileSuccess and fetchUserProfileRequest on success', async () => {
    mockedHttp.put.mockResolvedValueOnce({ data: mockUser });
    mockedProfileFile.get.mockReturnValue(undefined);

    const actions = await runEpic(
      profileEpics,
      profileSliceActions.updateUserProfileRequest({ values: mockProfilePayload })
    );

    expect(mockedHttp.put).toHaveBeenCalled();
    expect(actions[0]).toEqual(profileSliceActions.updateUserProfileSuccess(mockUser));
    expect(actions[1]).toEqual(profileSliceActions.fetchUserProfileRequest());
  });

  it('appends File to FormData when profileFile.get() returns a File', async () => {
    const mockFile = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' });
    mockedProfileFile.get.mockReturnValue(mockFile);
    mockedHttp.put.mockResolvedValueOnce({ data: mockUser });

    await runEpic(
      profileEpics,
      profileSliceActions.updateUserProfileRequest({ values: mockProfilePayload })
    );

    const formDataArg = mockedHttp.put.mock.calls[0][1] as FormData;
    expect(formDataArg.get('profilePicture')).toEqual(mockFile);
  });

  it('dispatches updateUserProfileFailure on API error', async () => {
    mockedHttp.put.mockRejectedValueOnce({
      response: { data: { message: 'Update failed' } },
    });

    const actions = await runEpic(
      profileEpics,
      profileSliceActions.updateUserProfileRequest({ values: mockProfilePayload })
    );

    expect(actions).toEqual([
      profileSliceActions.updateUserProfileFailure('Update failed'),
    ]);
  });
});
