import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GameStateBackup } from '../../../src/game/storage/GameStateBackup';

function createStorage() {
  const store = new Map<string, string>();
  return {
    store,
    storage: {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        store.delete(key);
      }),
    },
  };
}

describe('GameStateBackup', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('saves and loads interruption snapshots', () => {
    const { storage } = createStorage();
    const backup = new GameStateBackup({
      storage,
      now: () => 1234,
    });

    backup.save({
      sceneType: 'stage',
      stagePlaying: true,
      userPaused: false,
      reason: 'visibilitychange',
    });

    expect(backup.load()).toEqual({
      sceneType: 'stage',
      stagePlaying: true,
      userPaused: false,
      savedAt: 1234,
      reason: 'visibilitychange',
    });
  });

  it('drops invalid stored payloads', () => {
    const { storage, store } = createStorage();
    store.set('universe-kids-race-interruption-backup', '{"sceneType":"oops"}');
    const backup = new GameStateBackup({ storage });

    expect(backup.load()).toBeNull();
    expect(storage.removeItem).toHaveBeenCalled();
  });

  it('loadRecent() clears stale snapshots', () => {
    const { storage } = createStorage();
    const backup = new GameStateBackup({
      storage,
      now: () => 20_000,
      maxAgeMs: 1_000,
    });

    backup.save({
      sceneType: 'stage',
      stagePlaying: true,
      userPaused: false,
      reason: 'blur',
      savedAt: 100,
    });

    expect(backup.loadRecent()).toBeNull();
    expect(storage.removeItem).toHaveBeenCalled();
  });

  it('clear() removes the saved snapshot', () => {
    const { storage } = createStorage();
    const backup = new GameStateBackup({ storage });

    backup.save({
      sceneType: 'title',
      stagePlaying: false,
      userPaused: false,
      reason: 'pagehide',
    });
    backup.clear();

    expect(backup.load()).toBeNull();
  });
});
