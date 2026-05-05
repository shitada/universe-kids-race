// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { SpecialShootingStar } from '../../src/game/entities/SpecialShootingStar';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function createScene(): {
  scene: StageScene;
  audioManager: { playSFX: ReturnType<typeof vi.fn> };
  saveManager: { markSpecialStarDiscovered: ReturnType<typeof vi.fn> };
} {
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], discoveredSpecialStars: [] })),
    save: vi.fn(),
    clear: vi.fn(),
    markSpecialStarDiscovered: vi.fn(() => true),
  } as unknown as SaveManager;

  return {
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager),
    audioManager: audioManager as unknown as { playSFX: ReturnType<typeof vi.fn> },
    saveManager: saveManager as unknown as { markSpecialStarDiscovered: ReturnType<typeof vi.fn> },
  };
}

describe('StageScene special shooting star integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('celebrates a collected special shooting star and records it in the encyclopedia', () => {
    const { scene, audioManager, saveManager } = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      meteorites: [];
      stars: [];
      shootingStars: [];
      comets: [];
      specialShootingStars: SpecialShootingStar[];
      scoreSystem: { getStageScore(): number };
      particleBurstManager: { getActiveCount(): number };
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      cameraShakeTimer: number;
      update(deltaTime: number): void;
      threeScene: { add: (object: object) => void };
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    const specialStar = new SpecialShootingStar(0, 0, 0, 'gold', 1);
    internal.meteorites = [];
    internal.stars = [];
    internal.shootingStars = [];
    internal.comets = [];
    internal.specialShootingStars = [specialStar];
    internal.threeScene.add(specialStar.mesh);

    internal.update(0.016);

    expect(internal.scoreSystem.getStageScore()).toBe(specialStar.scoreBonus);
    expect(audioManager.playSFX).toHaveBeenCalledWith('shootingStarCollect');
    expect(saveManager.markSpecialStarDiscovered).toHaveBeenCalledWith('gold');
    expect(internal.specialShootingStars).toHaveLength(0);
    expect(internal.particleBurstManager.getActiveCount()).toBeGreaterThan(0);
    expect(internal.cameraShakeTimer).toBeGreaterThan(0);
    expect(document.querySelector('[data-score-popup-kind="special-star"]')?.textContent).toContain('きん');
  });
});
