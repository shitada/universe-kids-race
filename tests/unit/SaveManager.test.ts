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

function runBootstrapSessionCheck(saveManager: SaveManager): void {
  if (saveManager.getSessionState() === 'fresh') {
    saveManager.resetSessionDataPreservingMuted();
  }
}

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
    expect(data.gameplayStats).toEqual({
      totalPlayTimeSeconds: 0,
      totalStarsCollected: 0,
      totalBoostUses: 0,
      stageClearCounts: {},
    });
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

  describe('discoveredConstellations', () => {
    it('defaults to empty array when the field is missing', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 1, unlockedPlanets: [1] }));
      const manager = new SaveManager();
      expect(manager.load().discoveredConstellations ?? []).toEqual([]);
    });

    it('sanitizes invalid constellation stage numbers', () => {
      storage.set('universe-kids-race-save', JSON.stringify({
        clearedStage: 1,
        unlockedPlanets: [1],
        discoveredConstellations: [0, 1, 1.5, 4, 99, 'bad'],
      }));
      const manager = new SaveManager();
      expect(manager.load().discoveredConstellations ?? []).toEqual([1, 4]);
    });

    it('marks a constellation as discovered once per stage', () => {
      const manager = new SaveManager();
      expect(manager.markConstellationDiscovered(1)).toBe(true);
      expect(manager.markConstellationDiscovered(1)).toBe(false);
      expect(manager.load().discoveredConstellations ?? []).toEqual([1]);
    });
  });

  describe('muted persistence', () => {
    it('defaults muted to false when no save exists', () => {
      const manager = new SaveManager();
      expect(manager.load().muted).toBe(false);
    });

    it('defaults muted to false for legacy saves missing the field', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 3, unlockedPlanets: [1, 2] }));
      const manager = new SaveManager();
      expect(manager.load().muted).toBe(false);
    });

    it('persists muted=true through save/load roundtrip', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 4, unlockedPlanets: [1, 2, 3], muted: true });
      const data = manager.load();
      expect(data.muted).toBe(true);
      // Other fields remain intact
      expect(data.clearedStage).toBe(4);
      expect(data.unlockedPlanets).toEqual([1, 2, 3]);
    });

    it('persists muted=false through save/load roundtrip', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 1, unlockedPlanets: [1], muted: false });
      expect(manager.load().muted).toBe(false);
    });

    it('coerces non-boolean muted values to false', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 2, unlockedPlanets: [1], muted: 'yes' }));
      const manager = new SaveManager();
      expect(manager.load().muted).toBe(false);
    });

    it('coerces null muted to false', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 2, unlockedPlanets: [1], muted: null }));
      const manager = new SaveManager();
      expect(manager.load().muted).toBe(false);
    });
  });

  describe('spaceshipCustomization', () => {
    it('defaults to the starter spaceship colors when missing', () => {
      const manager = new SaveManager();

      expect(manager.load().spaceshipCustomization).toEqual({
        bodyColor: 'sky',
        noseColor: 'sunset',
        wingColor: 'aqua',
      });
    });

    it('keeps valid customization values on load', () => {
      storage.set('universe-kids-race-save', JSON.stringify({
        clearedStage: 2,
        unlockedPlanets: [1, 2],
        spaceshipCustomization: {
          bodyColor: 'aqua',
          noseColor: 'sky',
          wingColor: 'sunset',
        },
      }));
      const manager = new SaveManager();

      expect(manager.load().spaceshipCustomization).toEqual({
        bodyColor: 'aqua',
        noseColor: 'sky',
        wingColor: 'sunset',
      });
    });

    it('falls back per part when customization is malformed', () => {
      storage.set('universe-kids-race-save', JSON.stringify({
        clearedStage: 1,
        unlockedPlanets: [1],
        spaceshipCustomization: {
          bodyColor: 'bad',
          noseColor: 'sky',
          wingColor: null,
        },
      }));
      const manager = new SaveManager();

      expect(manager.load().spaceshipCustomization).toEqual({
        bodyColor: 'sky',
        noseColor: 'sky',
        wingColor: 'aqua',
      });
    });

    it('preserves spaceship customization when progress is reset', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 4,
        unlockedPlanets: [1, 2, 3, 4],
        muted: true,
        spaceshipCustomization: {
          bodyColor: 'sunset',
          noseColor: 'aqua',
          wingColor: 'sky',
        },
      });

      manager.resetProgressPreservingSettings();

      expect(manager.load().spaceshipCustomization).toEqual({
        bodyColor: 'sunset',
        noseColor: 'aqua',
        wingColor: 'sky',
      });
    });
  });

  describe('gameplayStats', () => {
    it('sanitizes malformed gameplay stats from storage', () => {
      storage.set('universe-kids-race-save', JSON.stringify({
        clearedStage: 2,
        unlockedPlanets: [1, 2],
        gameplayStats: {
          totalPlayTimeSeconds: 125.5,
          totalStarsCollected: 18,
          totalBoostUses: -1,
          stageClearCounts: {
            1: 2,
            2: 1,
            99: 4,
            bad: 3,
          },
        },
      }));
      const manager = new SaveManager();

      expect(manager.load().gameplayStats).toEqual({
        totalPlayTimeSeconds: 125.5,
        totalStarsCollected: 18,
        totalBoostUses: 0,
        stageClearCounts: { 1: 2, 2: 1 },
      });
    });

    it('records play time, stars, boosts, and clears', () => {
      const manager = new SaveManager();

      manager.recordGameplaySession({
        stageNumber: 2,
        playTimeSeconds: 65,
        collectedStars: 7,
        boostUses: 3,
        stageCleared: true,
      });

      expect(manager.load().gameplayStats).toEqual({
        totalPlayTimeSeconds: 65,
        totalStarsCollected: 7,
        totalBoostUses: 3,
        stageClearCounts: { 2: 1 },
      });
    });

    it('preserves gameplay stats when progress is reset', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 4,
        unlockedPlanets: [1, 2, 3, 4],
        muted: true,
        gameplayStats: {
          totalPlayTimeSeconds: 180,
          totalStarsCollected: 14,
          totalBoostUses: 6,
          stageClearCounts: { 1: 1, 4: 2 },
        },
      });

      manager.resetProgressPreservingSettings();

      expect(manager.load().gameplayStats).toEqual({
        totalPlayTimeSeconds: 180,
        totalStarsCollected: 14,
        totalBoostUses: 6,
        stageClearCounts: { 1: 1, 4: 2 },
      });
    });
  });

  describe('colorAccessibility', () => {
    it('persists high contrast mode when enabled', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 2,
        unlockedPlanets: [1, 2],
        colorAccessibility: { highContrast: true },
      });

      expect(manager.load().colorAccessibility).toEqual({ highContrast: true });
    });

    it('drops malformed colorAccessibility payloads', () => {
      storage.set('universe-kids-race-save', JSON.stringify({
        clearedStage: 1,
        unlockedPlanets: [1],
        colorAccessibility: { highContrast: 'yes' },
      }));
      const manager = new SaveManager();

      expect(manager.load().colorAccessibility).toBeUndefined();
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
      runBootstrapSessionCheck(saveManager);
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

    it('fresh session restart resets progress and tutorialShown for the next player', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 5,
        unlockedPlanets: [1, 2, 3, 4, 5],
        bestStageStars: { 1: 3, 2: 2 },
        tutorialShown: true,
        muted: true,
      });

      expect(manager.getSessionState()).toBe('fresh');
      manager.resetSessionDataPreservingMuted();

      expect(manager.load()).toEqual({
        clearedStage: 0,
        unlockedPlanets: [],
        bestStageStars: {},
        gameplayStats: {
          totalPlayTimeSeconds: 0,
          totalStarsCollected: 0,
          totalBoostUses: 0,
          stageClearCounts: {},
        },
        tutorialShown: false,
        muted: true,
        spaceshipCustomization: { bodyColor: 'sky', noseColor: 'sunset', wingColor: 'aqua' },
      });
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

    it('getSessionState() does not throw when sessionStorage.getItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('SecurityError');
      });
      const manager = new SaveManager();
      let result: string | undefined;
      expect(() => {
        result = manager.getSessionState();
      }).not.toThrow();
      expect(result).toBe('unavailable');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('getSessionState() stays unavailable after repeated sessionStorage.getItem failures', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorageMock.getItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });
      const manager = new SaveManager();
      expect(manager.getSessionState()).toBe('unavailable');
      expect(manager.getSessionState()).toBe('unavailable');
      expect(warnSpy).toHaveBeenCalledTimes(2);
      warnSpy.mockRestore();
    });

    it('getSessionState() returns unavailable when sessionStorage.setItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      sessionStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      const manager = new SaveManager();
      expect(manager.getSessionState()).toBe('unavailable');
      expect(manager.getSessionState()).toBe('unavailable');
      expect(warnSpy).toHaveBeenCalledTimes(2);
      warnSpy.mockRestore();
    });

    it('getSessionState() returns fresh on first call and existing on subsequent calls', () => {
      const manager = new SaveManager();
      expect(manager.getSessionState()).toBe('fresh');
      expect(manager.getSessionState()).toBe('existing');
    });

    it('preserves localStorage progress across restart when sessionStorage.getItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const initialData = {
        clearedStage: 3,
        unlockedPlanets: [1, 2, 3],
        bestStageStars: { 1: 3, 3: 2 },
        gameplayStats: {
          totalPlayTimeSeconds: 0,
          totalStarsCollected: 0,
          totalBoostUses: 0,
          stageClearCounts: {},
        },
        muted: true,
        tutorialShown: true,
        spaceshipCustomization: { bodyColor: 'sky', noseColor: 'sunset', wingColor: 'aqua' },
      };
      const manager = new SaveManager();
      manager.save(initialData);
      sessionStorageMock.getItem.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      runBootstrapSessionCheck(manager);
      const restartedManager = new SaveManager();
      runBootstrapSessionCheck(restartedManager);

      expect(restartedManager.load()).toEqual(initialData);
      expect(warnSpy).toHaveBeenCalledTimes(2);
      warnSpy.mockRestore();
    });

    it('preserves localStorage progress across restart when sessionStorage.setItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const initialData = {
        clearedStage: 4,
        unlockedPlanets: [1, 2, 3, 4],
        bestStageStars: { 2: 1, 4: 3 },
        gameplayStats: {
          totalPlayTimeSeconds: 0,
          totalStarsCollected: 0,
          totalBoostUses: 0,
          stageClearCounts: {},
        },
        muted: false,
        tutorialShown: true,
        spaceshipCustomization: { bodyColor: 'sky', noseColor: 'sunset', wingColor: 'aqua' },
      };
      const manager = new SaveManager();
      manager.save(initialData);
      sessionStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      runBootstrapSessionCheck(manager);
      const restartedManager = new SaveManager();
      runBootstrapSessionCheck(restartedManager);

      expect(restartedManager.load()).toEqual(initialData);
      expect(warnSpy).toHaveBeenCalledTimes(2);
      warnSpy.mockRestore();
    });
  });

  describe('resetSessionDataPreservingMuted', () => {
    it('preserves muted=true while resetting clearedStage and unlockedPlanets', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 5, unlockedPlanets: [1, 2, 3], muted: true });
      manager.resetSessionDataPreservingMuted();
      const data = manager.load();
      expect(data.clearedStage).toBe(0);
      expect(data.unlockedPlanets).toEqual([]);
      expect(data.muted).toBe(true);
    });

    it('preserves muted=false while resetting other fields', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 7, unlockedPlanets: [4, 5], muted: false });
      manager.resetSessionDataPreservingMuted();
      const data = manager.load();
      expect(data.clearedStage).toBe(0);
      expect(data.unlockedPlanets).toEqual([]);
      expect(data.muted).toBe(false);
    });

    it('resets tutorialShown to false while resetting session progress data', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 7,
        unlockedPlanets: [1, 2, 3, 4],
        muted: true,
        tutorialShown: true,
        colorAccessibility: { highContrast: true },
        bestStageStars: { 1: 3, 2: 5 },
      });

      manager.resetSessionDataPreservingMuted();

      expect(manager.load()).toEqual({
        clearedStage: 0,
        unlockedPlanets: [],
        muted: true,
        tutorialShown: false,
        colorAccessibility: { highContrast: true },
        bestStageStars: {},
        gameplayStats: {
          totalPlayTimeSeconds: 0,
          totalStarsCollected: 0,
          totalBoostUses: 0,
          stageClearCounts: {},
        },
        spaceshipCustomization: { bodyColor: 'sky', noseColor: 'sunset', wingColor: 'aqua' },
      });
    });

    it('keeps tutorialShown=false when resetting a first-run save', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 2,
        unlockedPlanets: [1, 2],
        muted: false,
        tutorialShown: false,
        bestStageStars: { 1: 2 },
      });

      manager.resetSessionDataPreservingMuted();

      expect(manager.load()).toEqual({
        clearedStage: 0,
        unlockedPlanets: [],
        muted: false,
        tutorialShown: false,
        bestStageStars: {},
        gameplayStats: {
          totalPlayTimeSeconds: 0,
          totalStarsCollected: 0,
          totalBoostUses: 0,
          stageClearCounts: {},
        },
        spaceshipCustomization: { bodyColor: 'sky', noseColor: 'sunset', wingColor: 'aqua' },
      });
    });

    it('does not throw and stores muted=false when no save exists', () => {
      const manager = new SaveManager();
      expect(() => manager.resetSessionDataPreservingMuted()).not.toThrow();
      const data = manager.load();
      expect(data.clearedStage).toBe(0);
      expect(data.unlockedPlanets).toEqual([]);
      expect(data.muted).toBe(false);
    });

    it('does not throw when localStorage.setItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const manager = new SaveManager();
      vi.spyOn(localStorage, 'setItem').mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => manager.resetSessionDataPreservingMuted()).not.toThrow();
      warnSpy.mockRestore();
    });
  });

  describe('resetProgressPreservingSettings', () => {
    it('resets progress while preserving stable settings and onboarding state', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 6,
        unlockedPlanets: [1, 2, 3, 4, 5, 6],
        muted: true,
        tutorialShown: true,
        colorAccessibility: { highContrast: true },
        bestStageStars: { 1: 3, 6: 2 },
        lastStablePixelTier: 2,
      });

      manager.resetProgressPreservingSettings();

      expect(manager.load()).toEqual({
        clearedStage: 0,
        unlockedPlanets: [],
        muted: true,
        tutorialShown: true,
        colorAccessibility: { highContrast: true },
        bestStageStars: {},
        gameplayStats: {
          totalPlayTimeSeconds: 0,
          totalStarsCollected: 0,
          totalBoostUses: 0,
          stageClearCounts: {},
        },
        spaceshipCustomization: { bodyColor: 'sky', noseColor: 'sunset', wingColor: 'aqua' },
        lastStablePixelTier: 2,
      });
    });

    it('keeps default settings when resetting a save without progress', () => {
      const manager = new SaveManager();

      manager.resetProgressPreservingSettings();

      expect(manager.load()).toEqual({
        clearedStage: 0,
        unlockedPlanets: [],
        muted: false,
        tutorialShown: false,
        bestStageStars: {},
        gameplayStats: {
          totalPlayTimeSeconds: 0,
          totalStarsCollected: 0,
          totalBoostUses: 0,
          stageClearCounts: {},
        },
        spaceshipCustomization: { bodyColor: 'sky', noseColor: 'sunset', wingColor: 'aqua' },
      });
    });
  });

  describe('bestStageStars', () => {
    it('defaults to empty object when no save exists', () => {
      const manager = new SaveManager();
      expect(manager.load().bestStageStars).toEqual({});
    });

    it('defaults to empty object for legacy saves missing the field', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 3, unlockedPlanets: [1, 2] }));
      const manager = new SaveManager();
      expect(manager.load().bestStageStars).toEqual({});
    });

    it('does not throw on legacy save without bestStageStars', () => {
      storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 3, unlockedPlanets: [1, 2] }));
      const manager = new SaveManager();
      expect(() => manager.load()).not.toThrow();
    });

    it('persists bestStageStars through save/load roundtrip', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 2, unlockedPlanets: [1, 2], bestStageStars: { 1: 5, 2: 3 } });
      const data = manager.load();
      expect(data.bestStageStars).toEqual({ 1: 5, 2: 3 });
    });

    it('drops stage keys outside 1..TOTAL_STAGES', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({
          clearedStage: 1,
          unlockedPlanets: [1],
          bestStageStars: { 0: 1, 1: 4, [String(TOTAL_STAGES)]: 9, [String(TOTAL_STAGES + 1)]: 99 },
        }),
      );
      const manager = new SaveManager();
      const data = manager.load();
      expect(data.bestStageStars).toEqual({ 1: 4, [TOTAL_STAGES]: 9 });
    });

    it('drops non-integer or non-canonical stage keys', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 1, unlockedPlanets: [1], bestStageStars: { 'a': 1, '1.5': 2, '1': 3 } }),
      );
      const manager = new SaveManager();
      expect(manager.load().bestStageStars).toEqual({ 1: 3 });
    });

    it('drops negative or non-integer star counts', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 1, unlockedPlanets: [1], bestStageStars: { 1: -1, 2: 2.5, 3: 'x', 4: 7 } }),
      );
      const manager = new SaveManager();
      expect(manager.load().bestStageStars).toEqual({ 4: 7 });
    });

    it('falls back to empty object when bestStageStars is not an object', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 1, unlockedPlanets: [1], bestStageStars: 'oops' }),
      );
      const manager = new SaveManager();
      expect(manager.load().bestStageStars).toEqual({});
    });

    it('falls back to empty object when bestStageStars is an array', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 1, unlockedPlanets: [1], bestStageStars: [1, 2, 3] }),
      );
      const manager = new SaveManager();
      expect(manager.load().bestStageStars).toEqual({});
    });
  });

  describe('updateBestStageStars', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('records a new best when no previous record exists', () => {
      const manager = new SaveManager();
      manager.updateBestStageStars(1, 4);
      expect(manager.load().bestStageStars).toEqual({ 1: 4 });
    });

    it('updates the record only when the new count is higher', () => {
      const manager = new SaveManager();
      manager.updateBestStageStars(1, 3);
      manager.updateBestStageStars(1, 5);
      expect(manager.load().bestStageStars?.[1]).toBe(5);
    });

    it('does not overwrite a higher previous record with a lower count', () => {
      const manager = new SaveManager();
      manager.updateBestStageStars(1, 7);
      manager.updateBestStageStars(1, 2);
      expect(manager.load().bestStageStars?.[1]).toBe(7);
    });

    it('does not overwrite when counts are equal', () => {
      const manager = new SaveManager();
      manager.updateBestStageStars(1, 4);
      manager.updateBestStageStars(1, 4);
      expect(manager.load().bestStageStars?.[1]).toBe(4);
    });

    it('tracks multiple stages independently', () => {
      const manager = new SaveManager();
      manager.updateBestStageStars(1, 3);
      manager.updateBestStageStars(2, 8);
      manager.updateBestStageStars(3, 0);
      expect(manager.load().bestStageStars).toEqual({ 1: 3, 2: 8 });
    });

    it('ignores invalid stageNumber', () => {
      const manager = new SaveManager();
      manager.updateBestStageStars(0, 5);
      manager.updateBestStageStars(TOTAL_STAGES + 1, 5);
      manager.updateBestStageStars(1.5, 5);
      expect(manager.load().bestStageStars).toEqual({});
    });

    it('ignores negative or non-integer star counts', () => {
      const manager = new SaveManager();
      manager.updateBestStageStars(1, -1);
      manager.updateBestStageStars(1, 2.5);
      expect(manager.load().bestStageStars).toEqual({});
    });

    it('does not throw when localStorage.setItem throws', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const manager = new SaveManager();
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => manager.updateBestStageStars(1, 5)).not.toThrow();
      warnSpy.mockRestore();
    });

    it('preserves clearedStage and unlockedPlanets when updating', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 4, unlockedPlanets: [1, 2, 3] });
      manager.updateBestStageStars(2, 6);
      const data = manager.load();
      expect(data.clearedStage).toBe(4);
      expect(data.unlockedPlanets).toEqual([1, 2, 3]);
      expect(data.bestStageStars).toEqual({ 2: 6 });
    });
  });

  describe('markStageCleared', () => {
    it('updates clearedStage and unlockedPlanets for a newly cleared stage', () => {
      const manager = new SaveManager();

      const isNewUnlock = manager.markStageCleared(3);

      expect(isNewUnlock).toBe(true);
      expect(manager.load().clearedStage).toBe(3);
      expect(manager.load().unlockedPlanets).toEqual([3]);
    });

    it('does not duplicate unlockedPlanets when the same stage is cleared again', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 3, unlockedPlanets: [1, 3], muted: true });

      const isNewUnlock = manager.markStageCleared(3);

      expect(isNewUnlock).toBe(false);
      expect(manager.load().clearedStage).toBe(3);
      expect(manager.load().unlockedPlanets).toEqual([1, 3]);
      expect(manager.load().muted).toBe(true);
    });

    it('does not roll clearedStage back when a lower stage is marked later', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 5, unlockedPlanets: [2, 5] });

      const isNewUnlock = manager.markStageCleared(3);

      expect(isNewUnlock).toBe(true);
      expect(manager.load().clearedStage).toBe(5);
      expect(manager.load().unlockedPlanets).toEqual([2, 5, 3]);
    });

    it('ignores invalid stage numbers', () => {
      const manager = new SaveManager();

      expect(manager.markStageCleared(0)).toBe(false);
      expect(manager.markStageCleared(TOTAL_STAGES + 1)).toBe(false);
      expect(manager.markStageCleared(1.5)).toBe(false);

      expect(manager.load().clearedStage).toBe(0);
      expect(manager.load().unlockedPlanets).toEqual([]);
    });
  });

  describe('lastStablePixelTier persistence', () => {
    it('returns undefined when field is missing (legacy save)', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 3, unlockedPlanets: [1, 2] }),
      );
      const manager = new SaveManager();
      expect(manager.load().lastStablePixelTier).toBeUndefined();
    });

    it('round-trips a valid tier through save/load', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 1, unlockedPlanets: [], lastStablePixelTier: 1 });
      expect(manager.load().lastStablePixelTier).toBe(1);
    });

    it('drops negative tier values', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 0, unlockedPlanets: [], lastStablePixelTier: -1 }),
      );
      const manager = new SaveManager();
      expect(manager.load().lastStablePixelTier).toBeUndefined();
    });

    it('drops non-integer tier values', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 0, unlockedPlanets: [], lastStablePixelTier: 1.5 }),
      );
      const manager = new SaveManager();
      expect(manager.load().lastStablePixelTier).toBeUndefined();
    });

    it('drops non-numeric tier values without throwing', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 0, unlockedPlanets: [], lastStablePixelTier: 'low' }),
      );
      const manager = new SaveManager();
      expect(() => manager.load()).not.toThrow();
      expect(manager.load().lastStablePixelTier).toBeUndefined();
    });

    it('saveLastStablePixelTier persists the value alongside existing data', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 4, unlockedPlanets: [1, 2, 3], muted: true });
      manager.saveLastStablePixelTier(0);
      const data = manager.load();
      expect(data.lastStablePixelTier).toBe(0);
      expect(data.clearedStage).toBe(4);
      expect(data.unlockedPlanets).toEqual([1, 2, 3]);
      expect(data.muted).toBe(true);
    });

    it('saveLastStablePixelTier ignores negative or non-integer values', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 0, unlockedPlanets: [] });
      manager.saveLastStablePixelTier(-1);
      manager.saveLastStablePixelTier(1.5);
      manager.saveLastStablePixelTier(Number.NaN);
      expect(manager.load().lastStablePixelTier).toBeUndefined();
    });

    it('resetSessionDataPreservingMuted preserves lastStablePixelTier as a perf hint', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 5,
        unlockedPlanets: [1, 2, 3],
        muted: true,
        lastStablePixelTier: 1,
      });
      manager.resetSessionDataPreservingMuted();
      const data = manager.load();
      expect(data.clearedStage).toBe(0);
      expect(data.unlockedPlanets).toEqual([]);
      expect(data.muted).toBe(true);
      expect(data.lastStablePixelTier).toBe(1);
    });

    it('does not throw when localStorage.setItem fails', () => {
      const manager = new SaveManager();
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => manager.saveLastStablePixelTier(0)).not.toThrow();
      warnSpy.mockRestore();
    });
  });

  describe('memory cache', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('does not re-read localStorage on subsequent load() calls', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 1, unlockedPlanets: [1] });
      // First load() may read storage; clear spy counts so we can measure
      // post-cache behaviour precisely.
      manager.load();
      const baseline = localStorageMock.getItem.mock.calls.length;
      manager.load();
      manager.load();
      manager.load();
      expect(localStorageMock.getItem.mock.calls.length).toBe(baseline);
    });

    it('returns independent copies so callers cannot mutate the cache', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 2,
        unlockedPlanets: [1, 2],
        bestStageStars: { 1: 3 },
      });
      const a = manager.load();
      const b = manager.load();
      expect(a).not.toBe(b);
      expect(a.unlockedPlanets).not.toBe(b.unlockedPlanets);
      expect(a.bestStageStars).not.toBe(b.bestStageStars);

      // Mutate the first copy; subsequent loads must still see pristine data.
      a.unlockedPlanets.push(99);
      a.bestStageStars![1] = 0;
      a.clearedStage = 999;

      const c = manager.load();
      expect(c.unlockedPlanets).toEqual([1, 2]);
      expect(c.bestStageStars).toEqual({ 1: 3 });
      expect(c.clearedStage).toBe(2);
    });

    it('reflects the latest data after save() (cache updated)', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 1, unlockedPlanets: [1] });
      expect(manager.load().clearedStage).toBe(1);
      manager.save({ clearedStage: 3, unlockedPlanets: [1, 2, 3] });
      const loaded = manager.load();
      expect(loaded.clearedStage).toBe(3);
      expect(loaded.unlockedPlanets).toEqual([1, 2, 3]);
    });

    it('returns defaults after clear() (cache invalidated)', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 4, unlockedPlanets: [1, 2, 3, 4] });
      manager.load();
      manager.clear();
      const loaded = manager.load();
      expect(loaded.clearedStage).toBe(0);
      expect(loaded.unlockedPlanets).toEqual([]);
      expect(loaded.bestStageStars).toEqual({});
    });

    it('updateBestStageStars + saveLastStablePixelTier reflect both updates via cached load()', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 2,
        unlockedPlanets: [1, 2],
        muted: true,
        bestStageStars: { 1: 1 },
      });
      manager.updateBestStageStars(2, 3);
      manager.saveLastStablePixelTier(2);
      const loaded = manager.load();
      expect(loaded.bestStageStars).toEqual({ 1: 1, 2: 3 });
      expect(loaded.lastStablePixelTier).toBe(2);
      expect(loaded.muted).toBe(true);
      expect(loaded.clearedStage).toBe(2);
      expect(loaded.unlockedPlanets).toEqual([1, 2]);
    });

    it('resetSessionDataPreservingMuted preserves muted/lastStablePixelTier and resets the rest', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 5,
        unlockedPlanets: [1, 2, 3, 4, 5],
        muted: true,
        bestStageStars: { 1: 3, 2: 2 },
        tutorialShown: true,
        lastStablePixelTier: 3,
      });
      manager.resetSessionDataPreservingMuted();
      const loaded = manager.load();
      expect(loaded.muted).toBe(true);
      expect(loaded.lastStablePixelTier).toBe(3);
      expect(loaded.clearedStage).toBe(0);
      expect(loaded.unlockedPlanets).toEqual([]);
      expect(loaded.bestStageStars).toEqual({});
      expect(loaded.tutorialShown).toBe(false);
    });

    it('invalidates the cache when save() throws so the next load() re-reads storage', () => {
      const manager = new SaveManager();
      manager.save({ clearedStage: 1, unlockedPlanets: [1] });
      manager.load(); // populate cache

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const setItemSpy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      manager.save({ clearedStage: 99, unlockedPlanets: [] });
      setItemSpy.mockRestore();
      warnSpy.mockRestore();

      const before = localStorageMock.getItem.mock.calls.length;
      const loaded = manager.load();
      // Re-read should have happened (cache was invalidated on save failure).
      expect(localStorageMock.getItem.mock.calls.length).toBeGreaterThan(before);
      // And it should reflect what's actually in storage (the previous save).
      expect(loaded.clearedStage).toBe(1);
    });
  });

  describe('tutorialShown (first-run onboarding flag)', () => {
    it('defaults to false when no save exists', () => {
      const manager = new SaveManager();
      expect(manager.load().tutorialShown).toBe(false);
    });

    it('defaults to false for legacy saves missing the field (backward compatible)', () => {
      // Legacy v1 save with no tutorialShown key.
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 1, unlockedPlanets: [1] }),
      );
      const manager = new SaveManager();
      expect(manager.load().tutorialShown).toBe(false);
    });

    it('normalizes non-boolean tutorialShown values to false', () => {
      storage.set(
        'universe-kids-race-save',
        JSON.stringify({ clearedStage: 0, unlockedPlanets: [], tutorialShown: 'yes' }),
      );
      const manager = new SaveManager();
      expect(manager.load().tutorialShown).toBe(false);
    });

    it('markTutorialShown() persists tutorialShown=true', () => {
      const manager = new SaveManager();
      expect(manager.load().tutorialShown).toBe(false);
      manager.markTutorialShown();
      expect(manager.load().tutorialShown).toBe(true);
      // And survives a fresh manager instance reading from storage.
      const manager2 = new SaveManager();
      expect(manager2.load().tutorialShown).toBe(true);
    });

    it('markTutorialShown() preserves other fields (clearedStage / unlockedPlanets / muted)', () => {
      const manager = new SaveManager();
      manager.save({
        clearedStage: 3,
        unlockedPlanets: [1, 2, 3],
        muted: true,
        bestStageStars: { 1: 3, 2: 2 },
      });
      manager.markTutorialShown();
      const data = manager.load();
      expect(data.tutorialShown).toBe(true);
      expect(data.clearedStage).toBe(3);
      expect(data.unlockedPlanets).toEqual([1, 2, 3]);
      expect(data.muted).toBe(true);
      expect(data.bestStageStars).toEqual({ 1: 3, 2: 2 });
    });

    it('markTutorialShown() is idempotent (no extra write when already true)', () => {
      const manager = new SaveManager();
      manager.markTutorialShown();
      const snapshot = storage.get('universe-kids-race-save');
      // Mutate stored value to detect any unwanted re-write.
      storage.set('universe-kids-race-save', snapshot + ' /* sentinel */');
      manager.markTutorialShown();
      // No new write happened, so the sentinel must remain intact.
      expect(storage.get('universe-kids-race-save')).toBe(snapshot + ' /* sentinel */');
    });

    it('clear() resets tutorialShown back to false on next load', () => {
      const manager = new SaveManager();
      manager.markTutorialShown();
      expect(manager.load().tutorialShown).toBe(true);
      manager.clear();
      expect(manager.load().tutorialShown).toBe(false);
    });
  });
});
