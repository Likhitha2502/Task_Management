/// <reference types="jest" />
import { of, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { StateObservable } from 'redux-observable';

import http from '../../../services/http';
import reducer, {
  focusTimerEpics,
  focusTimerSliceActions,
  focusTimerSelectors,
} from '../focusTimerSlice';

import type { FocusTimerState, FocusTimerStatus } from '../focusTimerSlice';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('../../../services/http', () => ({
  __esModule: true,
  default: {
    get:    jest.fn(),
    post:   jest.fn(),
    put:    jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedHttp = http as jest.Mocked<typeof http>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockActiveStatus: FocusTimerStatus   = { active: true,  remainingMinutes: 20 };
const mockInactiveStatus: FocusTimerStatus = { active: false, remainingMinutes: 0  };

const initialState: FocusTimerState = {
  timerStatus: null,
  loading:     { get: false, post: false },
  postStatus:  null,
  error:       null,
};

const makeRootState = (focusTimer: Partial<FocusTimerState> = {}) => ({
  focusTimer: { ...initialState, ...focusTimer },
});

// ─── Epic runner ──────────────────────────────────────────────────────────────

const runEpic = (epic: any, action: object, state = initialState) => {
  const action$ = of(action as any);
  const state$  = new StateObservable(new Subject(), { focusTimer: state });
  return epic(action$, state$, {}).pipe(toArray()).toPromise() as Promise<any[]>;
};

// ─── Reducer tests ────────────────────────────────────────────────────────────

describe('focusTimerSlice — reducer', () => {

  it('returns initial state when called with undefined', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // ── fetchFocusTimer ────────────────────────────────────────────────────────

  describe('fetchFocusTimerRequest', () => {
    it('sets loading.get to true and clears error', () => {
      const state = reducer(
        { ...initialState, error: 'old error' },
        focusTimerSliceActions.fetchFocusTimerRequest()
      );
      expect(state.loading.get).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchFocusTimerSuccess', () => {
    it('sets timerStatus and clears loading.get', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, get: true } },
        focusTimerSliceActions.fetchFocusTimerSuccess(mockActiveStatus)
      );
      expect(state.loading.get).toBe(false);
      expect(state.timerStatus).toEqual(mockActiveStatus);
    });
  });

  describe('fetchFocusTimerFailure', () => {
    it('sets error and clears loading.get', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, get: true } },
        focusTimerSliceActions.fetchFocusTimerFailure('Failed to fetch timer status.')
      );
      expect(state.loading.get).toBe(false);
      expect(state.error).toBe('Failed to fetch timer status.');
    });
  });

  // ── startFocusTimer ────────────────────────────────────────────────────────

  describe('startFocusTimerRequest', () => {
    it('sets loading.post to true, clears error and postStatus', () => {
      const state = reducer(
        { ...initialState, error: 'old error', postStatus: 'success' },
        focusTimerSliceActions.startFocusTimerRequest({ durationMinutes: 25 })
      );
      expect(state.loading.post).toBe(true);
      expect(state.error).toBeNull();
      expect(state.postStatus).toBeNull();
    });
  });

  describe('startFocusTimerSuccess', () => {
    it('clears loading.post and sets postStatus to success', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, post: true } },
        focusTimerSliceActions.startFocusTimerSuccess()
      );
      expect(state.loading.post).toBe(false);
      expect(state.postStatus).toBe('success');
    });
  });

  describe('startFocusTimerFailure', () => {
    it('sets error and clears loading.post', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, post: true } },
        focusTimerSliceActions.startFocusTimerFailure('Failed to start focus timer.')
      );
      expect(state.loading.post).toBe(false);
      expect(state.error).toBe('Failed to start focus timer.');
    });
  });

  // ── clearFocusTimerPostStatus ──────────────────────────────────────────────

  describe('clearFocusTimerPostStatus', () => {
    it('sets postStatus to null', () => {
      const state = reducer(
        { ...initialState, postStatus: 'success' },
        focusTimerSliceActions.clearFocusTimerPostStatus()
      );
      expect(state.postStatus).toBeNull();
    });

    it('is safe to call when postStatus is already null', () => {
      const state = reducer(initialState, focusTimerSliceActions.clearFocusTimerPostStatus());
      expect(state.postStatus).toBeNull();
    });
  });

  // ── focusTimerDeactivated ──────────────────────────────────────────────────

  describe('focusTimerDeactivated', () => {
    it('does not change any state (signal-only action)', () => {
      const state = reducer(
        { ...initialState, timerStatus: mockActiveStatus },
        focusTimerSliceActions.focusTimerDeactivated()
      );
      expect(state).toEqual({ ...initialState, timerStatus: mockActiveStatus });
    });
  });
});

// ─── Selector tests ───────────────────────────────────────────────────────────

describe('focusTimerSelectors', () => {

  describe('timerStatus', () => {
    it('returns null initially', () => {
      expect(focusTimerSelectors.timerStatus(makeRootState() as any)).toBeNull();
    });
    it('returns timer status when loaded', () => {
      expect(
        focusTimerSelectors.timerStatus(makeRootState({ timerStatus: mockActiveStatus }) as any)
      ).toEqual(mockActiveStatus);
    });
  });

  describe('isLoading', () => {
    it('returns both loaders as false initially', () => {
      expect(focusTimerSelectors.isLoading(makeRootState() as any)).toEqual({
        get: false, post: false,
      });
    });
    it('returns correct loading state when get is in progress', () => {
      expect(
        focusTimerSelectors.isLoading(
          makeRootState({ loading: { get: true, post: false } }) as any
        )
      ).toEqual({ get: true, post: false });
    });
  });

  describe('postStatus', () => {
    it('returns null initially', () => {
      expect(focusTimerSelectors.postStatus(makeRootState() as any)).toBeNull();
    });
    it('returns success after successful post', () => {
      expect(
        focusTimerSelectors.postStatus(makeRootState({ postStatus: 'success' }) as any)
      ).toBe('success');
    });
  });

  describe('error', () => {
    it('returns null when no error', () => {
      expect(focusTimerSelectors.error(makeRootState() as any)).toBeNull();
    });
    it('returns error string when error is set', () => {
      expect(
        focusTimerSelectors.error(makeRootState({ error: 'Something went wrong' }) as any)
      ).toBe('Something went wrong');
    });
  });
});

// ─── Epic tests ───────────────────────────────────────────────────────────────

describe('fetchFocusTimerEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches fetchFocusTimerSuccess on success', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: mockActiveStatus });

    const actions = await runEpic(
      focusTimerEpics,
      focusTimerSliceActions.fetchFocusTimerRequest()
    );

    expect(mockedHttp.get).toHaveBeenCalledWith('/focus-timer');
    expect(actions).toContainEqual(
      focusTimerSliceActions.fetchFocusTimerSuccess(mockActiveStatus)
    );
  });

  it('also dispatches focusTimerDeactivated when timer transitions from active to inactive', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: mockInactiveStatus });

    const actions = await runEpic(
      focusTimerEpics,
      focusTimerSliceActions.fetchFocusTimerRequest(),
      { ...initialState, timerStatus: mockActiveStatus }
    );

    expect(actions).toContainEqual(
      focusTimerSliceActions.fetchFocusTimerSuccess(mockInactiveStatus)
    );
    expect(actions).toContainEqual(focusTimerSliceActions.focusTimerDeactivated());
  });

  it('does not dispatch focusTimerDeactivated when timer was already inactive', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: mockInactiveStatus });

    const actions = await runEpic(
      focusTimerEpics,
      focusTimerSliceActions.fetchFocusTimerRequest(),
      { ...initialState, timerStatus: mockInactiveStatus }
    );

    expect(actions).not.toContainEqual(focusTimerSliceActions.focusTimerDeactivated());
  });

  it('dispatches fetchFocusTimerFailure on API error', async () => {
    mockedHttp.get.mockRejectedValueOnce({
      response: { data: { message: 'Unauthorized' } },
    });

    const actions = await runEpic(
      focusTimerEpics,
      focusTimerSliceActions.fetchFocusTimerRequest()
    );

    expect(actions).toEqual([
      focusTimerSliceActions.fetchFocusTimerFailure('Unauthorized'),
    ]);
  });

  it('dispatches fetchFocusTimerFailure with fallback message on network error', async () => {
    mockedHttp.get.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(
      focusTimerEpics,
      focusTimerSliceActions.fetchFocusTimerRequest()
    );

    expect(actions).toEqual([
      focusTimerSliceActions.fetchFocusTimerFailure('Failed to fetch timer status.'),
    ]);
  });
});

describe('startFocusTimerEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches startFocusTimerSuccess on success', async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: null });

    const actions = await runEpic(
      focusTimerEpics,
      focusTimerSliceActions.startFocusTimerRequest({ durationMinutes: 25 })
    );

    expect(mockedHttp.post).toHaveBeenCalledWith('/focus-timer', { durationMinutes: 25 });
    expect(actions).toEqual([focusTimerSliceActions.startFocusTimerSuccess()]);
  });

  it('dispatches startFocusTimerFailure on API error', async () => {
    mockedHttp.post.mockRejectedValueOnce({
      response: { data: { message: 'Timer already active' } },
    });

    const actions = await runEpic(
      focusTimerEpics,
      focusTimerSliceActions.startFocusTimerRequest({ durationMinutes: 25 })
    );

    expect(actions).toEqual([
      focusTimerSliceActions.startFocusTimerFailure('Timer already active'),
    ]);
  });

  it('dispatches startFocusTimerFailure with fallback message on network error', async () => {
    mockedHttp.post.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(
      focusTimerEpics,
      focusTimerSliceActions.startFocusTimerRequest({ durationMinutes: 25 })
    );

    expect(actions).toEqual([
      focusTimerSliceActions.startFocusTimerFailure('Failed to start focus timer.'),
    ]);
  });
});
