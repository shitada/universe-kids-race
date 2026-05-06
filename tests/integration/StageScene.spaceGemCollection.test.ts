// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { SpaceGem } from '../../src/game/entities/SpaceGem';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function createScene(): {
  scene: StageScene;
  audioManager: { playSFX: ReturnType<typeof vi.fn> };
  saveManager: { markSpaceGemDiscovered: ReturnType<typeof vi.fn> };
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], discoveredSpaceGems: [] })),
    save: vi.fn(),
    clear: vi.fn(),
    markSpaceGemDiscovered: vi.fn(() => true),
  } as unknown as SaveManager;

  return {
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager),
    audioManager: audioManager as unknown as { playSFX: ReturnType<typeof vi.fn> },
    saveManager: saveManager as unknown as { markSpaceGemDiscovered: ReturnType<typeof vi.fn> },
  };
}

describe('StageScene space gem integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('celebrates a collected space gem and records it in the treasure box', () => {
    const { scene, audioManager, saveManager } = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      meteorites: [];
      stars: [];
      shootingStars: [];
      comets: [];
      specialShootingStars: [];
      monthlyEncounters: [];
      spaceGems: SpaceGem[];
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

    const gem = new SpaceGem(0, 0, 0, 'diamond-nebula');
    internal.meteorites = [];
    internal.stars = [];
    internal.shootingStars = [];
    internal.comets = [];
    internal.specialShootingStars = [];
    internal.monthlyEncounters = [];
    internal.spaceGems = [gem];
    internal.threeScene.add(gem.mesh);

    internal.update(0.016);

    expect(internal.scoreSystem.getStageScore()).toBe(gem.scoreBonus);
    expect(audioManager.playSFX).toHaveBeenCalledWith('spaceGemCollect');
    expect(saveManager.markSpaceGemDiscovered).toHaveBeenCalledWith('diamond-nebula');
    expect(internal.spaceGems).toHaveLength(0);
    expect(internal.particleBurstManager.getActiveCount()).toBeGreaterThan(0);
    expect(internal.cameraShakeTimer).toBeGreaterThan(0);
    expect(document.querySelector('[data-score-popup-kind="space-gem"]')?.textContent).toContain('だいや');
  });
});
