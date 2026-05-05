import { describe, expect, it } from 'vitest';
import { SpecialShootingStar } from '../../../src/game/entities/SpecialShootingStar';
import { SpecialStarSpawnSystem } from '../../../src/game/systems/SpecialStarSpawnSystem';

describe('SpecialStarSpawnSystem', () => {
  it('spawns a rainbow special star when the chance roll succeeds', () => {
    const randomValues = [0, 0.05, 0.25, 0.4, 0.3, 0.2];
    const system = new SpecialStarSpawnSystem({
      attemptInterval: 1,
      spawnChance: 1,
      introGraceSeconds: 0,
      spawnAheadDistance: 90,
    }, () => randomValues.shift() ?? 0);

    const result = system.update(1, 12);

    expect(result.newSpecialStars).toHaveLength(1);
    expect(result.newSpecialStars[0]?.specialType).toBe('rainbow');
    expect(result.newSpecialStars[0]?.position.z).toBeLessThan(12);
  });

  it('picks gold and silver variants from their weighted rolls', () => {
    const goldRandoms = [0, 0.45, 0.2, 0.3, 0.1, 0.2];
    const silverRandoms = [0, 0.9, 0.2, 0.3, 0.1, 0.2];
    const goldSystem = new SpecialStarSpawnSystem({
      attemptInterval: 1,
      spawnChance: 1,
      introGraceSeconds: 0,
    }, () => goldRandoms.shift() ?? 0);
    const silverSystem = new SpecialStarSpawnSystem({
      attemptInterval: 1,
      spawnChance: 1,
      introGraceSeconds: 0,
    }, () => silverRandoms.shift() ?? 0);

    expect(goldSystem.update(1, 0).newSpecialStars[0]?.specialType).toBe('gold');
    expect(silverSystem.update(1, 0).newSpecialStars[0]?.specialType).toBe('silver');
  });

  it('skips spawning while another rare sky event is active', () => {
    const system = new SpecialStarSpawnSystem({
      attemptInterval: 1,
      spawnChance: 1,
      introGraceSeconds: 0,
    }, () => 0);
    const activeSpecialStar = new SpecialShootingStar(0, 0, -20, 'gold', 1);

    const result = system.update(1, 0, [activeSpecialStar]);

    expect(result.newSpecialStars).toHaveLength(0);
  });
});
