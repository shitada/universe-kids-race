import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SaveManager } from '../../src/game/storage/SaveManager';
import { TOTAL_STAGES } from '../../src/game/config/StageConfig';

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

// Mock sessionStorage
const sessionStore = new Map<string, string>();
const sessionStorageMock = {
  getItem: vi.fn((key: string) => sessionStore.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => sessionStore.set(key, value)),
  removeItem: vi.fn((key: string) => sessionStore.delete(key)),
  clear: vi.fn(() => sessionStore.clear()),
  length: 0,
  key: vi.fn(() => null),
};

vi.stubGlobal('sessionStorage', sessionStorageMock);

describe('SaveManager', () => {
  beforeEach(() => {
    storage.clear();
    sessionStore.clear();
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

  it('accepts clearedStage up to TOTAL_STAGES', () => {
    const manager = new SaveManager();
    manager.save({ clearedStage: TOTAL_STAGES, unlockedPlanets: [] });
    const data = manager.load();
    expect(data.clearedStage).toBe(TOTAL_STAGES);
  });

  it('rejects clearedStage greater than TOTAL_STAGES', () => {
    storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: TOTAL_STAGES + 1 }));
    const manager = new SaveManager();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
  });

  it('accepts all valid clearedStage values 0 through TOTAL_STAGES', () => {
    const manager = new SaveManager();
    for (let i = 0; i <= TOTAL_STAGES; i++) {
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

  describe('storage failure resilience', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('does not throw when localStorage.setItem throws QuotaExceededError on save', () => {
      const manager = new SaveManager();
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => manager.save({ clearedStage: 3, unlockedPlanets: [1, 2] })).not.toThrow();
    });

    it('does not throw when localStorage.removeItem throws on clear', () => {
      const manager = new SaveManager();
      vi.spyOn(localStorage, 'removeItem').mockImplementation(() => {
        throw new Error('removal failed');
      });
      expect(() => manager.clear()).not.toThrow();
    });

    it('returns previously stored value when a later save fails to write', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 4, unlockedPlanets: [1, 2] });

      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => manager.save({ clearedStage: 9, unlockedPlanets: [1, 2, 3] })).not.toThrow();

      vi.restoreAllMocks();
      const data = manager.load();
      expect(data.clearedStage).toBe(4);
      expect(data.unlockedPlanets).toEqual([1, 2]);
    });

    it('returns default when setItem fails before any successful write', () => {
      const manager = new SaveManager();
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      manager.save({ clearedStage: 7, unlockedPlanets: [1, 2, 3] });

      vi.restoreAllMocks();
      const data = manager.load();
      expect(data.clearedStage).toBe(0);
      expect(data.unlockedPlanets).toEqual([]);
    });
  });

  describe('session management (sessionStorage flag pattern)', () => {
    const SESSION_KEY = 'universe-kids-race-session';

    function runSessionCheck(saveManager: SaveManager): void {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        saveManager.clear();
      }
      sessionStorage.setItem(SESSION_KEY, 'active');
    }

    it('clears save data when sessionStorage flag is absent and localStorage has data', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 5, unlockedPlanets: [1, 2, 3, 4, 5] });

      // No session flag set — simulates Safari swipe termination
      runSessionCheck(manager);

      const data = manager.load();
      expect(data.clearedStage).toBe(0);
      expect(data.unlockedPlanets).toEqual([]);
    });

    it('preserves save data when sessionStorage flag is present', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 5, unlockedPlanets: [1, 2, 3, 4, 5] });

      // Session flag already set — tab was kept alive
      sessionStore.set(SESSION_KEY, 'active');

      runSessionCheck(manager);

      const data = manager.load();
      expect(data.clearedStage).toBe(5);
      expect(data.unlockedPlanets).toEqual([1, 2, 3, 4, 5]);
    });

    it('calls clear safely when sessionStorage flag is absent and localStorage is empty', () => {
      const manager = new SaveManager();
      // No data saved, no session flag
      expect(() => runSessionCheck(manager)).not.toThrow();
      const data = manager.load();
      expect(data.clearedStage).toBe(0);
      expect(data.unlockedPlanets).toEqual([]);
    });

    it('sets sessionStorage flag to active after check', () => {
      const manager = new SaveManager();
      runSessionCheck(manager);
      expect(sessionStore.get(SESSION_KEY)).toBe('active');
    });
  });

  describe('exception safety (iPad Safari hardening)', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('save() does not throw when localStorage.setItem throws QuotaExceededError', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });
      const manager = new SaveManager();
      expect(() => manager.save({ clearedStage: 3, unlockedPlanets: [1, 2, 3] })).not.toThrow();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('clear() does not throw when localStorage.removeItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(localStorage, 'removeItem').mockImplementationOnce(() => {
        throw new Error('SecurityError');
      });
      const manager = new SaveManager();
      expect(() => manager.clear()).not.toThrow();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('load() returns DEFAULT_DATA after a save() failure (no crash on subsequent load)', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });
      const manager = new SaveManager();
      manager.save({ clearedStage: 7, unlockedPlanets: [1, 2] });
      const data = manager.load();
      expect(data.clearedStage).toBe(0);
      expect(data.unlockedPlanets).toEqual([]);
    });

    it('isFreshSession() does not throw when sessionStorage.getItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('SecurityError');
      });
      const manager = new SaveManager();
      let result: boolean | undefined;
      expect(() => {
        result = manager.isFreshSession();
      }).not.toThrow();
      expect(result).toBe(false);
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('isFreshSession() does not throw when sessionStorage.setItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });
      const manager = new SaveManager();
      expect(() => manager.isFreshSession()).not.toThrow();
      warnSpy.mockRestore();
    });

    it('isFreshSession() returns true on first call and false on subsequent calls', () => {
      const manager = new SaveManager();
      expect(manager.isFreshSession()).toBe(true);
      expect(manager.isFreshSession()).toBe(false);
    });
  });
});
