// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function createScene(): { scene: StageScene; audioManager: { playSFX: ReturnType<typeof vi.fn> } } {
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

  return {
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager),
    audioManager: audioManager as unknown as { playSFX: ReturnType<typeof vi.fn> },
  };
}

describe('StageScene meteor shower integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('shows the special announcement, plays the start SFX, and spawns extra shooting stars', () => {
    const { scene, audioManager } = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      update(deltaTime: number): void;
      shootingStars: { length: number };
      meteoShowerEventSystem: {
        update: (deltaTime: number) => {
          active: boolean;
          started: boolean;
          ended: boolean;
          timeRemaining: number;
        };
      };
      meteoShowerEffect: { getObject: () => { visible: boolean } | null };
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
    internal.meteoShowerEventSystem = {
      update: () => ({
        active: true,
        started: true,
        ended: false,
        timeRemaining: 4.5,
      }),
    };

    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.25);

    try {
      internal.update(0.8);
    } finally {
      randomSpy.mockRestore();
    }

    expect(audioManager.playSFX).toHaveBeenCalledWith('meteorShowerStart');
    expect(internal.shootingStars.length).toBeGreaterThan(0);
    expect(document.querySelector('[data-hud-assist-message]')?.textContent).toBe('りゅうせいぐんだ！ ✨');
    expect(internal.meteoShowerEffect.getObject()?.visible).toBe(true);
  });
});
