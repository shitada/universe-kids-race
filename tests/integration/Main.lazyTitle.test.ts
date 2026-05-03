// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

async function flushPromises(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await vi.dynamicImportSettled();
  await Promise.resolve();
}

type LoaderBehavior = () => Promise<void>;

async function bootMain(
  titleBehaviors: LoaderBehavior[],
  options: {
    initialPixelTier?: number;
    freshSession?: boolean;
    initialSaveData?: {
      muted?: boolean;
      clearedStage?: number;
      unlockedPlanets?: number[];
      lastStablePixelTier?: number | null;
      tutorialShown?: boolean;
    };
  } = {},
) {
  vi.resetModules();
  document.body.innerHTML = '<canvas id="game-canvas"></canvas><div id="hud"></div><div id="ui-overlay"></div>';

  const loaderCalls = {
    boot: 0,
    title: 0,
    stage: 0,
    ending: 0,
  };
  let loaderIndex = 0;
  const initialPixelTier = options.initialPixelTier ?? 0;
  const saveState = {
    muted: options.initialSaveData?.muted ?? false,
    clearedStage: options.initialSaveData?.clearedStage ?? 0,
    unlockedPlanets: options.initialSaveData?.unlockedPlanets ?? [1],
    lastStablePixelTier: options.initialSaveData?.lastStablePixelTier ?? null,
    tutorialShown: options.initialSaveData?.tutorialShown ?? true,
  };
  const adaptiveState: {
    onTierChange: ((tier: number) => void) | null;
    resetToTier: ReturnType<typeof vi.fn> | null;
  } = {
    onTierChange: null,
    resetToTier: null,
  };
  const contextLossState: {
    callbacks: { onLost: () => void; onRestored: () => void } | null;
  } = { callbacks: null };

  class MockScene {
    protected readonly scene = new THREE.Scene();
    protected readonly camera = new THREE.PerspectiveCamera();

    enter(): void {}

    update(): void {}

    exit(): void {}

    getThreeScene(): THREE.Scene {
      return this.scene;
    }

    getCamera(): THREE.PerspectiveCamera {
      return this.camera;
    }
  }

  vi.doMock('../../src/game/GameLoop', () => ({
    GameLoop: class {
      start = vi.fn();
      pause = vi.fn();
      resume = vi.fn();
      stop = vi.fn();
      isPaused = vi.fn(() => false);
    },
  }));

  vi.doMock('../../src/game/systems/InputSystem', () => ({
    InputSystem: class {
      setup = vi.fn();
      notifyResize = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../src/game/storage/SaveManager', () => ({
    SaveManager: class {
      isFreshSession(): boolean {
        return options.freshSession ?? false;
      }

      resetSessionDataPreservingMuted = vi.fn(() => {
        saveState.clearedStage = 0;
        saveState.unlockedPlanets = [];
        saveState.tutorialShown = false;
      });

      load() {
        return {
          muted: saveState.muted,
          clearedStage: saveState.clearedStage,
          unlockedPlanets: [...saveState.unlockedPlanets],
          lastStablePixelTier: saveState.lastStablePixelTier,
          tutorialShown: saveState.tutorialShown,
        };
      }

      saveLastStablePixelTier = vi.fn();
    },
  }));

  vi.doMock('../../src/game/audio/AudioManager', () => ({
    AudioManager: class {
      setMuted = vi.fn();
      ensureResumed = vi.fn();
      suspend = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../src/game/utils/AdaptivePixelRatioController', () => ({
    AdaptivePixelRatioController: class {
      resetToTier = vi.fn();

      constructor(_maxTier: number, onTierChange: (tier: number) => void) {
        adaptiveState.onTierChange = onTierChange;
        adaptiveState.resetToTier = this.resetToTier;
      }
      sample = vi.fn();
      notifyResume = vi.fn();
      reset = vi.fn();
    },
  }));

  vi.doMock('../../src/game/utils/ResizeCoalescer', () => ({
    createResizeCoalescer: (cb: (width: number, height: number) => void) => ({
      schedule: (width: number, height: number) => cb(width, height),
      flush: vi.fn(),
      dispose: vi.fn(),
    }),
  }));

  vi.doMock('../../src/game/utils/createSceneTransitionHandler', () => ({
    createSceneTransitionHandler:
      ({ sceneManager }: { sceneManager: { transitionTo: (sceneType: string, context?: object) => Promise<void> } }) =>
      (sceneType: string, context?: object) =>
        sceneManager.transitionTo(sceneType, context),
  }));

  vi.doMock('../../src/game/utils/createWebGLContextLossHandler', () => ({
    createWebGLContextLossHandler: vi.fn(
      (_canvas: HTMLCanvasElement, callbacks: { onLost: () => void; onRestored: () => void }) => {
        contextLossState.callbacks = callbacks;
        return () => {};
      },
    ),
  }));

  vi.doMock('../../src/game/utils/createVisibilityPauseHandler', () => ({
    createVisibilityPauseHandler: vi.fn(() => () => {}),
  }));

  vi.doMock('../../src/game/utils/createRenderer', () => ({
    createRenderer: () => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      setClearColor: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
    }),
  }));

  vi.doMock('../../src/game/utils/getViewportSize', () => ({
    getViewportSize: () => ({ width: 1024, height: 768 }),
    updateViewportSizeCache: () => ({ width: 1024, height: 768 }),
    subscribeViewportResize: vi.fn(() => () => {}),
  }));

  vi.doMock('../../src/game/utils/resolveInitialPixelTier', () => ({
    resolveInitialPixelTier: () => initialPixelTier,
  }));

  vi.doMock('../../src/game/utils/createOrientationHintHandler', () => ({
    createOrientationHintHandler: () => ({
      evaluate: vi.fn(),
      dispose: vi.fn(),
    }),
  }));

  vi.doMock('../../src/game/utils/createRetryableModuleLoader', () => ({
    createRetryableModuleLoader: (loadModule: () => Promise<unknown>) => {
      const sceneType = (['boot', 'title', 'stage', 'ending'] as const)[loaderIndex++] ?? 'ending';
      let modulePromise: Promise<unknown> | null = null;
      let attempt = 0;

      return () => {
        if (modulePromise) {
          return modulePromise;
        }

        loaderCalls[sceneType] += 1;
        modulePromise = (async () => {
          if (sceneType === 'title') {
            const behavior = titleBehaviors[attempt++] ?? (async () => {});
            await behavior();
          }
          return loadModule();
        })().catch((error: unknown) => {
          modulePromise = null;
          throw error;
        });

        return modulePromise;
      };
    },
  }));

  vi.doMock('../../src/ui/ContextLossOverlay', () => ({
    ContextLossOverlay: class {
      show = vi.fn();
      hide = vi.fn();
    },
  }));

  vi.doMock('../../src/ui/ResumeOverlay', () => ({
    ResumeOverlay: class {
      show = vi.fn();
      hide = vi.fn();
    },
  }));

  vi.doMock('../../src/ui/OrientationHintOverlay', () => ({
    OrientationHintOverlay: class {
      show = vi.fn();
      hide = vi.fn();
    },
  }));

  vi.doMock('../../src/game/scenes/TitleScene', () => ({
    TitleScene: class extends MockScene {
      private overlay: HTMLDivElement | null = null;
      private tutorialOverlay: HTMLDivElement | null = null;

      constructor(
        _sceneManager: unknown,
        private readonly saveManager: { load: () => { tutorialShown?: boolean } },
      ) {
        super();
      }

      override enter(): void {
        this.overlay = document.createElement('div');
        this.overlay.setAttribute('data-next-adventure-card', '');
        this.overlay.textContent = 'title ready';
        document.getElementById('ui-overlay')?.appendChild(this.overlay);
        if (!this.saveManager.load().tutorialShown) {
          this.tutorialOverlay = document.createElement('div');
          this.tutorialOverlay.setAttribute('data-tutorial-overlay', '');
          document.getElementById('ui-overlay')?.appendChild(this.tutorialOverlay);
        }
      }

      override exit(): void {
        this.overlay?.remove();
        this.overlay = null;
        this.tutorialOverlay?.remove();
        this.tutorialOverlay = null;
      }
    },
  }));

  vi.doMock('../../src/game/scenes/StageScene', () => ({
    StageScene: class extends MockScene {
      setVisualQualityTier = vi.fn();
      isPlaying = vi.fn(() => false);
      requestResumeCountdown = vi.fn();
    },
  }));

  vi.doMock('../../src/game/scenes/EndingScene', () => ({
    EndingScene: class extends MockScene {},
  }));

  await import('../../src/main');
  await flushPromises();

  return { loaderCalls, adaptiveState, contextLossState };
}

describe('Main lazy title bootstrap', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('shows loading overlay before lazy title resolves, then displays title UI', async () => {
    const titleReady = createDeferred();

    const { loaderCalls } = await bootMain([() => titleReady.promise]);

    expect(loaderCalls.title).toBe(1);
    expect(loaderCalls.stage).toBe(0);
    expect(document.querySelector('[data-loading-overlay]')?.textContent).toContain('タイトルの じゅんび ちゅう...');
    expect(document.querySelector('[data-next-adventure-card]')).toBeNull();

    titleReady.resolve();
    await flushPromises();

    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-next-adventure-card]')).not.toBeNull();
  });

  it('shows retry overlay after title lazy-load failure and recovers on retry', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { loaderCalls } = await bootMain([
      async () => {
        throw new Error('title chunk failed');
      },
      async () => {},
    ]);
    await flushPromises();

    const failureOverlay = document.querySelector('[data-load-failure-overlay]');
    expect(loaderCalls.title).toBe(1);
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(failureOverlay?.textContent).toContain('タイトルの じゅんびが できなかったよ');
    expect(document.querySelector('[data-load-failure-secondary]')).toBeNull();

    (document.querySelector('[data-load-failure-primary]') as HTMLButtonElement).dispatchEvent(
      new Event('pointerdown', { bubbles: true }),
    );
    await flushPromises();

    expect(loaderCalls.title).toBe(2);
    expect(document.querySelector('[data-load-failure-overlay]')).toBeNull();
    expect(document.querySelector('[data-next-adventure-card]')).not.toBeNull();

    consoleErrorSpy.mockRestore();
  });

  it('shows retry overlay after boot module import failure and recovers on retry', async () => {
    vi.resetModules();
    document.body.innerHTML = '';

    const bootstrapGameMock = vi.fn(async () => ({
      dispose: vi.fn(),
    }));
    const loadBootstrapModule = vi
      .fn<() => Promise<{ bootstrapGame: typeof bootstrapGameMock }>>()
      .mockRejectedValueOnce(new Error('boot chunk failed'))
      .mockResolvedValueOnce({ bootstrapGame: bootstrapGameMock });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const mainModule = await import('../../src/main');

    document.body.innerHTML = '<canvas id="game-canvas"></canvas><div id="hud"></div><div id="ui-overlay"></div>';
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    void mainModule.startMainBootstrap({ canvas, loadBootstrapModule });
    await flushPromises();

    expect(loadBootstrapModule).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-load-failure-overlay]')?.textContent).toContain(
      'ゲームの じゅんびが できなかったよ',
    );

    (document.querySelector('[data-load-failure-primary]') as HTMLButtonElement).dispatchEvent(
      new Event('pointerdown', { bubbles: true }),
    );
    await flushPromises();

    expect(loadBootstrapModule).toHaveBeenCalledTimes(2);
    expect(document.querySelector('[data-load-failure-overlay]')).toBeNull();
    expect(bootstrapGameMock).toHaveBeenCalledWith(
      expect.objectContaining({
        canvas,
      }),
    );

    consoleErrorSpy.mockRestore();
  });

  it('disposes the previous boot session before starting a new main bootstrap', async () => {
    vi.resetModules();
    document.body.innerHTML = '';

    const firstHandle = { dispose: vi.fn() };
    const secondHandle = { dispose: vi.fn() };
    const bootstrapGameMock = vi
      .fn()
      .mockResolvedValueOnce(firstHandle)
      .mockResolvedValueOnce(secondHandle);
    const loadBootstrapModule = vi.fn().mockResolvedValue({ bootstrapGame: bootstrapGameMock });

    const mainModule = await import('../../src/main');

    document.body.innerHTML = '<canvas id="game-canvas"></canvas><div id="hud"></div><div id="ui-overlay"></div>';
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

    const firstBoot = mainModule.startMainBootstrap({ canvas, loadBootstrapModule });
    await flushPromises();
    await expect(firstBoot).resolves.toBe(firstHandle);
    expect(firstHandle.dispose).not.toHaveBeenCalled();

    const secondBoot = mainModule.startMainBootstrap({ canvas, loadBootstrapModule });
    await flushPromises();

    await expect(secondBoot).resolves.toBe(secondHandle);
    expect(firstHandle.dispose).toHaveBeenCalledTimes(1);
    expect(secondHandle.dispose).not.toHaveBeenCalled();
  });

  it('starts stage prefetch right after title transition finishes', async () => {
    const titleReady = createDeferred();

    const { loaderCalls } = await bootMain([() => titleReady.promise]);

    await vi.advanceTimersByTimeAsync(1000);
    expect(loaderCalls.stage).toBe(0);
    expect(document.querySelector('[data-next-adventure-card]')).toBeNull();

    titleReady.resolve();
    await flushPromises();

    expect(document.querySelector('[data-next-adventure-card]')).not.toBeNull();
    expect(loaderCalls.stage).toBe(1);
  });

  it('wires WebGL restore to the current stable pixel tier instead of MAX_TIER', async () => {
    const { adaptiveState, contextLossState } = await bootMain([async () => {}], {
      initialPixelTier: 2,
    });

    expect(contextLossState.callbacks).not.toBeNull();

    adaptiveState.onTierChange?.(1);
    contextLossState.callbacks?.onRestored();

    expect(adaptiveState.resetToTier).toHaveBeenCalledWith(1);
  });

  it('re-shows the tutorial after a fresh Safari session resets tutorialShown', async () => {
    await bootMain([async () => {}], {
      freshSession: true,
      initialSaveData: {
        tutorialShown: true,
        clearedStage: 4,
        unlockedPlanets: [1, 2, 3, 4],
      },
    });

    expect(document.querySelector('[data-next-adventure-card]')).not.toBeNull();
    expect(document.querySelector('[data-tutorial-overlay]')).not.toBeNull();
  });
});
