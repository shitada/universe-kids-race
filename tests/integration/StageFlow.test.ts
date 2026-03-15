import { describe, it, expect } from 'vitest';
import { SceneManager } from '../../src/game/SceneManager';
import type { Scene, SceneContext, SceneType } from '../../src/types';
import * as THREE from 'three';

function createTrackingScene(transitionLog: { type: SceneType; context: SceneContext }[], sceneType: SceneType): Scene {
  const threeScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  return {
    enter: (ctx: SceneContext) => { transitionLog.push({ type: sceneType, context: ctx }); },
    update: () => {},
    exit: () => {},
    getThreeScene: () => threeScene,
    getCamera: () => camera,
  };
}

describe('Stage Flow Integration', () => {
  it('follows full flow: title → stage1 → stage2 → stage3 → ending → title', () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerScene('stage', createTrackingScene(log, 'stage'));
    manager.registerScene('ending', createTrackingScene(log, 'ending'));

    // Start at title
    manager.transitionTo('title');
    expect(log).toHaveLength(1);
    expect(log[0].type).toBe('title');

    // Title → Stage 1
    manager.transitionTo('stage', { stageNumber: 1 });
    expect(log[1].type).toBe('stage');
    expect(log[1].context.stageNumber).toBe(1);

    // Stage 1 → Stage 2
    manager.transitionTo('stage', { stageNumber: 2, totalScore: 500, totalStarCount: 5 });
    expect(log[2].context.stageNumber).toBe(2);
    expect(log[2].context.totalScore).toBe(500);

    // Stage 2 → Stage 3
    manager.transitionTo('stage', { stageNumber: 3, totalScore: 1200, totalStarCount: 12 });
    expect(log[3].context.stageNumber).toBe(3);

    // Stage 3 → Ending
    manager.transitionTo('ending', { totalScore: 2000, totalStarCount: 20 });
    expect(log[4].type).toBe('ending');
    expect(log[4].context.totalScore).toBe(2000);
    expect(log[4].context.totalStarCount).toBe(20);

    // Ending → Title (restart)
    manager.transitionTo('title');
    expect(log[5].type).toBe('title');
  });

  it('tracks current scene type correctly', () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerScene('stage', createTrackingScene(log, 'stage'));

    manager.transitionTo('title');
    expect(manager.getCurrentType()).toBe('title');

    manager.transitionTo('stage', { stageNumber: 1 });
    expect(manager.getCurrentType()).toBe('stage');
  });
});
