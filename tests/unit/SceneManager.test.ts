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

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((resolver) => {
    resolve = resolver;
  });

  return { promise, resolve };
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

  it('no-ops when transitioning to the current title scene with the same context', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const loadStateHandler = vi.fn();
    const transitionErrorHandler = vi.fn();

    manager.registerScene('title', titleScene);
    manager.setLoadStateHandler(loadStateHandler);
    manager.setTransitionErrorHandler(transitionErrorHandler);

    await manager.transitionTo('title');
    await manager.transitionTo('title');

    expect(titleScene.enter).toHaveBeenCalledTimes(1);
    expect(titleScene.exit).not.toHaveBeenCalled();
    expect(loadStateHandler).not.toHaveBeenCalled();
    expect(transitionErrorHandler).not.toHaveBeenCalled();
  });

  it('no-ops when transitioning to the current stage scene with the same stage number', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    const loadStateHandler = vi.fn();
    const transitionErrorHandler = vi.fn();
    const factory = vi.fn(async () => stageScene);

    manager.registerScene('title', titleScene);
    manager.registerSceneFactory('stage', factory);
    manager.setLoadStateHandler(loadStateHandler);
    manager.setTransitionErrorHandler(transitionErrorHandler);

    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 1 });

    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'stage'],
      [false, 'stage'],
    ]);

    await manager.requestTransition('stage', { stageNumber: 1 });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(titleScene.exit).toHaveBeenCalledTimes(1);
    expect(stageScene.enter).toHaveBeenCalledTimes(1);
    expect(stageScene.exit).not.toHaveBeenCalled();
    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'stage'],
      [false, 'stage'],
    ]);
    expect(transitionErrorHandler).not.toHaveBeenCalled();
  });

  it('re-enters the current stage scene when the stage number changes', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();

    manager.registerScene('title', titleScene);
    manager.registerScene('stage', stageScene);

    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 1 });
    await manager.transitionTo('stage', { stageNumber: 2 });

    expect(titleScene.exit).toHaveBeenCalledTimes(1);
    expect(stageScene.exit).toHaveBeenCalledTimes(1);
    expect(stageScene.enter).toHaveBeenNthCalledWith(1, { stageNumber: 1 });
    expect(stageScene.enter).toHaveBeenNthCalledWith(2, { stageNumber: 2 });
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

  it('prefers the latest context when the same lazy scene type is requested again', async () => {
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
    const second = manager.transitionTo('stage', { stageNumber: 5 });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'stage'],
      [true, 'stage'],
    ]);

    resolveScene?.(stageScene);
    await Promise.all([first, second]);

    expect(stageScene.enter).toHaveBeenCalledTimes(1);
    expect(stageScene.enter).toHaveBeenCalledWith({ stageNumber: 5 });
    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'stage'],
      [true, 'stage'],
      [false, 'stage'],
    ]);
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

  it('falls back to lazy transition after a failed prefetch', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    const prefetchError = new Error('prefetch failed');
    const factory = vi
      .fn<() => Promise<Scene>>()
      .mockRejectedValueOnce(prefetchError)
      .mockResolvedValueOnce(stageScene);
    const loadStateHandler = vi.fn();
    const transitionErrorHandler = vi.fn();

    manager.registerScene('title', titleScene);
    manager.registerSceneFactory('stage', factory);
    manager.setLoadStateHandler(loadStateHandler);
    manager.setTransitionErrorHandler(transitionErrorHandler);

    await expect(manager.prefetchScene('stage')).rejects.toThrow('prefetch failed');
    await manager.transitionTo('title');
    await manager.requestTransition('stage', { stageNumber: 1 });

    expect(factory).toHaveBeenCalledTimes(2);
    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'stage'],
      [false, 'stage'],
    ]);
    expect(transitionErrorHandler).not.toHaveBeenCalled();
    expect(stageScene.enter).toHaveBeenCalledWith({ stageNumber: 1 });
  });

  it('prefetches a scene module without creating the scene until transition', async () => {
    const manager = new SceneManager();
    const stageScene = createMockScene();
    const prefetcher = vi.fn(async () => ({ StageScene: class {} }));
    const factory = vi.fn(async () => stageScene);

    manager.registerSceneModulePrefetch('stage', prefetcher);
    manager.registerSceneFactory('stage', factory);

    await manager.prefetchSceneModule('stage');

    expect(prefetcher).toHaveBeenCalledTimes(1);
    expect(factory).not.toHaveBeenCalled();

    await manager.transitionTo('stage', { stageNumber: 1 });

    expect(factory).toHaveBeenCalledTimes(1);
    expect(stageScene.enter).toHaveBeenCalledWith({ stageNumber: 1 });
  });

  it('coalesces repeated scene module prefetches', async () => {
    const manager = new SceneManager();
    const moduleDeferred = createDeferred<Record<string, unknown>>();
    const prefetcher = vi.fn(() => moduleDeferred.promise);

    manager.registerSceneModulePrefetch('stage', prefetcher);

    const first = manager.prefetchSceneModule('stage');
    const second = manager.prefetchSceneModule('stage');

    expect(prefetcher).toHaveBeenCalledTimes(1);

    moduleDeferred.resolve({ StageScene: class {} });
    await Promise.all([first, second]);

    expect(prefetcher).toHaveBeenCalledTimes(1);
  });

  it('keeps the latest title transition when an older lazy ending resolves later', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const endingScene = createMockScene();
    const endingDeferred = createDeferred<Scene>();
    const loadStateHandler = vi.fn();

    manager.registerScene('title', titleScene);
    manager.registerSceneFactory('ending', () => endingDeferred.promise);
    manager.setLoadStateHandler(loadStateHandler);

    await manager.transitionTo('title');

    const endingTransition = manager.transitionTo('ending', { totalScore: 1500, totalStarCount: 10 });
    await manager.transitionTo('title');

    expect(manager.getCurrentType()).toBe('title');
    expect(titleScene.exit).toHaveBeenCalledTimes(1);
    expect(titleScene.enter).toHaveBeenCalledTimes(2);
    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'ending'],
      [false, 'ending'],
    ]);

    endingDeferred.resolve(endingScene);
    await endingTransition;

    expect(manager.getCurrentType()).toBe('title');
    expect(endingScene.enter).not.toHaveBeenCalled();
    expect(titleScene.exit).toHaveBeenCalledTimes(1);
    expect(loadStateHandler).toHaveBeenCalledTimes(2);
  });

  it('ignores stale lazy transitions for scene changes and loading state cleanup', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const stageScene = createMockScene();
    const endingScene = createMockScene();
    const endingDeferred = createDeferred<Scene>();
    const stageDeferred = createDeferred<Scene>();
    const loadStateHandler = vi.fn();

    manager.registerScene('title', titleScene);
    manager.registerSceneFactory('ending', () => endingDeferred.promise);
    manager.registerSceneFactory('stage', () => stageDeferred.promise);
    manager.setLoadStateHandler(loadStateHandler);

    await manager.transitionTo('title');

    const staleEndingTransition = manager.transitionTo('ending', { totalScore: 1500, totalStarCount: 10 });
    const latestStageTransition = manager.transitionTo('stage', { stageNumber: 1 });

    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'ending'],
      [true, 'stage'],
    ]);

    endingDeferred.resolve(endingScene);
    await staleEndingTransition;

    expect(manager.getCurrentType()).toBe('title');
    expect(titleScene.exit).not.toHaveBeenCalled();
    expect(endingScene.enter).not.toHaveBeenCalled();
    expect(loadStateHandler).toHaveBeenCalledTimes(2);

    stageDeferred.resolve(stageScene);
    await latestStageTransition;

    expect(manager.getCurrentType()).toBe('stage');
    expect(titleScene.exit).toHaveBeenCalledTimes(1);
    expect(stageScene.enter).toHaveBeenCalledWith({ stageNumber: 1 });
    expect(endingScene.enter).not.toHaveBeenCalled();
    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'ending'],
      [true, 'stage'],
      [false, 'stage'],
    ]);
  });

  it('notifies transition errors and clears loading state when a lazy transition fails', async () => {
    const manager = new SceneManager();
    const titleScene = createMockScene();
    const error = new Error('stage load failed');
    const loadStateHandler = vi.fn();
    const transitionErrorHandler = vi.fn();

    manager.registerScene('title', titleScene);
    manager.registerSceneFactory('stage', async () => {
      throw error;
    });
    manager.setLoadStateHandler(loadStateHandler);
    manager.setTransitionErrorHandler(transitionErrorHandler);

    await manager.transitionTo('title');
    await manager.requestTransition('stage', { stageNumber: 1, totalScore: 0, totalStarCount: 0 });

    expect(loadStateHandler.mock.calls).toEqual([
      [true, 'stage'],
      [false, 'stage'],
    ]);
    expect(transitionErrorHandler).toHaveBeenCalledWith(
      error,
      'stage',
      { stageNumber: 1, totalScore: 0, totalStarCount: 0 },
    );
    expect(manager.getCurrentType()).toBe('title');
    expect(titleScene.exit).not.toHaveBeenCalled();
  });
});
