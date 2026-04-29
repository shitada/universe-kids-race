// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Star } from '../../../src/game/entities/Star';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const sceneManager = {} as unknown as SceneManager;
  const inputSystem = {} as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    playSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

interface Internals {
  threeScene: THREE.Scene;
  spaceship: { position: { x: number; y: number; z: number } };
  stars: Star[];
  meteorites: Meteorite[];
  spawnSystem: { releaseStar: (s: Star) => void };
  cleanupPassedObjects: () => void;
}

// After merging releaseCollectedStars into cleanupPassedObjects, the unified
// per-frame pass must release a freshly collected star in the same frame even
// when its z position is still ahead of the behind-threshold.
describe('StageScene cleanup releases collected stars in the same frame', () => {
  it('removes collected stars from this.stars in-place via cleanupPassedObjects', () => {
    const scene = createScene();
    const internals = scene as unknown as Internals;
    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const a = new Star(0, 0, -10);
    const b = new Star(0, 0, -5);
    const c = new Star(0, 0, 0);
    [a, b, c].forEach((s) => threeScene.add(s.mesh));

    const starsRef = [a, b, c];
    internals.stars = starsRef;
    internals.meteorites = [];

    // Simulate CollisionSystem flagging b as collected.
    b.collect();

    internals.cleanupPassedObjects();

    expect(internals.stars).toBe(starsRef);
    expect(internals.stars).toHaveLength(2);
    expect(internals.stars).toEqual([a, c]);
    expect(internals.stars).not.toContain(b);
  });

  it('detaches the released star mesh from the scene', () => {
    const scene = createScene();
    const internals = scene as unknown as Internals;
    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const star = new Star(0, 0, -3);
    threeScene.add(star.mesh);
    internals.stars = [star];
    internals.meteorites = [];
    star.collect();

    expect(star.mesh.parent).toBe(threeScene);
    internals.cleanupPassedObjects();
    expect(star.mesh.parent).toBeNull();
  });

  it('calls spawnSystem.releaseStar exactly once per collected star', () => {
    const scene = createScene();
    const internals = scene as unknown as Internals;
    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const s1 = new Star(0, 0, -10);
    const s2 = new Star(0, 0, -5);
    const s3 = new Star(0, 0, 0);
    [s1, s2, s3].forEach((s) => threeScene.add(s.mesh));
    internals.stars = [s1, s2, s3];
    internals.meteorites = [];
    s1.collect();
    s3.collect();

    const spy = vi.spyOn(internals.spawnSystem, 'releaseStar');
    internals.cleanupPassedObjects();

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(s1);
    expect(spy).toHaveBeenCalledWith(s3);
  });

  it('is a no-op for collected-star release when no star is collected and none passed', () => {
    const scene = createScene();
    const internals = scene as unknown as Internals;
    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const a = new Star(0, 0, -10);
    const b = new Star(0, 0, -5);
    [a, b].forEach((s) => threeScene.add(s.mesh));
    const starsRef = [a, b];
    internals.stars = starsRef;
    internals.meteorites = [];

    const spy = vi.spyOn(internals.spawnSystem, 'releaseStar');
    internals.cleanupPassedObjects();

    expect(spy).not.toHaveBeenCalled();
    expect(internals.stars).toBe(starsRef);
    expect(internals.stars).toEqual([a, b]);
    expect(a.mesh.parent).toBe(threeScene);
    expect(b.mesh.parent).toBe(threeScene);
  });

  it('preserves uncollected survivors and their original order', () => {
    const scene = createScene();
    const internals = scene as unknown as Internals;
    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const s1 = new Star(0, 0, -1);
    const s2 = new Star(0, 0, -2);
    const s3 = new Star(0, 0, -3);
    const s4 = new Star(0, 0, -4);
    const s5 = new Star(0, 0, -5);
    [s1, s2, s3, s4, s5].forEach((s) => threeScene.add(s.mesh));
    internals.stars = [s1, s2, s3, s4, s5];
    internals.meteorites = [];
    s2.collect();
    s4.collect();

    internals.cleanupPassedObjects();

    expect(internals.stars).toEqual([s1, s3, s5]);
    expect(s1.mesh.parent).toBe(threeScene);
    expect(s3.mesh.parent).toBe(threeScene);
    expect(s5.mesh.parent).toBe(threeScene);
  });
});
