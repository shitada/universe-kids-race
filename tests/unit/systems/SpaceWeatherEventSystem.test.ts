import { describe, expect, it } from 'vitest';
import { SpaceWeatherEventSystem } from '../../../src/game/systems/SpaceWeatherEventSystem';

describe('SpaceWeatherEventSystem', () => {
  it('starts a random space weather event after the sampled delay', () => {
    const randomValues = [0, 0.4];
    const system = new SpaceWeatherEventSystem(() => randomValues.shift() ?? 0);

    const beforeStart = system.update(17.9);
    expect(beforeStart.started).toBe(false);
    expect(beforeStart.active).toBe(false);

    const started = system.update(0.2);
    expect(started.started).toBe(true);
    expect(started.active).toBe(true);
    expect(started.event?.id).toBe('aurora-storm');
    expect(started.timeRemaining).toBeGreaterThan(6);
  });

  it('ends the active event and schedules another random event', () => {
    const randomValues = [0, 0.1, 0, 0.8];
    const system = new SpaceWeatherEventSystem(() => randomValues.shift() ?? 0);

    system.update(18);
    const ended = system.update(6.7);
    expect(ended.ended).toBe(true);
    expect(ended.active).toBe(false);
    expect(system.isActive()).toBe(false);

    const restarted = system.update(18);
    expect(restarted.started).toBe(true);
    expect(restarted.active).toBe(true);
    expect(restarted.event?.id).toBe('comet-approach');
  });

  it('reset cancels the active event and resamples the next delay', () => {
    const randomValues = [0, 0.2, 0.5, 0.6];
    const system = new SpaceWeatherEventSystem(() => randomValues.shift() ?? 0);

    system.update(18);
    expect(system.isActive()).toBe(true);

    system.reset();
    expect(system.isActive()).toBe(false);
    expect(system.getActiveEvent()).toBeNull();

    const waiting = system.update(25.9);
    expect(waiting.started).toBe(false);

    const restarted = system.update(0.2);
    expect(restarted.started).toBe(true);
    expect(restarted.event?.id).toBe('aurora-storm');
  });
});
