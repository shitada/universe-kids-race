// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TitleScene } from '../../../src/game/scenes/TitleScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';

function createMockSceneManager(): SceneManager {
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

function createMockAudioManager(): AudioManager {
  return {
    init: vi.fn(),
    initSync: vi.fn(),
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    ensureResumed: vi.fn(),
    dispose: vi.fn(),
  } as unknown as AudioManager;
}

function createMockSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
}

beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  return () => {
    overlay.remove();
  };
});

describe('TitleScene (T009)', () => {
  it('overlay pointerdown calls initSync() but NOT playBGM()', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager();

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    const uiOverlay = document.getElementById('ui-overlay')!;
    // The overlay div created by TitleScene is the first child of ui-overlay
    const titleOverlay = uiOverlay.firstElementChild as HTMLDivElement;
    expect(titleOverlay).toBeTruthy();

    // Simulate pointerdown on the overlay (not on the button)
    const event = new Event('pointerdown', { bubbles: true });
    titleOverlay.dispatchEvent(event);

    expect(audioManager.initSync).toHaveBeenCalled();
    expect(audioManager.playBGM).not.toHaveBeenCalled();

    scene.exit();
  });

  it('"あそぶ" button calls initSync() and playBGM()', () => {
    const sceneManager = createMockSceneManager();
    const saveManager = createMockSaveManager();
    const audioManager = createMockAudioManager();

    const scene = new TitleScene(sceneManager, saveManager, audioManager);
    scene.enter({});

    const uiOverlay = document.getElementById('ui-overlay')!;
    // Find the "あそぶ" button
    const buttons = uiOverlay.querySelectorAll('button');
    const playButton = Array.from(buttons).find(b => b.textContent === 'あそぶ');
    expect(playButton).toBeTruthy();

    const event = new Event('pointerdown', { bubbles: true });
    playButton!.dispatchEvent(event);

    expect(audioManager.initSync).toHaveBeenCalled();
    expect(audioManager.playBGM).toHaveBeenCalledWith(0);

    scene.exit();
  });
});
