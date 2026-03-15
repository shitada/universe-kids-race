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
  });

  it('saves and loads data', () => {
    const manager = new SaveManager();
    manager.save({ clearedStage: 2 });
    const data = manager.load();
    expect(data.clearedStage).toBe(2);
  });

  it('returns default on JSON parse error', () => {
    storage.set('universe-kids-race-save', 'invalid json');
    const manager = new SaveManager();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
  });

  it('returns default if clearedStage is invalid', () => {
    storage.set('universe-kids-race-save', JSON.stringify({ clearedStage: 99 }));
    const manager = new SaveManager();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
  });

  it('clear removes saved data', () => {
    const manager = new SaveManager();
    manager.save({ clearedStage: 3 });
    manager.clear();
    const data = manager.load();
    expect(data.clearedStage).toBe(0);
  });
});
