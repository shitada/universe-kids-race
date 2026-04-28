import { describe, it, expect, vi } from 'vitest';
import {
  AdaptivePixelRatioController,
  DEFAULT_ADAPTIVE_PIXEL_RATIO_THRESHOLDS,
} from '../../../src/game/utils/AdaptivePixelRatioController';

const T = DEFAULT_ADAPTIVE_PIXEL_RATIO_THRESHOLDS;

function makeController(maxTier = 2) {
  const onTierChange = vi.fn();
  const controller = new AdaptivePixelRatioController(maxTier, onTierChange);
  return { controller, onTierChange };
}

describe('AdaptivePixelRatioController', () => {
  it('initial tier equals maxTier', () => {
    const { controller, onTierChange } = makeController(2);
    expect(controller.getCurrentTier()).toBe(2);
    expect(onTierChange).not.toHaveBeenCalled();
  });

  it('downscales after sustained low FPS beyond downscaleSustainMs', () => {
    const { controller, onTierChange } = makeController(2);
    let now = 10_000;
    controller.sample(40, now);
    now += T.downscaleSustainMs;
    controller.sample(40, now);
    expect(controller.getCurrentTier()).toBe(1);
    expect(onTierChange).toHaveBeenCalledTimes(1);
    expect(onTierChange).toHaveBeenCalledWith(1);
  });

  it('does not downscale when low FPS does not persist long enough', () => {
    const { controller, onTierChange } = makeController(2);
    let now = 10_000;
    controller.sample(40, now);
    now += T.downscaleSustainMs - 1;
    controller.sample(40, now);
    expect(controller.getCurrentTier()).toBe(2);
    expect(onTierChange).not.toHaveBeenCalled();
  });

  it('mid-range FPS resets both pending timers', () => {
    const { controller, onTierChange } = makeController(2);
    let now = 10_000;
    controller.sample(40, now); // start low timer
    now += T.downscaleSustainMs - 100;
    controller.sample(55, now); // mid range -> reset
    now += 200;
    controller.sample(40, now); // restart low timer
    now += T.downscaleSustainMs - 1;
    controller.sample(40, now);
    expect(controller.getCurrentTier()).toBe(2);
    expect(onTierChange).not.toHaveBeenCalled();
  });

  it('upscales after sustained high FPS once below maxTier', () => {
    const { controller, onTierChange } = makeController(2);
    let now = 10_000;
    // First, force a downscale to tier 1
    controller.sample(40, now);
    now += T.downscaleSustainMs;
    controller.sample(40, now);
    expect(controller.getCurrentTier()).toBe(1);

    // Wait past cooldown
    now += T.tierChangeCooldownMs + 1;
    controller.sample(60, now);
    now += T.upscaleSustainMs;
    controller.sample(60, now);
    expect(controller.getCurrentTier()).toBe(2);
    expect(onTierChange).toHaveBeenLastCalledWith(2);
    expect(onTierChange).toHaveBeenCalledTimes(2);
  });

  it('respects tierChangeCooldownMs after a tier change', () => {
    const { controller, onTierChange } = makeController(2);
    let now = 10_000;
    controller.sample(40, now);
    now += T.downscaleSustainMs;
    controller.sample(40, now);
    expect(controller.getCurrentTier()).toBe(1);

    // Within cooldown: even sustained low FPS should not change again
    now += 100;
    controller.sample(40, now);
    now += T.downscaleSustainMs;
    // Still within cooldown window if total elapsed since change < cooldown
    // Force exactly inside cooldown:
    const insideCooldownNow = 10_000 + T.downscaleSustainMs + (T.tierChangeCooldownMs - 1);
    controller.sample(40, insideCooldownNow);
    controller.sample(40, insideCooldownNow);
    expect(controller.getCurrentTier()).toBe(1);
    expect(onTierChange).toHaveBeenCalledTimes(1);
  });

  it('notifyResume suppresses tier changes during the resume grace window', () => {
    const { controller, onTierChange } = makeController(2);
    let now = 100_000;
    controller.notifyResume(now);
    // During grace, low FPS samples should not start the downscale timer
    controller.sample(20, now + 10);
    controller.sample(20, now + T.resumeGraceMs - 1);
    // Even if more low samples accumulate beyond the would-be sustain window,
    // since the timer was cleared each sample, no downscale happens until grace ends.
    expect(controller.getCurrentTier()).toBe(2);
    expect(onTierChange).not.toHaveBeenCalled();

    // After grace, downscale resumes normally
    let after = now + T.resumeGraceMs;
    controller.sample(20, after);
    after += T.downscaleSustainMs;
    controller.sample(20, after);
    expect(controller.getCurrentTier()).toBe(1);
    expect(onTierChange).toHaveBeenCalledTimes(1);
  });

  it('clamps tier within [0, maxTier]', () => {
    const { controller, onTierChange } = makeController(1);
    let now = T.tierChangeCooldownMs + 1;
    // Downscale from 1 -> 0
    controller.sample(10, now);
    now += T.downscaleSustainMs;
    controller.sample(10, now);
    expect(controller.getCurrentTier()).toBe(0);

    // Further sustained low FPS should not go below 0
    now += T.tierChangeCooldownMs + 1;
    controller.sample(10, now);
    now += T.downscaleSustainMs;
    controller.sample(10, now);
    expect(controller.getCurrentTier()).toBe(0);

    // Upscale beyond maxTier should not happen
    now += T.tierChangeCooldownMs + 1;
    controller.sample(60, now);
    now += T.upscaleSustainMs;
    controller.sample(60, now);
    expect(controller.getCurrentTier()).toBe(1);

    now += T.tierChangeCooldownMs + 1;
    controller.sample(60, now);
    now += T.upscaleSustainMs;
    controller.sample(60, now);
    expect(controller.getCurrentTier()).toBe(1);
    // onTierChange called: 1->0, 0->1 = 2 times total
    expect(onTierChange).toHaveBeenCalledTimes(2);
  });

  it('reset restores initial state', () => {
    const { controller } = makeController(2);
    let now = T.tierChangeCooldownMs + 1;
    controller.sample(40, now);
    now += T.downscaleSustainMs;
    controller.sample(40, now);
    expect(controller.getCurrentTier()).toBe(1);
    controller.reset();
    expect(controller.getCurrentTier()).toBe(2);
  });
});
