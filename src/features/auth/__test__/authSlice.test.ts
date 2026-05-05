import {of } from 'rxjs';
import { toArray } from 'rxjs/operators';

import { RequestStatus } from '../../../models/index';
import http from '../../../services/http';
import reducer, {
  authEpics,
  authSliceActions,
  selectors as authSliceSelectors} from '../authSlice';

import type { LoginPayload, LoginResponse,RegisterPayload} from '../../../models/index';
import type {
  AuthState} from '../authSlice';
import type { Observable} from 'rxjs';

import { beforeEach,describe, expect, it, jest } from '@jest/globals';

jest.mock('../../../services/http', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../../services/jwt', () => ({
  jwtService: { setToken: jest.fn(), removeToken: jest.fn() },
}));

jest.mock('../../../utils/storage', () => ({
  tempAuthService: { setTempPasswordFlag: jest.fn(), clearTempPasswordFlag: jest.fn() },
}));

jest.mock('../../../utils/response', () => ({
  getResponseError: (error: any) => error?.response?.data?.message || null,
}));

const mockedHttp = http as jest.Mocked<typeof http>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockLoginResponse: LoginResponse = {
  message: 'Login successful',
  email: 'alex@example.com',
  requiresPasswordReset: false,
  token: 'jwt-token-abc',
  tokenType: 'Bearer',
};

const mockRegisterPayload: RegisterPayload = {
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex@example.com',
  password: 'password123',
};

const mockLoginPayload: LoginPayload = {
  email: 'alex@example.com',
  password: 'password123',
};

const initialState: AuthState = {
  loggedInUser: null,
  isAuthorized: false,
  register: false,
  mustChangePassword: false,
  loading: {
    forgotPassword: false,
    changePassword: false,
    logout: false,
  },
  accessToken: null,
  error: null,
  statuses: {
    register: RequestStatus.Idle,
    passwordChangeStatus: RequestStatus.Idle,
    login: RequestStatus.Idle,
    logout: RequestStatus.Idle,
  },
};

const makeRootState = (auth: Partial<AuthState> = {}) => ({
  auth: { ...initialState, ...auth },
});

// ─── Reducer tests ────────────────────────────────────────────────────────────

describe('authSlice — reducer', () => {

  it('returns the initial state when called with undefined', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  // ── Register ───────────────────────────────────────────────────────────────

  describe('registerRequest', () => {
    it('sets register to true and clears error', () => {
      const state = reducer(
        { ...initialState, error: 'old error' },
        authSliceActions.registerRequest(mockRegisterPayload)
      );
      expect(state.register).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('registerSuccess', () => {
    it('sets register to false, status to Success, and clears error', () => {
      const state = reducer(
        { ...initialState, register: true },
        authSliceActions.registerSuccess()
      );
      expect(state.register).toBe(false);
      expect(state.statuses.register).toBe(RequestStatus.Success);
      expect(state.error).toBeNull();
    });
  });

  describe('registerFailure', () => {
    it('sets error message, sets register status to Failure, and clears register flag', () => {
      const state = reducer(
        { ...initialState, register: true },
        authSliceActions.registerFailure('Email already in use')
      );
      expect(state.register).toBe(false);
      expect(state.error).toBe('Email already in use');
      expect(state.statuses.register).toBe(RequestStatus.Failure);
    });
  });

  // ── Login ──────────────────────────────────────────────────────────────────

  describe('loginRequest', () => {
    it('sets login status to Pending, clears isAuthorized and error', () => {
      const state = reducer(
        { ...initialState, isAuthorized: true, error: 'old error' },
        authSliceActions.loginRequest(mockLoginPayload)
      );
      expect(state.isAuthorized).toBeNull();
      expect(state.error).toBeNull();
      expect(state.statuses.login).toBe(RequestStatus.Pending);
    });
  });

  describe('loginSuccess', () => {
    it('sets loggedInUser, isAuthorized, accessToken, login status to Success, clears error', () => {
      const state = reducer(
        { ...initialState, statuses: { ...initialState.statuses, login: RequestStatus.Pending } },
        authSliceActions.loginSuccess(mockLoginResponse)
      );
      expect(state.loggedInUser).toEqual(mockLoginResponse);
      expect(state.isAuthorized).toBe(true);
      expect(state.accessToken).toBe(mockLoginResponse.token);
      expect(state.statuses.login).toBe(RequestStatus.Success);
      expect(state.error).toBeNull();
    });
  });

  describe('loginFailure', () => {
    it('sets error and login status to Failure', () => {
      const state = reducer(
        { ...initialState, statuses: { ...initialState.statuses, login: RequestStatus.Pending } },
        authSliceActions.loginFailure('Invalid credentials')
      );
      expect(state.error).toBe('Invalid credentials');
      expect(state.statuses.login).toBe(RequestStatus.Failure);
    });
  });

  // ── Logout ─────────────────────────────────────────────────────────────────

  describe('logout (legacy)', () => {
    it('clears loggedInUser, accessToken, isAuthorized and error, resets login/logout statuses', () => {
      const state = reducer(
        { ...initialState, loggedInUser: mockLoginResponse, isAuthorized: true, accessToken: 'token', error: 'some error' },
        authSliceActions.logout()
      );
      expect(state.loggedInUser).toBeNull();
      expect(state.isAuthorized).toBe(false);
      expect(state.accessToken).toBeNull();
      expect(state.error).toBeNull();
      expect(state.statuses.login).toBe(RequestStatus.Idle);
      expect(state.statuses.logout).toBe(RequestStatus.Idle);
    });
  });

  // ── clearError ─────────────────────────────────────────────────────────────

  describe('clearError', () => {
    it('sets error to null', () => {
      const state = reducer(
        { ...initialState, error: 'something went wrong' },
        authSliceActions.clearError()
      );
      expect(state.error).toBeNull();
    });

    it('is safe to call when error is already null', () => {
      const state = reducer(initialState, authSliceActions.clearError());
      expect(state.error).toBeNull();
    });
  });
});

// ─── Selector tests ───────────────────────────────────────────────────────────

describe('authSliceSelectors', () => {

  describe('isRegisterLoading', () => {
    it('returns true when register is true', () => {
      expect(authSliceSelectors.isRegisterLoading(makeRootState({ register: true }) as any)).toBe(true);
    });
    it('returns false when register is false', () => {
      expect(authSliceSelectors.isRegisterLoading(makeRootState({ register: false }) as any)).toBe(false);
    });
  });

  describe('isAuthorized', () => {
    it('returns true when isAuthorized is true', () => {
      expect(authSliceSelectors.isAuthorized(makeRootState({ isAuthorized: true }) as any)).toBe(true);
    });
    it('returns null during login request', () => {
      expect(authSliceSelectors.isAuthorized(makeRootState({ isAuthorized: null }) as any)).toBeNull();
    });
    it('returns false in initial state', () => {
      expect(authSliceSelectors.isAuthorized(makeRootState() as any)).toBe(false);
    });
  });

  describe('isLoginSuccess', () => {
    it('returns true when login status is Success', () => {
      expect(
        authSliceSelectors.isLoginSuccess(
          makeRootState({ statuses: { ...initialState.statuses, login: RequestStatus.Success } }) as any
        )
      ).toBe(true);
    });
    it('returns false when login status is Pending', () => {
      expect(
        authSliceSelectors.isLoginSuccess(
          makeRootState({ statuses: { ...initialState.statuses, login: RequestStatus.Pending } }) as any
        )
      ).toBe(false);
    });
    it('returns false in initial state', () => {
      expect(authSliceSelectors.isLoginSuccess(makeRootState() as any)).toBe(false);
    });
  });

  describe('isError', () => {
    it('returns the error string when present', () => {
      expect(authSliceSelectors.isError(makeRootState({ error: 'oops' }) as any)).toBe('oops');
    });
    it('returns null when there is no error', () => {
      expect(authSliceSelectors.isError(makeRootState() as any)).toBeNull();
    });
  });

  describe('loggedInUser', () => {
    it('returns the logged-in user when set', () => {
      expect(
        authSliceSelectors.loggedInUser(makeRootState({ loggedInUser: mockLoginResponse }) as any)
      ).toEqual(mockLoginResponse);
    });
    it('returns null when no user is logged in', () => {
      expect(authSliceSelectors.loggedInUser(makeRootState() as any)).toBeNull();
    });
  });
});

// ─── Epic tests ───────────────────────────────────────────────────────────────

const runEpic = (epic: any, action: any, state = initialState) => {
  const action$ = of(action);
  const state$  = of({ auth: state }) as Observable<any>;
  return epic(action$, state$, {}).pipe(toArray()).toPromise() as Promise<any[]>;
};

describe('registerEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches registerSuccess on a successful API call', async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: {} });

    const actions = await runEpic(
      authEpics,
      authSliceActions.registerRequest(mockRegisterPayload)
    );

    expect(mockedHttp.post).toHaveBeenCalledWith('/auth/register', mockRegisterPayload);
    expect(actions).toEqual([authSliceActions.registerSuccess()]);
  });

  it('dispatches registerFailure with BE message on API error', async () => {
    mockedHttp.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    });

    const actions = await runEpic(
      authEpics,
      authSliceActions.registerRequest(mockRegisterPayload)
    );

    expect(actions).toEqual([authSliceActions.registerFailure('Email already exists')]);
  });

  it('dispatches registerFailure with fallback message on network error', async () => {
    mockedHttp.post.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(
      authEpics,
      authSliceActions.registerRequest(mockRegisterPayload)
    );

    expect(actions).toEqual([
      authSliceActions.registerFailure('Registration failed. Please try again.'),
    ]);
  });
});

describe('loginEpic', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('dispatches loginSuccess and setChangePasswordFlag on a successful API call', async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: mockLoginResponse });

    const actions = await runEpic(
      authEpics,
      authSliceActions.loginRequest(mockLoginPayload)
    );

    expect(mockedHttp.post).toHaveBeenCalledWith('/auth/login', mockLoginPayload);
    expect(actions).toEqual([
      authSliceActions.loginSuccess(mockLoginResponse),
      authSliceActions.setChangePasswordFlag(mockLoginResponse.requiresPasswordReset),
    ]);
  });

  it('dispatches loginFailure with BE message on API error', async () => {
    mockedHttp.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } },
    });

    const actions = await runEpic(
      authEpics,
      authSliceActions.loginRequest(mockLoginPayload)
    );

    expect(actions).toEqual([authSliceActions.loginFailure('Invalid credentials')]);
  });

  it('dispatches loginFailure with fallback message on network error', async () => {
    mockedHttp.post.mockRejectedValueOnce(new Error('Network Error'));

    const actions = await runEpic(
      authEpics,
      authSliceActions.loginRequest(mockLoginPayload)
    );

    expect(actions).toEqual([
      authSliceActions.loginFailure('Login failed. Please check your credentials.'),
    ]);
  });
});
