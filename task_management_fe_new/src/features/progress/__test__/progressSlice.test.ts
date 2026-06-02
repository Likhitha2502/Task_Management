/// <reference types="jest" />
import { of, Subject } from 'rxjs';
import { toArray } from 'rxjs/operators';
import { StateObservable } from 'redux-observable';

import http from '../../../services/http';
import reducer, {
  progressEpics,
  progressSliceActions,
  progressSelectors,
} from '../progressSlice';

import type { ProgressState, TaskCountData, TaskPercentData } from '../progressSlice';

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

const mockCountData: TaskCountData = {
  totalTasks:      10,
  toDoTasks:       3,
  inProgressTasks: 4,
  inReviewTasks:   1,
  completedTasks:  2,
};

const mockPercentData: TaskPercentData = {
  toDoPercent:       30,
  inProgressPercent: 40,
  inReviewPercent:   10,
  completedPercent:  20,
};

const initialState: ProgressState = {
  count:   null,
  percent: null,
  loading: { count: false, percent: false },
  error:   null,
};

const makeRootState = (progress: Partial<ProgressState> = {}) => ({
  progress: { ...initialState, ...progress },
});

// ─── Epic runner ──────────────────────────────────────────────────────────────

const runEpic = (epic: any, action: object, state = initialState) => {
  const action$ = of(action as any);
  const state$  = new StateObservable(new Subject(), { progress: state });
  return epic(action$, state$, {}).pipe(toArray()).toPromise() as Promise<any[]>;
};

// ─── Reducer tests ────────────────────────────────────────────────────────────

describe('progressSlice — reducer', () => {

  it('returns initial state when called with undefined', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // ── fetchCount ─────────────────────────────────────────────────────────────

  describe('fetchCountRequest', () => {
    it('sets loading.count to true and clears error', () => {
      const state = reducer(
        { ...initialState, error: 'old error' },
        progressSliceActions.fetchCountRequest()
      );
      expect(state.loading.count).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchCountSuccess', () => {
    it('sets count data and clears loading.count', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, count: true } },
        progressSliceActions.fetchCountSuccess(mockCountData)
      );
      expect(state.loading.count).toBe(false);
      expect(state.count).toEqual(mockCountData);
    });
  });

  describe('fetchCountFailure', () => {
    it('sets error and clears loading.count', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, count: true } },
        progressSliceActions.fetchCountFailure('Failed to load task counts.')
      );
      expect(state.loading.count).toBe(false);
      expect(state.error).toBe('Failed to load task counts.');
    });
  });

  // ── fetchPercent ───────────────────────────────────────────────────────────

  describe('fetchPercentRequest', () => {
    it('sets loading.percent to true and clears error', () => {
      const state = reducer(
        { ...initialState, error: 'old error' },
        progressSliceActions.fetchPercentRequest()
      );
      expect(state.loading.percent).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchPercentSuccess', () => {
    it('sets percent data and clears loading.percent', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, percent: true } },
        progressSliceActions.fetchPercentSuccess(mockPercentData)
      );
      expect(state.loading.percent).toBe(false);
      expect(state.percent).toEqual(mockPercentData);
    });
  });

  describe('fetchPercentFailure', () => {
    it('sets error and clears loading.percent', () => {
      const state = reducer(
        { ...initialState, loading: { ...initialState.loading, percent: true } },
        progressSliceActions.fetchPercentFailure('Failed to load task percentages.')
      );
      expect(state.loading.percent).toBe(false);
      expect(state.error).toBe('Failed to load task percentages.');
    });
  });
});

// ─── Selector tests ───────────────────────────────────────────────────────────

describe('progressSelectors', () => {

  describe('getCount', () => {
    it('returns null initially', () => {
      expect(progressSelectors.getCount(makeRootState() as any)).toBeNull();
    });
    it('returns count data when loaded', () => {
      expect(
        progressSelectors.getCount(makeRootState({ count: mockCountData }) as any)
      ).toEqual(mockCountData);
    });
  });

  describe('getPercent', () => {
    it('returns null initially', () => {
      expect(progressSelectors.getPercent(makeRootState() as any)).toBeNull();
    });
    it('returns percent data when loaded', () => {
      expect(
        progressSelectors.getPercent(makeRootState({ percent: mockPercentData }) as any)
      ).toEqual(mockPercentData);
    });
  });

  describe('isLoading', () => {
    it('returns both loaders as false initially', () => {
      expect(progressSelectors.isLoading(makeRootState() as any)).toEqual({
        count: false, percent: false,
      });
    });
    it('returns correct loading state when count fetch is in progress', () => {
      expect(
        progressSelectors.isLoading(
          makeRootState({ loading: { count: true, percent: false } }) as any
        )
      ).toEqual({ count: true, percent: false });
    });
  });

  describe('getError', () => {
    it('returns null when no error', () => {
      expect(progressSelectors.getError(makeRootState() as any)).toBeNull();
    });
    it('returns error string when error is set', () => {
      expect(
        progressSelectors.getError(makeRootState({ error: 'Something went wrong' }) as any)
      ).toBe('Something went wrong');
    });
  });

  describe('total', () => {
    it('returns 0 when count is null', () => {
      expect(progressSelectors.total(makeRootState() as any)).toBe(0);
    });
    it('returns totalTasks from count data', () => {
      expect(
        progressSelectors.total(makeRootState({ count: mockCountData }) as any)
      ).toBe(10);
    });
  });
});

// ─── Epic tests ───────────────────────────────────────────────────────────────

describe('fetchCountEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches fetchCountSuccess with data on success', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: mockCountData });

    const actions = await runEpic(
      progressEpics,
      progressSliceActions.fetchCountRequest()
    );

    expect(mockedHttp.get).toHaveBeenCalledWith('/progress/count');
    expect(actions).toEqual([progressSliceActions.fetchCountSuccess(mockCountData)]);
  });

  it('dispatches fetchCountFailure on API error', async () => {
    mockedHttp.get.mockRejectedValueOnce({
      response: { data: { message: 'Forbidden' } },
    });

    const actions = await runEpic(
      progressEpics,
      progressSliceActions.fetchCountRequest()
    );

    expect(actions).toEqual([progressSliceActions.fetchCountFailure('Forbidden')]);
  });

  it('dispatches fetchCountFailure with fallback message on network error', async () => {
    mockedHttp.get.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(
      progressEpics,
      progressSliceActions.fetchCountRequest()
    );

    expect(actions).toEqual([
      progressSliceActions.fetchCountFailure('Failed to load task counts.'),
    ]);
  });
});

describe('fetchPercentEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches fetchPercentSuccess with data on success', async () => {
    mockedHttp.get.mockResolvedValueOnce({ data: mockPercentData });

    const actions = await runEpic(
      progressEpics,
      progressSliceActions.fetchPercentRequest()
    );

    expect(mockedHttp.get).toHaveBeenCalledWith('/progress/percent');
    expect(actions).toEqual([progressSliceActions.fetchPercentSuccess(mockPercentData)]);
  });

  it('dispatches fetchPercentFailure on API error', async () => {
    mockedHttp.get.mockRejectedValueOnce({
      response: { data: { message: 'Forbidden' } },
    });

    const actions = await runEpic(
      progressEpics,
      progressSliceActions.fetchPercentRequest()
    );

    expect(actions).toEqual([progressSliceActions.fetchPercentFailure('Forbidden')]);
  });

  it('dispatches fetchPercentFailure with fallback message on network error', async () => {
    mockedHttp.get.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(
      progressEpics,
      progressSliceActions.fetchPercentRequest()
    );

    expect(actions).toEqual([
      progressSliceActions.fetchPercentFailure('Failed to load task percentages.'),
    ]);
  });
});
