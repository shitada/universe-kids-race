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
  options: { initialPixelTier?: number } = {},
) {
  vi.resetModules();
  document.body.innerHTML = '<canvas id="game-canvas"></canvas><div id="hud"></div><div id="ui-overlay"></div>';

  const loaderCalls = {
    title: 0,
    stage: 0,
    ending: 0,
  };
  let loaderIndex = 0;
  const initialPixelTier = options.initialPixelTier ?? 0;
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
      isPaused = vi.fn(() => false);
    },
  }));

  vi.doMock('../../src/game/systems/InputSystem', () => ({
    InputSystem: class {
      setup = vi.fn();
      notifyResize = vi.fn();
    },
  }));

  vi.doMock('../../src/game/storage/SaveManager', () => ({
    SaveManager: class {
      isFreshSession(): boolean {
        return false;
      }

      resetSessionDataPreservingMuted = vi.fn();

      load() {
        return {
          muted: false,
          clearedStage: 0,
          unlockedPlanets: [1],
          lastStablePixelTier: null,
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

  vi.doMock('../../src/game/utils/createResizeCoalescer', () => ({
    createResizeCoalescer: (cb: (width: number, height: number) => void) => ({
      schedule: (width: number, height: number) => cb(width, height),
      flush: vi.fn(),
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
      },
    ),
  }));

  vi.doMock('../../src/game/utils/createVisibilityPauseHandler', () => ({
    createVisibilityPauseHandler: vi.fn(),
  }));

  vi.doMock('../../src/game/utils/createRenderer', () => ({
    createRenderer: () => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      setClearColor: vi.fn(),
      render: vi.fn(),
    }),
  }));

  vi.doMock('../../src/game/utils/getViewportSize', () => ({
    getViewportSize: () => ({ width: 1024, height: 768 }),
    subscribeViewportResize: vi.fn(),
  }));

  vi.doMock('../../src/game/utils/resolveInitialPixelTier', () => ({
    resolveInitialPixelTier: () => initialPixelTier,
  }));

  vi.doMock('../../src/game/utils/createOrientationHintHandler', () => ({
    createOrientationHintHandler: () => ({
      evaluate: vi.fn(),
    }),
  }));

  vi.doMock('../../src/game/utils/createRetryableModuleLoader', () => ({
    createRetryableModuleLoader: (loadModule: () => Promise<unknown>) => {
      const sceneType = (['title', 'stage', 'ending'] as const)[loaderIndex++] ?? 'ending';
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

      override enter(): void {
        this.overlay = document.createElement('div');
        this.overlay.setAttribute('data-next-adventure-card', '');
        this.overlay.textContent = 'title ready';
        document.getElementById('ui-overlay')?.appendChild(this.overlay);
      }

      override exit(): void {
        this.overlay?.remove();
        this.overlay = null;
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

  it('does not prefetch stage before title transition finishes', async () => {
    const titleReady = createDeferred();

    const { loaderCalls } = await bootMain([() => titleReady.promise]);

    await vi.advanceTimersByTimeAsync(1000);
    expect(loaderCalls.stage).toBe(0);
    expect(document.querySelector('[data-next-adventure-card]')).toBeNull();

    titleReady.resolve();
    await flushPromises();

    expect(document.querySelector('[data-next-adventure-card]')).not.toBeNull();
    expect(loaderCalls.stage).toBe(0);

    await vi.advanceTimersByTimeAsync(800);
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
});
