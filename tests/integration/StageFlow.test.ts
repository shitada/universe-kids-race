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
  it('follows full flow: title → stage1 through stage11 → ending → title', () => {
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
    manager.transitionTo('stage', { stageNumber: 3, totalScore: 1000, totalStarCount: 10 });
    expect(log[3].context.stageNumber).toBe(3);

    // Stage 3 → Stage 4
    manager.transitionTo('stage', { stageNumber: 4, totalScore: 1500, totalStarCount: 15 });
    expect(log[4].context.stageNumber).toBe(4);

    // Stage 4 → Stage 5
    manager.transitionTo('stage', { stageNumber: 5, totalScore: 2000, totalStarCount: 18 });
    expect(log[5].context.stageNumber).toBe(5);

    // Stage 5 → Stage 6
    manager.transitionTo('stage', { stageNumber: 6, totalScore: 2800, totalStarCount: 24 });
    expect(log[6].context.stageNumber).toBe(6);

    // Stage 6 → Stage 7
    manager.transitionTo('stage', { stageNumber: 7, totalScore: 3600, totalStarCount: 31 });
    expect(log[7].context.stageNumber).toBe(7);

    // Stage 7 → Stage 8
    manager.transitionTo('stage', { stageNumber: 8, totalScore: 4500, totalStarCount: 39 });
    expect(log[8].context.stageNumber).toBe(8);

    // Stage 8 → Stage 9
    manager.transitionTo('stage', { stageNumber: 9, totalScore: 5500, totalStarCount: 48 });
    expect(log[9].context.stageNumber).toBe(9);

    // Stage 9 → Stage 10
    manager.transitionTo('stage', { stageNumber: 10, totalScore: 6500, totalStarCount: 55 });
    expect(log[10].context.stageNumber).toBe(10);

    // Stage 10 → Stage 11
    manager.transitionTo('stage', { stageNumber: 11, totalScore: 7500, totalStarCount: 62 });
    expect(log[11].context.stageNumber).toBe(11);

    // Stage 11 → Ending
    manager.transitionTo('ending', { totalScore: 9000, totalStarCount: 72 });
    expect(log[12].type).toBe('ending');
    expect(log[12].context.totalScore).toBe(9000);
    expect(log[12].context.totalStarCount).toBe(72);

    // Ending → Title (restart)
    manager.transitionTo('title');
    expect(log[13].type).toBe('title');
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
