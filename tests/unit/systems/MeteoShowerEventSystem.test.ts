import { describe, expect, it, vi } from 'vitest';
import { MeteoShowerEventSystem } from '../../../src/game/systems/MeteoShowerEventSystem';

describe('MeteoShowerEventSystem', () => {
  it('starts a meteor shower after the sampled delay elapses', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

    try {
      const system = new MeteoShowerEventSystem();

      const beforeStart = system.update(21.9);
      expect(beforeStart.started).toBe(false);
      expect(beforeStart.active).toBe(false);

      const started = system.update(0.2);
      expect(started.started).toBe(true);
      expect(started.active).toBe(true);
      expect(started.timeRemaining).toBeGreaterThan(4);
    } finally {
      randomSpy.mockRestore();
    }
  });

  it('ends the active shower after its duration and schedules the next one', () => {
    const randomValues = [0, 0.5];
    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => randomValues.shift() ?? 0);

    try {
      const system = new MeteoShowerEventSystem();

      system.update(22);
      const ended = system.update(4.6);
      expect(ended.ended).toBe(true);
      expect(ended.active).toBe(false);

      const waiting = system.update(30.9);
      expect(waiting.started).toBe(false);

      const restarted = system.update(0.2);
      expect(restarted.started).toBe(true);
      expect(restarted.active).toBe(true);
    } finally {
      randomSpy.mockRestore();
    }
  });

  it('reset cancels the active shower and resamples the next delay', () => {
    const randomValues = [0, 0.75];
    const randomSpy = vi.spyOn(Math, 'random').mockImplementation(() => randomValues.shift() ?? 0);

    try {
      const system = new MeteoShowerEventSystem();

      system.update(22);
      expect(system.isActive()).toBe(true);

      system.reset();
      expect(system.isActive()).toBe(false);

      const beforeRestart = system.update(35.4);
      expect(beforeRestart.started).toBe(false);

      const restarted = system.update(0.2);
      expect(restarted.started).toBe(true);
      expect(restarted.active).toBe(true);
    } finally {
      randomSpy.mockRestore();
    }
  });
});
