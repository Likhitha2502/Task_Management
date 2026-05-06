/// <reference types="jest" />
import { profileFile } from '../profileFile';

describe('profileFile', () => {
  beforeEach(() => {
    profileFile.clear();
  });

  describe('get', () => {
    it('returns undefined initially', () => {
      expect(profileFile.get()).toBeUndefined();
    });
  });

  describe('set', () => {
    it('stores a File object', () => {
      const file = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' });
      profileFile.set(file);
      expect(profileFile.get()).toBe(file);
    });

    it('stores null', () => {
      profileFile.set(null);
      expect(profileFile.get()).toBeNull();
    });

    it('stores undefined explicitly', () => {
      const file = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' });
      profileFile.set(file);
      profileFile.set(undefined);
      expect(profileFile.get()).toBeUndefined();
    });

    it('overwrites a previously stored file with a new file', () => {
      const first = new File(['first'], 'first.jpg', { type: 'image/jpeg' });
      const second = new File(['second'], 'second.jpg', { type: 'image/png' });
      profileFile.set(first);
      profileFile.set(second);
      expect(profileFile.get()).toBe(second);
    });

    it('overwrites a File with null', () => {
      const file = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' });
      profileFile.set(file);
      profileFile.set(null);
      expect(profileFile.get()).toBeNull();
    });
  });

  describe('clear', () => {
    it('resets the stored value to undefined', () => {
      const file = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' });
      profileFile.set(file);
      profileFile.clear();
      expect(profileFile.get()).toBeUndefined();
    });

    it('is safe to call when value is already undefined', () => {
      profileFile.clear();
      expect(profileFile.get()).toBeUndefined();
    });

    it('is safe to call when value is null', () => {
      profileFile.set(null);
      profileFile.clear();
      expect(profileFile.get()).toBeUndefined();
    });
  });
});
