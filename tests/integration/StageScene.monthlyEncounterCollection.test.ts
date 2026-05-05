// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { MonthlyEncounterEntity } from '../../src/game/entities/MonthlyEncounterEntity';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function createScene(): {
  scene: StageScene;
  audioManager: { playSFX: ReturnType<typeof vi.fn> };
  saveManager: { markMonthlyEncounterDiscovered: ReturnType<typeof vi.fn> };
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
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [],
      discoveredMonthlyEncounters: [],
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markMonthlyEncounterDiscovered: vi.fn(() => true),
  } as unknown as SaveManager;

  return {
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager),
    audioManager: audioManager as unknown as { playSFX: ReturnType<typeof vi.fn> },
    saveManager: saveManager as unknown as { markMonthlyEncounterDiscovered: ReturnType<typeof vi.fn> },
  };
}

describe('StageScene monthly encounter integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('records a discovered monthly encounter and shows a discovery popup', () => {
    const { scene, audioManager, saveManager } = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      meteorites: [];
      stars: [];
      shootingStars: [];
      comets: [];
      specialShootingStars: [];
      monthlyEncounters: MonthlyEncounterEntity[];
      scoreSystem: { getStageScore(): number };
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      update(deltaTime: number): void;
      threeScene: { add: (object: object) => void };
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    const encounter = new MonthlyEncounterEntity(0, 0, 0, 'new-year-comet', 1);
    internal.meteorites = [];
    internal.stars = [];
    internal.shootingStars = [];
    internal.comets = [];
    internal.specialShootingStars = [];
    internal.monthlyEncounters = [encounter];
    internal.threeScene.add(encounter.mesh);

    internal.update(0.016);

    expect(internal.scoreSystem.getStageScore()).toBe(encounter.scoreBonus);
    expect(audioManager.playSFX).toHaveBeenCalledWith('shootingStarCollect');
    expect(saveManager.markMonthlyEncounterDiscovered).toHaveBeenCalledWith('new-year-comet');
    expect(internal.monthlyEncounters).toHaveLength(0);
    expect(document.querySelector('[data-score-popup-kind="monthly-encounter"]')?.textContent).toContain('あたらしい');
  });
});
