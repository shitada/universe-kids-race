// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { getStageSpecialEventConfig } from '../../src/game/config/StageSpecialEvents';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState = { moveDirection: 0, boostPressed: false };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (value: boolean) => {
      inputState.boostPressed = value;
    },
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

  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

describe('StageScene stage special event integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('イベント開始時にHUD通知と演出表示を行う', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 6 });

    const specialEvent = getStageSpecialEventConfig(6);
    expect(specialEvent).not.toBeNull();

    const internal = scene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      update(deltaTime: number): void;
      stageSpecialEventSystem: {
        update: (progress: number, deltaTime: number) => {
          active: boolean;
          started: boolean;
          ended: boolean;
          timeRemaining: number;
          event: ReturnType<typeof getStageSpecialEventConfig>;
        };
      };
      stageSpecialEffects: {
        getGroup: () => { visible: boolean };
      };
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
    internal.stageSpecialEventSystem = {
      update: () => ({
        active: true,
        started: true,
        ended: false,
        timeRemaining: 3,
        event: specialEvent,
      }),
    };

    internal.update(0.5);

    expect(document.querySelector('[data-hud-assist-message]')?.textContent).toBe(specialEvent?.message);
    expect(internal.stageSpecialEffects.getGroup().visible).toBe(true);
  });
});
