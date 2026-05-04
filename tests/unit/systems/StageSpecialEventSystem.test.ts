import { describe, expect, it } from 'vitest';
import { StageSpecialEventSystem } from '../../../src/game/systems/StageSpecialEventSystem';
import type { StageSpecialEventConfig } from '../../../src/types';

function createConfig(overrides: Partial<StageSpecialEventConfig> = {}): StageSpecialEventConfig {
  return {
    stageNumber: 6,
    id: 'saturn-ring',
    style: 'ring',
    startProgress: 0.4,
    duration: 2.5,
    message: 'リングを くぐったよ！',
    accentColor: 0xffcc66,
    ...overrides,
  };
}

describe('StageSpecialEventSystem', () => {
  it('進行度がしきい値に達したとき一度だけイベントを開始する', () => {
    const config = createConfig();
    const system = new StageSpecialEventSystem();
    system.setStage(config);

    expect(system.update(0.39, 0.5)).toMatchObject({
      started: false,
      active: false,
      event: null,
    });

    const started = system.update(0.4, 0.016);
    expect(started.started).toBe(true);
    expect(started.active).toBe(true);
    expect(started.event).toEqual(config);
    expect(started.timeRemaining).toBe(config.duration);
  });

  it('イベント時間が終わると終了し、同じステージ中に再発火しない', () => {
    const config = createConfig({ duration: 1.2 });
    const system = new StageSpecialEventSystem();
    system.setStage(config);

    system.update(0.45, 0.016);
    expect(system.update(0.6, 1.1).active).toBe(true);

    const ended = system.update(0.7, 0.2);
    expect(ended.ended).toBe(true);
    expect(ended.active).toBe(false);
    expect(ended.event).toEqual(config);

    const afterEnd = system.update(0.95, 1);
    expect(afterEnd.started).toBe(false);
    expect(afterEnd.active).toBe(false);
    expect(afterEnd.event).toBeNull();
  });

  it('reset で発火状態を取り消し、新しいステージ設定を受け付ける', () => {
    const first = createConfig({ stageNumber: 1, id: 'moon-rabbit', style: 'rabbit' });
    const second = createConfig({
      stageNumber: 8,
      id: 'neptune-bubbles',
      style: 'bubble',
      startProgress: 0.2,
      message: 'あおい あわが ぷかぷか！',
    });
    const system = new StageSpecialEventSystem();

    system.setStage(first);
    system.update(0.5, 0.016);
    expect(system.isActive()).toBe(true);

    system.reset();
    expect(system.isActive()).toBe(false);

    system.setStage(second);
    const restarted = system.update(0.2, 0.016);
    expect(restarted.started).toBe(true);
    expect(restarted.event).toEqual(second);
  });
});
