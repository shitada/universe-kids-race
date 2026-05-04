// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(stageNumber = 1): StageScene {
  const inputState = { moveDirection: 0, boostPressed: false };
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (value: boolean) => {
      inputState.boostPressed = value;
    },
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
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], muted: false, bestStageStars: {} })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;
  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  scene.enter({ stageNumber, replayToken: 1, totalScore: 0, totalStarCount: 0 });
  (scene as unknown as { countdownOverlay: { dispose(): void } | null }).countdownOverlay?.dispose();
  (scene as unknown as { isStarting: boolean }).isStarting = false;
  (scene as unknown as { countdownOverlay: unknown | null }).countdownOverlay = null;
  return scene;
}

describe('StageScene accessibility announcements', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('announces meteorite collisions through HUD', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      collisionSystem: { check: (...args: unknown[]) => unknown };
      hud: { announceMeteoriteHit: () => void };
      meteorites: Meteorite[];
      update: (dt: number) => void;
    };

    const hit = new Meteorite(0, 0, -30);
    internal.meteorites = [hit];
    internal.collisionSystem = {
      check: () => ({
        starCollisions: [],
        meteoriteCollision: true,
        meteoriteHit: hit,
      }),
    };

    const announceSpy = vi.spyOn(internal.hud, 'announceMeteoriteHit');
    internal.update(0.016);

    expect(announceSpy).toHaveBeenCalledTimes(1);
  });

  it('announces stage clear summaries through HUD', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      hud: { announceStageClear: (starCount: number, isNewPlanetUnlock?: boolean, isBestUpdated?: boolean) => void };
      scoreSystem: { getStarCount(): number };
      onStageClear(): void;
    };

    internal.scoreSystem = {
      getStarCount: () => 5,
    };
    const announceSpy = vi.spyOn(internal.hud, 'announceStageClear');

    internal.onStageClear();

    expect(announceSpy).toHaveBeenCalledWith(5, false, true);
  });
});
