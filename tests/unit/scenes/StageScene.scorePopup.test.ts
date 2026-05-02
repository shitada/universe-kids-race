// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Star } from '../../../src/game/entities/Star';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

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

describe('StageScene score popup integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('shows +100 for NORMAL stars and +500 for RAINBOW stars', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      stars: Star[];
      meteorites: [];
      threeScene: THREE.Scene;
      scorePopupManager: { show: ReturnType<typeof vi.fn> };
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      update(deltaTime: number): void;
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
    internal.scorePopupManager = { show: vi.fn(), dispose: vi.fn() };

    const normalStar = new Star(0, 0, 0, 'NORMAL');
    const rainbowStar = new Star(0, 0, 0, 'RAINBOW');
    internal.stars = [normalStar, rainbowStar];
    internal.meteorites = [];
    internal.threeScene.add(normalStar.mesh);
    internal.threeScene.add(rainbowStar.mesh);

    internal.update(0.016);

    expect(internal.scorePopupManager.show).toHaveBeenCalledTimes(2);
    expect(internal.scorePopupManager.show).toHaveBeenNthCalledWith(
      1,
      100,
      normalStar.position,
      expect.any(THREE.PerspectiveCamera),
    );
    expect(internal.scorePopupManager.show).toHaveBeenNthCalledWith(
      2,
      500,
      rainbowStar.position,
      expect.any(THREE.PerspectiveCamera),
    );
  });
});
