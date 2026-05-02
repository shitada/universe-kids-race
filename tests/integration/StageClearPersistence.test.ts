// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveData } from '../../src/types';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function createStatefulSaveManager(initial: SaveData) {
  const state: SaveData = {
    ...initial,
    unlockedPlanets: [...initial.unlockedPlanets],
    bestStageStars: { ...(initial.bestStageStars ?? {}) },
  };

  return {
    state,
    api: {
      load: vi.fn(() => ({
        ...state,
        unlockedPlanets: [...state.unlockedPlanets],
        bestStageStars: { ...(state.bestStageStars ?? {}) },
      })),
      save: vi.fn(),
      markStageCleared: vi.fn((stageNumber: number) => {
        const wasUnlocked = state.unlockedPlanets.includes(stageNumber);
        state.clearedStage = Math.max(state.clearedStage, stageNumber);
        if (!wasUnlocked) {
          state.unlockedPlanets.push(stageNumber);
        }
        return !wasUnlocked;
      }),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager,
  };
}

function createScene(saveManager: SaveManager) {
  const sceneManager = { requestTransition: vi.fn() };
  const inputSystem = {} as InputSystem;
  const audioManager = {
    playSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
  } as unknown as AudioManager;
  const scene = new StageScene(sceneManager as unknown as SceneManager, inputSystem, audioManager, saveManager);
  (scene as unknown as { ensureInitialized(): void }).ensureInitialized();
  const internal = scene as unknown as {
    stageNumber: number;
    scoreSystem: { getStarCount(): number };
    companionManager: unknown | null;
    spaceship: { position: { x: number; y: number; z: number } };
    update(deltaTime: number): void;
    onStageClear(): void;
  };
  internal.companionManager = null;
  internal.spaceship = { position: { x: 0, y: 0, z: 0 } };

  return {
    scene,
    internal,
    sceneManager,
    audioManager: audioManager as unknown as {
      playSFX: ReturnType<typeof vi.fn>;
      stopBoostSFX: ReturnType<typeof vi.fn>;
    },
  };
}

describe('Stage clear persistence integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('persists cleared progress before the clear animation finishes', () => {
    const { state, api: saveManager } = createStatefulSaveManager({
      clearedStage: 1,
      unlockedPlanets: [1],
      muted: false,
      bestStageStars: { 4: 0 },
    });
    const { internal, sceneManager } = createScene(saveManager);
    internal.stageNumber = 4;
    internal.scoreSystem = { getStarCount: () => 2 };

    internal.onStageClear();

    expect(state.clearedStage).toBe(4);
    expect(state.unlockedPlanets).toEqual([1, 4]);
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    internal.update(1);

    expect(state.clearedStage).toBe(4);
    expect(state.unlockedPlanets).toEqual([1, 4]);
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
  });

  it('keeps the highest cleared stage when a lower stage is replayed from stage select', () => {
    const { state, api: saveManager } = createStatefulSaveManager({
      clearedStage: 5,
      unlockedPlanets: [1, 2, 5],
      muted: false,
      bestStageStars: { 3: 1 },
    });
    const { internal } = createScene(saveManager);
    internal.stageNumber = 3;
    internal.scoreSystem = { getStarCount: () => 1 };

    internal.onStageClear();

    expect(state.clearedStage).toBe(5);
    expect(state.unlockedPlanets).toEqual([1, 2, 5, 3]);
  });
});
