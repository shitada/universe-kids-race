// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';

interface SetupResult {
  bootstrapHandle: { dispose: () => void };
  stageSceneInstance: {
    setPauseHandlers: ReturnType<typeof vi.fn>;
    setVisualQualityTier: ReturnType<typeof vi.fn>;
    setPerformanceAdaptationLevel: ReturnType<typeof vi.fn>;
    requestResumeCountdown: ReturnType<typeof vi.fn>;
    isPlaying: ReturnType<typeof vi.fn>;
    isUserPaused: ReturnType<typeof vi.fn>;
    pauseHandlers: {
      onPauseRequested?: () => void;
      onResumeRequested?: () => void;
      onExitHomeRequested?: () => void;
    } | null;
  };
  sceneManagerInstance: {
    requestTransition: ReturnType<typeof vi.fn>;
  };
  gameLoopInstance: {
    pause: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
    runUpdate: (deltaTime: number) => void;
  };
  audioManagerInstance: {
    suspend: ReturnType<typeof vi.fn>;
    ensureResumed: ReturnType<typeof vi.fn>;
  };
  playTimeRestOverlayInstance: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
    isVisible: ReturnType<typeof vi.fn>;
  };
  thermalPreventionSystemInstance: {
    triggerMilestone: (level: number, thresholdMinutes: number) => void;
    updateActivePlay: ReturnType<typeof vi.fn>;
  };
}

async function setup(
  initialPreventiveLevel = 0,
  saveOverrides: Record<string, unknown> = {},
): Promise<SetupResult> {
  vi.resetModules();
  document.body.innerHTML = '<canvas id="game-canvas"></canvas><div id="hud"></div><div id="ui-overlay"></div>';
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  Object.defineProperty(canvas, 'clientWidth', { configurable: true, get: () => 1024 });
  canvas.getBoundingClientRect = () =>
    ({
      left: 0,
      width: 1024,
      right: 1024,
      top: 0,
      bottom: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;

  let stageSceneInstance: SetupResult['stageSceneInstance'] | null = null;
  let sceneManagerInstance: SetupResult['sceneManagerInstance'] | null = null;
  let gameLoopInstance: SetupResult['gameLoopInstance'] | null = null;
  let audioManagerInstance: SetupResult['audioManagerInstance'] | null = null;
  let playTimeRestOverlayInstance: SetupResult['playTimeRestOverlayInstance'] | null = null;
  let thermalPreventionCallback:
    | ((event: { level: number; thresholdMinutes: number; totalPlayTimeMs: number }) => void)
    | null = null;
  let thermalPreventionUpdateSpy: ReturnType<typeof vi.fn> | null = null;
  let updateCallback: ((deltaTime: number) => void) | null = null;

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
    dispose(): void {}
    async requestTransition(sceneType: 'title' | 'stage' | 'ending', context: object = {}): Promise<void> {
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
      constructor() {
        gameLoopInstance = this as unknown as SetupResult['gameLoopInstance'];
      }
      start = vi.fn((onUpdate: (deltaTime: number) => void) => {
        updateCallback = onUpdate;
      });
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
        unlockedPlanets: [],
        clearedStage: 0,
        tutorialShown: true,
        lastStablePixelTier: 0,
        restReminderSettings: { enabled: true },
        ...saveOverrides,
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
      sample = vi.fn();
      notifyResume = vi.fn();
      resetToTier = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/MemoryHealthMonitor', () => ({
    MemoryHealthMonitor: class {
      sample = vi.fn(() => ({ sampled: true, latestSample: null, alert: null }));
      reset = vi.fn();
    },
  }));

  vi.doMock('../../../src/game/utils/ResizeCoalescer', () => ({
    createResizeCoalescer: () => ({
      schedule: vi.fn(),
      flush: vi.fn(),
      dispose: vi.fn(),
    }),
  }));

  vi.doMock('../../../src/game/utils/createSceneTransitionHandler', () => ({
    createSceneTransitionHandler: () => vi.fn(),
  }));

  vi.doMock('../../../src/game/utils/createWebGLContextLossHandler', () => ({
    createWebGLContextLossHandler: () => () => {},
  }));

  vi.doMock('../../../src/game/utils/createVisibilityPauseHandler', () => ({
    createVisibilityPauseHandler: () => () => {},
  }));

  vi.doMock('../../../src/game/utils/createRenderer', () => ({
    createRenderer: () => ({
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
    }),
  }));

  vi.doMock('../../../src/game/utils/getViewportSize', () => ({
    getViewportSize: () => ({ width: 1024, height: 768 }),
    updateViewportSizeCache: () => ({ width: 1024, height: 768 }),
    subscribeViewportResize: () => () => {},
  }));

  vi.doMock('../../../src/game/utils/resolveInitialPixelTier', () => ({
    resolveInitialPixelTier: () => 0,
  }));

  vi.doMock('../../../src/game/utils/createOrientationHintHandler', () => ({
    createOrientationHintHandler: () => ({
      evaluate: vi.fn(),
      dispose: vi.fn(),
    }),
  }));

  vi.doMock('../../../src/game/utils/createRetryableModuleLoader', () => ({
    createRetryableModuleLoader: (loader: () => Promise<unknown>) => loader,
  }));

  vi.doMock('../../../src/game/systems/FrameRateAdaptationSystem', () => ({
    FrameRateAdaptationSystem: class {
      constructor(
        _maxLevel: number,
        private readonly onLevelChange: (change: {
          previousLevel: number;
          level: number;
          direction: 'degraded' | 'recovered';
        }) => void,
      ) {}

      sample = vi.fn();
      notifyResume = vi.fn();
      reset = vi.fn();
      setPreventiveLevel = vi.fn((level: number) => {
        this.onLevelChange({
          previousLevel: Math.max(0, level - 1),
          level,
          direction: 'degraded',
        });
      });
    },
  }));

  vi.doMock('../../../src/game/systems/ThermalPreventionSystem', () => ({
    ThermalPreventionSystem: class {
      constructor(options: {
        onMilestoneReached?: (event: { level: number; thresholdMinutes: number; totalPlayTimeMs: number }) => void;
      }) {
        thermalPreventionCallback = options.onMilestoneReached ?? null;
        thermalPreventionUpdateSpy = this.updateActivePlay;
      }

      updateActivePlay = vi.fn();
      flush = vi.fn();
      getPreventiveLevel = vi.fn(() => initialPreventiveLevel);
    },
  }));

  vi.doMock('../../../src/ui/PlayTimeRestOverlay', () => ({
    PlayTimeRestOverlay: class {
      show = vi.fn();
      hide = vi.fn();
      isVisible = vi.fn(() => false);
      dispose = vi.fn();
      constructor() {
        playTimeRestOverlayInstance = this as unknown as SetupResult['playTimeRestOverlayInstance'];
      }
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
      pauseHandlers = null;
      setPauseHandlers = vi.fn((handlers: SetupResult['stageSceneInstance']['pauseHandlers']) => {
        this.pauseHandlers = handlers;
      });
      setVisualQualityTier = vi.fn();
      setPerformanceAdaptationLevel = vi.fn();
      requestResumeCountdown = vi.fn();
      isPlaying = vi.fn(() => true);
      isUserPaused = vi.fn(() => false);
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
  const bootstrapHandle = await bootstrapGame({ canvas });
  await sceneManagerInstance!.requestTransition('stage');

  return {
    bootstrapHandle,
    stageSceneInstance: stageSceneInstance!,
    sceneManagerInstance: sceneManagerInstance!,
    gameLoopInstance: {
      ...gameLoopInstance!,
      runUpdate: (deltaTime: number) => {
        updateCallback?.(deltaTime);
      },
    },
    audioManagerInstance: audioManagerInstance!,
    playTimeRestOverlayInstance: playTimeRestOverlayInstance!,
    thermalPreventionSystemInstance: {
      triggerMilestone: (level: number, thresholdMinutes: number) => {
        thermalPreventionCallback?.({
          level,
          thresholdMinutes,
          totalPlayTimeMs: thresholdMinutes * 60 * 1000,
        });
      },
      updateActivePlay: thermalPreventionUpdateSpy!,
    },
  };
}

describe('bootstrapGame thermal prevention wiring', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('applies the stored preventive adaptation level when entering the stage', async () => {
    const { bootstrapHandle, stageSceneInstance } = await setup(1);

    expect(stageSceneInstance.setPerformanceAdaptationLevel).toHaveBeenCalledWith(1);

    bootstrapHandle.dispose();
  });

  it('shows the rest overlay and pauses the game when a play-time milestone is reached', async () => {
    const {
      bootstrapHandle,
      stageSceneInstance,
      gameLoopInstance,
      audioManagerInstance,
      playTimeRestOverlayInstance,
      thermalPreventionSystemInstance,
    } = await setup();

    thermalPreventionSystemInstance.triggerMilestone(1, 15);

    expect(stageSceneInstance.setPerformanceAdaptationLevel).toHaveBeenCalledWith(1);
    expect(gameLoopInstance.pause).toHaveBeenCalledTimes(1);
    expect(audioManagerInstance.suspend).toHaveBeenCalledTimes(1);
    expect(playTimeRestOverlayInstance.show).toHaveBeenCalledTimes(1);

    bootstrapHandle.dispose();
  });

  it('records active play time only while the stage is actively playing', async () => {
    const {
      bootstrapHandle,
      gameLoopInstance,
      stageSceneInstance,
      thermalPreventionSystemInstance,
      sceneManagerInstance,
    } = await setup();

    gameLoopInstance.runUpdate(1.5);
    expect(thermalPreventionSystemInstance.updateActivePlay).toHaveBeenCalledWith(1.5);

    stageSceneInstance.isPlaying.mockReturnValue(false);
    gameLoopInstance.runUpdate(1.5);
    expect(thermalPreventionSystemInstance.updateActivePlay).toHaveBeenCalledTimes(1);

    await sceneManagerInstance.requestTransition('title');
    gameLoopInstance.runUpdate(1.5);
    expect(thermalPreventionSystemInstance.updateActivePlay).toHaveBeenCalledTimes(1);

    bootstrapHandle.dispose();
  });

  it('continue from the rest overlay resumes the game with the stage countdown', async () => {
    const {
      bootstrapHandle,
      stageSceneInstance,
      gameLoopInstance,
      audioManagerInstance,
      playTimeRestOverlayInstance,
      thermalPreventionSystemInstance,
    } = await setup();

    thermalPreventionSystemInstance.triggerMilestone(1, 15);
    const [options] = playTimeRestOverlayInstance.show.mock.calls[0];

    options.onContinue();

    expect(gameLoopInstance.resume).toHaveBeenCalledTimes(1);
    expect(audioManagerInstance.ensureResumed).toHaveBeenCalledTimes(1);
    expect(stageSceneInstance.requestResumeCountdown).toHaveBeenCalledTimes(1);

    bootstrapHandle.dispose();
  });

  it('rest from the overlay returns to the title in one tap', async () => {
    const {
      bootstrapHandle,
      sceneManagerInstance,
      gameLoopInstance,
      audioManagerInstance,
      playTimeRestOverlayInstance,
      thermalPreventionSystemInstance,
    } = await setup();

    const transitionSpy = vi.spyOn(sceneManagerInstance, 'requestTransition');
    thermalPreventionSystemInstance.triggerMilestone(2, 30);
    const [options] = playTimeRestOverlayInstance.show.mock.calls[0];

    await options.onRest();

    expect(gameLoopInstance.resume).toHaveBeenCalledTimes(1);
    expect(audioManagerInstance.ensureResumed).toHaveBeenCalledTimes(1);
    expect(transitionSpy).toHaveBeenCalledWith('title');
    expect(playTimeRestOverlayInstance.show).toHaveBeenCalledTimes(2);
    expect(playTimeRestOverlayInstance.show.mock.calls[1][0]).toEqual(expect.objectContaining({
      variant: 'rest-complete',
      totalPlayTimeMs: 30 * 60 * 1000,
    }));

    bootstrapHandle.dispose();
  });

  it('does not count or show reminders while the rest reminder setting is off', async () => {
    const {
      bootstrapHandle,
      gameLoopInstance,
      thermalPreventionSystemInstance,
      playTimeRestOverlayInstance,
    } = await setup(0, {
      restReminderSettings: { enabled: false },
    });

    gameLoopInstance.runUpdate(1.5);
    expect(thermalPreventionSystemInstance.updateActivePlay).not.toHaveBeenCalled();

    thermalPreventionSystemInstance.triggerMilestone(1, 15);
    expect(playTimeRestOverlayInstance.show).not.toHaveBeenCalled();

    bootstrapHandle.dispose();
  });
});
