import { describe, expect, it, vi } from 'vitest';
import { SpawnSystem } from '../../../src/game/systems/SpawnSystem';
import { SpaceGem } from '../../../src/game/entities/SpaceGem';
import type { StageConfig } from '../../../src/types';

const testConfig: StageConfig = {
  stageNumber: 1,
  destination: '月',
  destinationReading: 'つき',
  stageLength: 500,
  meteoriteInterval: 3,
  starDensity: 5,
  medalThresholds: [2, 5, 8],
  emoji: '🌙',
  displayName: '月をめざせ！',
  planetColor: 0xcccccc,
};

describe('SpawnSystem space gems', () => {
  it('spawns a rare space gem when the chance roll succeeds', () => {
    const randoms = [0.5, 0, 0.18, 0.7, 0.4, 0.2];
    const spy = vi.spyOn(Math, 'random').mockImplementation(() => randoms.shift() ?? 0.5);

    try {
      const system = new SpawnSystem();
      const result = system.update(10, -20, testConfig);

      expect(result.newSpaceGems).toHaveLength(1);
      expect(result.newSpaceGems[0]?.gemType).toBe('emerald-comet');
      expect(result.newSpaceGems[0]?.position.z).toBeLessThan(-20);
    } finally {
      spy.mockRestore();
    }
  });

  it('does not spawn a second gem while one is still active', () => {
    const spy = vi.spyOn(Math, 'random').mockReturnValue(0);

    try {
      const system = new SpawnSystem();
      const activeGem = new SpaceGem(0, 0, -30, 'diamond-nebula');

      const result = system.update(10, -20, testConfig, [], [], [], [], {}, [activeGem]);

      expect(result.newSpaceGems).toHaveLength(0);
    } finally {
      spy.mockRestore();
    }
  });

  it('reuses a released gem from the pool', () => {
    const randoms = [0.5, 0, 0.02, 0.7, 0.4, 0.2];
    const spy = vi.spyOn(Math, 'random').mockImplementation(() => randoms.shift() ?? 0.5);

    try {
      const system = new SpawnSystem();
      const first = system.update(10, -20, testConfig);
      const gem = first.newSpaceGems[0];
      expect(gem).toBeDefined();
      const poolSize = system.getSpaceGemPoolSize();

      system.releaseSpaceGem(gem!);
      system.reset();

      const nextRandoms = [0.5, 0, 0.02, 0.7, 0.4, 0.2];
      spy.mockImplementation(() => nextRandoms.shift() ?? 0.5);
      const second = system.update(10, -20, testConfig);

      expect(second.newSpaceGems[0]).toBe(gem);
      expect(system.getSpaceGemPoolSize()).toBe(poolSize);
    } finally {
      spy.mockRestore();
    }
  });
});
