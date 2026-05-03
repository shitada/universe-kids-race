// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';

interface SetupResult {
  bootstrapHandle: {
    dispose: () => void;
  };
  sceneManagerInstance: {
    requestTransition: (sceneType: 'title' | 'stage' | 'ending', context?: object) => Promise<void>;
  };
  inputSystemInstance: {
    setup: ReturnType<typeof vi.fn>;
    notifyResize: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };
  gameLoopInstance: {
    pause: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  };
  audioManagerInstance: {
    suspend: ReturnType<typeof vi.fn>;
    ensureResumed: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };
  stageSceneInstance: {
    pauseHandlers: {
      onPauseRequested?: () => void;
      onResumeRequested?: () => void;
      onExitHomeRequested?: () => void;
    } | null;
    manuallyPaused: boolean;
    requestResumeCountdown: ReturnType<typeof vi.fn>;
    setVisualQualityTier: ReturnType<typeof vi.fn>;
  };
  visibilityCallbacks: { onHide: () => void; onShow: () => void };
  contextLossCallbacks: { onLost: () => void; onRestored: () => void };
  orientationCallbacks: { onPortrait: () => void; onLandscape: () => void };
  viewportResizeCallback: (() => void) | null;
  viewportSize: { width: number; height: number };
  canvasMetrics: { left: number; width: number };
  pixelRatioControllerInstance: {
    notifyResume: ReturnType<typeof vi.fn>;
    resetToTier: ReturnType<typeof vi.fn>;
  };
  resizeCoalescerInstance: {
    flush: ReturnType<typeof vi.fn>;
  };
  contextLossOverlayInstance: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };
  resumeOverlayInstance: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };
}

async function setup(
  options: {
    canvasLeft?: number;
    canvasWidth?: number;
    viewportWidth?: number;
    viewportHeight?: number;
  } = {},
): Promise<SetupResult> {
  vi.resetModules();
  document.body.innerHTML = '<canvas id="game-canvas"></canvas><div id="hud"></div><div id="ui-overlay"></div>';
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const canvasMetrics = {
    left: options.canvasLeft ?? 0,
    width: options.canvasWidth ?? 1024,
  };
  const viewportSize = {
    width: options.viewportWidth ?? 1024,
    height: options.viewportHeight ?? 768,
  };
  Object.defineProperty(canvas, 'clientWidth', {
    configurable: true,
    get: () => canvasMetrics.width,
  });
  canvas.getBoundingClientRect = () =>
    ({
      left: canvasMetrics.left,
      width: canvasMetrics.width,
      right: canvasMetrics.left + canvasMetrics.width,
      top: 0,
      bottom: 0,
      height: 0,
      x: canvasMetrics.left,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;

  let sceneManagerInstance: SetupResult['sceneManagerInstance'] | null = null;
  let inputSystemInstance: SetupResult['inputSystemInstance'] | null = null;
  let gameLoopInstance: SetupResult['gameLoopInstance'] | null = null;
  let audioManagerInstance: SetupResult['audioManagerInstance'] | null = null;
  let stageSceneInstance: SetupResult['stageSceneInstance'] | null = null;
  let visibilityCallbacks: SetupResult['visibilityCallbacks'] | null = null;
  let contextLossCallbacks: SetupResult['contextLossCallbacks'] | null = null;
  let orientationCallbacks: SetupResult['orientationCallbacks'] | null = null;
  let viewportResizeCallback: SetupResult['viewportResizeCallback'] = null;
  let pixelRatioControllerInstance: SetupResult['pixelRatioControllerInstance'] | null = null;
  let resizeCoalescerInstance: SetupResult['resizeCoalescerInstance'] | null = null;
  let contextLossOverlayInstance: SetupResult['contextLossOverlayInstance'] | null = null;
  let resumeOverlayInstance: SetupResult['resumeOverlayInstance'] | null = null;

  class MockSceneManager {
    private factories = new Map<string, () => Promise<unknown> | unknown>();
    private currentScene:
      | { enter?: (context?: object) => void; exit?: () => void; update?: (delta: number) => void; getThreeScene: () => THREE.Scene; getCamera: () => THREE.Camera }
      | null = null;
    private currentType: 'title' | 'stage' | 'ending' | null = null;
    registerSceneFactory(type: string, factory: () => Promise<unknown> | unknown): void {
      this.factories.set(type, factory);
    }
    registerSceneModulePrefetch(): void {}
    setLoadStateHandler(): void {}
    setTransitionErrorHandler(): void {}
    setTransitionHandler(): void {}
    dispose(): void {
      this.currentScene?.exit?.();
      this.currentScene = null;
      this.currentType = null;
    }
    prefetchSceneModule(): Promise<void> {
      return Promise.resolve();
    }
    async requestTransition(sceneType: 'title' | 'stage' | 'ending', context: object = {}): Promise<void> {
      this.currentScene?.exit?.();
      const factory = this.factories.get(sceneType)!;
      this.currentScene = await factory() as SetupResult['stageSceneInstance'] & {
        enter?: (context?: object) => void;
        exit?: () => void;
        update?: (delta: number) => void;
        getThreeScene: () => THREE.Scene;
        getCamera: () => THREE.Camera;
      };
      this.currentType = sceneType;
      this.currentScene.enter?.(context);
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
      private paused = false;
      constructor() {
        gameLoopInstance = this as unknown as SetupResult['gameLoopInstance'];
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
        inputSystemInstance = this as unknown as SetupResult['inputSystemInstance'];
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
        audioManagerInstance = this as unknown as SetupResult['audioManagerInstance'];
      }
      setMuted = vi.fn();
      ensureResumed = vi.fn();
      suspend = vi.fn();
      dispose = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/AdaptivePixelRatioController', () => ({
    AdaptivePixelRatioController: class {
      constructor() {
        pixelRatioControllerInstance = this as unknown as SetupResult['pixelRatioControllerInstance'];
      }
      sample = vi.fn();
      notifyResume = vi.fn();
      resetToTier = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/ResizeCoalescer', () => ({
    createResizeCoalescer: (callback: (width: number, height: number) => void) => {
      const instance = {
        schedule: (width: number, height: number) => callback(width, height),
        flush: vi.fn(),
      };
      resizeCoalescerInstance = instance;
      return instance;
    },
  }));

  vi.doMock('../../../src/game/utils/createSceneTransitionHandler', () => ({
    createSceneTransitionHandler: () => vi.fn(),
  }));

  vi.doMock('../../../src/game/utils/createWebGLContextLossHandler', () => ({
    createWebGLContextLossHandler: vi.fn((_canvas: HTMLCanvasElement, callbacks: SetupResult['contextLossCallbacks']) => {
      contextLossCallbacks = callbacks;
      return () => {};
    }),
  }));

  vi.doMock('../../../src/game/utils/createVisibilityPauseHandler', () => ({
    createVisibilityPauseHandler: vi.fn((callbacks: SetupResult['visibilityCallbacks']) => {
      visibilityCallbacks = callbacks;
      return () => {};
    }),
  }));

  vi.doMock('../../../src/game/utils/createRenderer', () => ({
    createRenderer: () => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      setClearColor: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      forceContextLoss: vi.fn(),
    }),
  }));

  vi.doMock('../../../src/game/utils/getViewportSize', () => ({
    getViewportSize: () => ({ ...viewportSize }),
    updateViewportSizeCache: () => ({ ...viewportSize }),
    subscribeViewportResize: vi.fn((_target: Window, callback: () => void) => {
      viewportResizeCallback = callback;
      return () => {};
    }),
  }));

  vi.doMock('../../../src/game/utils/resolveInitialPixelTier', () => ({
    resolveInitialPixelTier: () => 0,
  }));

  vi.doMock('../../../src/ui/ContextLossOverlay', () => ({
    ContextLossOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      constructor() {
        contextLossOverlayInstance = this as unknown as SetupResult['contextLossOverlayInstance'];
      }
    },
  }));

  vi.doMock('../../../src/ui/ResumeOverlay', () => ({
    ResumeOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      constructor() {
        resumeOverlayInstance = this as unknown as SetupResult['resumeOverlayInstance'];
      }
    },
  }));

  vi.doMock('../../../src/ui/OrientationHintOverlay', () => ({
    OrientationHintOverlay: class {
      show = vi.fn();
      hide = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/LoadingOverlay', () => ({
    LoadingOverlay: class {
      show = vi.fn();
      hide = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/LoadFailureOverlay', () => ({
    LoadFailureOverlay: class {
      show = vi.fn();
      hide = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/createOrientationHintHandler', () => ({
    createOrientationHintHandler: (callbacks: SetupResult['orientationCallbacks']) => {
      orientationCallbacks = callbacks;
      return {
        evaluate: vi.fn(),
        dispose: vi.fn(),
      };
    },
  }));

  vi.doMock('../../../src/game/utils/createRetryableModuleLoader', () => ({
    createRetryableModuleLoader: (loader: () => Promise<unknown>) => loader,
  }));

  vi.doMock('../../../src/game/scenes/TitleScene', () => ({
    TitleScene: class {
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
      pauseHandlers: SetupResult['stageSceneInstance']['pauseHandlers'] = null;
      manuallyPaused = false;
      setVisualQualityTier = vi.fn();
      isPlaying = vi.fn(() => true);
      isUserPaused = vi.fn(() => this.manuallyPaused);
      requestResumeCountdown = vi.fn();
      setPauseHandlers = vi.fn((handlers: SetupResult['stageSceneInstance']['pauseHandlers']) => {
        this.pauseHandlers = handlers;
      });
      enter(): void {}
      exit(): void {}
      update(): void {}
      getThreeScene(): THREE.Scene {
        return new THREE.Scene();
      }
      getCamera(): THREE.Camera {
        return new THREE.PerspectiveCamera();
      }
      constructor() {
        stageSceneInstance = this as unknown as SetupResult['stageSceneInstance'];
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
  const bootstrapHandle = await bootstrapGame({
    canvas,
  });
  await sceneManagerInstance!.requestTransition('stage');

  return {
    bootstrapHandle,
    sceneManagerInstance: sceneManagerInstance!,
    inputSystemInstance: inputSystemInstance!,
    gameLoopInstance: gameLoopInstance!,
    audioManagerInstance: audioManagerInstance!,
    stageSceneInstance: stageSceneInstance!,
    visibilityCallbacks: visibilityCallbacks!,
    contextLossCallbacks: contextLossCallbacks!,
    orientationCallbacks: orientationCallbacks!,
    viewportResizeCallback,
    viewportSize,
    canvasMetrics,
    pixelRatioControllerInstance: pixelRatioControllerInstance!,
    resizeCoalescerInstance: resizeCoalescerInstance!,
    contextLossOverlayInstance: contextLossOverlayInstance!,
    resumeOverlayInstance: resumeOverlayInstance!,
  };
}

describe('bootstrapGame manual pause wiring', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('passes canvas left and width to InputSystem on boot and viewport resize', async () => {
    const {
      inputSystemInstance,
      viewportResizeCallback,
      viewportSize,
      canvasMetrics,
    } = await setup({
      canvasLeft: 40,
      canvasWidth: 900,
    });

    expect(inputSystemInstance.notifyResize).toHaveBeenCalledWith(40, 900);

    canvasMetrics.left = 120;
    canvasMetrics.width = 860;
    viewportSize.width = 1280;
    viewportSize.height = 720;
    viewportResizeCallback?.();

    expect(inputSystemInstance.notifyResize).toHaveBeenLastCalledWith(120, 860);
  });

  it('connects StageScene pause handlers to gameLoop/audio/countdown flow', async () => {
    const { gameLoopInstance, audioManagerInstance, stageSceneInstance, sceneManagerInstance } = await setup();
    const transitionSpy = vi.spyOn(sceneManagerInstance, 'requestTransition');

    stageSceneInstance.pauseHandlers?.onPauseRequested?.();
    stageSceneInstance.pauseHandlers?.onResumeRequested?.();
    stageSceneInstance.pauseHandlers?.onExitHomeRequested?.();

    expect(gameLoopInstance.pause).toHaveBeenCalledTimes(1);
    expect(audioManagerInstance.suspend).toHaveBeenCalledTimes(1);
    expect(gameLoopInstance.resume).toHaveBeenCalledTimes(2);
    expect(audioManagerInstance.ensureResumed).toHaveBeenCalledTimes(2);
    expect(stageSceneInstance.requestResumeCountdown).toHaveBeenCalledTimes(1);
    expect(transitionSpy).toHaveBeenCalledWith('title');
  });

  it('does not auto-resume from visibility restore while manual pause overlay is open', async () => {
    const { gameLoopInstance, audioManagerInstance, stageSceneInstance, visibilityCallbacks } = await setup();
    stageSceneInstance.manuallyPaused = true;

    visibilityCallbacks.onHide();
    gameLoopInstance.resume.mockClear();
    audioManagerInstance.ensureResumed.mockClear();
    stageSceneInstance.requestResumeCountdown.mockClear();

    visibilityCallbacks.onShow();

    expect(gameLoopInstance.resume).not.toHaveBeenCalled();
    expect(audioManagerInstance.ensureResumed).not.toHaveBeenCalled();
    expect(stageSceneInstance.requestResumeCountdown).not.toHaveBeenCalled();
  });

  it('uses the shared context restore order and shows the stage resume overlay after resize flush', async () => {
    const {
      contextLossCallbacks,
      contextLossOverlayInstance,
      pixelRatioControllerInstance,
      resizeCoalescerInstance,
      resumeOverlayInstance,
      stageSceneInstance,
    } = await setup();

    contextLossCallbacks.onLost();
    contextLossOverlayInstance.hide.mockClear();
    pixelRatioControllerInstance.resetToTier.mockClear();
    pixelRatioControllerInstance.notifyResume.mockClear();
    stageSceneInstance.setVisualQualityTier.mockClear();
    resizeCoalescerInstance.flush.mockClear();
    resumeOverlayInstance.show.mockClear();

    contextLossCallbacks.onRestored();

    expect(contextLossOverlayInstance.hide).toHaveBeenCalledTimes(1);
    expect(pixelRatioControllerInstance.resetToTier).toHaveBeenCalledWith(0);
    expect(stageSceneInstance.setVisualQualityTier).toHaveBeenCalledWith(0);
    expect(resumeOverlayInstance.show).toHaveBeenCalledTimes(1);

    const orders = [
      contextLossOverlayInstance.hide.mock.invocationCallOrder[0],
      pixelRatioControllerInstance.resetToTier.mock.invocationCallOrder[0],
      stageSceneInstance.setVisualQualityTier.mock.invocationCallOrder[0],
      resizeCoalescerInstance.flush.mock.invocationCallOrder[0],
      resumeOverlayInstance.show.mock.invocationCallOrder[0],
      pixelRatioControllerInstance.notifyResume.mock.invocationCallOrder[0],
    ];
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('does not auto-resume after context restore while manual pause is active', async () => {
    const {
      contextLossCallbacks,
      gameLoopInstance,
      audioManagerInstance,
      stageSceneInstance,
      resumeOverlayInstance,
    } = await setup();
    stageSceneInstance.manuallyPaused = true;

    contextLossCallbacks.onLost();
    gameLoopInstance.resume.mockClear();
    audioManagerInstance.ensureResumed.mockClear();
    stageSceneInstance.requestResumeCountdown.mockClear();
    resumeOverlayInstance.show.mockClear();

    contextLossCallbacks.onRestored();

    expect(gameLoopInstance.resume).not.toHaveBeenCalled();
    expect(audioManagerInstance.ensureResumed).not.toHaveBeenCalled();
    expect(stageSceneInstance.requestResumeCountdown).not.toHaveBeenCalled();
    expect(resumeOverlayInstance.show).not.toHaveBeenCalled();
  });

  it('does not auto-resume after context restore while portrait lock is active', async () => {
    const {
      contextLossCallbacks,
      orientationCallbacks,
      gameLoopInstance,
      audioManagerInstance,
      resumeOverlayInstance,
    } = await setup();

    orientationCallbacks.onPortrait();
    gameLoopInstance.resume.mockClear();
    audioManagerInstance.ensureResumed.mockClear();
    resumeOverlayInstance.show.mockClear();

    contextLossCallbacks.onRestored();

    expect(gameLoopInstance.resume).not.toHaveBeenCalled();
    expect(audioManagerInstance.ensureResumed).not.toHaveBeenCalled();
    expect(resumeOverlayInstance.show).not.toHaveBeenCalled();
  });
});
