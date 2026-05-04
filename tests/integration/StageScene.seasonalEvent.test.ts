// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function createScene(date: Date): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState = { moveDirection: 0, boostPressed: false };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (value: boolean) => {
      inputState.boostPressed = value;
    },
    resetPointers: vi.fn(),
  } as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;

  return new StageScene(sceneManager, inputSystem, audioManager, saveManager, {
    seasonalEventDateProvider: () => date,
  });
}

describe('StageScene seasonal event integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('季節イベント日に入ると通知UIと演出を有効化する', () => {
    const scene = createScene(new Date(2026, 6, 7, 12));
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      seasonalEventEffects: { getGroup(): { visible: boolean } };
      seasonalEventNotice: { isVisible(): boolean };
    };

    expect(document.querySelector('[data-seasonal-event-notice-title]')?.textContent).toContain('たなばた');
    expect(internal.seasonalEventEffects.getGroup().visible).toBe(true);
    expect(internal.seasonalEventNotice.isVisible()).toBe(true);
  });

  it('季節イベント日でないときは通知UIも演出も表示しない', () => {
    const scene = createScene(new Date(2026, 1, 14, 12));
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      seasonalEventEffects: { getGroup(): { visible: boolean } };
      seasonalEventNotice: { isVisible(): boolean };
    };

    expect(document.querySelector('[data-seasonal-event-notice]')).toBeNull();
    expect(internal.seasonalEventEffects.getGroup().visible).toBe(false);
    expect(internal.seasonalEventNotice.isVisible()).toBe(false);
  });
});
