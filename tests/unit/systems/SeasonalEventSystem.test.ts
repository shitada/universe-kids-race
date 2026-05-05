import { describe, expect, it } from 'vitest';
import { SeasonalEventSystem } from '../../../src/game/systems/SeasonalEventSystem';

describe('SeasonalEventSystem', () => {
  it('dateProvider から現在の季節イベントを更新して保持する', () => {
    let currentDate = new Date(2026, 3, 10, 12);
    const system = new SeasonalEventSystem(() => currentDate);

    expect(system.refresh()?.id).toBe('sakura');
    expect(system.isActive()).toBe(true);
    expect(system.getActiveEvent()?.id).toBe('sakura');

    currentDate = new Date(2026, 1, 1, 12);
    expect(system.refresh()).toBeNull();
    expect(system.isActive()).toBe(false);
  });

  it('clear でイベント状態をリセットする', () => {
    const system = new SeasonalEventSystem(() => new Date(2026, 11, 25, 12));

    system.refresh();
    expect(system.isActive()).toBe(true);

    system.clear();
    expect(system.isActive()).toBe(false);
    expect(system.getActiveEvent()).toBeNull();
  });
});
