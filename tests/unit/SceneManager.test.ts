import { describe, it, expect, vi } from 'vitest';
import { SceneManager } from '../../src/game/SceneManager';
import type { Scene, SceneContext } from '../../src/types';
import * as THREE from 'three';

function createMockScene(): Scene {
  const threeScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  return {
    enter: vi.fn(),
    update: vi.fn(),
    exit: vi.fn(),
    getThreeScene: () => threeScene,
    getCamera: () => camera,
  };
}

describe('SceneManager', () => {
  it('registers and transitions to a scene', () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    manager.registerScene('title', titleScene);
    manager.transitionTo('title');
    expect(titleScene.enter).toHaveBeenCalledWith({});
  });

  it('calls exit on current scene when transitioning', () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    manager.registerScene('title', titleScene);
    manager.registerScene('stage', stageScene);

    manager.transitionTo('title');
    manager.transitionTo('stage', { stageNumber: 1 });

    expect(titleScene.exit).toHaveBeenCalled();
    expect(stageScene.enter).toHaveBeenCalledWith({ stageNumber: 1 });
  });

  it('passes context through transitions title → stage → ending', () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    const endingScene = createMockScene();

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', stageScene);
    manager.registerScene('ending', endingScene);

    manager.transitionTo('title');
    manager.transitionTo('stage', { stageNumber: 1 });
    manager.transitionTo('ending', { totalScore: 1500, totalStarCount: 10 });

    expect(endingScene.enter).toHaveBeenCalledWith({
      totalScore: 1500,
      totalStarCount: 10,
    });
  });

  it('updates the current scene', () => {
    const manager = new SceneManager();
    const scene = createMockScene();
    manager.registerScene('title', scene);
    manager.transitionTo('title');
    manager.update(0.016);
    expect(scene.update).toHaveBeenCalledWith(0.016);
  });

  it('returns current Three.js scene and camera', () => {
    const manager = new SceneManager();
    const scene = createMockScene();
    manager.registerScene('title', scene);
    manager.transitionTo('title');
    expect(manager.getCurrentThreeScene()).toBeInstanceOf(THREE.Scene);
    expect(manager.getCurrentCamera()).toBeInstanceOf(THREE.PerspectiveCamera);
  });

  it('returns current scene type', () => {
    const manager = new SceneManager();
    const scene = createMockScene();
    manager.registerScene('stage', scene);
    manager.transitionTo('stage', { stageNumber: 2 });
    expect(manager.getCurrentType()).toBe('stage');
  });
});
