/// <reference types="jest" />
import { jwtService } from '../jwt';

const TOKEN_KEY = 'auth_token';

describe('jwtService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getToken', () => {
    it('returns null when no token is stored', () => {
      expect(jwtService.getToken()).toBeNull();
    });

    it('returns the stored token', () => {
      localStorage.setItem(TOKEN_KEY, 'my-token');
      expect(jwtService.getToken()).toBe('my-token');
    });
  });

  describe('setToken', () => {
    it('stores the token in localStorage', () => {
      jwtService.setToken('abc123');
      expect(localStorage.getItem(TOKEN_KEY)).toBe('abc123');
    });

    it('overwrites an existing token', () => {
      jwtService.setToken('first-token');
      jwtService.setToken('second-token');
      expect(jwtService.getToken()).toBe('second-token');
    });
  });

  describe('removeToken', () => {
    it('removes the token from localStorage', () => {
      jwtService.setToken('to-be-removed');
      jwtService.removeToken();
      expect(jwtService.getToken()).toBeNull();
    });

    it('is safe to call when no token is stored', () => {
      jwtService.removeToken();
      expect(jwtService.getToken()).toBeNull();
    });
  });
});
