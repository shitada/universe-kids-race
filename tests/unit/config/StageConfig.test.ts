import { describe, it, expect } from 'vitest';
import { STAGE_CONFIGS, getStageConfig } from '../../../src/game/config/StageConfig';

describe('StageConfig', () => {
  it('has exactly 11 stage configs', () => {
    expect(STAGE_CONFIGS).toHaveLength(11);
  });

  it('has sequential stageNumbers from 1 to 11', () => {
    for (let i = 0; i < STAGE_CONFIGS.length; i++) {
      expect(STAGE_CONFIGS[i].stageNumber).toBe(i + 1);
    }
  });

  it('has correct destination order for all 11 stages', () => {
    const expectedDestinations = ['月', '水星', '金星', '火星', '木星', '土星', '天王星', '海王星', '冥王星', '太陽', '地球'];
    for (let i = 0; i < expectedDestinations.length; i++) {
      expect(STAGE_CONFIGS[i].destination).toBe(expectedDestinations[i]);
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
    for (let i = 1; i <= 11; i++) {
      const config = getStageConfig(i);
      expect(config.stageNumber).toBe(i);
    }
  });

  it('getStageConfig throws for invalid stage number', () => {
    expect(() => getStageConfig(0)).toThrow('Invalid stage number: 0');
    expect(() => getStageConfig(12)).toThrow('Invalid stage number: 12');
  });

  it('has correct difficulty curve for new stages (水星, 金星, 地球)', () => {
    const mercury = getStageConfig(2);
    expect(mercury.stageLength).toBe(1100);
    expect(mercury.meteoriteInterval).toBe(2.8);

    const venus = getStageConfig(3);
    expect(venus.stageLength).toBe(1150);
    expect(venus.meteoriteInterval).toBe(2.6);

    const earth = getStageConfig(11);
    expect(earth.stageLength).toBe(2700);
    expect(earth.meteoriteInterval).toBe(0.5);
  });
});
