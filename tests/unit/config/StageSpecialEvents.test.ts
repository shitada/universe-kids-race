import { describe, expect, it } from 'vitest';
import {
  STAGE_SPECIAL_EVENT_CONFIGS,
  getStageSpecialEventConfig,
} from '../../../src/game/config/StageSpecialEvents';

describe('StageSpecialEvents', () => {
  it('全12ステージぶんの特別イベント設定を持つ', () => {
    expect(STAGE_SPECIAL_EVENT_CONFIGS).toHaveLength(12);
    expect(STAGE_SPECIAL_EVENT_CONFIGS.map((config) => config.stageNumber)).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    );
  });

  it('各イベントに有効な進行度・時間・メッセージが設定されている', () => {
    for (const config of STAGE_SPECIAL_EVENT_CONFIGS) {
      expect(config.startProgress).toBeGreaterThan(0);
      expect(config.startProgress).toBeLessThan(1);
      expect(config.duration).toBeGreaterThan(0);
      expect(config.message).toBeTruthy();
      expect(config.accentColor).toBeGreaterThanOrEqual(0);
      expect(config.accentColor).toBeLessThanOrEqual(0xffffff);
    }
  });

  it('ステージ番号から対応する特別イベント設定を返す', () => {
    expect(getStageSpecialEventConfig(1)?.style).toBe('rabbit');
    expect(getStageSpecialEventConfig(6)?.style).toBe('ring');
    expect(getStageSpecialEventConfig(8)?.style).toBe('bubble');
    expect(getStageSpecialEventConfig(11)?.style).toBe('halo');
    expect(getStageSpecialEventConfig(12)?.style).toBe('homecoming');
  });

  it('存在しないステージ番号では null を返す', () => {
    expect(getStageSpecialEventConfig(0)).toBeNull();
    expect(getStageSpecialEventConfig(13)).toBeNull();
  });
});
