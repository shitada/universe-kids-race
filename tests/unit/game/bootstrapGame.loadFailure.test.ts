// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import type { LoadFailureOverlayOptions } from '../../../src/ui/LoadFailureOverlay';

type SceneType = 'title' | 'stage' | 'ending';

interface SetupResult {
  sceneManagerInstance: {
    requestTransition: (sceneType: SceneType, context?: object) => Promise<void>;
  };
  failureOptions: LoadFailureOverlayOptions[];
}

async function flushPromises(): Promise<void> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

async function setupBootstrap(failingSceneType: SceneType): Promise<SetupResult> {
  vi.resetModules();
  document.body.innerHTML = '<canvas id="game-canvas"></canvas><div id="hud"></div><div id="ui-overlay"></div>';
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  Object.defineProperty(canvas, 'clientWidth', {
    configurable: true,
    get: () => 1024,
  });
  canvas.getBoundingClientRect = () =>
    ({
      left: 0,
      width: 1024,
      right: 1024,
      top: 0,
      bottom: 768,
      height: 768,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;

  let sceneManagerInstance: SetupResult['sceneManagerInstance'] | null = null;
  const failureOptions: LoadFailureOverlayOptions[] = [];
  let titleSceneCreateCount = 0;

  class MockSceneManager {
    private readonly factories = new Map<SceneType, () => Promise<unknown> | unknown>();
    private currentType: SceneType | null = null;
    private transitionHandler:
      | ((sceneType: SceneType, context?: object) => Promise<void> | void)
      | null = null;
    private transitionErrorHandler:
      | ((error: unknown, sceneType: SceneType, context?: object) => void)
      | null = null;

    registerSceneFactory(type: SceneType, factory: () => Promise<unknown> | unknown): void {
      this.factories.set(type, factory);
    }

    registerSceneModulePrefetch(): void {}

    setLoadStateHandler(): void {}

    setTransitionErrorHandler(
      handler: (error: unknown, sceneType: SceneType, context?: object) => void,
    ): void {
      this.transitionErrorHandler = handler;
    }

    setTransitionHandler(
      handler: (sceneType: SceneType, context?: object) => Promise<void> | void,
    ): void {
      this.transitionHandler = handler;
    }

    async performTransition(sceneType: SceneType, context: object = {}): Promise<void> {
      try {
        const factory = this.factories.get(sceneType);
        if (!factory) {
          throw new Error(`Missing factory for ${sceneType}`);
        }
        const scene = await factory();
        this.currentType = sceneType;
        (
          scene as {
            enter?: (context?: object) => void;
          }
        ).enter?.(context);
      } catch (error) {
        this.transitionErrorHandler?.(error, sceneType, context);
      }
    }

    async requestTransition(sceneType: SceneType, context: object = {}): Promise<void> {
      if (this.transitionHandler) {
        await this.transitionHandler(sceneType, context);
        return;
      }
      await this.performTransition(sceneType, context);
    }

    prefetchSceneModule(): Promise<void> {
      return Promise.resolve();
    }

    getCurrentType(): SceneType | null {
      return this.currentType;
    }

    update(): void {}

    getCurrentThreeScene(): THREE.Scene | null {
      return new THREE.Scene();
    }

    getCurrentCamera(): THREE.Camera | null {
      return new THREE.PerspectiveCamera();
    }

    dispose(): void {
      this.currentType = null;
    }
  }

  vi.doMock('../../../src/game/SceneManager', () => ({
    SceneManager: class extends MockSceneManager {
      constructor() {
        super();
        sceneManagerInstance = this as unknown as SetupResult['sceneManagerInstance'];
      }
    },
  }));

  vi.doMock('../../../src/game/GameLoop', () => ({
    GameLoop: class {
      start = vi.fn();
      pause = vi.fn();
      resume = vi.fn();
      stop = vi.fn();
      isPaused = vi.fn(() => false);
    },
  }));

  vi.doMock('../../../src/game/systems/InputSystem', () => ({
    InputSystem: class {
      setup = vi.fn();
      notifyResize = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/storage/SaveManager', () => ({
    SaveManager: class {
      getSessionState = vi.fn(() => 'existing');
      resetSessionDataPreservingMuted = vi.fn();
      load = vi.fn(() => ({
        muted: false,
        lastStablePixelTier: 0,
      }));
      saveLastStablePixelTier = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/audio/AudioManager', () => ({
    AudioManager: class {
      setMuted = vi.fn();
      setBGMVolume = vi.fn();
      setSFXVolume = vi.fn();
      ensureResumed = vi.fn();
      suspend = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/AdaptivePixelRatioController', () => ({
    AdaptivePixelRatioController: class {
      sample = vi.fn();
      notifyResume = vi.fn();
      resetToTier = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/ResizeCoalescer', () => ({
    createResizeCoalescer: (callback: (width: number, height: number) => void) => ({
      schedule: (width: number, height: number) => callback(width, height),
      flush: vi.fn(),
      dispose: vi.fn(),
    }),
  }));

  vi.doMock('../../../src/game/utils/createSceneTransitionHandler', () => ({
    createSceneTransitionHandler:
      ({ sceneManager }: { sceneManager: MockSceneManager }) =>
      (sceneType: SceneType, context?: object) =>
        sceneManager.performTransition(sceneType, context),
  }));

  vi.doMock('../../../src/game/utils/createWebGLContextLossHandler', () => ({
    createWebGLContextLossHandler: vi.fn(() => vi.fn()),
  }));

  vi.doMock('../../../src/game/utils/createWebGLContextRestoredHandler', () => ({
    createWebGLContextRestoredHandler: vi.fn(() => () => {}),
  }));

  vi.doMock('../../../src/game/utils/createVisibilityPauseHandler', () => ({
    createVisibilityPauseHandler: vi.fn(() => vi.fn()),
  }));

  vi.doMock('../../../src/game/utils/createRenderer', () => ({
    createRenderer: vi.fn(() => ({
      setPixelRatio: vi.fn(),
      setSize: vi.fn(),
      setClearColor: vi.fn(),
      render: vi.fn(),
      info: {
        memory: {
          textures: 0,
          geometries: 0,
        },
      },
      forceContextLoss: vi.fn(),
      dispose: vi.fn(),
    })),
  }));

  vi.doMock('../../../src/game/utils/getViewportSize', () => ({
    getViewportSize: vi.fn(() => ({ width: 1024, height: 768 })),
    subscribeViewportResize: vi.fn(() => vi.fn()),
    updateViewportSizeCache: vi.fn(() => ({ width: 1024, height: 768 })),
  }));

  vi.doMock('../../../src/game/utils/resolveInitialPixelTier', () => ({
    resolveInitialPixelTier: vi.fn(() => 0),
  }));

  vi.doMock('../../../src/game/utils/MemoryHealthMonitor', () => ({
    MemoryHealthMonitor: class {
      sample = vi.fn(() => ({ alert: null }));
      reset = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/ContextLossOverlay', () => ({
    ContextLossOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/ResumeOverlay', () => ({
    ResumeOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/ResumeGentlyOverlay', () => ({
    ResumeGentlyOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/OrientationHintOverlay', () => ({
    OrientationHintOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/MemoryPressureOverlay', () => ({
    MemoryPressureOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      isVisible = vi.fn(() => false);
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/createOrientationHintHandler', () => ({
    createOrientationHintHandler: vi.fn(() => ({
      evaluate: vi.fn(),
      dispose: vi.fn(),
    })),
  }));

  vi.doMock('../../../src/game/utils/createRetryableModuleLoader', () => ({
    createRetryableModuleLoader: (loader: () => Promise<unknown>) => loader,
  }));

  vi.doMock('../../../src/game/scenes/TitleScene', () => ({
    TitleScene: class {
      constructor() {
        titleSceneCreateCount += 1;
        if (failingSceneType === 'title' && titleSceneCreateCount > 1) {
          throw new Error('title scene failed');
        }
      }
      enter(): void {}
      exit(): void {}
      update(): void {}
      getThreeScene(): THREE.Scene {
        return new THREE.Scene();
      }
      getCamera(): THREE.Camera {
        return new THREE.PerspectiveCamera();
      }
    },
  }));

  vi.doMock('../../../src/game/scenes/StageScene', () => ({
    StageScene: class {
      constructor() {
        if (failingSceneType === 'stage') {
          throw new Error('stage scene failed');
        }
      }
      setPauseHandlers = vi.fn();
      setVisualQualityTier = vi.fn();
      requestResumeCountdown = vi.fn();
      isUserPaused = vi.fn(() => false);
      isPlaying = vi.fn(() => true);
      enter(): void {}
      exit(): void {}
      update(): void {}
      getThreeScene(): THREE.Scene {
        return new THREE.Scene();
      }
      getCamera(): THREE.Camera {
        return new THREE.PerspectiveCamera();
      }
    },
  }));

  vi.doMock('../../../src/game/scenes/EndingScene', () => ({
    EndingScene: class {
      constructor() {
        if (failingSceneType === 'ending') {
          throw new Error('ending scene failed');
        }
      }
      enter(): void {}
      exit(): void {}
      update(): void {}
      getThreeScene(): THREE.Scene {
        return new THREE.Scene();
      }
      getCamera(): THREE.Camera {
        return new THREE.PerspectiveCamera();
      }
    },
  }));

  const { bootstrapGame } = await import('../../../src/game/bootstrapGame');
  await bootstrapGame({
    canvas,
    loadingOverlay: {
      show: vi.fn(),
      hide: vi.fn(),
      dispose: vi.fn(),
    } as never,
    loadFailureOverlay: {
      show: vi.fn((options: LoadFailureOverlayOptions) => {
        failureOptions.push(options);
      }),
      hide: vi.fn(),
      dispose: vi.fn(),
    } as never,
  });

  return {
    sceneManagerInstance: sceneManagerInstance!,
    failureOptions,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

describe('bootstrapGame load failure messages', () => {
  it.each([
    ['title', 'タイトルの じゅんびを もういちど してみよう！', false],
    ['stage', 'たびの じゅんびを もういちど してみよう！', true],
    ['ending', 'さいごの じゅんびを もういちど してみよう！', true],
  ] as const)(
    'shows positive retry copy for %s load failures',
    async (sceneType, expectedTitle, expectsSecondaryAction) => {
      const { sceneManagerInstance, failureOptions } = await setupBootstrap(sceneType);

      await sceneManagerInstance.requestTransition(sceneType, {
        stageNumber: 1,
        totalScore: 0,
        totalStarCount: 0,
      });
      await flushPromises();

      expect(failureOptions).toHaveLength(1);
      expect(failureOptions[0]?.title).toBe(expectedTitle);
      expect(failureOptions[0]?.message).toBe('ボタンを おして もういちど ためしてみよう！');
      if (expectsSecondaryAction) {
        expect(failureOptions[0]?.secondaryAction).toMatchObject({
          label: 'タイトルへ',
        });
      } else {
        expect(failureOptions[0]?.secondaryAction).toBeUndefined();
      }
    },
  );
});
