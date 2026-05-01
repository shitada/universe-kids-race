// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { SaveData } from '../../../src/types';

interface CreatedScene {
  scene: StageScene;
  setBestSpy: ReturnType<typeof vi.fn>;
}

function createScene(saveData: Partial<SaveData>): CreatedScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => ({ moveDirection: 0, boostPressed: false }),
    setBoostPressed: vi.fn(),
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
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [],
      muted: false,
      ...saveData,
    })),
    save: vi.fn(),
    clear: vi.fn(),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;
  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  // Spy on hud.setBestStarCount by replacing the method on the actual HUD
  // instance after construction. The real HUD still mounts its DOM and is
  // cleaned up by exit() / hide().
  const internal = scene as unknown as { hud: { setBestStarCount: (n: number) => void } };
  const setBestSpy = vi.fn();
  internal.hud.setBestStarCount = setBestSpy;
  return { scene, setBestSpy };
}

describe('StageScene.enter passes bestStageStars to HUD', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('calls hud.setBestStarCount with the stored best for the entered stage', () => {
    const { scene, setBestSpy } = createScene({
      bestStageStars: { 1: 5, 3: 2 },
    });
    scene.enter({ stageNumber: 1 });
    expect(setBestSpy).toHaveBeenCalledWith(5);
  });

  it('passes 0 when no best record exists for the stage', () => {
    const { scene, setBestSpy } = createScene({
      bestStageStars: {},
    });
    scene.enter({ stageNumber: 1 });
    expect(setBestSpy).toHaveBeenCalledWith(0);
  });

  it('passes 0 when bestStageStars is undefined (legacy save)', () => {
    const { scene, setBestSpy } = createScene({} as Partial<SaveData>);
    scene.enter({ stageNumber: 1 });
    expect(setBestSpy).toHaveBeenCalledWith(0);
  });
});
