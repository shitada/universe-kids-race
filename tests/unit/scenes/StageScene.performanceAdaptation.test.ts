// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Star } from '../../../src/game/entities/Star';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const inputState = { moveDirection: 0 as -1 | 0 | 1, boostPressed: false };
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: vi.fn(),
    resetPointers: vi.fn(),
  } as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], muted: false, bestStageStars: {} })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;

  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  scene.setVisualQualityTier(2);
  scene.enter({ stageNumber: 1, replayToken: 1, totalScore: 0, totalStarCount: 0 });

  const internal = scene as unknown as {
    countdownOverlay: { dispose(): void } | null;
    isStarting: boolean;
  };
  internal.countdownOverlay?.dispose();
  internal.countdownOverlay = null;
  internal.isStarting = false;
  return scene;
}

function runFrames(scene: StageScene, frameCount: number, deltaTime: number): void {
  const internal = scene as unknown as {
    update(deltaTime: number): void;
  };
  for (let index = 0; index < frameCount; index += 1) {
    internal.update(deltaTime);
  }
}

describe('StageScene performance adaptation', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('reduces background star density and LOD distance when adaptation is raised', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      bgStars: THREE.Points;
      spaceship: { position: { x: number; y: number; z: number } };
      stars: Star[];
      threeScene: THREE.Scene;
      update(deltaTime: number): void;
    };

    const baseCount = internal.bgStars.geometry.drawRange.count;
    const midDistanceStar = new Star(0, 0, internal.spaceship.position.z - 40, 'NORMAL');
    internal.stars.push(midDistanceStar);
    internal.threeScene.add(midDistanceStar.mesh);

    internal.update(0.016);
    expect(midDistanceStar.getLODLevel()).toBe('mid');

    scene.setPerformanceAdaptationLevel(2);
    internal.update(0.016);

    expect(internal.bgStars.geometry.drawRange.count).toBeLessThan(baseCount);
    expect(midDistanceStar.getLODLevel()).toBe('far');
  });

  it('shows a child-friendly hint when the scene is lightened', () => {
    const scene = createScene();

    scene.showFrameRateHint(1);

    expect(document.body.textContent).toContain('じどうで かるくしたよ');
  });

  it('automatically lowers the quality tier after sustained low fps', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      bgStars: THREE.Points;
    };
    const baseCount = internal.bgStars.geometry.drawRange.count;

    runFrames(scene, 110, 1 / 30);

    expect(internal.bgStars.geometry.drawRange.count).toBeLessThan(baseCount);
    expect(document.body.textContent).toContain('じどうで かるくしたよ');
  });

  it('keeps the auto-adjusted quality across stage re-entry', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      bgStars: THREE.Points;
    };
    const baseCount = internal.bgStars.geometry.drawRange.count;

    runFrames(scene, 110, 1 / 30);
    const degradedCount = internal.bgStars.geometry.drawRange.count;
    expect(degradedCount).toBeLessThan(baseCount);

    scene.exit();
    scene.enter({ stageNumber: 2, replayToken: 2, totalScore: 100, totalStarCount: 5 });

    const nextInternal = scene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      bgStars: THREE.Points;
    };
    nextInternal.countdownOverlay?.dispose();
    nextInternal.countdownOverlay = null;
    nextInternal.isStarting = false;

    expect(nextInternal.bgStars.geometry.drawRange.count).toBe(degradedCount);
  });
});
