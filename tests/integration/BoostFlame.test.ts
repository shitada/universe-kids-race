import { describe, it, expect } from 'vitest';
import { BoostSystem } from '../../src/game/systems/BoostSystem';

describe('BoostFlame integration', () => {
  const FADE_START = 0.83;

  function calcEmitCount(progress: number): number {
    return progress < FADE_START
      ? 8
      : Math.max(0, Math.round(8 * (1.0 - progress) / (1.0 - FADE_START)));
  }

  function calcSizeFraction(progress: number): number {
    return progress < FADE_START
      ? 1.0
      : Math.max(0, (1.0 - progress) / (1.0 - FADE_START));
  }

  it('BoostSystem stays active for full 3 seconds and getDurationProgress progresses 0→1', () => {
    const system = new BoostSystem();
    system.activate();

    expect(system.isActive()).toBe(true);
    expect(system.getDurationProgress()).toBe(0.0);

    // Simulate frame-by-frame updates across the full 3-second duration
    const progressValues: number[] = [];
    const step = 0.1;
    for (let t = 0; t < 3.0; t += step) {
      expect(system.isActive()).toBe(true);
      const progress = system.getDurationProgress();
      progressValues.push(progress);
      system.update(step);
    }

    // Progress should be monotonically increasing
    for (let i = 1; i < progressValues.length; i++) {
      expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1]);
    }

    // After 3 seconds, system should have deactivated
    expect(system.isActive()).toBe(false);
    expect(system.getDurationProgress()).toBe(1.0);
  });

  it('emitCount=8 and sizeFraction=1.0 during active phase (progress < 0.83)', () => {
    const system = new BoostSystem();
    system.activate();

    // At progress=0
    expect(calcEmitCount(system.getDurationProgress())).toBe(8);
    expect(calcSizeFraction(system.getDurationProgress())).toBe(1.0);

    // Advance to ~50% (1.5s)
    system.update(1.5);
    const midProgress = system.getDurationProgress();
    expect(midProgress).toBeCloseTo(0.5, 1);
    expect(calcEmitCount(midProgress)).toBe(8);
    expect(calcSizeFraction(midProgress)).toBe(1.0);
  });

  it('emitCount and sizeFraction decrease during fade phase (progress ≈ 0.90)', () => {
    const system = new BoostSystem();
    system.activate();

    // Advance to ~90% (2.7s of 3s)
    system.update(2.7);
    const progress = system.getDurationProgress();
    expect(progress).toBeCloseTo(0.90, 1);

    expect(calcEmitCount(progress)).toBe(5);
    expect(calcSizeFraction(progress)).toBeCloseTo(0.588, 1);
  });

  it('emitCount=0 and sizeFraction=0 at end of boost (progress=1.0)', () => {
    const system = new BoostSystem();
    system.activate();
    system.update(3.1); // exceed duration

    const progress = system.getDurationProgress();
    expect(progress).toBe(1.0);
    expect(calcEmitCount(progress)).toBe(0);
    expect(calcSizeFraction(progress)).toBeCloseTo(0.0, 2);
  });

  it('isActive() returns false after deactivation', () => {
    const system = new BoostSystem();
    system.activate();
    expect(system.isActive()).toBe(true);

    system.update(3.1);
    expect(system.isActive()).toBe(false);
  });
});
