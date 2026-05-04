// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';

function createScene() {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => ({ moveDirection: 0, boostPressed: false }),
    setBoostPressed: vi.fn(),
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
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [],
      muted: false,
      bestStageStars: {},
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => true),
    updateBestStageStars: vi.fn(),
    recordGameplaySession: vi.fn(),
  } as unknown as SaveManager & { recordGameplaySession: ReturnType<typeof vi.fn> };

  return {
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager),
    saveManager,
  };
}

describe('StageScene gameplay stats', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('records gameplay stats when a stage is cleared', () => {
    const { scene, saveManager } = createScene();
    scene.enter({ stageNumber: 2 });

    const internal = scene as unknown as {
      playTime: number;
      scoreSystem: { addStarScore: (starType: 'NORMAL' | 'RAINBOW') => void };
      boostSystem: { activate: () => boolean };
      onStageClear: () => void;
    };
    internal.playTime = 42;
    internal.scoreSystem.addStarScore('NORMAL');
    internal.scoreSystem.addStarScore('RAINBOW');
    internal.boostSystem.activate();

    internal.onStageClear();
    scene.exit();

    expect(saveManager.recordGameplaySession).toHaveBeenCalledTimes(1);
    expect(saveManager.recordGameplaySession).toHaveBeenCalledWith({
      stageNumber: 2,
      playTimeSeconds: 42,
      collectedStars: 2,
      boostUses: 1,
      stageCleared: true,
    });
  });

  it('records unfinished attempts on exit', () => {
    const { scene, saveManager } = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      playTime: number;
      scoreSystem: { addStarScore: (starType: 'NORMAL' | 'RAINBOW') => void };
      boostSystem: { activate: () => boolean };
    };
    internal.playTime = 18;
    internal.scoreSystem.addStarScore('NORMAL');
    internal.boostSystem.activate();

    scene.exit();

    expect(saveManager.recordGameplaySession).toHaveBeenCalledWith({
      stageNumber: 1,
      playTimeSeconds: 18,
      collectedStars: 1,
      boostUses: 1,
      stageCleared: false,
    });
  });
});
