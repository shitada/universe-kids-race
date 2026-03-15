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
});
