import * as THREE from 'three';
import { GameLoop } from './GameLoop';
import { SceneManager } from './SceneManager';
import { InputSystem } from './systems/InputSystem';
import type { StageScene } from './scenes/StageScene';
import { SaveManager } from './storage/SaveManager';
import { AudioManager } from './audio/AudioManager';
import { AdaptivePixelRatioController } from './utils/AdaptivePixelRatioController';
import { createResizeCoalescer } from './utils/ResizeCoalescer';
import { createSceneTransitionHandler } from './utils/createSceneTransitionHandler';
import { createWebGLContextLossHandler } from './utils/createWebGLContextLossHandler';
import { createVisibilityPauseHandler } from './utils/createVisibilityPauseHandler';
import { createRenderer } from './utils/createRenderer';
import { getViewportSize, subscribeViewportResize, updateViewportSizeCache } from './utils/getViewportSize';
import { resolveInitialPixelTier } from './utils/resolveInitialPixelTier';
import { ContextLossOverlay } from '../ui/ContextLossOverlay';
import { ResumeOverlay } from '../ui/ResumeOverlay';
import { OrientationHintOverlay } from '../ui/OrientationHintOverlay';
import { LoadingOverlay } from '../ui/LoadingOverlay';
import { LoadFailureOverlay } from '../ui/LoadFailureOverlay';
import { createOrientationHintHandler } from './utils/createOrientationHintHandler';
import { createRetryableModuleLoader } from './utils/createRetryableModuleLoader';
import type { SceneType } from '../types';

export interface BootstrapGameOptions {
  canvas: HTMLCanvasElement;
  loadingOverlay?: LoadingOverlay;
  loadFailureOverlay?: LoadFailureOverlay;
}

export async function bootstrapGame(options: BootstrapGameOptions): Promise<void> {
  const { canvas } = options;
  const renderer = createRenderer(canvas);
  const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
  const pixelRatioTiers = [1.0, 1.5, maxPixelRatio];
  const maxTier = pixelRatioTiers.length - 1;
  const sceneManager = new SceneManager();
  const inputSystem = new InputSystem();
  const saveManager = new SaveManager();
  const audioManager = new AudioManager();
  const gameLoop = new GameLoop();
  const loadingOverlay = options.loadingOverlay ?? new LoadingOverlay();
  const loadFailureOverlay = options.loadFailureOverlay ?? new LoadFailureOverlay();

  let lastAppliedWidth = 0;
  let lastAppliedHeight = 0;
  let stageScene: StageScene | null = null;
  let hasScheduledStagePrefetch = false;

  function isStageManuallyPaused(): boolean {
    return (stageScene as (StageScene & { isManuallyPaused?: () => boolean }) | null)?.isManuallyPaused?.() === true;
  }

  function applyRendererSize(width: number, height: number): void {
    if (width !== lastAppliedWidth || height !== lastAppliedHeight) {
      renderer.setSize(width, height);
      lastAppliedWidth = width;
      lastAppliedHeight = height;
      inputSystem.notifyResize(canvas.clientWidth);
    }

    const camera = sceneManager.getCurrentCamera();
    if (camera instanceof THREE.PerspectiveCamera) {
      const aspect = width / height;
      if (camera.aspect !== aspect) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
    }
  }

  function applyPixelRatioTier(tier: number): void {
    const clamped = Math.max(0, Math.min(maxTier, tier));
    renderer.setPixelRatio(pixelRatioTiers[clamped]);
    lastAppliedWidth = 0;
    lastAppliedHeight = 0;
    const { width, height } = updateViewportSizeCache();
    applyRendererSize(width, height);
  }

  if (saveManager.isFreshSession()) {
    saveManager.resetSessionDataPreservingMuted();
  }

  const initialPixelTier = resolveInitialPixelTier(
    saveManager.load().lastStablePixelTier,
    maxTier,
  );

  applyPixelRatioTier(initialPixelTier);

  const currentVisualTier = { value: initialPixelTier };
  const pixelRatioController = new AdaptivePixelRatioController(
    maxTier,
    (newTier: number) => {
      applyPixelRatioTier(newTier);
      stageScene?.setVisualQualityTier(newTier);
      if (newTier < currentVisualTier.value) {
        saveManager.saveLastStablePixelTier(newTier);
      }
      currentVisualTier.value = newTier;
    },
    {},
    initialPixelTier,
  );

  renderer.setClearColor(0x000020);
  inputSystem.setup(canvas);
  audioManager.setMuted(saveManager.load().muted === true);

  const loadTitleSceneModule = createRetryableModuleLoader(() => import('./scenes/TitleScene'));
  const loadStageSceneModule = createRetryableModuleLoader(() => import('./scenes/StageScene'));
  const loadEndingSceneModule = createRetryableModuleLoader(() => import('./scenes/EndingScene'));

  function getLoadingMessage(sceneType: SceneType): string {
    switch (sceneType) {
      case 'title':
        return 'タイトルの じゅんび ちゅう...';
      case 'ending':
        return 'さいごの じゅんび ちゅう...';
      default:
        return 'たびの じゅんび ちゅう...';
    }
  }

  function getLoadFailureTitle(sceneType: SceneType): string {
    switch (sceneType) {
      case 'title':
        return 'タイトルの じゅんびが できなかったよ';
      case 'ending':
        return 'さいごの じゅんびが できなかったよ';
      default:
        return 'たびの じゅんびが できなかったよ';
    }
  }

  const scheduleSoonTask = (cb: () => void): void => {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(cb);
      return;
    }
    Promise.resolve().then(cb);
  };

  function scheduleStagePrefetchAfterTitleReady(): void {
    if (hasScheduledStagePrefetch || sceneManager.getCurrentType() !== 'title') {
      return;
    }

    hasScheduledStagePrefetch = true;
    scheduleSoonTask(() => {
      if (sceneManager.getCurrentType() !== 'title') {
        return;
      }
      void sceneManager.prefetchSceneModule('stage').catch(() => {});
    });
  }

  sceneManager.registerSceneFactory('title', async () => {
    const { TitleScene } = await loadTitleSceneModule();
    return new TitleScene(sceneManager, saveManager, audioManager);
  });
  sceneManager.registerSceneModulePrefetch('stage', loadStageSceneModule);
  sceneManager.registerSceneModulePrefetch('ending', loadEndingSceneModule);
  sceneManager.registerSceneFactory('stage', async () => {
    const { StageScene } = await loadStageSceneModule();
    stageScene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
    (stageScene as StageScene & {
      setPauseHandlers?: (handlers: {
        onPauseRequested?: () => void;
        onResumeRequested?: () => void;
        onExitHomeRequested?: () => void;
      }) => void;
    }).setPauseHandlers?.({
      onPauseRequested: () => {
        pendingBackgroundResume = false;
        resumeOverlay.hide();
        gameLoop.pause();
        audioManager.suspend();
      },
      onResumeRequested: () => {
        pendingBackgroundResume = false;
        resumeOverlay.hide();
        resumeGame();
        stageScene?.requestResumeCountdown();
      },
      onExitHomeRequested: () => {
        pendingBackgroundResume = false;
        resumeOverlay.hide();
        resumeGame();
        void sceneManager.requestTransition('title');
      },
    });
    stageScene.setVisualQualityTier(currentVisualTier.value);
    return stageScene;
  });
  sceneManager.registerSceneFactory('ending', async () => {
    const { EndingScene } = await loadEndingSceneModule();
    return new EndingScene(sceneManager, saveManager, audioManager);
  });
  sceneManager.setLoadStateHandler((isLoading, sceneType) => {
    if (isLoading) {
      loadingOverlay.show(getLoadingMessage(sceneType));
      return;
    }
    loadingOverlay.hide();
  });
  sceneManager.setTransitionErrorHandler((error, sceneType, context) => {
    console.error(`Failed to transition to ${sceneType}`, error);
    loadingOverlay.hide();

    if (sceneType !== 'title' && sceneType !== 'stage' && sceneType !== 'ending') {
      return;
    }

    loadFailureOverlay.show({
      title: getLoadFailureTitle(sceneType),
      message: 'ボタンを おして もういちど ためそう！',
      primaryAction: {
        label: 'もういちど',
        onSelect: () =>
          sceneManager.requestTransition(sceneType, context).then(() => {
            if (sceneType === 'title') {
              scheduleStagePrefetchAfterTitleReady();
            }
          }),
      },
      secondaryAction:
        sceneType === 'title'
          ? undefined
          : {
              label: 'タイトルへ',
              onSelect: () => sceneManager.requestTransition('title'),
            },
    });
  });

  sceneManager.setTransitionHandler(
    createSceneTransitionHandler({
      sceneManager,
      pixelRatioController,
      now: () => performance.now(),
    }),
  );

  gameLoop.start(
    (deltaTime: number) => {
      sceneManager.update(deltaTime);
    },
    () => {
      const scene = sceneManager.getCurrentThreeScene();
      const camera = sceneManager.getCurrentCamera();
      if (scene && camera) {
        renderer.render(scene, camera);
      }
    },
    (fps: number) => {
      pixelRatioController.sample(fps, performance.now());
    },
  );

  const resizeCoalescer = createResizeCoalescer((width, height) => applyRendererSize(width, height));
  function scheduleResize(): void {
    const { width, height } = getViewportSize();
    resizeCoalescer.schedule(width, height);
  }
  subscribeViewportResize(window, scheduleResize);

  function resumeGame(): void {
    gameLoop.resume();
    audioManager.ensureResumed();
  }

  function refreshViewportAfterRestore(): void {
    pixelRatioController.notifyResume(performance.now());
    const { width, height } = updateViewportSizeCache();
    resizeCoalescer.schedule(width, height);
    resizeCoalescer.flush();
  }

  const resumeOverlay = new ResumeOverlay();
  let isPortraitLocked = false;
  let pendingBackgroundResume = false;

  function showStageResumeOverlay(): void {
    resumeOverlay.show(() => {
      pendingBackgroundResume = false;
      resumeGame();
      stageScene?.requestResumeCountdown();
    });
  }

  function shouldShowStageResumeOverlay(): boolean {
    return (
      sceneManager.getCurrentType() === 'stage' &&
      gameLoop.isPaused() &&
      stageScene?.isPlaying() === true
    );
  }

  function handleVisibilityRestore(): void {
    refreshViewportAfterRestore();
    if (isPortraitLocked) {
      return;
    }
    if (isStageManuallyPaused()) {
      resumeOverlay.hide();
      pendingBackgroundResume = false;
      return;
    }
    if (shouldShowStageResumeOverlay()) {
      showStageResumeOverlay();
    } else {
      resumeOverlay.hide();
      pendingBackgroundResume = false;
      resumeGame();
    }
  }

  createVisibilityPauseHandler({
    onHide: () => {
      pendingBackgroundResume = !isStageManuallyPaused();
      gameLoop.pause();
      audioManager.suspend();
    },
    onShow: handleVisibilityRestore,
  });

  const orientationHintOverlay = new OrientationHintOverlay();
  const orientationHintHandler = createOrientationHintHandler({
    onPortrait: () => {
      isPortraitLocked = true;
      resumeOverlay.hide();
      orientationHintOverlay.show();
      gameLoop.pause();
      audioManager.suspend();
    },
    onLandscape: () => {
      if (!isPortraitLocked) return;
      isPortraitLocked = false;
      orientationHintOverlay.hide();
      refreshViewportAfterRestore();
      if (isStageManuallyPaused()) {
        pendingBackgroundResume = false;
        return;
      }
      if (pendingBackgroundResume && shouldShowStageResumeOverlay()) {
        showStageResumeOverlay();
      } else {
        pendingBackgroundResume = false;
        resumeGame();
      }
    },
  });
  orientationHintHandler.evaluate();

  const contextLossOverlay = new ContextLossOverlay();
  createWebGLContextLossHandler(canvas, {
    onLost: () => {
      gameLoop.pause();
      audioManager.suspend();
      contextLossOverlay.show(() => {
        window.location.reload();
      });
    },
    onRestored: () => {
      const restoreTier = currentVisualTier.value ?? initialPixelTier;
      contextLossOverlay.hide();
      pixelRatioController.resetToTier(restoreTier);
      applyPixelRatioTier(restoreTier);
      currentVisualTier.value = restoreTier;
      stageScene?.setVisualQualityTier(restoreTier);
      handleVisibilityRestore();
    },
  });

  await sceneManager.requestTransition('title');
  scheduleStagePrefetchAfterTitleReady();
}
