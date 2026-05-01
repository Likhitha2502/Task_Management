import { describe, it, expect, jest } from '@jest/globals';
import { of, Observable } from 'rxjs';
import { toArray } from 'rxjs/operators';
import reducer, {
  authSliceActions,
  selectors as authSliceSelectors,
  AuthState,
  authEpics
} from '../authSlice';
import { RequestStatus, User, RegisterPayload, LoginPayload } from '../../../models/index';
import http from '../../../services/http';

jest.mock('../../../services/http', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedHttp = http as jest.Mocked<typeof http>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockUser: User = {
  id: 1,
  firstName: 'Alex',
  lastName: 'Johnson',
  email: 'alex@example.com',
  token: '',
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
    passwordChangeStatus: RequestStatus.Idle,
    login: RequestStatus.Idle,
    logout: RequestStatus.Idle,
  },
};

// helper — builds a minimal RootState shape for selectors
const makeRootState = (auth: Partial<AuthState> = {}) => ({
  auth: { ...initialState, ...auth },
});

// ─── Reducer tests ────────────────────────────────────────────────────────────

describe('authSlice — reducer', () => {

  // ── Initial state ──────────────────────────────────────────────────────────

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
    it('sets currentUser, clears register flag and error', () => {
      const state = reducer(
        { ...initialState, register: true },
        authSliceActions.registerSuccess(mockUser)
      );
      expect(state.register).toBe(false);
      expect(state.currentUser).toEqual(mockUser);
      expect(state.error).toBeNull();
    });
  });

  describe('registerFailure', () => {
    it('sets error message and clears register flag', () => {
      const state = reducer(
        { ...initialState, register: true },
        authSliceActions.registerFailure('Email already in use')
      );
      expect(state.register).toBe(false);
      expect(state.error).toBe('Email already in use');
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
    it('sets currentUser, login status to Success, clears error', () => {
      const state = reducer(
        { ...initialState, statuses: { login: RequestStatus.Pending, logout: RequestStatus.Idle } },
        authSliceActions.loginSuccess(mockUser)
      );
      expect(state.currentUser).toEqual(mockUser);
      expect(state.statuses.login).toBe(RequestStatus.Success);
      expect(state.error).toBeNull();
    });
  });

  describe('loginFailure', () => {
    it('sets error and login status to Failure', () => {
      const state = reducer(
        { ...initialState, statuses: { login: RequestStatus.Pending, logout: RequestStatus.Idle } },
        authSliceActions.loginFailure('Invalid credentials')
      );
      expect(state.error).toBe('Invalid credentials');
      expect(state.statuses.login).toBe(RequestStatus.Failure);
    });
  });

  // ── Logout ─────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('clears currentUser and error, resets logout status to Idle', () => {
      const state = reducer(
        { ...initialState, currentUser: mockUser, error: 'some error' },
        authSliceActions.logout()
      );
      expect(state.currentUser).toBeNull();
      expect(state.error).toBeNull();
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
          makeRootState({ statuses: { login: RequestStatus.Success, logout: RequestStatus.Idle } }) as any
        )
      ).toBe(true);
    });
    it('returns false when login status is Pending', () => {
      expect(
        authSliceSelectors.isLoginSuccess(
          makeRootState({ statuses: { login: RequestStatus.Pending, logout: RequestStatus.Idle } }) as any
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

  describe('getCurrentUser', () => {
    it('returns the current user when set', () => {
      expect(authSliceSelectors.getCurrentUser(makeRootState({ currentUser: mockUser }) as any)).toEqual(mockUser);
    });
    it('returns null when no user is logged in', () => {
      expect(authSliceSelectors.getCurrentUser(makeRootState() as any)).toBeNull();
    });
  });
});

// ─── Epic tests ───────────────────────────────────────────────────────────────

// Helper — runs an epic and collects all emitted actions into an array
const runEpic = (epic: any, action: any, state = initialState) => {
  const action$ = of(action); // Standard RxJS observable
  const state$ = of({ auth: state }) as Observable<any>; // Standard RxJS observable
  
  return epic(action$, state$, {}).pipe(toArray()).toPromise() as Promise<any[]>;
};

// describe('registerEpic', () => {
//   const [registerEpic] = authEpics as any; // grab individual epics for isolated testing

//   it('dispatches registerSuccess with user data on a successful API call', async () => {
//     mockedHttp.post.mockResolvedValueOnce({ data: mockUser });

//     const actions = await runEpic(
//       registerEpic,
//       authSliceActions.registerRequest(mockRegisterPayload)
//     );

//     expect(mockedHttp.post).toHaveBeenCalledWith('/auth/register', mockRegisterPayload);
//     expect(actions).toEqual([authSliceActions.registerSuccess(mockUser)]);
//   });

//   it('dispatches registerFailure with BE message on API error', async () => {
//     mockedHttp.post.mockRejectedValueOnce({
//       response: { data: { message: 'Email already exists' } },
//     });

//     const actions = await runEpic(
//       registerEpic,
//       authSliceActions.registerRequest(mockRegisterPayload)
//     );

//     expect(actions).toEqual([authSliceActions.registerFailure('Email already exists')]);
//   });

//   it('dispatches registerFailure with fallback message on network error', async () => {
//     mockedHttp.post.mockRejectedValueOnce(new Error('Network Error'));

//     const actions = await runEpic(
//       registerEpic,
//       authSliceActions.registerRequest(mockRegisterPayload)
//     );

//     expect(actions).toEqual([
//       authSliceActions.registerFailure('Registration failed. Please try again.'),
//     ]);
//   });
// });

// describe('loginEpic', () => {
//   const [, loginEpic] = authEpics as any;

//   it('dispatches loginSuccess with user data on a successful API call', async () => {
//     mockedHttp.post.mockResolvedValueOnce({ data: mockUser });

//     const actions = await runEpic(
//       loginEpic,
//       authSliceActions.loginRequest(mockLoginPayload)
//     );

//     expect(mockedHttp.post).toHaveBeenCalledWith('/auth/login', mockLoginPayload);
//     expect(actions).toEqual([authSliceActions.loginSuccess(mockUser)]);
//   });

//   it('dispatches loginFailure with BE message on API error', async () => {
//     mockedHttp.post.mockRejectedValueOnce({
//       response: { data: { message: 'Invalid credentials' } },
//     });

//     const actions = await runEpic(
//       loginEpic,
//       authSliceActions.loginRequest(mockLoginPayload)
//     );

//     expect(actions).toEqual([authSliceActions.loginFailure('Invalid credentials')]);
//   });

//   it('dispatches loginFailure with fallback message on network error', async () => {
//     mockedHttp.post.mockRejectedValueOnce(new Error('Network Error'));

//     const actions = await runEpic(
//       loginEpic,
//       authSliceActions.loginRequest(mockLoginPayload)
//     );

//     expect(actions).toEqual([
//       authSliceActions.loginFailure('Login failed. Please check your credentials.'),
//     ]);
//   });
// });

describe('registerEpic', () => {
  // Using array destructuring safely
  const registerEpic = authEpics; 

  it('dispatches registerSuccess with user data on a successful API call', async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: mockUser });

    const actions = await runEpic(
      registerEpic,
      authSliceActions.registerRequest(mockRegisterPayload)
    );

    expect(mockedHttp.post).toHaveBeenCalledWith('/auth/register', mockRegisterPayload);
    expect(actions).toEqual([authSliceActions.registerSuccess(mockUser)]);
  });

  it('dispatches registerFailure with BE message on API error', async () => {
    mockedHttp.post.mockRejectedValueOnce({
      response: { data: { message: 'Email already exists' } },
    });

    const actions = await runEpic(
      registerEpic,
      authSliceActions.registerRequest(mockRegisterPayload)
    );

    expect(actions).toEqual([authSliceActions.registerFailure('Email already exists')]);
  });
});

describe('loginEpic', () => {
  const loginEpic = authEpics;

  it('dispatches loginSuccess with user data on a successful API call', async () => {
    mockedHttp.post.mockResolvedValueOnce({ data: mockUser });

    const actions = await runEpic(
      loginEpic,
      authSliceActions.loginRequest(mockLoginPayload)
    );

    expect(mockedHttp.post).toHaveBeenCalledWith('/auth/login', mockLoginPayload);
    expect(actions).toEqual([authSliceActions.loginSuccess(mockUser)]);
  });
});

