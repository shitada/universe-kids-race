// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as THREE from 'three';
import { TitleScene } from '../../../src/game/scenes/TitleScene';
import { EndingScene } from '../../../src/game/scenes/EndingScene';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { updateViewportSizeCache } from '../../../src/game/utils/getViewportSize';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';

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
    isInitialized: vi.fn(() => false),
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

function createMockSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
}

function createMockInputSystem(): InputSystem {
  return {
    update: vi.fn(),
    getInput: vi.fn(() => ({ x: 0, y: 0, boost: false })),
    dispose: vi.fn(),
  } as unknown as InputSystem;
}

function setWindowSize(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
}

function setVisualViewport(width: number, height: number): void {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: { width, height, addEventListener: () => {}, removeEventListener: () => {} },
  });
}

function clearVisualViewport(): void {
  Object.defineProperty(window, 'visualViewport', { configurable: true, value: undefined });
}

beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  setWindowSize(1024, 768);
  clearVisualViewport();
  updateViewportSizeCache();
});

afterEach(() => {
  const overlay = document.getElementById('ui-overlay');
  if (overlay) overlay.remove();
  clearVisualViewport();
  updateViewportSizeCache();
});

describe('getCamera() uses getViewportSize() (visualViewport priority)', () => {
  it('TitleScene aspect follows visualViewport, ignoring window.innerWidth/Height', () => {
    setVisualViewport(900, 600);
    setWindowSize(1024, 768);
    updateViewportSizeCache();
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({});
    const cam = scene.getCamera() as THREE.PerspectiveCamera;
    expect(cam.aspect).toBeCloseTo(900 / 600);

    // change only window.inner*, not visualViewport: aspect must not change
    setWindowSize(2048, 100);
    scene.getCamera();
    expect(cam.aspect).toBeCloseTo(900 / 600);
    scene.exit();
  });

  it('EndingScene aspect follows visualViewport when window.innerHeight diverges (URL-bar case)', () => {
    setVisualViewport(900, 600);
    setWindowSize(900, 800); // simulate iPad Safari URL bar visible
    updateViewportSizeCache();
    const scene = new EndingScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({ totalScore: 0, totalStarCount: 0 });
    const cam = scene.getCamera() as THREE.PerspectiveCamera;
    expect(cam.aspect).toBeCloseTo(900 / 600);
    scene.exit();
  });

  it('StageScene aspect follows visualViewport after the cached viewport is refreshed', () => {
    setVisualViewport(900, 600);
    setWindowSize(1280, 720);
    updateViewportSizeCache();
    const scene = new StageScene(
      createMockSceneManager(),
      createMockInputSystem(),
      createMockAudioManager(),
      createMockSaveManager(),
    );
    scene.enter({ stageNumber: 1 });
    const cam = scene.getCamera() as THREE.PerspectiveCamera;
    expect(cam.aspect).toBeCloseTo(900 / 600);

    setVisualViewport(800, 500);
    updateViewportSizeCache();
    scene.getCamera();
    expect(cam.aspect).toBeCloseTo(800 / 500);
    scene.exit();
  });

  it('falls back to window.innerWidth/Height when visualViewport is undefined', () => {
    clearVisualViewport();
    setWindowSize(1280, 720);
    updateViewportSizeCache();
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({});
    const cam = scene.getCamera() as THREE.PerspectiveCamera;
    expect(cam.aspect).toBeCloseTo(1280 / 720);
    scene.exit();
  });

  it('does not call updateProjectionMatrix when aspect is unchanged across calls (visualViewport stable)', () => {
    setVisualViewport(900, 600);
    updateViewportSizeCache();
    const scene = new StageScene(
      createMockSceneManager(),
      createMockInputSystem(),
      createMockAudioManager(),
      createMockSaveManager(),
    );
    scene.enter({ stageNumber: 1 });
    const cam = scene.getCamera() as THREE.PerspectiveCamera;
    const spy = vi.spyOn(cam, 'updateProjectionMatrix');
    scene.getCamera();
    scene.getCamera();
    scene.getCamera();
    expect(spy).toHaveBeenCalledTimes(0);
    scene.exit();
  });

  it('updates TitleScene aspect only after the viewport cache is refreshed for URL-bar/orientation changes', () => {
    setVisualViewport(900, 600);
    updateViewportSizeCache();
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({});
    const cam = scene.getCamera() as THREE.PerspectiveCamera;
    const spy = vi.spyOn(cam, 'updateProjectionMatrix');

    setVisualViewport(600, 900);
    scene.getCamera();
    expect(cam.aspect).toBeCloseTo(900 / 600);
    expect(spy).toHaveBeenCalledTimes(0);

    updateViewportSizeCache();
    scene.getCamera();
    expect(cam.aspect).toBeCloseTo(600 / 900);
    expect(spy).toHaveBeenCalledTimes(1);
    scene.exit();
  });
});
