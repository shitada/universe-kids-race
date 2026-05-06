import { describe, expect, it, vi } from 'vitest';
import { AutoPerformanceManager } from '../../../src/game/utils/AutoPerformanceManager';

describe('AutoPerformanceManager', () => {
  it('lowers quality after sustained low fps', () => {
    const onLevelChange = vi.fn();
    const manager = new AutoPerformanceManager(2, onLevelChange, {
      lowFpsSustainMs: 300,
      tierChangeCooldownMs: 1000,
    });

    for (let index = 0; index < 20; index += 1) {
      manager.sample(1 / 30, 42, 60);
    }

    expect(manager.getLevel()).toBe(1);
    expect(onLevelChange).toHaveBeenCalledWith({
      previousLevel: 0,
      level: 1,
      direction: 'degraded',
    });
  });

  it('waits for the downgrade lock to expire before recovering', () => {
    const onLevelChange = vi.fn();
    const manager = new AutoPerformanceManager(2, onLevelChange, {
      lowFpsSustainMs: 200,
      highFpsSustainMs: 200,
      tierChangeCooldownMs: 0,
      downgradeLockMs: 500,
    });

    for (let index = 0; index < 10; index += 1) {
      manager.sample(1 / 30, 42, 60);
    }
    expect(manager.getLevel()).toBe(1);

    for (let index = 0; index < 10; index += 1) {
      manager.sample(1 / 60, 60, 60);
    }
    expect(manager.getLevel()).toBe(1);

    for (let index = 0; index < 45; index += 1) {
      manager.sample(1 / 60, 60, 60);
    }
    expect(manager.getLevel()).toBe(0);
    expect(onLevelChange).toHaveBeenLastCalledWith({
      previousLevel: 1,
      level: 0,
      direction: 'recovered',
    });
  });

  it('keeps the current level when reset is requested for a stage transition', () => {
    const manager = new AutoPerformanceManager(2, vi.fn(), {
      lowFpsSustainMs: 200,
      tierChangeCooldownMs: 0,
    });

    for (let index = 0; index < 10; index += 1) {
      manager.sample(1 / 30, 42, 60);
    }
    expect(manager.getLevel()).toBe(1);

    manager.reset(true);

    expect(manager.getLevel()).toBe(1);
  });
});
