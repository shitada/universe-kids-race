import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Star } from '../../../src/game/entities/Star';
import {
  __setSharedVibrationSystemForTest,
  VibrationSystem,
} from '../../../src/game/systems/VibrationSystem';

describe('Star.collect', () => {
  beforeEach(() => {
    __setSharedVibrationSystemForTest(null);
  });

  afterEach(() => {
    __setSharedVibrationSystemForTest(null);
  });

  it('plays a light vibration for a normal star once', () => {
    const vibrate = vi.fn(() => true);
    __setSharedVibrationSystemForTest(new VibrationSystem({ vibrate }, () => 0, 0));
    const star = new Star(0, 0, 0, 'NORMAL');

    star.collect();
    star.collect();

    expect(star.isCollected).toBe(true);
    expect(star.mesh.visible).toBe(false);
    expect(vibrate).toHaveBeenCalledTimes(1);
    expect(vibrate).toHaveBeenCalledWith(50);
  });

  it('plays a stronger vibration for a rainbow star', () => {
    const vibrate = vi.fn(() => true);
    __setSharedVibrationSystemForTest(new VibrationSystem({ vibrate }, () => 0, 0));
    const star = new Star(0, 0, 0, 'RAINBOW');

    star.collect();

    expect(vibrate).toHaveBeenCalledWith(100);
  });
});
