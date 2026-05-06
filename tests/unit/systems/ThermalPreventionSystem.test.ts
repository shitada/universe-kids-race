import { describe, expect, it, vi } from 'vitest';
import { ThermalPreventionSystem } from '../../../src/game/systems/ThermalPreventionSystem';

function createStorage(initialState?: unknown) {
  const bucket = new Map<string, string>();
  if (initialState !== undefined) {
    bucket.set('thermal-test', JSON.stringify(initialState));
  }

  return {
    getItem: vi.fn((key: string) => bucket.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      bucket.set(key, value);
    }),
  };
}

describe('ThermalPreventionSystem', () => {
  it('15分・30分・45分で一度だけ休憩提案を発火し、予防レベルを上げる', () => {
    const storage = createStorage();
    const onMilestoneReached = vi.fn();
    const system = new ThermalPreventionSystem({
      storage,
      storageKey: 'thermal-test',
      persistIntervalMs: 60_000,
      onMilestoneReached,
    });

    system.updateActivePlay(14 * 60);
    expect(system.getPreventiveLevel()).toBe(0);
    expect(onMilestoneReached).not.toHaveBeenCalled();

    system.updateActivePlay(60);
    expect(system.getPreventiveLevel()).toBe(1);
    expect(onMilestoneReached).toHaveBeenNthCalledWith(1, {
      level: 1,
      thresholdMinutes: 15,
      totalPlayTimeMs: 15 * 60 * 1000,
    });

    system.updateActivePlay(14 * 60);
    expect(onMilestoneReached).toHaveBeenCalledTimes(1);

    system.updateActivePlay(60);
    expect(system.getPreventiveLevel()).toBe(2);
    expect(onMilestoneReached).toHaveBeenNthCalledWith(2, {
      level: 2,
      thresholdMinutes: 30,
      totalPlayTimeMs: 30 * 60 * 1000,
    });

    system.updateActivePlay(14 * 60);
    expect(onMilestoneReached).toHaveBeenCalledTimes(2);

    system.updateActivePlay(60);
    expect(system.getPreventiveLevel()).toBe(3);
    expect(onMilestoneReached).toHaveBeenNthCalledWith(3, {
      level: 3,
      thresholdMinutes: 45,
      totalPlayTimeMs: 45 * 60 * 1000,
    });
  });

  it('sessionStorageの累積値を引き継ぎ、未表示の閾値だけを発火する', () => {
    const storage = createStorage({
      totalPlayTimeMs: 25 * 60 * 1000,
      shownMilestoneLevels: [1],
    });
    const onMilestoneReached = vi.fn();
    const system = new ThermalPreventionSystem({
      storage,
      storageKey: 'thermal-test',
      persistIntervalMs: 60_000,
      onMilestoneReached,
    });

    expect(system.getPreventiveLevel()).toBe(1);
    expect(system.getTotalPlayTimeMs()).toBe(25 * 60 * 1000);

    system.updateActivePlay(5 * 60);

    expect(system.getPreventiveLevel()).toBe(2);
    expect(onMilestoneReached).toHaveBeenCalledTimes(1);
    expect(onMilestoneReached).toHaveBeenCalledWith({
      level: 2,
      thresholdMinutes: 30,
      totalPlayTimeMs: 30 * 60 * 1000,
    });

    system.flush();
    expect(storage.setItem).toHaveBeenCalled();
  });
});
