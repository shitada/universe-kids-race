import { describe, it, expect } from 'vitest';
import { LODSystem } from '../../../src/game/systems/LODSystem';
import { Star } from '../../../src/game/entities/Star';
import { Meteorite } from '../../../src/game/entities/Meteorite';

describe('LODSystem', () => {
  it('assigns near, mid, and far LOD levels from spaceship distance', () => {
    const system = new LODSystem();
    const star = new Star(0, 0, -10, 'NORMAL');
    const meteorite = new Meteorite(0, 0, -35);
    const farStar = new Star(0, 0, -80, 'NORMAL');

    system.update({ x: 0, y: 0, z: 0 }, [star, meteorite, farStar]);

    expect(star.getLODLevel()).toBe('near');
    expect(meteorite.getLODLevel()).toBe('mid');
    expect(farStar.getLODLevel()).toBe('far');
  });

  it('updates LOD immediately when the spaceship crosses a threshold', () => {
    const system = new LODSystem();
    const star = new Star(0, 0, -40, 'NORMAL');

    system.update({ x: 0, y: 0, z: 0 }, [star]);
    expect(star.getLODLevel()).toBe('mid');

    system.update({ x: 0, y: 0, z: -20 }, [star]);
    expect(star.getLODLevel()).toBe('near');

    system.update({ x: 0, y: 0, z: 30 }, [star]);
    expect(star.getLODLevel()).toBe('far');
  });

  it('uses exact thresholds so 25 is mid and 50 is far', () => {
    expect(LODSystem.resolveLevel(24.99)).toBe('near');
    expect(LODSystem.resolveLevel(25)).toBe('mid');
    expect(LODSystem.resolveLevel(49.99)).toBe('mid');
    expect(LODSystem.resolveLevel(50)).toBe('far');
  });
});
