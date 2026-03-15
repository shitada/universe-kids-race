import { describe, it, expect } from 'vitest';
import { STAGE_CONFIGS, getStageConfig } from '../../../src/game/config/StageConfig';

describe('StageConfig', () => {
  it('has exactly 8 stage configs', () => {
    expect(STAGE_CONFIGS).toHaveLength(8);
  });

  it('has sequential stageNumbers from 1 to 8', () => {
    for (let i = 0; i < STAGE_CONFIGS.length; i++) {
      expect(STAGE_CONFIGS[i].stageNumber).toBe(i + 1);
    }
  });

  it('has increasing stageLength', () => {
    for (let i = 1; i < STAGE_CONFIGS.length; i++) {
      expect(STAGE_CONFIGS[i].stageLength).toBeGreaterThan(STAGE_CONFIGS[i - 1].stageLength);
    }
  });

  it('has decreasing meteoriteInterval', () => {
    for (let i = 1; i < STAGE_CONFIGS.length; i++) {
      expect(STAGE_CONFIGS[i].meteoriteInterval).toBeLessThan(STAGE_CONFIGS[i - 1].meteoriteInterval);
    }
  });

  it('has non-empty emoji for all stages', () => {
    for (const config of STAGE_CONFIGS) {
      expect(config.emoji).toBeTruthy();
    }
  });

  it('has non-empty displayName for all stages', () => {
    for (const config of STAGE_CONFIGS) {
      expect(config.displayName).toBeTruthy();
    }
  });

  it('has valid planetColor for all stages', () => {
    for (const config of STAGE_CONFIGS) {
      expect(config.planetColor).toBeGreaterThanOrEqual(0);
      expect(config.planetColor).toBeLessThanOrEqual(0xffffff);
    }
  });

  it('getStageConfig returns correct config for each stage', () => {
    for (let i = 1; i <= 8; i++) {
      const config = getStageConfig(i);
      expect(config.stageNumber).toBe(i);
    }
  });

  it('getStageConfig throws for invalid stage number', () => {
    expect(() => getStageConfig(0)).toThrow('Invalid stage number: 0');
    expect(() => getStageConfig(9)).toThrow('Invalid stage number: 9');
  });
});
