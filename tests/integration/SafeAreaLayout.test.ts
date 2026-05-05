// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TitleScene } from '../../src/game/scenes/TitleScene';
import { StageScene } from '../../src/game/scenes/StageScene';
import type { SceneManager } from '../../src/game/SceneManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';

function createSceneManager(): SceneManager {
  return {
    requestTransition: vi.fn(),
    registerScene: vi.fn(),
    transitionTo: vi.fn(),
    update: vi.fn(),
    getCurrentThreeScene: vi.fn(),
    getCurrentCamera: vi.fn(),
    setTransitionHandler: vi.fn(),
  } as unknown as SceneManager;
}

function createTitleSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [],
      tutorialShown: true,
      bestStageStars: {},
      muted: false,
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markTutorialShown: vi.fn(),
  } as unknown as SaveManager;
}

function createStageSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], muted: false, bestStageStars: {} })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;
}

function createAudioManager(): AudioManager {
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
    initFromInteraction: vi.fn(),
    dispose: vi.fn(),
  } as unknown as AudioManager;
}

function createInputSystem(): InputSystem {
  return {
    getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    setBoostPressed: vi.fn(),
  } as unknown as InputSystem;
}

describe('safe-area root layout integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders title controls under the root containers without child safe-area offsets', () => {
    const scene = new TitleScene(createSceneManager(), createTitleSaveManager(), createAudioManager());

    scene.enter({});

    const hudRoot = document.getElementById('hud')!;
    const overlayRoot = document.getElementById('ui-overlay')!;
    const muteButton = document.querySelector('button[data-mute-button]') as HTMLButtonElement | null;
    const tutorialButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent === 'あそびかた',
    ) as HTMLButtonElement | undefined;
    const encyclopediaButton = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.startsWith('ずかん'),
    ) as HTMLButtonElement | undefined;

    expect(muteButton).not.toBeNull();
    expect(hudRoot.contains(muteButton)).toBe(true);
    expect(overlayRoot.contains(tutorialButton ?? null)).toBe(true);
    expect(overlayRoot.contains(encyclopediaButton ?? null)).toBe(true);
    expect(muteButton?.style.right).toBe('1rem');
    expect(tutorialButton?.style.right).toBe('');
    expect(encyclopediaButton?.style.left).toBe('');
    expect(`${muteButton?.style.cssText}${tutorialButton?.style.cssText}${encyclopediaButton?.style.cssText}`).not.toContain('env(');

    scene.exit();
  });

  it('renders stage controls under the root containers without child safe-area offsets', () => {
    const scene = new StageScene(
      createSceneManager(),
      createInputSystem(),
      createAudioManager(),
      createStageSaveManager(),
    );

    scene.enter({ stageNumber: 1 });

    const hudRoot = document.getElementById('hud')!;
    const overlayRoot = document.getElementById('ui-overlay')!;
    const homeButton = document.querySelector('button[aria-label="ホームへ もどる"]') as HTMLButtonElement | null;
    const muteButton = document.querySelector('button[data-mute-button]') as HTMLButtonElement | null;
    const boostButton = document.querySelector('button[aria-label="ブースト"]') as HTMLButtonElement | null;
    const touchGuide = document.querySelector('[data-touch-guide-overlay]') as HTMLElement | null;

    expect(homeButton).not.toBeNull();
    expect(muteButton).not.toBeNull();
    expect(boostButton).not.toBeNull();
    expect(touchGuide).not.toBeNull();
    expect(hudRoot.contains(homeButton)).toBe(true);
    expect(hudRoot.contains(muteButton)).toBe(true);
    expect(overlayRoot.contains(boostButton)).toBe(true);
    expect(overlayRoot.contains(touchGuide)).toBe(true);
    expect(homeButton?.style.left).toBe('1rem');
    expect(muteButton?.style.right).toBe('1rem');
    expect(boostButton?.style.right).toBe('2rem');
    expect(boostButton?.style.bottom).toBe('2rem');
    expect(`${homeButton?.style.cssText}${muteButton?.style.cssText}${boostButton?.style.cssText}${touchGuide?.style.cssText}`).not.toContain('env(');

    scene.exit();
  });
});
