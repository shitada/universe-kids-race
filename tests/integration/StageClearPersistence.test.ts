// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { TitleScene } from '../../src/game/scenes/TitleScene';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveData } from '../../src/types';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import * as THREE from 'three';

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

function createTitleScene(saveManager: SaveManager) {
  const sceneManager = { requestTransition: vi.fn() };
  const audioManager = {
    init: vi.fn(),
    initSync: vi.fn(),
    isInitialized: vi.fn(() => true),
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    ensureResumed: vi.fn(),
    dispose: vi.fn(),
  } as unknown as AudioManager;

  return new TitleScene(
    sceneManager as unknown as SceneManager,
    saveManager,
    audioManager,
    {
      loadTitleCompanionFactory: async () => ({
        createCompanionMesh: () => new THREE.Group(),
      }),
    },
  );
}

function findCompanionParade(scene: TitleScene): THREE.Group | undefined {
  return scene.getThreeScene().children.find(
    (child) => child instanceof THREE.Group && child.name === 'title-companion-parade',
  ) as THREE.Group | undefined;
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
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

  it('shows the newly unlocked companion when returning to the title scene after clearing a stage', async () => {
    const { state, api: saveManager } = createStatefulSaveManager({
      clearedStage: 1,
      unlockedPlanets: [1],
      muted: false,
      bestStageStars: { 4: 0 },
      tutorialShown: true,
    });
    const { internal } = createScene(saveManager);
    internal.stageNumber = 4;
    internal.scoreSystem = { getStarCount: () => 2 };

    const titleBeforeClear = createTitleScene(saveManager);
    titleBeforeClear.enter({});
    await flushPromises();
    expect(findCompanionParade(titleBeforeClear)?.children).toHaveLength(1);
    titleBeforeClear.exit();

    internal.onStageClear();

    expect(state.unlockedPlanets).toEqual([1, 4]);

    const titleAfterClear = createTitleScene(saveManager);
    titleAfterClear.enter({});
    await flushPromises();

    const parade = findCompanionParade(titleAfterClear);
    expect(parade).toBeTruthy();
    expect(parade?.children).toHaveLength(2);

    const playButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'あそぶ',
    ) as HTMLButtonElement | undefined;
    expect(playButton).toBeTruthy();

    titleAfterClear.exit();
  });
});
