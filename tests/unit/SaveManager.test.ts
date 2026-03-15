import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SaveManager } from '../../src/game/storage/SaveManager';

// Mock localStorage
const storage = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => storage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
  removeItem: vi.fn((key: string) => storage.delete(key)),
  clear: vi.fn(() => storage.clear()),
  length: 0,
  key: vi.fn(() => null),
};

vi.stubGlobal('localStorage', localStorageMock);

describe('SaveManager', () => {
  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();
  });

  it('returns default data when no save exists', () => {
    const manager = new SaveManager();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
    expect(data.unlockedPlanets).toEqual([]);
  });

  it('saves and loads data', () => {
    const manager = new SaveManager();
    manager.save({ clearedStage: 2, unlockedPlanets: [1, 2] });
    const data = manager.load();
    expect(data.clearedStage).toBe(2);
    expect(data.unlockedPlanets).toEqual([1, 2]);
  });

  it('returns default on JSON parse error', () => {
    storage.set('universe-kids-race-save', 'invalid json');
    const manager = new SaveManager();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
    expect(data.unlockedPlanets).toEqual([]);
  });

  it('returns default if clearedStage is invalid', () => {
    storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 99 }));
    const manager = new SaveManager();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
  });

  it('accepts clearedStage up to 11', () => {
    const manager = new SaveManager();
    manager.save({ clearedStage: 11, unlockedPlanets: [] });
    const data = manager.load();
    expect(data.clearedStage).toBe(11);
  });

  it('rejects clearedStage greater than 11', () => {
    storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 12 }));
    const manager = new SaveManager();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
  });

  it('accepts all valid clearedStage values 0 through 11', () => {
    const manager = new SaveManager();
    for (let i = 0; i <= 11; i++) {
      manager.save({ clearedStage: i, unlockedPlanets: [] });
      const data = manager.load();
      expect(data.clearedStage).toBe(i);
    }
  });

  it('clear removes saved data', () => {
    const manager = new SaveManager();
    manager.save({ clearedStage: 8, unlockedPlanets: [1] });
    manager.clear();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
    expect(data.unlockedPlanets).toEqual([]);
  });

  // unlockedPlanets validation tests
  describe('unlockedPlanets', () => {
    it('defaults to empty array when missing (backward compat)', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 5 }));
      const manager = new SaveManager();
      const data = manager.load();
      expect(data.clearedStage).toBe(5);
      expect(data.unlockedPlanets).toEqual([]);
    });

    it('falls back to empty array when not an array', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 3, unlockedPlanets: 'bad' }));
      const manager = new SaveManager();
      const data = manager.load();
      expect(data.unlockedPlanets).toEqual([]);
    });

    it('filters out values outside range 1-11', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 3, unlockedPlanets: [0, 1, 2, 12, 99, -1] }));
      const manager = new SaveManager();
      const data = manager.load();
      expect(data.unlockedPlanets).toEqual([1, 2]);
    });

    it('filters out non-integer values', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 3, unlockedPlanets: [1, 2.5, 3, 'a', null] }));
      const manager = new SaveManager();
      const data = manager.load();
      expect(data.unlockedPlanets).toEqual([1, 3]);
    });

    it('deduplicates values', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 3, unlockedPlanets: [1, 1, 2, 2, 3] }));
      const manager = new SaveManager();
      const data = manager.load();
      expect(data.unlockedPlanets).toEqual([1, 2, 3]);
    });

    it('returns default on JSON parse error', () => {
      storage.set('universe-kids-race-save', 'not json at all');
      const manager = new SaveManager();
      const data = manager.load();
      expect(data.unlockedPlanets).toEqual([]);
    });

    it('preserves valid unlockedPlanets on save and load', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 5, unlockedPlanets: [1, 3, 5, 11] });
      const data = manager.load();
      expect(data.unlockedPlanets).toEqual([1, 3, 5, 11]);
    });
  });
});
