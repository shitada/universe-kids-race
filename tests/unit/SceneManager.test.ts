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
  it('registers and transitions to a scene', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    manager.registerScene('title', titleScene);
    await manager.transitionTo('title');
    expect(titleScene.enter).toHaveBeenCalledWith({});
  });

  it('calls exit on current scene when transitioning', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    manager.registerScene('title', titleScene);
    manager.registerScene('stage', stageScene);

    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 1 });

    expect(titleScene.exit).toHaveBeenCalled();
    expect(stageScene.enter).toHaveBeenCalledWith({ stageNumber: 1 });
  });

  it('passes context through transitions title → stage → ending', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    const endingScene = createMockScene();

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', stageScene);
    manager.registerScene('ending', endingScene);

    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 1 });
    await manager.transitionTo('ending', { totalScore: 1500, totalStarCount: 10 });

    expect(endingScene.enter).toHaveBeenCalledWith({
      totalScore: 1500,
      totalStarCount: 10,
    });
  });

  it('updates the current scene', async () => {
    const manager = new SceneManager();
    const scene = createMockScene();
    manager.registerScene('title', scene);
    await manager.transitionTo('title');
    manager.update(0.016);
    expect(scene.update).toHaveBeenCalledWith(0.016);
  });

  it('returns current Three.js scene and camera', async () => {
    const manager = new SceneManager();
    const scene = createMockScene();
    manager.registerScene('title', scene);
    await manager.transitionTo('title');
    expect(manager.getCurrentThreeScene()).toBeInstanceOf(THREE.Scene);
    expect(manager.getCurrentCamera()).toBeInstanceOf(THREE.PerspectiveCamera);
  });

  it('returns current scene type', async () => {
    const manager = new SceneManager();
    const scene = createMockScene();
    manager.registerScene('stage', scene);
    await manager.transitionTo('stage', { stageNumber: 2 });
    expect(manager.getCurrentType()).toBe('stage');
  });

  it('lazy-loads a scene once and reuses it on later transitions', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    const factory = vi.fn(async () => stageScene);

    manager.registerScene('title', titleScene);
    manager.registerSceneFactory('stage', factory);

    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 1 });
    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 2 });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(stageScene.enter).toHaveBeenNthCalledWith(1, { stageNumber: 1 });
    expect(stageScene.enter).toHaveBeenNthCalledWith(2, { stageNumber: 2 });
  });

  it('coalesces repeated transitions while a lazy scene is still loading', async () => {
    let resolveScene: ((scene: Scene) => void) | null = null;
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    const factory = vi.fn(
      () =>
        new Promise<Scene>((resolve) => {
          resolveScene = resolve;
        }),
    );
    const loadStateHandler = vi.fn();

    manager.registerScene('title', titleScene);
    manager.registerSceneFactory('stage', factory);
    manager.setLoadStateHandler(loadStateHandler);

    await manager.transitionTo('title');
    const first = manager.transitionTo('stage', { stageNumber: 1 });
    const second = manager.transitionTo('stage', { stageNumber: 1 });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(stageScene.enter).not.toHaveBeenCalled();
    expect(loadStateHandler).toHaveBeenNthCalledWith(1, true, 'stage');

    resolveScene?.(stageScene);
    await Promise.all([first, second]);

    expect(stageScene.enter).toHaveBeenCalledTimes(1);
    expect(loadStateHandler).toHaveBeenNthCalledWith(2, false, 'stage');
  });

  it('prefetches a lazy scene and skips loading state on the later transition', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    const factory = vi.fn(async () => stageScene);
    const loadStateHandler = vi.fn();

    manager.registerScene('title', titleScene);
    manager.registerSceneFactory('stage', factory);
    manager.setLoadStateHandler(loadStateHandler);

    await manager.prefetchScene('stage');
    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 1 });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(loadStateHandler).not.toHaveBeenCalled();
    expect(stageScene.enter).toHaveBeenCalledWith({ stageNumber: 1 });
  });
});
