import { describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_FRAME_RATE_ADAPTATION_THRESHOLDS,
  FrameRateAdaptationSystem,
} from '../../../src/game/systems/FrameRateAdaptationSystem';

const T = DEFAULT_FRAME_RATE_ADAPTATION_THRESHOLDS;

describe('FrameRateAdaptationSystem', () => {
  it('raises adaptation after sustained low FPS', () => {
    const onLevelChange = vi.fn();
    const system = new FrameRateAdaptationSystem(2, onLevelChange);

    let now = 10_000;
    system.sample(45, now);
    now += T.downscaleSustainMs;
    system.sample(45, now);

    expect(system.getCurrentLevel()).toBe(1);
    expect(onLevelChange).toHaveBeenCalledWith({
      previousLevel: 0,
      level: 1,
      direction: 'degraded',
    });
  });

  it('recovers one step after sustained stable FPS', () => {
    const onLevelChange = vi.fn();
    const system = new FrameRateAdaptationSystem(2, onLevelChange);

    let now = 10_000;
    system.sample(45, now);
    now += T.downscaleSustainMs;
    system.sample(45, now);
    expect(system.getCurrentLevel()).toBe(1);

    now += T.tierChangeCooldownMs + 1;
    system.sample(60, now);
    now += T.upscaleSustainMs;
    system.sample(60, now);

    expect(system.getCurrentLevel()).toBe(0);
    expect(onLevelChange).toHaveBeenLastCalledWith({
      previousLevel: 1,
      level: 0,
      direction: 'recovered',
    });
  });

  it('ignores low FPS during the resume grace window', () => {
    const onLevelChange = vi.fn();
    const system = new FrameRateAdaptationSystem(2, onLevelChange);

    let now = 30_000;
    system.notifyResume(now);
    system.sample(30, now + 50);
    system.sample(30, now + T.resumeGraceMs - 10);

    expect(system.getCurrentLevel()).toBe(0);

    now += T.resumeGraceMs;
    system.sample(30, now);
    now += T.downscaleSustainMs;
    system.sample(30, now);

    expect(system.getCurrentLevel()).toBe(1);
    expect(onLevelChange).toHaveBeenCalledTimes(1);
  });
});
