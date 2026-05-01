// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TitleScene } from '../../src/game/scenes/TitleScene';
import { StageScene } from '../../src/game/scenes/StageScene';
import { SceneManager } from '../../src/game/SceneManager';
import { LoadingOverlay } from '../../src/ui/LoadingOverlay';
import { EncyclopediaOverlay } from '../../src/ui/EncyclopediaOverlay';
import type { Scene, SceneContext, SceneType } from '../../src/types';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import * as THREE from 'three';

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

describe('Encyclopedia Stage Selection Integration', () => {
  let uiOverlay: HTMLDivElement;
  let hud: HTMLDivElement;

  beforeEach(() => {
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

  it('lazy-loads the encyclopedia on first open, then transitions to the selected stage', async () => {
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
    encyclopediaBtn.dispatchEvent(new Event('pointerdown', { bubbles: true }));

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

    card.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    expect(manager.getCurrentType()).toBe('stage');
    expect(log).toContainEqual({
      type: 'stage',
      context: { stageNumber: 2, totalScore: 0, totalStarCount: 0 },
    });
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

    encyclopediaBtn().dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();
    const backButton = uiOverlay.querySelector('[data-gallery-back]') as HTMLElement;
    backButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    encyclopediaBtn().dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();
    await flushPromises();

    expect(loadEncyclopediaOverlay).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-loading-overlay]')).toBeNull();
    expect(uiOverlay.querySelector('[data-card][data-stage="2"]')).not.toBeNull();
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
    playButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
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
    replayButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    await flushPromises();

    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;

    expect(stageInternal.scoreSystem.getTotalScore()).toBe(0);
    expect(stageInternal.scoreSystem.getTotalStarCount()).toBe(0);
  });
});
