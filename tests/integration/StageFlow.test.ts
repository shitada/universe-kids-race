// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SceneManager } from '../../src/game/SceneManager';
import type { Scene, SceneContext, SceneType } from '../../src/types';
import * as THREE from 'three';
import { StageScene } from '../../src/game/scenes/StageScene';
import { EndingScene } from '../../src/game/scenes/EndingScene';
import { TitleScene } from '../../src/game/scenes/TitleScene';
import { TOTAL_STAGES } from '../../src/game/config/StageConfig';
import { getStageConfig } from '../../src/game/config/StageConfig';
import { InputSystem as RuntimeInputSystem } from '../../src/game/systems/InputSystem';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import type { SaveData } from '../../src/types';
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

  it('retrying a cleared stage keeps cumulative totals at the stage-entry baseline until the replay is cleared', async () => {
    const manager = new SceneManager();
    const transitionLog: { type: SceneType; context: SceneContext }[] = [];
    manager.setTransitionHandler((sceneType, context = {}) => {
      transitionLog.push({ type: sceneType, context });
      return manager.transitionTo(sceneType, context);
    });

    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
      resetPointers: vi.fn(),
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
      unlockedPlanets: [] as number[],
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
      save: vi.fn((nextData: SaveData) => {
        saveState.clearedStage = nextData.clearedStage;
        saveState.unlockedPlanets = [...nextData.unlockedPlanets];
        saveState.muted = nextData.muted ?? false;
        saveState.tutorialShown = nextData.tutorialShown ?? false;
        saveState.bestStageStars = { ...(nextData.bestStageStars ?? {}) };
      }),
      clear: vi.fn(),
      markStageCleared: vi.fn((stageNumber: number) => {
        const wasUnlocked = saveState.unlockedPlanets.includes(stageNumber);
        saveState.clearedStage = Math.max(saveState.clearedStage, stageNumber);
        if (!wasUnlocked) {
          saveState.unlockedPlanets = [...saveState.unlockedPlanets, stageNumber];
          return true;
        }
        return false;
      }),
      updateBestStageStars: vi.fn((stageNumber: number, starCount: number) => {
        const current = saveState.bestStageStars[stageNumber] ?? 0;
        if (starCount > current) {
          saveState.bestStageStars = {
            ...saveState.bestStageStars,
            [stageNumber]: starCount,
          };
        }
      }),
    } as unknown as SaveManager;

    let stageScene: StageScene | null = null;
    manager.registerSceneFactory('stage', async () => {
      stageScene ??= new StageScene(manager, inputSystem, audioManager, saveManager);
      return stageScene;
    });

    await manager.transitionTo('stage', { stageNumber: 3, totalScore: 1000, totalStarCount: 10 });

    const internal = stageScene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      scoreSystem: {
        getStageScore(): number;
        getStarCount(): number;
        getTotalScore(): number;
        getTotalStarCount(): number;
        setTotalScore(score: number): void;
        setTotalStarCount(count: number): void;
        resetStage(): void;
        finalizeStage(): { totalScore: number; totalStarCount: number };
      };
      onStageClear(): void;
      update(deltaTime: number): void;
    };
    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    let stageScore = 400;
    let starCount = 2;
    let totalScore = 1000;
    let totalStarCount = 10;
    internal.scoreSystem = {
      getStageScore: () => stageScore,
      getStarCount: () => starCount,
      getTotalScore: () => totalScore,
      getTotalStarCount: () => totalStarCount,
      setTotalScore: (score: number) => {
        totalScore = score;
      },
      setTotalStarCount: (count: number) => {
        totalStarCount = count;
      },
      resetStage: () => {
        stageScore = 0;
        starCount = 0;
      },
      finalizeStage: () => {
        totalScore += stageScore;
        totalStarCount += starCount;
        const result = { totalScore, totalStarCount };
        stageScore = 0;
        starCount = 0;
        return result;
      },
    };

    internal.onStageClear();
    internal.update(1);

    const retryButton = document.querySelector('[data-stage-clear-retry]') as HTMLButtonElement | null;
    expect(retryButton).toBeTruthy();
    retryButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    expect(transitionLog.at(-1)).toEqual({
      type: 'stage',
      context: { stageNumber: 3, totalScore: 1000, totalStarCount: 10, replayToken: expect.any(Number) },
    });
    expect(totalScore).toBe(1000);
    expect(totalStarCount).toBe(10);
    expect(saveState.bestStageStars[3]).toBe(2);

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
    stageScore = 500;
    starCount = 5;

    internal.onStageClear();
    internal.update(1);

    const continueButton = document.querySelector('[data-stage-clear-continue]') as HTMLButtonElement | null;
    expect(continueButton).toBeTruthy();
    continueButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    expect(transitionLog.at(-1)).toEqual({
      type: 'stage',
      context: { stageNumber: 4, totalScore: 1500, totalStarCount: 15 },
    });
    expect(saveState.bestStageStars[3]).toBe(5);
    expect(saveState.clearedStage).toBe(3);
  });

  it('matches the title next-adventure preview with the stage started by "あそぶ"', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    const saveManager = {
      load: vi.fn(() => ({
        clearedStage: 4,
        unlockedPlanets: [1, 2, 3, 4],
        muted: false,
        tutorialShown: true,
        bestStageStars: {},
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markTutorialShown: vi.fn(),
    } as unknown as SaveManager;
    const audioManager = {
      initSync: vi.fn(),
      isInitialized: vi.fn(() => true),
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      ensureResumed: vi.fn(),
      dispose: vi.fn(),
    } as unknown as AudioManager;

    manager.registerScene('title', new TitleScene(manager, saveManager, audioManager));
    manager.registerScene('stage', createTrackingScene(log, 'stage'));

    await manager.transitionTo('title');

    const card = document.querySelector('[data-next-adventure-card]') as HTMLDivElement | null;
    expect(card).toBeTruthy();
    expect(card?.getAttribute('data-next-stage-number')).toBe('5');
    expect(card?.getAttribute('data-next-stage-destination')).toBe('木星');

    const playButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'あそぶ',
    ) as HTMLButtonElement | undefined;
    expect(playButton).toBeTruthy();

    playButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    expect(log.at(-1)?.type).toBe('stage');
    expect(log.at(-1)?.context.stageNumber).toBe(5);
    expect(getStageConfig(log.at(-1)?.context.stageNumber ?? 0).destination).toBe(
      card?.getAttribute('data-next-stage-destination'),
    );
  });

  it('keeps the all-clear title preview after ending resets clearedStage to 0', async () => {
    const manager = new SceneManager();
    const saveState = {
      clearedStage: TOTAL_STAGES,
      unlockedPlanets: Array.from({ length: TOTAL_STAGES }, (_, index) => index + 1),
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
      save: vi.fn((nextData: SaveData) => {
        saveState.clearedStage = nextData.clearedStage;
        saveState.unlockedPlanets = [...nextData.unlockedPlanets];
        saveState.muted = nextData.muted ?? false;
        saveState.tutorialShown = nextData.tutorialShown ?? false;
        saveState.bestStageStars = { ...(nextData.bestStageStars ?? {}) };
      }),
      clear: vi.fn(),
      resetProgressPreservingSettings: vi.fn(),
      markTutorialShown: vi.fn(() => {
        saveState.tutorialShown = true;
      }),
    } as unknown as SaveManager;
    const audioManager = {
      initSync: vi.fn(),
      isInitialized: vi.fn(() => true),
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      ensureResumed: vi.fn(),
      dispose: vi.fn(),
    } as unknown as AudioManager;

    manager.registerScene(
      'title',
      new TitleScene(manager, saveManager, audioManager, {
        scheduleIdleTask: () => {},
        loadTitleCompanionFactory: async () => ({
          createCompanionMesh: () => new THREE.Group(),
        }),
      }),
    );
    manager.registerScene('ending', new EndingScene(manager, saveManager, audioManager));

    await manager.transitionTo('ending', { totalScore: 9000, totalStarCount: 72 });

    expect(saveState.clearedStage).toBe(0);

    for (let i = 0; i < 260; i++) {
      manager.update(0.01);
    }

    const endingOverlay = document.querySelector('[data-ending-overlay]') as HTMLDivElement | null;
    const exitCta = document.querySelector('[data-ending-exit-cta]') as HTMLDivElement | null;
    expect(endingOverlay).toBeTruthy();
    expect(exitCta?.textContent).toContain('どこでもタップでタイトルへ');

    endingOverlay!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    expect(manager.getCurrentType()).toBe('title');

    const card = document.querySelector('[data-next-adventure-card]') as HTMLDivElement | null;
    const hint = document.querySelector('[data-play-button-hint]') as HTMLDivElement | null;
    expect(card?.getAttribute('data-next-stage-number')).toBe('1');
    expect(card?.getAttribute('data-next-stage-destination')).toBe('月');
    expect(card?.textContent).toContain('ぜんぶ クリア');
    expect(hint?.textContent).toContain('ステージ 1');
    expect(hint?.textContent).toContain('もういちど');
    expect(document.querySelector('[data-reset-progress-button]')?.textContent).toBe('さいしょから');
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

  it('does not carry touch movement or HUD boost into the title → stage transition', async () => {
    const manager = new SceneManager();
    const canvas = document.createElement('canvas');
    Object.defineProperty(canvas, 'clientWidth', { value: 1024 });
    document.body.appendChild(canvas);

    const inputSystem = new RuntimeInputSystem();
    inputSystem.setup(canvas);

    const playSFX = vi.fn();
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX,
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
        unlockedPlanets: [1],
        muted: false,
        tutorialShown: true,
        bestStageStars: {},
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;

    manager.registerScene('title', createTrackingScene([], 'title'));

    let stageScene: StageScene | null = null;
    manager.registerSceneFactory('stage', async () => {
      stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
      return stageScene;
    });

    try {
      canvas.setPointerCapture = canvas.setPointerCapture ?? (() => {});
      canvas.dispatchEvent(new PointerEvent('pointerdown', { clientX: 100, pointerId: 1, bubbles: true }));
      inputSystem.setBoostPressed(true);
      expect(inputSystem.getState()).toEqual({ moveDirection: -1, boostPressed: true });

      await manager.transitionTo('title');
      await manager.transitionTo('stage', { stageNumber: 1 });
      expect(inputSystem.getState()).toEqual({ moveDirection: 0, boostPressed: false });

      const internal = stageScene as unknown as {
        countdownOverlay: { dispose(): void } | null;
        isStarting: boolean;
        update(deltaTime: number): void;
      };
      internal.countdownOverlay?.dispose();
      internal.countdownOverlay = null;
      internal.isStarting = false;

      playSFX.mockClear();
      internal.update(0.016);
      const sfxNames = playSFX.mock.calls.map((call) => call[0]);
      expect(sfxNames).not.toContain('boost');
      expect(sfxNames).not.toContain('boostDenied');
    } finally {
      inputSystem.dispose();
      canvas.remove();
    }
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

  it('uses the retry CTA to replay the same stage', async () => {
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

    await manager.transitionTo('stage', { stageNumber: 3, totalScore: 500, totalStarCount: 4 });

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
    expect(internal.stageNumber).toBe(3);

    const retryButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-retry]');
    expect(retryButton?.textContent).toBe('もういちど');
    retryButton!.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await Promise.resolve();
    await Promise.resolve();

    expect(manager.getCurrentType()).toBe('stage');
    expect(internal.stageNumber).toBe(3);
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

  it('starts ending module prefetch from the penultimate stage and reuses it on the final stage', async () => {
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

    await manager.transitionTo('stage', { stageNumber: TOTAL_STAGES - 2 });
    expect(endingModulePrefetcher).not.toHaveBeenCalled();
    expect(endingFactory).not.toHaveBeenCalled();

    await manager.transitionTo('stage', { stageNumber: TOTAL_STAGES - 1 });
    expect(endingModulePrefetcher).toHaveBeenCalledTimes(1);
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

  it('keeps normal play unchanged and enables assist only after consecutive meteorite hits', () => {
    const manager = new SceneManager();
    const inputState = { moveDirection: 0, boostPressed: false };
    const inputSystem = {
      getState: vi.fn(() => inputState),
      setBoostPressed: vi.fn((value: boolean) => {
        inputState.boostPressed = value;
      }),
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
    const scene = new StageScene(manager, inputSystem, audioManager, saveManager);

    scene.enter({ stageNumber: 9 });

    const internal = scene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      collisionSystem: { check: (...args: unknown[]) => unknown };
      spawnSystem: { getMeteoriteIntervalMultiplier: () => number };
      update: (dt: number) => void;
    };
    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    let checks = 0;
    internal.collisionSystem = {
      check: () => {
        checks += 1;
        if (checks === 2) {
          return {
            starCollisions: [],
            meteoriteCollision: true,
            meteoriteHit: { isActive: true, mesh: { visible: true }, position: { x: 0, y: 0, z: -30 } },
          };
        }
        if (checks === 3) {
          return {
            starCollisions: [],
            meteoriteCollision: true,
            meteoriteHit: { isActive: true, mesh: { visible: true }, position: { x: 1, y: 0, z: -35 } },
          };
        }
        return { starCollisions: [], meteoriteCollision: false, meteoriteHit: null };
      },
    };

    internal.update(0.5);
    expect(internal.spawnSystem.getMeteoriteIntervalMultiplier()).toBe(1);
    expect((document.querySelector('[data-hud-assist-message]') as HTMLElement | null)?.style.display).toBe('none');

    internal.update(0.016);
    expect(internal.spawnSystem.getMeteoriteIntervalMultiplier()).toBe(1);
    expect((document.querySelector('[data-hud-assist-message]') as HTMLElement | null)?.style.display).toBe('none');

    internal.update(5.0);
    expect(internal.spawnSystem.getMeteoriteIntervalMultiplier()).toBeGreaterThan(1);
    expect(document.querySelector('[data-hud-assist-message]')?.textContent).toBe('だいじょうぶ！ ゆっくりいこう ✨');
  });
});
