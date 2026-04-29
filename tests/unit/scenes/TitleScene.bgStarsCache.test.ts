// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import {
  TitleScene,
  __resetTitleSceneSharedAssetsForTest,
  __titleSceneSharedAssetsForTest,
} from '../../../src/game/scenes/TitleScene';
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

function findStars(scene: TitleScene): THREE.Points | null {
  const three = scene.getThreeScene();
  for (const child of three.children) {
    if ((child as THREE.Points).isPoints) return child as THREE.Points;
  }
  return null;
}

beforeEach(() => {
  __resetTitleSceneSharedAssetsForTest();
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  return () => {
    overlay.remove();
  };
});

describe('TitleScene shared bg-stars cache', () => {
  it('reuses the same geometry / material instances across re-entries (AC1)', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );

    scene.enter({});
    const stars1 = findStars(scene)!;
    expect(stars1).toBeTruthy();
    const geo1 = stars1.geometry;
    const mat1 = stars1.material as THREE.PointsMaterial;
    scene.exit();

    scene.enter({});
    const stars2 = findStars(scene)!;
    expect(stars2).toBeTruthy();
    expect(stars2.geometry).toBe(geo1);
    expect(stars2.material).toBe(mat1);
    scene.exit();

    expect(__titleSceneSharedAssetsForTest.getBgStarsGeometry()).toBe(geo1);
    expect(__titleSceneSharedAssetsForTest.getBgStarsMaterial()).toBe(mat1);
  });

  it('attaches exactly one Points to the scene referencing the shared assets (AC3)', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({});
    const three = scene.getThreeScene();
    const points = three.children.filter((c) => (c as THREE.Points).isPoints);
    expect(points).toHaveLength(1);
    const p = points[0] as THREE.Points;
    expect(p.geometry).toBe(__titleSceneSharedAssetsForTest.getBgStarsGeometry());
    expect(p.material).toBe(__titleSceneSharedAssetsForTest.getBgStarsMaterial());
    expect(p.userData.sharedAssets).toBe(true);
    scene.exit();
  });

  it('exit() does not dispose shared geometry / material and detaches Points (AC4)', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({});
    const stars = findStars(scene)!;
    const geo = stars.geometry;
    const mat = stars.material as THREE.PointsMaterial;
    const geoSpy = vi.spyOn(geo, 'dispose');
    const matSpy = vi.spyOn(mat, 'dispose');

    scene.exit();

    expect(geoSpy).not.toHaveBeenCalled();
    expect(matSpy).not.toHaveBeenCalled();
    expect(stars.parent).toBeNull();
  });

  it('resets stars rotation on re-entry so previous rotation does not carry over', () => {
    const scene = new TitleScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({});
    let stars = findStars(scene)!;
    // 1 秒進めて rotation.y を加算
    scene.update(1);
    expect(stars.rotation.y).toBeGreaterThan(0);
    scene.exit();

    scene.enter({});
    stars = findStars(scene)!;
    expect(stars.rotation.y).toBe(0);
    scene.exit();
  });
});
