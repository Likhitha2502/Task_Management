import authReducer, { loginSuccess, logout } from './authSlice';

describe('auth reducer', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
  };

  it('should handle initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle loginSuccess', () => {
    const actual = authReducer(initialState, loginSuccess('test@user.com'));
    expect(actual.isAuthenticated).toBe(true);
    expect(actual.user).toBe('test@user.com');
  });

  it('should handle logout', () => {
    const loggedInState = { user: 'test', isAuthenticated: true, loading: false };
    const actual = authReducer(loggedInState, logout());
    expect(actual.user).toBeNull();
    expect(actual.isAuthenticated).toBe(false);
  });
});
