// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';

interface MockBootSession {
  handle: { dispose: () => void };
  sceneManagerInstance: {
    requestTransition: (sceneType: 'title' | 'stage' | 'ending', context?: object) => Promise<void>;
  };
  gameLoopInstance: {
    pause: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  };
  inputSystemInstance: {
    dispose: ReturnType<typeof vi.fn>;
  };
  audioManagerInstance: {
    dispose: ReturnType<typeof vi.fn>;
  };
  rendererInstance: {
    dispose: ReturnType<typeof vi.fn>;
    forceContextLoss: ReturnType<typeof vi.fn>;
  };
  viewportUnsubscribe: ReturnType<typeof vi.fn>;
  visibilityUnsubscribe: ReturnType<typeof vi.fn>;
  contextLossUnsubscribe: ReturnType<typeof vi.fn>;
  orientationDispose: ReturnType<typeof vi.fn>;
  activeViewportCallbacks: Array<() => void>;
  activeVisibilityCallbacks: Array<{ onHide: () => void; onShow: () => void }>;
  activeContextLossCallbacks: Array<{ onLost: () => void; onRestored: () => void }>;
}

async function setupBootSession(): Promise<MockBootSession> {
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

  let sceneManagerInstance: MockBootSession['sceneManagerInstance'] | null = null;
  let gameLoopInstance: MockBootSession['gameLoopInstance'] | null = null;
  let inputSystemInstance: MockBootSession['inputSystemInstance'] | null = null;
  let audioManagerInstance: MockBootSession['audioManagerInstance'] | null = null;
  let rendererInstance: MockBootSession['rendererInstance'] | null = null;
  let viewportUnsubscribe: ReturnType<typeof vi.fn> | null = null;
  let visibilityUnsubscribe: ReturnType<typeof vi.fn> | null = null;
  let contextLossUnsubscribe: ReturnType<typeof vi.fn> | null = null;
  let orientationDispose: ReturnType<typeof vi.fn> | null = null;
  const activeViewportCallbacks: Array<() => void> = [];
  const activeVisibilityCallbacks: Array<{ onHide: () => void; onShow: () => void }> = [];
  const activeContextLossCallbacks: Array<{ onLost: () => void; onRestored: () => void }> = [];

  class MockSceneManager {
    private factories = new Map<string, () => Promise<unknown> | unknown>();
    private currentScene:
      | {
          enter?: (context?: object) => void;
          exit?: () => void;
          update?: (delta: number) => void;
          getThreeScene: () => THREE.Scene;
          getCamera: () => THREE.Camera;
        }
      | null = null;
    private currentType: 'title' | 'stage' | 'ending' | null = null;
    registerSceneFactory(type: string, factory: () => Promise<unknown> | unknown): void {
      this.factories.set(type, factory);
    }
    registerSceneModulePrefetch(): void {}
    setLoadStateHandler(): void {}
    setTransitionErrorHandler(): void {}
    setTransitionHandler(): void {}
    prefetchSceneModule(): Promise<void> {
      return Promise.resolve();
    }
    async requestTransition(sceneType: 'title' | 'stage' | 'ending', context: object = {}): Promise<void> {
      this.currentScene?.exit?.();
      const factory = this.factories.get(sceneType)!;
      this.currentScene = await factory() as MockSceneManager['currentScene'];
      this.currentType = sceneType;
      this.currentScene?.enter?.(context);
    }
    getCurrentType(): 'title' | 'stage' | 'ending' | null {
      return this.currentType;
    }
    update(delta: number): void {
      this.currentScene?.update?.(delta);
    }
    getCurrentThreeScene(): THREE.Scene | null {
      return this.currentScene?.getThreeScene() ?? null;
    }
    getCurrentCamera(): THREE.Camera | null {
      return this.currentScene?.getCamera() ?? null;
    }
    dispose(): void {
      this.currentScene?.exit?.();
      this.currentScene = null;
      this.currentType = null;
    }
  }

  vi.doMock('../../../src/game/SceneManager', () => ({
    SceneManager: class extends MockSceneManager {
      constructor() {
        super();
        sceneManagerInstance = this as unknown as MockBootSession['sceneManagerInstance'];
      }
    },
  }));

  vi.doMock('../../../src/game/GameLoop', () => ({
    GameLoop: class {
      private paused = false;
      constructor() {
        gameLoopInstance = this as unknown as MockBootSession['gameLoopInstance'];
      }
      start = vi.fn();
      pause = vi.fn(() => {
        this.paused = true;
      });
      resume = vi.fn(() => {
        this.paused = false;
      });
      stop = vi.fn(() => {
        this.paused = false;
      });
      isPaused = vi.fn(() => this.paused);
    },
  }));

  vi.doMock('../../../src/game/systems/InputSystem', () => ({
    InputSystem: class {
      constructor() {
        inputSystemInstance = this as unknown as MockBootSession['inputSystemInstance'];
      }
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
        unlockedPlanets: [],
        clearedStage: 0,
        tutorialShown: true,
        lastStablePixelTier: 0,
      }));
      saveLastStablePixelTier = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/audio/AudioManager', () => ({
    AudioManager: class {
      constructor() {
        audioManagerInstance = this as unknown as MockBootSession['audioManagerInstance'];
      }
      setMuted = vi.fn();
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
      ({ sceneManager }: { sceneManager: { transitionTo?: never; requestTransition: (sceneType: string, context?: object) => Promise<void> } }) =>
      (sceneType: 'title' | 'stage' | 'ending', context?: object) =>
        sceneManager.requestTransition(sceneType, context),
  }));

  vi.doMock('../../../src/game/utils/createWebGLContextLossHandler', () => ({
    createWebGLContextLossHandler: vi.fn(
      (_canvas: HTMLCanvasElement, callbacks: { onLost: () => void; onRestored: () => void }) => {
        activeContextLossCallbacks.push(callbacks);
        contextLossUnsubscribe = vi.fn(() => {
          const index = activeContextLossCallbacks.indexOf(callbacks);
          if (index !== -1) {
            activeContextLossCallbacks.splice(index, 1);
          }
        });
        return contextLossUnsubscribe;
      },
    ),
  }));

  vi.doMock('../../../src/game/utils/createVisibilityPauseHandler', () => ({
    createVisibilityPauseHandler: vi.fn((callbacks: { onHide: () => void; onShow: () => void }) => {
      activeVisibilityCallbacks.push(callbacks);
      visibilityUnsubscribe = vi.fn(() => {
        const index = activeVisibilityCallbacks.indexOf(callbacks);
        if (index !== -1) {
          activeVisibilityCallbacks.splice(index, 1);
        }
      });
      return visibilityUnsubscribe;
    }),
  }));

  vi.doMock('../../../src/game/utils/createRenderer', () => ({
    createRenderer: () => {
      const renderer = {
        setSize: vi.fn(),
        setPixelRatio: vi.fn(),
        setClearColor: vi.fn(),
        render: vi.fn(),
        dispose: vi.fn(),
        forceContextLoss: vi.fn(),
        info: {
          memory: {
            textures: 0,
            geometries: 0,
          },
        },
      };
      rendererInstance = renderer;
      return renderer;
    },
  }));

  vi.doMock('../../../src/game/utils/getViewportSize', () => ({
    getViewportSize: () => ({ width: 1024, height: 768 }),
    updateViewportSizeCache: () => ({ width: 1024, height: 768 }),
    subscribeViewportResize: vi.fn((_target: Window, callback: () => void) => {
      activeViewportCallbacks.push(callback);
      viewportUnsubscribe = vi.fn(() => {
        const index = activeViewportCallbacks.indexOf(callback);
        if (index !== -1) {
          activeViewportCallbacks.splice(index, 1);
        }
      });
      return viewportUnsubscribe;
    }),
  }));

  vi.doMock('../../../src/game/utils/resolveInitialPixelTier', () => ({
    resolveInitialPixelTier: () => 0,
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

  vi.doMock('../../../src/ui/MemoryPressureOverlay', () => ({
    MemoryPressureOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      isVisible = vi.fn(() => false);
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

  vi.doMock('../../../src/ui/LoadingOverlay', () => ({
    LoadingOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/LoadFailureOverlay', () => ({
    LoadFailureOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/MemoryHealthMonitor', () => ({
    MemoryHealthMonitor: class {
      sample = vi.fn(() => ({
        sampled: true,
        latestSample: null,
        alert: null,
      }));
      reset = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/createOrientationHintHandler', () => ({
    createOrientationHintHandler: () => {
      orientationDispose = vi.fn();
      return {
        evaluate: vi.fn(),
        dispose: orientationDispose,
      };
    },
  }));

  vi.doMock('../../../src/game/utils/createRetryableModuleLoader', () => ({
    createRetryableModuleLoader: (loader: () => Promise<unknown>) => loader,
  }));

  vi.doMock('../../../src/game/scenes/TitleScene', () => ({
    TitleScene: class {
      private overlay: HTMLDivElement | null = null;
      enter(): void {
        this.overlay = document.createElement('div');
        this.overlay.setAttribute('data-title-overlay', '');
        document.getElementById('ui-overlay')?.appendChild(this.overlay);
      }
      exit(): void {
        this.overlay?.remove();
        this.overlay = null;
      }
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
      private overlay: HTMLDivElement | null = null;
      private hud: HTMLDivElement | null = null;
      setPauseHandlers = vi.fn();
      setVisualQualityTier = vi.fn();
      isPlaying = vi.fn(() => false);
      isUserPaused = vi.fn(() => false);
      requestResumeCountdown = vi.fn();
      enter(): void {
        this.overlay = document.createElement('div');
        this.overlay.setAttribute('data-stage-overlay', '');
        document.getElementById('ui-overlay')?.appendChild(this.overlay);
        this.hud = document.createElement('div');
        this.hud.setAttribute('data-stage-hud', '');
        document.getElementById('hud')?.appendChild(this.hud);
      }
      exit(): void {
        this.overlay?.remove();
        this.overlay = null;
        this.hud?.remove();
        this.hud = null;
      }
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
  const handle = await bootstrapGame({ canvas });

  return {
    handle,
    sceneManagerInstance: sceneManagerInstance!,
    gameLoopInstance: gameLoopInstance!,
    inputSystemInstance: inputSystemInstance!,
    audioManagerInstance: audioManagerInstance!,
    rendererInstance: rendererInstance!,
    viewportUnsubscribe: viewportUnsubscribe!,
    visibilityUnsubscribe: visibilityUnsubscribe!,
    contextLossUnsubscribe: contextLossUnsubscribe!,
    orientationDispose: orientationDispose!,
    activeViewportCallbacks,
    activeVisibilityCallbacks,
    activeContextLossCallbacks,
  };
}

describe('bootstrapGame dispose', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('disposes listeners, renderer, audio, input, loop, and current scene overlays', async () => {
    const session = await setupBootSession();
    await session.sceneManagerInstance.requestTransition('stage');

    expect(document.querySelector('[data-stage-overlay]')).not.toBeNull();
    expect(document.querySelector('[data-stage-hud]')).not.toBeNull();
    expect(session.activeViewportCallbacks).toHaveLength(1);
    expect(session.activeVisibilityCallbacks).toHaveLength(1);
    expect(session.activeContextLossCallbacks).toHaveLength(1);

    session.handle.dispose();

    expect(session.viewportUnsubscribe).toHaveBeenCalledTimes(1);
    expect(session.visibilityUnsubscribe).toHaveBeenCalledTimes(1);
    expect(session.contextLossUnsubscribe).toHaveBeenCalledTimes(1);
    expect(session.orientationDispose).toHaveBeenCalledTimes(1);
    expect(session.gameLoopInstance.stop).toHaveBeenCalledTimes(1);
    expect(session.inputSystemInstance.dispose).toHaveBeenCalledTimes(1);
    expect(session.audioManagerInstance.dispose).toHaveBeenCalledTimes(1);
    expect(session.rendererInstance.forceContextLoss).toHaveBeenCalledTimes(1);
    expect(session.rendererInstance.dispose).toHaveBeenCalledTimes(1);
    expect(session.activeViewportCallbacks).toHaveLength(0);
    expect(session.activeVisibilityCallbacks).toHaveLength(0);
    expect(session.activeContextLossCallbacks).toHaveLength(0);
    expect(document.querySelector('[data-stage-overlay]')).toBeNull();
    expect(document.querySelector('[data-stage-hud]')).toBeNull();
  });

  it('does not duplicate pause and resume handlers after dispose and re-bootstrap on the same canvas', async () => {
    const firstSession = await setupBootSession();
    await firstSession.sceneManagerInstance.requestTransition('stage');
    firstSession.handle.dispose();

    const secondSession = await setupBootSession();
    await secondSession.sceneManagerInstance.requestTransition('stage');

    secondSession.activeVisibilityCallbacks.forEach((callbacks) => callbacks.onHide());
    secondSession.activeVisibilityCallbacks.forEach((callbacks) => callbacks.onShow());

    expect(firstSession.gameLoopInstance.pause).not.toHaveBeenCalled();
    expect(firstSession.gameLoopInstance.resume).not.toHaveBeenCalled();
    expect(secondSession.activeViewportCallbacks).toHaveLength(1);
    expect(secondSession.activeVisibilityCallbacks).toHaveLength(1);
    expect(secondSession.activeContextLossCallbacks).toHaveLength(1);
    expect(secondSession.gameLoopInstance.pause).toHaveBeenCalledTimes(1);
    expect(secondSession.gameLoopInstance.resume).toHaveBeenCalledTimes(1);
  });
});
