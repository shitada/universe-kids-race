import { describe, it, expect } from 'vitest';
import { BoostSystem } from '../../../src/game/systems/BoostSystem';

describe('BoostSystem', () => {
  it('starts available and not active', () => {
    const system = new BoostSystem();
    expect(system.isAvailable()).toBe(true);
    expect(system.isActive()).toBe(false);
  });

  it('activates when available', () => {
    const system = new BoostSystem();
    const result = system.activate();
    expect(result).toBe(true);
    expect(system.isActive()).toBe(true);
    expect(system.isAvailable()).toBe(false);
  });

  it('does not activate when already active', () => {
    const system = new BoostSystem();
    system.activate();
    const result = system.activate();
    expect(result).toBe(false);
  });

  it('deactivates after duration expires', () => {
    const system = new BoostSystem();
    system.activate();
    system.update(3.1); // 3s duration
    expect(system.isActive()).toBe(false);
  });

  it('enters cooldown after boost ends', () => {
    const system = new BoostSystem();
    system.activate();
    system.update(3.1);
    expect(system.isAvailable()).toBe(false);
  });

  it('becomes available after cooldown', () => {
    const system = new BoostSystem();
    system.activate();
    system.update(3.1); // boost ends
    system.update(5.1); // cooldown ends
    expect(system.isAvailable()).toBe(true);
  });

  it('cancel stops boost and starts cooldown', () => {
    const system = new BoostSystem();
    system.activate();
    system.cancel();
    expect(system.isActive()).toBe(false);
    expect(system.isAvailable()).toBe(false);
  });

  it('does nothing when cancelling while not active', () => {
    const system = new BoostSystem();
    system.cancel();
    expect(system.isAvailable()).toBe(true);
  });

  it('reset restores initial state', () => {
    const system = new BoostSystem();
    system.activate();
    system.reset();
    expect(system.isAvailable()).toBe(true);
    expect(system.isActive()).toBe(false);
  });

  describe('getCooldownProgress()', () => {
    it('returns 1.0 when available', () => {
      const system = new BoostSystem();
      expect(system.getCooldownProgress()).toBe(1.0);
    });

    it('returns 0.0 when boost is active', () => {
      const system = new BoostSystem();
      system.activate();
      expect(system.getCooldownProgress()).toBe(0.0);
    });

    it('returns 0.0 at start of cooldown', () => {
      const system = new BoostSystem();
      system.activate();
      system.update(3.1); // boost ends, cooldown starts
      // cooldownTimer is 5.0, progress = 1 - 5/5 = 0.0
      expect(system.getCooldownProgress()).toBeCloseTo(0.0, 1);
    });

    it('returns ~0.5 at halfway through cooldown', () => {
      const system = new BoostSystem();
      system.activate();
      system.update(3.1); // boost ends
      system.update(2.5); // half cooldown
      expect(system.getCooldownProgress()).toBeCloseTo(0.5, 1);
    });

    it('returns 1.0 after cooldown completes', () => {
      const system = new BoostSystem();
      system.activate();
      system.update(3.1); // boost ends
      system.update(5.1); // cooldown ends
      expect(system.getCooldownProgress()).toBe(1.0);
    });
  });

  describe('getDurationProgress()', () => {
    it('returns 1.0 when not active', () => {
      const system = new BoostSystem();
      expect(system.getDurationProgress()).toBe(1.0);
    });

    it('returns 0.0 immediately after activate()', () => {
      const system = new BoostSystem();
      system.activate();
      expect(system.getDurationProgress()).toBe(0.0);
    });

    it('returns ≈0.5 after update(1.5)', () => {
      const system = new BoostSystem();
      system.activate();
      system.update(1.5);
      expect(system.getDurationProgress()).toBeCloseTo(0.5, 2);
    });

    it('returns ≈0.967 after update(2.9)', () => {
      const system = new BoostSystem();
      system.activate();
      system.update(2.9);
      expect(system.getDurationProgress()).toBeCloseTo(0.967, 2);
    });

    it('returns 1.0 after update(3.1) (deactivated)', () => {
      const system = new BoostSystem();
      system.activate();
      system.update(3.1);
      expect(system.getDurationProgress()).toBe(1.0);
    });

    it('returns 1.0 after cancel()', () => {
      const system = new BoostSystem();
      system.activate();
      system.cancel();
      expect(system.getDurationProgress()).toBe(1.0);
    });
  });

  describe('flame fadeout calculations', () => {
    const FADE_START = 0.83;

    function calcEmitCount(progress: number): number {
      return progress < FADE_START
        ? 8
        : Math.max(0, Math.round(8 * (1.0 - progress) / (1.0 - FADE_START)));
    }

    function calcSizeFraction(progress: number): number {
      return progress < FADE_START
        ? 1.0
        : (1.0 - progress) / (1.0 - FADE_START);
    }

    it('emitCount=8 and sizeFraction=1.0 when progress < 0.83', () => {
      expect(calcEmitCount(0.0)).toBe(8);
      expect(calcEmitCount(0.5)).toBe(8);
      expect(calcEmitCount(0.82)).toBe(8);
      expect(calcSizeFraction(0.0)).toBe(1.0);
      expect(calcSizeFraction(0.5)).toBe(1.0);
    });

    it('emitCount≈5 and sizeFraction≈0.59 at progress=0.90', () => {
      expect(calcEmitCount(0.90)).toBe(5);
      expect(calcSizeFraction(0.90)).toBeCloseTo(0.588, 2);
    });

    it('emitCount=0 and sizeFraction=0.0 at progress=1.0', () => {
      expect(calcEmitCount(1.0)).toBe(0);
      expect(calcSizeFraction(1.0)).toBeCloseTo(0.0, 2);
    });

    it('emitCount decreases monotonically during fade phase', () => {
      const values = [0.83, 0.87, 0.90, 0.93, 0.97, 1.0].map(calcEmitCount);
      for (let i = 1; i < values.length; i++) {
        expect(values[i]).toBeLessThanOrEqual(values[i - 1]);
      }
    });
  });
});
