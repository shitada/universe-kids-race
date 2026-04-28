// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as THREE from 'three';
import { TitleScene } from '../../../src/game/scenes/TitleScene';
import { EndingScene } from '../../../src/game/scenes/EndingScene';
import { StageScene } from '../../../src/game/scenes/StageScene';
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

function createMockInputSystem(): InputSystem {
  return {
    update: vi.fn(),
    getInput: vi.fn(() => ({ x: 0, y: 0, boost: false })),
    dispose: vi.fn(),
  } as unknown as InputSystem;
}

function setWindowSize(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    value: height,
  });
}

beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  setWindowSize(1024, 768);
});

afterEach(() => {
  const overlay = document.getElementById('ui-overlay');
  if (overlay) overlay.remove();
});

describe('getCamera() aspect-change-only updateProjectionMatrix', () => {
  describe('TitleScene', () => {
    it('updateProjectionMatrix is called only once when window size unchanged', () => {
      const scene = new TitleScene(
        createMockSceneManager(),
        createMockSaveManager(),
        createMockAudioManager(),
      );
      scene.enter({});
      const cam = scene.getCamera() as THREE.PerspectiveCamera;
      const spy = vi.spyOn(cam, 'updateProjectionMatrix');
      // First call after spy: should update because lastAspect is set, no change → no call
      scene.getCamera();
      scene.getCamera();
      scene.getCamera();
      expect(spy).toHaveBeenCalledTimes(0);
      scene.exit();
    });

    it('updateProjectionMatrix is called when aspect changes', () => {
      const scene = new TitleScene(
        createMockSceneManager(),
        createMockSaveManager(),
        createMockAudioManager(),
      );
      scene.enter({});
      const cam = scene.getCamera() as THREE.PerspectiveCamera;
      const spy = vi.spyOn(cam, 'updateProjectionMatrix');
      setWindowSize(800, 500);
      scene.getCamera();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cam.aspect).toBeCloseTo(800 / 500);
      // Repeated calls without change should not invoke again
      scene.getCamera();
      expect(spy).toHaveBeenCalledTimes(1);
      scene.exit();
    });
  });

  describe('EndingScene', () => {
    it('updateProjectionMatrix is called only once when window size unchanged', () => {
      const scene = new EndingScene(
        createMockSceneManager(),
        createMockSaveManager(),
        createMockAudioManager(),
      );
      scene.enter({ totalScore: 0, totalStarCount: 0 });
      const cam = scene.getCamera() as THREE.PerspectiveCamera;
      const spy = vi.spyOn(cam, 'updateProjectionMatrix');
      scene.getCamera();
      scene.getCamera();
      expect(spy).toHaveBeenCalledTimes(0);
      scene.exit();
    });

    it('updateProjectionMatrix is called when aspect changes', () => {
      const scene = new EndingScene(
        createMockSceneManager(),
        createMockSaveManager(),
        createMockAudioManager(),
      );
      scene.enter({ totalScore: 0, totalStarCount: 0 });
      const cam = scene.getCamera() as THREE.PerspectiveCamera;
      const spy = vi.spyOn(cam, 'updateProjectionMatrix');
      setWindowSize(640, 360);
      scene.getCamera();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cam.aspect).toBeCloseTo(640 / 360);
      scene.exit();
    });
  });

  describe('StageScene', () => {
    it('updateProjectionMatrix is called only once when window size unchanged', () => {
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
      expect(spy).toHaveBeenCalledTimes(0);
      scene.exit();
    });

    it('updateProjectionMatrix is called when aspect changes', () => {
      const scene = new StageScene(
        createMockSceneManager(),
        createMockInputSystem(),
        createMockAudioManager(),
        createMockSaveManager(),
      );
      scene.enter({ stageNumber: 1 });
      const cam = scene.getCamera() as THREE.PerspectiveCamera;
      const spy = vi.spyOn(cam, 'updateProjectionMatrix');
      setWindowSize(1280, 720);
      scene.getCamera();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(cam.aspect).toBeCloseTo(1280 / 720);
      scene.exit();
    });

    it('does not update when aspect is invalid (height 0)', () => {
      const scene = new StageScene(
        createMockSceneManager(),
        createMockInputSystem(),
        createMockAudioManager(),
        createMockSaveManager(),
      );
      scene.enter({ stageNumber: 1 });
      const cam = scene.getCamera() as THREE.PerspectiveCamera;
      const aspectBefore = cam.aspect;
      const spy = vi.spyOn(cam, 'updateProjectionMatrix');
      setWindowSize(1024, 0);
      scene.getCamera();
      expect(spy).toHaveBeenCalledTimes(0);
      expect(cam.aspect).toBe(aspectBefore);
      scene.exit();
    });
  });
});
