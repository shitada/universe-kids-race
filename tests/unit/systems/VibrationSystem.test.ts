import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __setSharedVibrationSystemForTest,
  VibrationSystem,
  getSharedVibrationSystem,
} from '../../../src/game/systems/VibrationSystem';

describe('VibrationSystem', () => {
  beforeEach(() => {
    __setSharedVibrationSystemForTest(null);
  });

  it('triggers the configured vibration pattern for each game event', () => {
    const vibrate = vi.fn(() => true);
    let now = 0;
    const system = new VibrationSystem({ vibrate }, () => now, 0);

    expect(system.trigger('starCollect')).toBe(true);
    expect(system.trigger('rainbowCollect')).toBe(true);
    expect(system.trigger('meteoriteHit')).toBe(true);
    expect(system.trigger('boost')).toBe(true);
    expect(system.trigger('stageClear')).toBe(true);

    expect(vibrate.mock.calls).toEqual([
      [50],
      [100],
      [200],
      [[100, 50, 100]],
      [[100, 50, 100, 50, 150]],
    ]);
  });

  it('falls back silently when vibration is unsupported', () => {
    const system = new VibrationSystem({} as Navigator, () => 0, 0);

    expect(system.isSupported()).toBe(false);
    expect(system.trigger('stageClear')).toBe(false);
  });

  it('can be disabled explicitly', () => {
    const vibrate = vi.fn(() => true);
    const system = new VibrationSystem({ vibrate }, () => 0, 0);
    system.setEnabled(false);

    expect(system.trigger('boost')).toBe(false);
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('scales vibration patterns when intensity is lowered', () => {
    const vibrate = vi.fn(() => true);
    const system = new VibrationSystem({ vibrate }, () => 0, 0);
    system.setIntensity('weak');

    expect(system.trigger('stageClear')).toBe(true);
    expect(vibrate).toHaveBeenCalledWith([45, 23, 45, 23, 68]);
  });

  it('uses fallback feedback when vibration is unsupported', () => {
    const fallback = vi.fn();
    const system = new VibrationSystem({} as Navigator, () => 0, 0);
    system.setFallbackHandler(fallback);

    expect(system.trigger('boost')).toBe(true);
    expect(fallback).toHaveBeenCalledWith('boost');
  });

  it('suppresses repeated low-priority vibrations but allows stronger ones to override', () => {
    const vibrate = vi.fn(() => true);
    let now = 1000;
    const system = new VibrationSystem({ vibrate }, () => now, 100);

    expect(system.trigger('starCollect')).toBe(true);
    now += 20;
    expect(system.trigger('starCollect')).toBe(false);
    expect(system.trigger('meteoriteHit')).toBe(true);

    expect(vibrate.mock.calls).toEqual([[50], [200]]);
  });

  it('lets tests replace the shared vibration system', () => {
    const vibrate = vi.fn(() => true);
    const system = new VibrationSystem({ vibrate }, () => 0, 0);
    __setSharedVibrationSystemForTest(system);

    expect(getSharedVibrationSystem()).toBe(system);
  });
});
