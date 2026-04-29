// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EncyclopediaOverlay } from '../../src/ui/EncyclopediaOverlay';
import { SceneManager } from '../../src/game/SceneManager';
import type { Scene, SceneContext, SceneType } from '../../src/types';
import * as THREE from 'three';

function createTrackingScene(
  log: { type: SceneType; context: SceneContext }[],
  sceneType: SceneType,
): Scene {
  const threeScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  return {
    enter: (ctx: SceneContext) => {
      log.push({ type: sceneType, context: ctx });
    },
    update: () => {},
    exit: () => {},
    getThreeScene: () => threeScene,
    getCamera: () => camera,
  };
}

describe('Encyclopedia Stage Selection Integration', () => {
  let uiOverlay: HTMLDivElement;

  beforeEach(() => {
    uiOverlay = document.createElement('div');
    uiOverlay.id = 'ui-overlay';
    document.body.appendChild(uiOverlay);
  });

  afterEach(() => {
    uiOverlay.remove();
  });

  it('tapping unlocked planet card transitions to that stage with reset totals', () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerScene('stage', createTrackingScene(log, 'stage'));
    manager.transitionTo('title');

    const overlay = new EncyclopediaOverlay();
    overlay.show([1, 2, 3], () => {}, (stageNumber) => {
      manager.requestTransition('stage', {
        stageNumber,
        totalScore: 0,
        totalStarCount: 0,
      });
    });

    const card = uiOverlay.querySelector('[data-card][data-stage="2"]') as HTMLElement;
    expect(card).not.toBeNull();
    card.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    const stageEntry = log.find((e) => e.type === 'stage');
    expect(stageEntry).toBeDefined();
    expect(stageEntry!.context.stageNumber).toBe(2);
    expect(stageEntry!.context.totalScore).toBe(0);
    expect(stageEntry!.context.totalStarCount).toBe(0);

    // Encyclopedia DOM is gone after selection.
    expect(uiOverlay.querySelectorAll('[data-card]').length).toBe(0);
  });
});
