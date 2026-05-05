// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { Star } from '../../src/game/entities/Star';
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

describe('StageScene lovely star integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('awards the lovely star score, activates a short bonus, and shows a lovely popup', () => {
    const { scene, audioManager } = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      stars: Star[];
      meteorites: [];
      shootingStars: [];
      comets: [];
      specialShootingStars: [];
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      update(deltaTime: number): void;
      threeScene: { add: (object: object) => void };
      scoreSystem: { getStageScore(): number; getScoreMultiplier(): number };
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    const lovelyStar = new Star(0, 0, 0, 'LOVELY');
    internal.stars = [lovelyStar];
    internal.meteorites = [];
    internal.shootingStars = [];
    internal.comets = [];
    internal.specialShootingStars = [];
    internal.threeScene.add(lovelyStar.mesh);

    internal.update(0.016);

    expect(internal.scoreSystem.getStageScore()).toBe(1200);
    expect(internal.scoreSystem.getScoreMultiplier()).toBe(2);
    expect(audioManager.playSFX).toHaveBeenCalledWith('lovelyCollect');
    expect(document.querySelector('[data-score-popup-kind="lovely-star"]')?.textContent).toContain('ラブリー');
  });
});
