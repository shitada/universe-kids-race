// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { Star } from '../../src/game/entities/Star';
import { Comet } from '../../src/game/entities/Comet';
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

describe('StageScene comet encounter integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('adds comet bonus score and enables the same-frame star bonus', () => {
    const { scene, audioManager } = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      stars: Star[];
      meteorites: [];
      shootingStars: [];
      comets: Comet[];
      scoreSystem: { getStageScore(): number; getScoreMultiplier(): number };
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      update(deltaTime: number): void;
      threeScene: { add: (object: object) => void };
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    const normalStar = new Star(0, 0, 0, 'NORMAL');
    const comet = new Comet(0, 0, 0, 1);
    internal.stars = [normalStar];
    internal.meteorites = [];
    internal.shootingStars = [];
    internal.comets = [comet];
    internal.threeScene.add(normalStar.mesh);
    internal.threeScene.add(comet.mesh);

    internal.update(0.016);

    expect(internal.scoreSystem.getScoreMultiplier()).toBe(2);
    expect(internal.scoreSystem.getStageScore()).toBe(comet.scoreBonus + 200);
    expect(audioManager.playSFX).toHaveBeenCalledWith('cometCollect');
    expect(audioManager.playSFX).toHaveBeenCalledWith('starCollect');
    expect(internal.comets).toHaveLength(0);
  });
});
