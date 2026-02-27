import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { StorageService } from './storage-service';
import type { StorageData } from '../types';

function makeStorageData(overrides?: Partial<StorageData>): StorageData {
  return {
    content: '# Hello\nSome content',
    themeId: 'classic',
    customStyles: {},
    lastSaved: Date.now(),
    ...overrides,
  };
}

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService();
    localStorage.clear();
  });

  afterEach(() => {
    service.cancelPendingDebounce();
  });

  // --- isAvailable ---

  it('should report localStorage as available in jsdom', () => {
    expect(service.isAvailable()).toBe(true);
  });

  it('should report unavailable when localStorage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(service.isAvailable()).toBe(false);
    spy.mockRestore();
  });

  // --- save / load round-trip ---

  it('should save and load data correctly', () => {
    const data = makeStorageData();
    expect(service.save(data)).toBe(true);
    const loaded = service.load();
    expect(loaded).toEqual(data);
  });

  it('should preserve customStyles through save/load', () => {
    const data = makeStorageData({
      customStyles: { fontSize: 18, lineHeight: 2.0, color: '#ff0000' },
    });
    service.save(data);
    expect(service.load()).toEqual(data);
  });

  it('should return null when nothing is saved', () => {
    expect(service.load()).toBeNull();
  });

  // --- save failure ---

  it('should return false when localStorage is unavailable on save', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const data = makeStorageData();
    expect(service.save(data)).toBe(false);
    spy.mockRestore();
  });

  it('should return false when quota is exceeded', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    const data = makeStorageData();
    expect(service.save(data)).toBe(false);
    spy.mockRestore();
  });

  // --- load failure ---

  it('should return null when localStorage is unavailable on load', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(service.load()).toBeNull();
    spy.mockRestore();
  });

  it('should return null when stored data is invalid JSON', () => {
    localStorage.setItem('wechat-formatter-data', '{invalid json!!!');
    expect(service.load()).toBeNull();
  });

  // --- clear ---

  it('should clear stored data', () => {
    service.save(makeStorageData());
    service.clear();
    expect(service.load()).toBeNull();
  });

  it('should not throw when clearing with unavailable localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(() => service.clear()).not.toThrow();
    spy.mockRestore();
  });

  // --- debouncedSave ---

  it('should debounce save calls with 2 second delay', () => {
    vi.useFakeTimers();
    const data1 = makeStorageData({ content: 'first' });
    const data2 = makeStorageData({ content: 'second' });

    service.debouncedSave(data1);
    service.debouncedSave(data2);

    // Nothing saved yet
    expect(service.load()).toBeNull();

    // Advance past debounce window
    vi.advanceTimersByTime(2000);

    // Only the last call should have been saved
    const loaded = service.load();
    expect(loaded?.content).toBe('second');

    vi.useRealTimers();
  });

  it('should not save if debounce is cancelled', () => {
    vi.useFakeTimers();
    const data = makeStorageData();

    service.debouncedSave(data);
    service.cancelPendingDebounce();

    vi.advanceTimersByTime(3000);
    expect(service.load()).toBeNull();

    vi.useRealTimers();
  });

  it('should reset debounce timer on each call', () => {
    vi.useFakeTimers();
    const data1 = makeStorageData({ content: 'a' });
    const data2 = makeStorageData({ content: 'b' });

    service.debouncedSave(data1);
    vi.advanceTimersByTime(1500); // 1.5s - not yet fired
    expect(service.load()).toBeNull();

    service.debouncedSave(data2); // resets timer
    vi.advanceTimersByTime(1500); // 1.5s from second call - still not fired
    expect(service.load()).toBeNull();

    vi.advanceTimersByTime(500); // now 2s from second call
    expect(service.load()?.content).toBe('b');

    vi.useRealTimers();
  });
});
