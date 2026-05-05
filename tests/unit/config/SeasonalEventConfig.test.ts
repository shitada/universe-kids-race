import { describe, expect, it } from 'vitest';
import {
  SEASONAL_EVENT_CONFIGS,
  getSeasonalEventConfigForDate,
} from '../../../src/game/config/SeasonalEventConfig';

describe('SeasonalEventConfig', () => {
  it('子供向けの季節イベント設定を持つ', () => {
    expect(SEASONAL_EVENT_CONFIGS.map((config) => config.id)).toEqual([
      'tanabata',
      'christmas',
      'new-year',
    ]);
  });

  it('日付に応じて七夕・クリスマス・お正月イベントを返す', () => {
    expect(getSeasonalEventConfigForDate(new Date(2026, 6, 7, 12))?.id).toBe('tanabata');
    expect(getSeasonalEventConfigForDate(new Date(2026, 11, 24, 12))?.id).toBe('christmas');
    expect(getSeasonalEventConfigForDate(new Date(2026, 0, 2, 12))?.id).toBe('new-year');
  });

  it('イベント期間外は null を返す', () => {
    expect(getSeasonalEventConfigForDate(new Date(2026, 6, 8, 12))).toBeNull();
    expect(getSeasonalEventConfigForDate(new Date(2026, 11, 26, 12))).toBeNull();
    expect(getSeasonalEventConfigForDate(new Date(2026, 0, 4, 12))).toBeNull();
    expect(getSeasonalEventConfigForDate(new Date(2026, 1, 14, 12))).toBeNull();
  });
});
