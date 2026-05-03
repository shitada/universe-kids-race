// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';

interface SetupResult {
  sceneManagerInstance: {
    requestTransition: (sceneType: 'title' | 'stage' | 'ending', context?: object) => Promise<void>;
  };
  gameLoopInstance: {
    pause: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
  };
  audioManagerInstance: {
    suspend: ReturnType<typeof vi.fn>;
    ensureResumed: ReturnType<typeof vi.fn>;
  };
  stageSceneInstance: {
    pauseHandlers: {
      onPauseRequested?: () => void;
      onResumeRequested?: () => void;
      onExitHomeRequested?: () => void;
    } | null;
    manuallyPaused: boolean;
    requestResumeCountdown: ReturnType<typeof vi.fn>;
  };
  visibilityCallbacks: { onHide: () => void; onShow: () => void };
}

async function setup(): Promise<SetupResult> {
  vi.resetModules();
  document.body.innerHTML = '<canvas id="game-canvas"></canvas><div id="hud"></div><div id="ui-overlay"></div>';

  let sceneManagerInstance: SetupResult['sceneManagerInstance'] | null = null;
  let gameLoopInstance: SetupResult['gameLoopInstance'] | null = null;
  let audioManagerInstance: SetupResult['audioManagerInstance'] | null = null;
  let stageSceneInstance: SetupResult['stageSceneInstance'] | null = null;
  let visibilityCallbacks: SetupResult['visibilityCallbacks'] | null = null;

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
      isPaused = vi.fn(() => this.paused);
    },
  }));

  vi.doMock('../../../src/game/systems/InputSystem', () => ({
    InputSystem: class {
      setup = vi.fn();
      notifyResize = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/storage/SaveManager', () => ({
    SaveManager: class {
      isFreshSession = vi.fn(() => false);
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
    },
  }));

  vi.doMock('../../../src/game/utils/AdaptivePixelRatioController', () => ({
    AdaptivePixelRatioController: class {
      constructor() {}
      sample = vi.fn();
      notifyResume = vi.fn();
      resetToTier = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/ResizeCoalescer', () => ({
    createResizeCoalescer: (callback: (width: number, height: number) => void) => ({
      schedule: (width: number, height: number) => callback(width, height),
      flush: vi.fn(),
    }),
  }));

  vi.doMock('../../../src/game/utils/createSceneTransitionHandler', () => ({
    createSceneTransitionHandler: () => vi.fn(),
  }));

  vi.doMock('../../../src/game/utils/createWebGLContextLossHandler', () => ({
    createWebGLContextLossHandler: vi.fn(),
  }));

  vi.doMock('../../../src/game/utils/createVisibilityPauseHandler', () => ({
    createVisibilityPauseHandler: vi.fn((callbacks: SetupResult['visibilityCallbacks']) => {
      visibilityCallbacks = callbacks;
    }),
  }));

  vi.doMock('../../../src/game/utils/createRenderer', () => ({
    createRenderer: () => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      setClearColor: vi.fn(),
      render: vi.fn(),
    }),
  }));

  vi.doMock('../../../src/game/utils/getViewportSize', () => ({
    getViewportSize: () => ({ width: 1024, height: 768 }),
    updateViewportSizeCache: () => ({ width: 1024, height: 768 }),
    subscribeViewportResize: vi.fn(),
  }));

  vi.doMock('../../../src/game/utils/resolveInitialPixelTier', () => ({
    resolveInitialPixelTier: () => 0,
  }));

  vi.doMock('../../../src/ui/ContextLossOverlay', () => ({
    ContextLossOverlay: class {
      show = vi.fn();
      hide = vi.fn();
    },
  }));

  vi.doMock('../../../src/ui/ResumeOverlay', () => ({
    ResumeOverlay: class {
      show = vi.fn();
      hide = vi.fn();
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
    createOrientationHintHandler: () => ({
      evaluate: vi.fn(),
    }),
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
      isManuallyPaused = vi.fn(() => this.manuallyPaused);
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
  await bootstrapGame({
    canvas: document.getElementById('game-canvas') as HTMLCanvasElement,
  });
  await sceneManagerInstance!.requestTransition('stage');

  return {
    sceneManagerInstance: sceneManagerInstance!,
    gameLoopInstance: gameLoopInstance!,
    audioManagerInstance: audioManagerInstance!,
    stageSceneInstance: stageSceneInstance!,
    visibilityCallbacks: visibilityCallbacks!,
  };
}

describe('bootstrapGame manual pause wiring', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
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
});
