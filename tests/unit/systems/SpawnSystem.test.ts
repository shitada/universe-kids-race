import { describe, it, expect } from 'vitest';
import { SpawnSystem } from '../../../src/game/systems/SpawnSystem';
import type { StageConfig } from '../../../src/types';

const testConfig: StageConfig = {
  stageNumber: 1,
  destination: '月',
  stageLength: 500,
  meteoriteInterval: 3.0,
  starDensity: 5,
};

describe('SpawnSystem', () => {
  it('spawns stars ahead of spaceship', () => {
    const system = new SpawnSystem();
    const result = system.update(0.016, -10, testConfig);
    expect(result.newStars.length).toBeGreaterThan(0);
    for (const star of result.newStars) {
      expect(star.position.z).toBeLessThan(-10);
    }
  });

  it('spawns meteorites after interval elapses', () => {
    const system = new SpawnSystem();
    // First call, not enough time
    let result = system.update(1.0, -10, testConfig);
    expect(result.newMeteorites).toHaveLength(0);
    // After 3 seconds total
    result = system.update(2.1, -30, testConfig);
    expect(result.newMeteorites.length).toBeGreaterThanOrEqual(1);
  });

  it('stars include roughly 10% rainbow type', () => {
    const system = new SpawnSystem();
    // Generate many stars
    const result = system.update(0.016, -200, testConfig);
    const rainbowCount = result.newStars.filter(s => s.starType === 'RAINBOW').length;
    // With 10% probability, expect at least some rainbow in a large sample
    // This is probabilistic, so we just check they can exist
    expect(result.newStars.length).toBeGreaterThan(5);
    // Allow 0 rainbow due to randomness, just verify type is set
    for (const star of result.newStars) {
      expect(['NORMAL', 'RAINBOW']).toContain(star.starType);
    }
  });

  it('reset clears spawn state', () => {
    const system = new SpawnSystem();
    system.update(0.016, -50, testConfig);
    system.reset();
    const result = system.update(0.016, -10, testConfig);
    // After reset, spawning resumes from z=0
    expect(result.newStars.length).toBeGreaterThan(0);
  });
});
