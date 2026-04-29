// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import {
  EndingScene,
  __resetEndingSceneSharedAssetsForTest,
  __endingSceneSharedAssetsForTest,
} from '../../../src/game/scenes/EndingScene';
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
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
}

function createMockSaveManager(): SaveManager {
  return {
    load: vi.fn(() => ({ clearedStage: 11, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
}

function findStars(scene: EndingScene): THREE.Points | null {
  const three = scene.getThreeScene();
  for (const child of three.children) {
    if ((child as THREE.Points).isPoints) return child as THREE.Points;
  }
  return null;
}

beforeEach(() => {
  __resetEndingSceneSharedAssetsForTest();
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  return () => {
    overlay.remove();
  };
});

describe('EndingScene shared bg-stars cache', () => {
  it('reuses the same geometry / material instances across re-entries (AC2)', () => {
    const scene = new EndingScene(
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

    expect(__endingSceneSharedAssetsForTest.getBgStarsGeometry()).toBe(geo1);
    expect(__endingSceneSharedAssetsForTest.getBgStarsMaterial()).toBe(mat1);
  });

  it('attaches exactly one Points referencing shared assets and marks userData.sharedAssets (AC3)', () => {
    const scene = new EndingScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({});
    const three = scene.getThreeScene();
    const points = three.children.filter((c) => (c as THREE.Points).isPoints);
    expect(points).toHaveLength(1);
    const p = points[0] as THREE.Points;
    expect(p.geometry).toBe(__endingSceneSharedAssetsForTest.getBgStarsGeometry());
    expect(p.material).toBe(__endingSceneSharedAssetsForTest.getBgStarsMaterial());
    expect(p.userData.sharedAssets).toBe(true);
    scene.exit();
  });

  it('exit() does not dispose shared geometry / material and detaches Points (AC4)', () => {
    const scene = new EndingScene(
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

  it('resets bgStars rotation on re-entry so previous rotation does not carry over', () => {
    const scene = new EndingScene(
      createMockSceneManager(),
      createMockSaveManager(),
      createMockAudioManager(),
    );
    scene.enter({});
    let stars = findStars(scene)!;
    scene.update(1);
    expect(stars.rotation.y).toBeGreaterThan(0);
    scene.exit();

    scene.enter({});
    stars = findStars(scene)!;
    expect(stars.rotation.y).toBe(0);
    scene.exit();
  });
});
