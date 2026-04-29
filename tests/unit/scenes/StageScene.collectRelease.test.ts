// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Star } from '../../../src/game/entities/Star';
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
  stars: Star[];
  spawnSystem: { releaseStar: (s: Star) => void };
  releaseCollectedStars: (collected: readonly Star[]) => void;
}

describe('StageScene.releaseCollectedStars', () => {
  it('removes collected stars from this.stars in-place in the same frame', () => {
    const scene = createScene();
    const internals = scene as unknown as Internals;
    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;

    const a = new Star(0, 0, -10);
    const b = new Star(0, 0, -5);
    const c = new Star(0, 0, 0);
    [a, b, c].forEach((s) => threeScene.add(s.mesh));

    const starsRef = [a, b, c];
    internals.stars = starsRef;

    // Simulate CollisionSystem.collect() flagging b as collected.
    b.collect();

    internals.releaseCollectedStars([b]);

    // Same array instance, in-place compaction.
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

    const star = new Star(0, 0, -3);
    threeScene.add(star.mesh);
    internals.stars = [star];
    star.collect();

    expect(star.mesh.parent).toBe(threeScene);
    internals.releaseCollectedStars([star]);
    expect(star.mesh.parent).toBeNull();
  });

  it('calls spawnSystem.releaseStar exactly once per collected star', () => {
    const scene = createScene();
    const internals = scene as unknown as Internals;
    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;

    const s1 = new Star(0, 0, -10);
    const s2 = new Star(0, 0, -5);
    const s3 = new Star(0, 0, 0);
    [s1, s2, s3].forEach((s) => threeScene.add(s.mesh));
    internals.stars = [s1, s2, s3];
    s1.collect();
    s3.collect();

    const spy = vi.spyOn(internals.spawnSystem, 'releaseStar');
    internals.releaseCollectedStars([s1, s3]);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, s1);
    expect(spy).toHaveBeenNthCalledWith(2, s3);
  });

  it('is a no-op when no stars were collected this frame', () => {
    const scene = createScene();
    const internals = scene as unknown as Internals;
    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;

    const a = new Star(0, 0, -10);
    const b = new Star(0, 0, -5);
    [a, b].forEach((s) => threeScene.add(s.mesh));
    const starsRef = [a, b];
    internals.stars = starsRef;

    const spy = vi.spyOn(internals.spawnSystem, 'releaseStar');
    internals.releaseCollectedStars([]);

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

    const s1 = new Star(0, 0, -1);
    const s2 = new Star(0, 0, -2);
    const s3 = new Star(0, 0, -3);
    const s4 = new Star(0, 0, -4);
    const s5 = new Star(0, 0, -5);
    [s1, s2, s3, s4, s5].forEach((s) => threeScene.add(s.mesh));
    internals.stars = [s1, s2, s3, s4, s5];
    s2.collect();
    s4.collect();

    internals.releaseCollectedStars([s2, s4]);

    expect(internals.stars).toEqual([s1, s3, s5]);
    expect(s1.mesh.parent).toBe(threeScene);
    expect(s3.mesh.parent).toBe(threeScene);
    expect(s5.mesh.parent).toBe(threeScene);
  });
});
