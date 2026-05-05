// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TitleScene } from '../../src/game/scenes/TitleScene';
import { StageScene } from '../../src/game/scenes/StageScene';
import { SceneManager } from '../../src/game/SceneManager';
import { LoadingOverlay } from '../../src/ui/LoadingOverlay';
import { EncyclopediaOverlay } from '../../src/ui/EncyclopediaOverlay';
import { LoadFailureOverlay } from '../../src/ui/LoadFailureOverlay';
import type { Scene, SceneContext, SceneType } from '../../src/types';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import * as THREE from 'three';

interface StageSceneInternals {
  onStageClear(): void;
  update(deltaTime: number): void;
}

function createTrackingScene(
  log: { type: SceneType; context: SceneContext }[],
  sceneType: SceneType,
): Scene {
  const threeScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  return {
    enter: (ctx: SceneContext) => {
      log.push({ type: sceneType, context: ctx });
    },
    update: () => {},
    exit: () => {},
    getThreeScene: () => threeScene,
    getCamera: () => camera,
  };
}

function createMockSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [1, 2, 3],
      tutorialShown: true,
      bestStageStars: { 2: 4 },
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
    markTutorialShown: vi.fn(),
  } as unknown as SaveManager;
}

function createMockAudioManager(): AudioManager {
  return {
    init: vi.fn(),
    initSync: vi.fn(),
    isInitialized: vi.fn(() => true),
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    ensureResumed: vi.fn(),
    dispose: vi.fn(),
  } as unknown as AudioManager;
}

function flushPromises(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function createPointerEvent(type: string, init: PointerEventInit = {}): PointerEvent {
  return new PointerEvent(type, { bubbles: true, ...init });
}

function dispatchReleaseConfirm(button: HTMLElement, init: PointerEventInit = {}): void {
  button.dispatchEvent(createPointerEvent('pointerdown', init));
  button.dispatchEvent(createPointerEvent('pointerup', init));
}

function finishBonusSequence(scene: { update(deltaTime: number): void }): void {
  scene.update(13);
}

function dispatchCancelledReleaseConfirm(
  element: HTMLElement,
  moveInit: PointerEventInit,
  startInit: PointerEventInit = {},
): void {
  element.dispatchEvent(createPointerEvent('pointerdown', startInit));
  document.dispatchEvent(createPointerEvent('pointermove', { ...startInit, ...moveInit }));
  element.dispatchEvent(createPointerEvent('pointerup', { ...startInit, ...moveInit }));
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

describe('Encyclopedia Stage Selection Integration', () => {
  let uiOverlay: HTMLDivElement;
  let hud: HTMLDivElement;

  beforeEach(() => {
    vi.restoreAllMocks();
    mockCanvasContext();
    uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
    hud = document.createElement('div');
    hud.id = 'hud';
    document.body.appendChild(hud);
  });

  afterEach(() => {
    uiOverlay.remove();
    hud.remove();
  });

  it('lazy-loads the encyclopedia on first open, then transitions from detail play CTA', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    let resolveModule: ((value: { EncyclopediaOverlay: typeof EncyclopediaOverlay }) => void) | null = null;
    const loadEncyclopediaOverlay = vi.fn(
      () =>
        new Promise<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>((resolve) => {
          resolveModule = resolve;
        }),
    );
    const titleScene = new TitleScene(
      manager,
      createMockSaveManager(),
      createMockAudioManager(),
      {
        loadingOverlay,
        loadEncyclopediaOverlay,
      },
    );

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', createTrackingScene(log, 'stage'));

    await manager.transitionTo('title');

    const encyclopediaBtn = Array.from(uiOverlay.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('ずかん'),
    ) as HTMLButtonElement;
    dispatchReleaseConfirm(encyclopediaBtn);

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-loading-overlay]')).not.toBeNull();
    expect(uiOverlay.querySelector('[data-card]')).toBeNull();

    resolveModule?.({ EncyclopediaOverlay });
    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    const card = uiOverlay.querySelector('[data-card][data-stage="2"]') as HTMLElement;
    expect(card).not.toBeNull();

    card.dispatchEvent(createPointerEvent('pointerdown', { clientX: 16, clientY: 16 }));
    await flushPromises();

    expect(uiOverlay.querySelector('[data-detail]')).toBeNull();
    expect(manager.getCurrentType()).toBe('title');

    card.dispatchEvent(createPointerEvent('pointerup', { clientX: 16, clientY: 16 }));
    await flushPromises();

    expect(uiOverlay.querySelector('[data-detail]')).not.toBeNull();

    const playButton = uiOverlay.querySelector('[data-detail-play]') as HTMLElement;
    expect(playButton).not.toBeNull();
    playButton.dispatchEvent(createPointerEvent('pointerdown', { clientX: 24, clientY: 24 }));
    await flushPromises();

    expect(manager.getCurrentType()).toBe('title');

    playButton.dispatchEvent(createPointerEvent('pointerup', { clientX: 24, clientY: 24 }));
    await flushPromises();

      expect(manager.getCurrentType()).toBe('stage');
      expect(log).toContainEqual({
        type: 'stage',
       context: {
         stageNumber: 2,
         totalScore: 0,
         totalStarCount: 0,
         launchSource: 'encyclopedia',
       },
      });
    });

  it('cancels encyclopedia detail open and stage launch after scroll-like movement', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    const titleScene = new TitleScene(
      manager,
      createMockSaveManager(),
      createMockAudioManager(),
      {
        loadingOverlay,
        loadEncyclopediaOverlay: vi.fn(async () => ({ EncyclopediaOverlay })),
      },
    );

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', createTrackingScene(log, 'stage'));

    await manager.transitionTo('title');

    const encyclopediaBtn = Array.from(uiOverlay.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('ずかん'),
    ) as HTMLButtonElement;
    dispatchReleaseConfirm(encyclopediaBtn);
    await flushPromises();
    await flushPromises();

    const card = uiOverlay.querySelector('[data-card][data-stage="2"]') as HTMLElement;
    dispatchCancelledReleaseConfirm(
      card,
      { clientX: 30, clientY: 10 },
      { clientX: 10, clientY: 10 },
    );
    await flushPromises();

    expect(uiOverlay.querySelector('[data-detail]')).toBeNull();
    expect(manager.getCurrentType()).toBe('title');

    dispatchReleaseConfirm(card, { clientX: 10, clientY: 10 });
    await flushPromises();

    const playButton = uiOverlay.querySelector('[data-detail-play]') as HTMLElement;
    dispatchCancelledReleaseConfirm(
      playButton,
      { clientX: 40, clientY: 12 },
      { clientX: 12, clientY: 12 },
    );
    await flushPromises();

    expect(manager.getCurrentType()).toBe('title');
    expect(log).toEqual([]);
    expect(uiOverlay.querySelector('[data-detail]')).not.toBeNull();
  });

  it('reuses the loaded encyclopedia module on the second open', async () => {
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    const loadEncyclopediaOverlay = vi.fn(async () => ({ EncyclopediaOverlay }));
    const titleScene = new TitleScene(
      manager,
      createMockSaveManager(),
      createMockAudioManager(),
      {
        loadingOverlay,
        loadEncyclopediaOverlay,
      },
    );

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', createTrackingScene([], 'stage'));

    await manager.transitionTo('title');

    const encyclopediaBtn = () =>
      Array.from(uiOverlay.querySelectorAll('button')).find(
        (button) => button.textContent?.includes('ずかん'),
      ) as HTMLButtonElement;

    dispatchReleaseConfirm(encyclopediaBtn());
    await flushPromises();
    await flushPromises();
    const backButton = uiOverlay.querySelector('[data-gallery-back]') as HTMLElement;
    dispatchReleaseConfirm(backButton);

    dispatchReleaseConfirm(encyclopediaBtn());
    await flushPromises();
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(uiOverlay.querySelector('[data-card][data-stage="2"]')).not.toBeNull();
  });

  it('opens the encyclopedia without loading UI after idle prefetch completes', async () => {
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    const idleCallbacks: Array<() => void> = [];
    const loadEncyclopediaOverlay = vi.fn(async () => ({ EncyclopediaOverlay }));
    const titleScene = new TitleScene(
      manager,
      createMockSaveManager(),
      createMockAudioManager(),
      {
        loadingOverlay,
        loadEncyclopediaOverlay,
        scheduleIdleTask: (callback) => idleCallbacks.push(callback),
      },
    );

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', createTrackingScene([], 'stage'));

    await manager.transitionTo('title');

    expect(loadEncyclopediaOverlay).not.toHaveBeenCalled();
    idleCallbacks[0]?.();
    await flushPromises();
    await flushPromises();

    const encyclopediaBtn = Array.from(uiOverlay.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('ずかん'),
    ) as HTMLButtonElement;
    dispatchReleaseConfirm(encyclopediaBtn);
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(uiOverlay.querySelector('[data-card][data-stage="2"]')).not.toBeNull();
  });

  it('shows retry UI when encyclopedia lazy-load fails and opens after retry', async () => {
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    const loadFailureOverlay = new LoadFailureOverlay();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let attempt = 0;
    const loadEncyclopediaOverlay = vi.fn(async () => {
      attempt += 1;
      if (attempt === 1) {
        throw new Error('encyclopedia chunk failed');
      }
      return { EncyclopediaOverlay };
    });
    const titleScene = new TitleScene(
      manager,
      createMockSaveManager(),
      createMockAudioManager(),
      {
        loadingOverlay,
        loadFailureOverlay,
        loadEncyclopediaOverlay,
        scheduleIdleTask: () => {},
      },
    );

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', createTrackingScene([], 'stage'));

    await manager.transitionTo('title');

    const encyclopediaBtn = Array.from(uiOverlay.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('ずかん'),
    ) as HTMLButtonElement;
    dispatchReleaseConfirm(encyclopediaBtn);
    await flushPromises();
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-load-failure-overlay]')).not.toBeNull();

    const retryButton = document.querySelector('[data-load-failure-primary]') as HTMLButtonElement;
    retryButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(2);
    expect(document.querySelector('[data-load-failure-overlay]')).toBeNull();
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(uiOverlay.querySelector('[data-card][data-stage="2"]')).not.toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load encyclopedia overlay', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('ignores a resolved encyclopedia lazy-load after leaving title, then reopens after returning', async () => {
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    let resolveModule: ((value: { EncyclopediaOverlay: typeof EncyclopediaOverlay }) => void) | null = null;
    const loadEncyclopediaOverlay = vi.fn(
      () =>
        new Promise<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>((resolve) => {
          resolveModule = resolve;
        }),
    );
    const titleScene = new TitleScene(
      manager,
      createMockSaveManager(),
      createMockAudioManager(),
      {
        loadingOverlay,
        loadEncyclopediaOverlay,
      },
    );

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', createTrackingScene([], 'stage'));

    await manager.transitionTo('title');

    const findEncyclopediaButton = () =>
      Array.from(uiOverlay.querySelectorAll('button')).find(
        (button) => button.textContent?.includes('ずかん'),
      ) as HTMLButtonElement;

    dispatchReleaseConfirm(findEncyclopediaButton());
    expect(document.querySelector('[data-loading-overlay]')).not.toBeNull();

    await manager.requestTransition('stage', {
      stageNumber: 1,
      totalScore: 0,
      totalStarCount: 0,
    });

    resolveModule?.({ EncyclopediaOverlay });
    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(manager.getCurrentType()).toBe('stage');
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-load-failure-overlay]')).toBeNull();
    expect(uiOverlay.querySelector('[data-card]')).toBeNull();

    await manager.requestTransition('title');

    dispatchReleaseConfirm(findEncyclopediaButton());
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(uiOverlay.querySelector('[data-card][data-stage="2"]')).not.toBeNull();
  });

  it('ignores encyclopedia lazy-load failures after leaving title', async () => {
    const manager = new SceneManager();
    const loadingOverlay = new LoadingOverlay();
    const loadFailureOverlay = new LoadFailureOverlay();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let rejectModule: ((reason?: unknown) => void) | null = null;
    const loadEncyclopediaOverlay = vi.fn(
      () =>
        new Promise<{ EncyclopediaOverlay: typeof EncyclopediaOverlay }>((_resolve, reject) => {
          rejectModule = reject;
        }),
    );
    const titleScene = new TitleScene(
      manager,
      createMockSaveManager(),
      createMockAudioManager(),
      {
        loadingOverlay,
        loadFailureOverlay,
        loadEncyclopediaOverlay,
      },
    );

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', createTrackingScene([], 'stage'));

    await manager.transitionTo('title');

    const encyclopediaBtn = Array.from(uiOverlay.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('ずかん'),
    ) as HTMLButtonElement;
    dispatchReleaseConfirm(encyclopediaBtn);
    expect(document.querySelector('[data-loading-overlay]')).not.toBeNull();

    await manager.requestTransition('stage', {
      stageNumber: 1,
      totalScore: 0,
      totalStarCount: 0,
    });

    rejectModule?.(new Error('encyclopedia chunk failed after exit'));
    await flushPromises();
    await flushPromises();
    await flushPromises();

    expect(manager.getCurrentType()).toBe('stage');
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(document.querySelector('[data-load-failure-overlay]')).toBeNull();
    expect(uiOverlay.querySelector('[data-card]')).toBeNull();
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('restarts from zero totals after returning to title and pressing "あそぶ" again', async () => {
    const manager = new SceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager();
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const titleScene = new TitleScene(manager, saveManager, audioManager);
    const stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
    const stageInternal = stageScene as unknown as {
      scoreSystem: {
        setTotalScore(score: number): void;
        setTotalStarCount(count: number): void;
        getTotalScore(): number;
        getTotalStarCount(): number;
      };
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
    };

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', stageScene);

    await manager.transitionTo('title');

    const playButton = Array.from(uiOverlay.querySelectorAll('button')).find(
      (button) => button.textContent === 'あそぶ',
    ) as HTMLButtonElement;
    dispatchReleaseConfirm(playButton);
    await flushPromises();

    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;
    stageInternal.scoreSystem.setTotalScore(1200);
    stageInternal.scoreSystem.setTotalStarCount(12);

    manager.requestTransition('title');
    await flushPromises();

    const replayButton = Array.from(uiOverlay.querySelectorAll('button')).find(
      (button) => button.textContent === 'あそぶ',
    ) as HTMLButtonElement;
    dispatchReleaseConfirm(replayButton);
    await flushPromises();

    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;

    expect(stageInternal.scoreSystem.getTotalScore()).toBe(0);
    expect(stageInternal.scoreSystem.getTotalStarCount()).toBe(0);
  });

  it('ずかん起動ステージのクリア画面はタイトルへ表示で次プレビューを出さない', async () => {
    const manager = new SceneManager();
    const requestTransitionSpy = vi.spyOn(manager, 'requestTransition');
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager();
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const titleScene = new TitleScene(manager, saveManager, audioManager, {
      loadEncyclopediaOverlay: async () => ({ EncyclopediaOverlay }),
    });
    const stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
    const stageInternal = stageScene as unknown as StageSceneInternals & {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
    };

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', stageScene);

    await manager.transitionTo('title');

    const encyclopediaBtn = Array.from(uiOverlay.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('ずかん'),
    ) as HTMLButtonElement;
    dispatchReleaseConfirm(encyclopediaBtn);
    await flushPromises();
    await flushPromises();

    const card = uiOverlay.querySelector('[data-card][data-stage="2"]') as HTMLElement;
    dispatchReleaseConfirm(card);
    await flushPromises();

    const playButton = uiOverlay.querySelector('[data-detail-play]') as HTMLElement;
    dispatchReleaseConfirm(playButton);
    await flushPromises();

    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;
    stageInternal.onStageClear();
    finishBonusSequence(stageInternal);

    const continueButton = document.querySelector('[data-stage-clear-continue]') as HTMLButtonElement | null;
    expect(continueButton?.textContent).toBe('タイトルへ');
    expect(document.querySelector('[data-stage-clear-next-preview]')).toBeNull();
    expect(document.querySelector('[data-stage-clear-retry]')?.textContent).toBe('もういちど');
    expect(document.querySelector('[data-stage-clear-overlay]')?.textContent).toContain('⭐');

    const retryButton = document.querySelector('[data-stage-clear-retry]') as HTMLButtonElement | null;
    expect(retryButton).not.toBeNull();
    dispatchReleaseConfirm(retryButton!);
    await flushPromises();

    expect(manager.getCurrentType()).toBe('stage');
    expect(requestTransitionSpy).toHaveBeenNthCalledWith(2, 'stage', {
      stageNumber: 2,
      totalScore: 0,
      totalStarCount: 0,
      launchSource: 'encyclopedia',
      replayToken: expect.any(Number),
    });

    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;
    stageInternal.onStageClear();
    finishBonusSequence(stageInternal);

    const retryClearContinueButton = document.querySelector('[data-stage-clear-continue]') as HTMLButtonElement | null;
    expect(retryClearContinueButton?.textContent).toBe('タイトルへ');
    expect(document.querySelector('[data-stage-clear-next-preview]')).toBeNull();

    dispatchReleaseConfirm(retryClearContinueButton!);
    await flushPromises();

    expect(manager.getCurrentType()).toBe('title');
  });
});
