import { describe, expect, it } from 'vitest';
import {
  STAGE_ATMOSPHERE_CONFIGS,
  getStageAtmosphereConfig,
} from '../../../src/game/config/StageAtmosphereConfig';

describe('StageAtmosphereConfig', () => {
  it('12ステージ分の雰囲気設定を持つ', () => {
    expect(STAGE_ATMOSPHERE_CONFIGS).toHaveLength(12);
    expect(STAGE_ATMOSPHERE_CONFIGS.map((config) => config.stageNumber)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });

  it('月と火星と土星と宇宙ステーションに固有の背景と粒子設定を持つ', () => {
    expect(getStageAtmosphereConfig(1)).toMatchObject({
      gradientTopColor: 0xf4f8ff,
      gradientBottomColor: 0x4a547d,
      particlePattern: 'sparkle',
    });
    expect(getStageAtmosphereConfig(4)).toMatchObject({
      gradientTopColor: 0xffb26b,
      gradientBottomColor: 0x6d1f16,
      particlePattern: 'ember',
    });
    expect(getStageAtmosphereConfig(6)).toMatchObject({
      particlePattern: 'ring',
      particleCount: 54,
    });
    expect(getStageAtmosphereConfig(11)).toMatchObject({
      particlePattern: 'crystal',
      particleCount: 34,
    });
  });

  it('不正なステージ番号では例外を投げる', () => {
    expect(() => getStageAtmosphereConfig(0)).toThrow('Invalid stage atmosphere number: 0');
    expect(() => getStageAtmosphereConfig(13)).toThrow('Invalid stage atmosphere number: 13');
  });
});
