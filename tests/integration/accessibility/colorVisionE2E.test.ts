// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TitleScene } from '../../../src/game/scenes/TitleScene';
import { SaveManager } from '../../../src/game/storage/SaveManager';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import {
  getActiveColorVisionSupportMode,
  setActiveColorVisionSupportMode,
} from '../../../src/game/effects/ColorVisionPostProcessor';

const storage = new Map<string, string>();
const localStorageMock = {
  getItem: vi.fn((key: string) => storage.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
  removeItem: vi.fn((key: string) => storage.delete(key)),
  clear: vi.fn(() => storage.clear()),
  length: 0,
  key: vi.fn(() => null),
};
const sessionStore = new Map<string, string>();
const sessionStorageMock = {
  getItem: vi.fn((key: string) => sessionStore.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => sessionStore.set(key, value)),
  removeItem: vi.fn((key: string) => sessionStore.delete(key)),
  clear: vi.fn(() => sessionStore.clear()),
  length: 0,
  key: vi.fn(() => null),
};

vi.stubGlobal('localStorage', localStorageMock);
vi.stubGlobal('sessionStorage', sessionStorageMock);

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

function dispatchReleaseConfirm(button: HTMLElement): void {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

describe('color vision accessibility flow', () => {
  beforeEach(() => {
    storage.clear();
    sessionStore.clear();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    setActiveColorVisionSupportMode('color-only');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    setActiveColorVisionSupportMode('color-only');
  });

  it('persists a selected filter and updates the active post-process mode from the title settings', () => {
    const saveManager = new SaveManager();
    saveManager.save({
      clearedStage: 0,
      unlockedPlanets: [],
      tutorialShown: true,
    });

    const scene = new TitleScene(createSceneManager(), saveManager, createAudioManager());
    scene.enter({});

    const settingsButton = document.querySelector('[data-color-settings-button]') as HTMLButtonElement | null;
    expect(settingsButton).not.toBeNull();
    dispatchReleaseConfirm(settingsButton!);

    const deuteranopiaButton = document.querySelector('[data-color-vision-mode-button="deuteranopia-filter"]') as HTMLButtonElement | null;
    deuteranopiaButton?.click();

    expect(saveManager.load().colorAccessibility).toEqual({ colorVisionSupportMode: 'deuteranopia-filter' });
    expect(getActiveColorVisionSupportMode()).toBe('deuteranopia-filter');

    scene.exit();
  });
});
