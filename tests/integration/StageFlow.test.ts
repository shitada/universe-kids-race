// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SceneManager } from '../../src/game/SceneManager';
import type { Scene, SceneContext, SceneType } from '../../src/types';
import * as THREE from 'three';
import { StageScene } from '../../src/game/scenes/StageScene';
import { TOTAL_STAGES } from '../../src/game/config/StageConfig';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import { LoadingOverlay } from '../../src/ui/LoadingOverlay';
import { LoadFailureOverlay } from '../../src/ui/LoadFailureOverlay';
import { createSceneTransitionHandler } from '../../src/game/utils/createSceneTransitionHandler';
import { createRetryableModuleLoader } from '../../src/game/utils/createRetryableModuleLoader';

function createTrackingScene(transitionLog: { type: SceneType; context: SceneContext }[], sceneType: SceneType): Scene {
  const threeScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  return {
    enter: (ctx: SceneContext) => { transitionLog.push({ type: sceneType, context: ctx }); },
    update: () => {},
    exit: () => {},
    getThreeScene: () => threeScene,
    getCamera: () => camera,
  };
}

function mockCanvasContext(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      fillRect: () => {},
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      lineTo: () => {},
      ellipse: () => {},
    } as unknown as CanvasRenderingContext2D;
  });
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

describe('Stage Flow Integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCanvasContext();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('follows full flow with lazy scene factories: title → stage1 through stage11 → ending → title', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    const stageFactory = () => Promise.resolve(createTrackingScene(log, 'stage'));
    const endingFactory = () => Promise.resolve(createTrackingScene(log, 'ending'));

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerSceneFactory('stage', stageFactory);
    manager.registerSceneFactory('ending', endingFactory);

    // Start at title
    await manager.transitionTo('title');
    expect(log).toHaveLength(1);
    expect(log[0].type).toBe('title');

    // Title → Stage 1
    await manager.transitionTo('stage', { stageNumber: 1 });
    expect(log[1].type).toBe('stage');
    expect(log[1].context.stageNumber).toBe(1);

    // Stage 1 → Stage 2
    await manager.transitionTo('stage', { stageNumber: 2, totalScore: 500, totalStarCount: 5 });
    expect(log[2].context.stageNumber).toBe(2);
    expect(log[2].context.totalScore).toBe(500);

    // Stage 2 → Stage 3
    await manager.transitionTo('stage', { stageNumber: 3, totalScore: 1000, totalStarCount: 10 });
    expect(log[3].context.stageNumber).toBe(3);

    // Stage 3 → Stage 4
    await manager.transitionTo('stage', { stageNumber: 4, totalScore: 1500, totalStarCount: 15 });
    expect(log[4].context.stageNumber).toBe(4);

    // Stage 4 → Stage 5
    await manager.transitionTo('stage', { stageNumber: 5, totalScore: 2000, totalStarCount: 18 });
    expect(log[5].context.stageNumber).toBe(5);

    // Stage 5 → Stage 6
    await manager.transitionTo('stage', { stageNumber: 6, totalScore: 2800, totalStarCount: 24 });
    expect(log[6].context.stageNumber).toBe(6);

    // Stage 6 → Stage 7
    await manager.transitionTo('stage', { stageNumber: 7, totalScore: 3600, totalStarCount: 31 });
    expect(log[7].context.stageNumber).toBe(7);

    // Stage 7 → Stage 8
    await manager.transitionTo('stage', { stageNumber: 8, totalScore: 4500, totalStarCount: 39 });
    expect(log[8].context.stageNumber).toBe(8);

    // Stage 8 → Stage 9
    await manager.transitionTo('stage', { stageNumber: 9, totalScore: 5500, totalStarCount: 48 });
    expect(log[9].context.stageNumber).toBe(9);

    // Stage 9 → Stage 10
    await manager.transitionTo('stage', { stageNumber: 10, totalScore: 6500, totalStarCount: 55 });
    expect(log[10].context.stageNumber).toBe(10);

    // Stage 10 → Stage 11
    await manager.transitionTo('stage', { stageNumber: 11, totalScore: 7500, totalStarCount: 62 });
    expect(log[11].context.stageNumber).toBe(11);

    // Stage 11 → Ending
    await manager.transitionTo('ending', { totalScore: 9000, totalStarCount: 72 });
    expect(log[12].type).toBe('ending');
    expect(log[12].context.totalScore).toBe(9000);
    expect(log[12].context.totalStarCount).toBe(72);

    // Ending → Title (restart)
    await manager.transitionTo('title');
    expect(log[13].type).toBe('title');
  });

  it('tracks current scene type correctly after lazy transition', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerSceneFactory('stage', () => Promise.resolve(createTrackingScene(log, 'stage')));

    await manager.transitionTo('title');
    expect(manager.getCurrentType()).toBe('title');

    await manager.transitionTo('stage', { stageNumber: 1 });
    expect(manager.getCurrentType()).toBe('stage');
  });

  it('keeps StageScene uncreated during title while module prefetch is in flight, then transitions successfully', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    let stageInstance: Scene | null = null;
    const prefetcher = vi.fn(async () => ({ StageScene }));
    const stageFactory = vi.fn(async () => {
      stageInstance = createTrackingScene(log, 'stage');
      return stageInstance;
    });

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerSceneModulePrefetch('stage', prefetcher);
    manager.registerSceneFactory('stage', stageFactory);

    await manager.transitionTo('title');
    await manager.prefetchSceneModule('stage');

    expect(prefetcher).toHaveBeenCalledTimes(1);
    expect(stageFactory).not.toHaveBeenCalled();
    expect(stageInstance).toBeNull();
    expect(log).toEqual([{ type: 'title', context: {} }]);

    await manager.transitionTo('stage', { stageNumber: 1 });

    expect(stageFactory).toHaveBeenCalledTimes(1);
    expect(stageInstance).not.toBeNull();
    expect(log[1]).toEqual({ type: 'stage', context: { stageNumber: 1 } });
  });

  it('reuses the same StageScene instance and keeps persistent nodes singletons across title round-trips', async () => {
    const manager = new SceneManager();
    let stageScene: StageScene | null = null;
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveState = {
      clearedStage: 0,
      unlockedPlanets: [1, 2],
      muted: false,
      tutorialShown: true,
      bestStageStars: {} as Record<number, number>,
    };
    const saveManager = {
      load: vi.fn(() => ({
        ...saveState,
        unlockedPlanets: [...saveState.unlockedPlanets],
        bestStageStars: { ...saveState.bestStageStars },
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;

    manager.registerScene('title', createTrackingScene([], 'title'));
    const stageFactory = vi.fn(async () => {
      stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
      return stageScene;
    });
    manager.registerSceneFactory('stage', stageFactory);

    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 1 });

    const stageInternal = stageScene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      threeScene: THREE.Scene;
      spaceship: { mesh: THREE.Group };
      airShield: { getMesh(): THREE.Mesh };
      bgStars: THREE.Points | null;
      companionManager: { getGroup(): THREE.Group } | null;
    };
    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;

    const firstSceneRef = stageInternal.threeScene;
    const firstShipRef = stageInternal.spaceship.mesh;
    const firstShieldRef = stageInternal.airShield.getMesh();
    const firstCompanionGroupRef = stageInternal.companionManager?.getGroup();

    await manager.transitionTo('title');
    saveState.unlockedPlanets = [1, 2, 3];
    await manager.transitionTo('stage', { stageNumber: 4 });

    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;

    expect(stageFactory).toHaveBeenCalledTimes(1);
    expect(stageInternal.threeScene).toBe(firstSceneRef);
    expect(stageInternal.spaceship.mesh).toBe(firstShipRef);
    expect(stageInternal.airShield.getMesh()).toBe(firstShieldRef);
    expect(stageInternal.bgStars).not.toBeNull();
    expect(stageInternal.companionManager?.getGroup()).toBe(firstCompanionGroupRef);
    expect(firstSceneRef.children.filter((child) => child === firstShipRef)).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child === firstShieldRef)).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child === stageInternal.bgStars)).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child === firstCompanionGroupRef)).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child.type === 'AmbientLight')).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child.type === 'DirectionalLight')).toHaveLength(1);
  });

  it('uses a prefetched StageScene cache from title without showing loading UI or visible side effects', async () => {
    const manager = new SceneManager();
    let stageScene: StageScene | null = null;
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({
        clearedStage: 0,
        unlockedPlanets: [1, 2],
        muted: false,
        tutorialShown: true,
        bestStageStars: {},
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;
    const loadingOverlay = {
      show: vi.fn(),
      hide: vi.fn(),
    };
    const stageFactory = vi.fn(async () => {
      stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
      return stageScene;
    });

    manager.registerScene('title', createTrackingScene([], 'title'));
    manager.registerSceneFactory('stage', stageFactory);
    manager.setLoadStateHandler((isLoading, sceneType) => {
      if (isLoading) {
        loadingOverlay.show(
          sceneType === 'ending'
            ? 'さいごの じゅんび ちゅう...'
            : 'たびの じゅんび ちゅう...',
        );
        return;
      }
      loadingOverlay.hide();
    });

    await manager.transitionTo('title');
    await manager.prefetchScene('stage');

    const prefetchedStageInternal = stageScene as unknown as {
      initialized: boolean;
      threeScene: THREE.Scene;
      bgStars: THREE.Points | null;
    };

    expect(stageFactory).toHaveBeenCalledTimes(1);
    expect(prefetchedStageInternal.initialized).toBe(false);
    expect(prefetchedStageInternal.threeScene.children).toHaveLength(0);
    expect(prefetchedStageInternal.bgStars).toBeNull();
    expect(audioManager.playBGM).not.toHaveBeenCalled();
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-stage-clear-overlay]')).toBeNull();
    expect(document.querySelector('[aria-label="ホームへ もどる"]')).toBeNull();
    expect(manager.getCurrentType()).toBe('title');

    await manager.transitionTo('stage', { stageNumber: 1 });

    expect(stageFactory).toHaveBeenCalledTimes(1);
    expect(loadingOverlay.show).not.toHaveBeenCalled();
    expect(manager.getCurrentType()).toBe('stage');
    expect(audioManager.playBGM).toHaveBeenCalledWith(1);

    const stageInternal = stageScene as unknown as {
      initialized: boolean;
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      threeScene: THREE.Scene;
      bgStars: THREE.Points | null;
    };
    expect(stageInternal.initialized).toBe(true);
    expect(stageInternal.bgStars).not.toBeNull();
    expect(stageInternal.threeScene.children).not.toHaveLength(0);
    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;
  });

  it('waits for the clear CTA before moving to the next stage', async () => {
    const manager = new SceneManager();
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({
        clearedStage: 0,
        unlockedPlanets: [],
        muted: false,
        tutorialShown: true,
        bestStageStars: {},
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;
    let stageScene: StageScene | null = null;

    manager.registerSceneFactory('stage', async () => {
      stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
      return stageScene;
    });
    manager.registerScene('ending', createTrackingScene([], 'ending'));

    await manager.transitionTo('stage', { stageNumber: 1 });

    const internal = stageScene as unknown as {
      stageNumber: number;
      scoreSystem: {
        getStarCount(): number;
        finalizeStage(): { totalScore: number; totalStarCount: number };
      };
      onStageClear(): void;
      update(deltaTime: number): void;
    };
    internal.scoreSystem.getStarCount = () => 3;
    internal.scoreSystem.finalizeStage = () => ({ totalScore: 1200, totalStarCount: 9 });

    internal.onStageClear();
    internal.update(30);
    expect(internal.stageNumber).toBe(1);

    const button = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
    expect(button).not.toBeNull();
    button!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await Promise.resolve();
    await Promise.resolve();

    expect(manager.getCurrentType()).toBe('stage');
    expect(internal.stageNumber).toBe(2);
  });

  it('retries the same stage without double-counting cumulative totals and still continues afterward', async () => {
    const manager = new SceneManager();
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({
        clearedStage: 0,
        unlockedPlanets: [],
        muted: false,
        tutorialShown: true,
        bestStageStars: {},
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;
    let stageScene: StageScene | null = null;

    manager.registerSceneFactory('stage', async () => {
      stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
      return stageScene;
    });
    manager.registerScene('ending', createTrackingScene([], 'ending'));

    await manager.transitionTo('stage', { stageNumber: 3, totalScore: 1000, totalStarCount: 10 });

    const internal = stageScene as unknown as {
      stageNumber: number;
      scoreSystem: {
        getStarCount(): number;
        getTotalScore(): number;
        getTotalStarCount(): number;
        finalizeStage(): { stageScore: number; totalScore: number; totalStarCount: number };
      };
      onStageClear(): void;
      update(deltaTime: number): void;
    };
    internal.scoreSystem.getStarCount = () => 5;
    internal.scoreSystem.finalizeStage = () => ({ stageScore: 500, totalScore: 1500, totalStarCount: 15 });

    internal.onStageClear();
    internal.update(1);

    const retryButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-retry]');
    expect(retryButton?.textContent).toBe('もういちど');
    retryButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();

    expect(manager.getCurrentType()).toBe('stage');
    expect(internal.stageNumber).toBe(3);
    expect(internal.scoreSystem.getTotalScore()).toBe(1000);
    expect(internal.scoreSystem.getTotalStarCount()).toBe(10);

    internal.scoreSystem.getStarCount = () => 4;
    internal.scoreSystem.finalizeStage = () => ({ stageScore: 400, totalScore: 1400, totalStarCount: 14 });

    internal.onStageClear();
    internal.update(1);

    const continueButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
    expect(continueButton?.textContent).toBe('つぎへ');
    continueButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();

    expect(manager.getCurrentType()).toBe('stage');
    expect(internal.stageNumber).toBe(4);
    expect(internal.scoreSystem.getTotalScore()).toBe(1400);
    expect(internal.scoreSystem.getTotalStarCount()).toBe(14);
  });

  it('uses the clear CTA to move from the last stage to ending', async () => {
    const manager = new SceneManager();
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({
        clearedStage: 0,
        unlockedPlanets: [],
        muted: false,
        tutorialShown: true,
        bestStageStars: {},
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;
    let stageScene: StageScene | null = null;

    manager.registerSceneFactory('stage', async () => {
      stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
      return stageScene;
    });
    manager.registerScene('ending', createTrackingScene([], 'ending'));

    await manager.transitionTo('stage', { stageNumber: TOTAL_STAGES });

    const internal = stageScene as unknown as {
      scoreSystem: {
        getStarCount(): number;
        finalizeStage(): { totalScore: number; totalStarCount: number };
      };
      onStageClear(): void;
      update(deltaTime: number): void;
    };
    internal.scoreSystem.getStarCount = () => 6;
    internal.scoreSystem.finalizeStage = () => ({ totalScore: 9000, totalStarCount: 72 });

    internal.onStageClear();
    internal.update(1);

    const button = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
    expect(button?.textContent).toBe('おいわいへ');
    button!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    expect(manager.getCurrentType()).toBe('ending');
  });

  it('starts ending module prefetch only after reaching the final stage', async () => {
    const manager = new SceneManager();
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({
        clearedStage: 0,
        unlockedPlanets: [],
        muted: false,
        tutorialShown: true,
        bestStageStars: {},
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;
    const stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
    const endingModulePrefetcher = vi.fn(async () => ({ EndingScene: class {} }));
    const endingFactory = vi.fn(async () => createTrackingScene([], 'ending'));

    manager.registerScene('stage', stageScene);
    manager.registerSceneModulePrefetch('ending', endingModulePrefetcher);
    manager.registerSceneFactory('ending', endingFactory);

    await manager.transitionTo('stage', { stageNumber: TOTAL_STAGES - 1 });
    expect(endingModulePrefetcher).not.toHaveBeenCalled();
    expect(endingFactory).not.toHaveBeenCalled();

    await manager.transitionTo('stage', { stageNumber: TOTAL_STAGES });
    expect(endingModulePrefetcher).toHaveBeenCalledTimes(1);
    expect(endingFactory).not.toHaveBeenCalled();

    const internal = stageScene as unknown as {
      scoreSystem: {
        getStarCount(): number;
        finalizeStage(): { totalScore: number; totalStarCount: number };
      };
      onStageClear(): void;
      update(deltaTime: number): void;
    };
    internal.scoreSystem.getStarCount = () => 6;
    internal.scoreSystem.finalizeStage = () => ({ totalScore: 9000, totalStarCount: 72 });

    internal.onStageClear();
    internal.update(1);

    const button = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
    expect(button?.textContent).toBe('おいわいへ');
    button!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    expect(manager.getCurrentType()).toBe('ending');
    expect(endingFactory).toHaveBeenCalledTimes(1);
    expect(endingModulePrefetcher).toHaveBeenCalledTimes(1);
  });

  it('shows retry UI after stage lazy-load failure and retries successfully on "もういちど"', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    const loadFailureOverlay = new LoadFailureOverlay();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const pixelRatioController = {
      reset: vi.fn(),
      notifyResume: vi.fn(),
    };

    const loadStageModule = createRetryableModuleLoader(
      vi.fn<() => Promise<{ StageScene: typeof StageScene }>>()
        .mockRejectedValueOnce(new Error('stage chunk failed'))
        .mockResolvedValueOnce({ StageScene }),
    );

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerSceneFactory('stage', async () => {
      await loadStageModule();
      return createTrackingScene(log, 'stage');
    });
    manager.setLoadStateHandler((isLoading, sceneType) => {
      if (isLoading) {
        loadingOverlay.show(
          sceneType === 'ending'
            ? 'さいごの じゅんび ちゅう...'
            : 'たびの じゅんび ちゅう...',
        );
        return;
      }
      loadingOverlay.hide();
    });
    manager.setTransitionErrorHandler((error, sceneType, context) => {
      console.error(`Failed to transition to ${sceneType}`, error);
      loadingOverlay.hide();
      if (sceneType !== 'stage' && sceneType !== 'ending') {
        return;
      }
      loadFailureOverlay.show({
        primaryAction: {
          label: 'もういちど',
          onSelect: () => manager.requestTransition(sceneType, context),
        },
        secondaryAction: {
          label: 'タイトルへ',
          onSelect: () => manager.requestTransition('title'),
        },
      });
    });
    manager.setTransitionHandler(
      createSceneTransitionHandler({
        sceneManager: manager,
        pixelRatioController,
        now: () => 0,
      }),
    );

    await manager.requestTransition('title');
    await manager.requestTransition('stage', { stageNumber: 1, totalScore: 0, totalStarCount: 0 });
    await flushPromises();
    await flushPromises();

    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-load-failure-overlay]')).not.toBeNull();

    const retryButton = document.querySelector('[data-load-failure-primary]') as HTMLButtonElement;
    retryButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();

    expect(document.querySelector('[data-load-failure-overlay]')).toBeNull();
    expect(log).toEqual([
      { type: 'title', context: {} },
      { type: 'stage', context: { stageNumber: 1, totalScore: 0, totalStarCount: 0 } },
    ]);
    expect(manager.getCurrentType()).toBe('stage');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to transition to stage', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('shows retry UI after ending lazy-load failure and retries successfully on "もういちど"', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    const loadFailureOverlay = new LoadFailureOverlay();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const pixelRatioController = {
      reset: vi.fn(),
      notifyResume: vi.fn(),
    };
    const loadEndingModule = createRetryableModuleLoader(
      vi.fn<() => Promise<{ EndingScene: string }>>()
        .mockRejectedValueOnce(new Error('ending chunk failed'))
        .mockResolvedValueOnce({ EndingScene: 'loaded' }),
    );

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerScene('stage', createTrackingScene(log, 'stage'));
    manager.registerSceneFactory('ending', async () => {
      await loadEndingModule();
      return createTrackingScene(log, 'ending');
    });
    manager.setLoadStateHandler((isLoading, sceneType) => {
      if (isLoading) {
        loadingOverlay.show(
          sceneType === 'ending'
            ? 'さいごの じゅんび ちゅう...'
            : 'たびの じゅんび ちゅう...',
        );
        return;
      }
      loadingOverlay.hide();
    });
    manager.setTransitionErrorHandler((error, sceneType, context) => {
      console.error(`Failed to transition to ${sceneType}`, error);
      loadingOverlay.hide();
      if (sceneType !== 'stage' && sceneType !== 'ending') {
        return;
      }
      loadFailureOverlay.show({
        primaryAction: {
          label: 'もういちど',
          onSelect: () => manager.requestTransition(sceneType, context),
        },
        secondaryAction: {
          label: 'タイトルへ',
          onSelect: () => manager.requestTransition('title'),
        },
      });
    });
    manager.setTransitionHandler(
      createSceneTransitionHandler({
        sceneManager: manager,
        pixelRatioController,
        now: () => 0,
      }),
    );

    await manager.requestTransition('title');
    await manager.requestTransition('stage', { stageNumber: TOTAL_STAGES, totalScore: 9000, totalStarCount: 72 });
    await manager.requestTransition('ending', { totalScore: 9000, totalStarCount: 72 });
    await flushPromises();
    await flushPromises();

    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-load-failure-overlay]')).not.toBeNull();

    const retryButton = document.querySelector('[data-load-failure-primary]') as HTMLButtonElement;
    retryButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();

    expect(document.querySelector('[data-load-failure-overlay]')).toBeNull();
    expect(log).toEqual([
      { type: 'title', context: {} },
      { type: 'stage', context: { stageNumber: TOTAL_STAGES, totalScore: 9000, totalStarCount: 72 } },
      { type: 'ending', context: { totalScore: 9000, totalStarCount: 72 } },
    ]);
    expect(manager.getCurrentType()).toBe('ending');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to transition to ending', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
