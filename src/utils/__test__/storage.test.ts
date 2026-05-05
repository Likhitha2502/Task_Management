/// <reference types="jest" />
import { tempAuthService } from '../storage';

const FLAG_KEY = 'focusflow_temp_password';

describe('tempAuthService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isTempPassword', () => {
    it('returns false when flag is not set', () => {
      expect(tempAuthService.isTempPassword()).toBe(false);
    });

    it('returns false when flag has an unexpected value', () => {
      localStorage.setItem(FLAG_KEY, 'yes');
      expect(tempAuthService.isTempPassword()).toBe(false);
    });
  });

  describe('setTempPasswordFlag', () => {
    it('stores "true" in localStorage under the flag key', () => {
      tempAuthService.setTempPasswordFlag();
      expect(localStorage.getItem(FLAG_KEY)).toBe('true');
    });

    it('makes isTempPassword return true', () => {
      tempAuthService.setTempPasswordFlag();
      expect(tempAuthService.isTempPassword()).toBe(true);
    });
  });

  describe('clearTempPasswordFlag', () => {
    it('removes the flag from localStorage', () => {
      tempAuthService.setTempPasswordFlag();
      tempAuthService.clearTempPasswordFlag();
      expect(localStorage.getItem(FLAG_KEY)).toBeNull();
    });

    it('makes isTempPassword return false after clearing', () => {
      tempAuthService.setTempPasswordFlag();
      tempAuthService.clearTempPasswordFlag();
      expect(tempAuthService.isTempPassword()).toBe(false);
    });

    it('is safe to call when flag is not set', () => {
      tempAuthService.clearTempPasswordFlag();
      expect(tempAuthService.isTempPassword()).toBe(false);
    });
  });
});
