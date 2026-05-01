// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SceneManager } from '../../src/game/SceneManager';
import type { Scene, SceneContext, SceneType } from '../../src/types';
import * as THREE from 'three';
import { StageScene } from '../../src/game/scenes/StageScene';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

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
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('follows full flow with lazy scene factories: title → stage1 through stage11 → ending → title', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    const stageFactory = () => Promise.resolve(createTrackingScene(log, 'stage'));
    const endingFactory = () => Promise.resolve(createTrackingScene(log, 'ending'));

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerSceneFactory('stage', stageFactory);
    manager.registerSceneFactory('ending', endingFactory);

    // Start at title
    await manager.transitionTo('title');
    expect(log).toHaveLength(1);
    expect(log[0].type).toBe('title');

    // Title → Stage 1
    await manager.transitionTo('stage', { stageNumber: 1 });
    expect(log[1].type).toBe('stage');
    expect(log[1].context.stageNumber).toBe(1);

    // Stage 1 → Stage 2
    await manager.transitionTo('stage', { stageNumber: 2, totalScore: 500, totalStarCount: 5 });
    expect(log[2].context.stageNumber).toBe(2);
    expect(log[2].context.totalScore).toBe(500);

    // Stage 2 → Stage 3
    await manager.transitionTo('stage', { stageNumber: 3, totalScore: 1000, totalStarCount: 10 });
    expect(log[3].context.stageNumber).toBe(3);

    // Stage 3 → Stage 4
    await manager.transitionTo('stage', { stageNumber: 4, totalScore: 1500, totalStarCount: 15 });
    expect(log[4].context.stageNumber).toBe(4);

    // Stage 4 → Stage 5
    await manager.transitionTo('stage', { stageNumber: 5, totalScore: 2000, totalStarCount: 18 });
    expect(log[5].context.stageNumber).toBe(5);

    // Stage 5 → Stage 6
    await manager.transitionTo('stage', { stageNumber: 6, totalScore: 2800, totalStarCount: 24 });
    expect(log[6].context.stageNumber).toBe(6);

    // Stage 6 → Stage 7
    await manager.transitionTo('stage', { stageNumber: 7, totalScore: 3600, totalStarCount: 31 });
    expect(log[7].context.stageNumber).toBe(7);

    // Stage 7 → Stage 8
    await manager.transitionTo('stage', { stageNumber: 8, totalScore: 4500, totalStarCount: 39 });
    expect(log[8].context.stageNumber).toBe(8);

    // Stage 8 → Stage 9
    await manager.transitionTo('stage', { stageNumber: 9, totalScore: 5500, totalStarCount: 48 });
    expect(log[9].context.stageNumber).toBe(9);

    // Stage 9 → Stage 10
    await manager.transitionTo('stage', { stageNumber: 10, totalScore: 6500, totalStarCount: 55 });
    expect(log[10].context.stageNumber).toBe(10);

    // Stage 10 → Stage 11
    await manager.transitionTo('stage', { stageNumber: 11, totalScore: 7500, totalStarCount: 62 });
    expect(log[11].context.stageNumber).toBe(11);

    // Stage 11 → Ending
    await manager.transitionTo('ending', { totalScore: 9000, totalStarCount: 72 });
    expect(log[12].type).toBe('ending');
    expect(log[12].context.totalScore).toBe(9000);
    expect(log[12].context.totalStarCount).toBe(72);

    // Ending → Title (restart)
    await manager.transitionTo('title');
    expect(log[13].type).toBe('title');
  });

  it('tracks current scene type correctly after lazy transition', async () => {
    const log: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();

    manager.registerScene('title', createTrackingScene(log, 'title'));
    manager.registerSceneFactory('stage', () => Promise.resolve(createTrackingScene(log, 'stage')));

    await manager.transitionTo('title');
    expect(manager.getCurrentType()).toBe('title');

    await manager.transitionTo('stage', { stageNumber: 1 });
    expect(manager.getCurrentType()).toBe('stage');
  });

  it('reuses the same StageScene instance and keeps persistent nodes singletons across title round-trips', async () => {
    const manager = new SceneManager();
    let stageScene: StageScene | null = null;
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveState = {
      clearedStage: 0,
      unlockedPlanets: [1, 2],
      muted: false,
      tutorialShown: true,
      bestStageStars: {} as Record<number, number>,
    };
    const saveManager = {
      load: vi.fn(() => ({
        ...saveState,
        unlockedPlanets: [...saveState.unlockedPlanets],
        bestStageStars: { ...saveState.bestStageStars },
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;

    manager.registerScene('title', createTrackingScene([], 'title'));
    const stageFactory = vi.fn(async () => {
      stageScene = new StageScene(manager, inputSystem, audioManager, saveManager);
      return stageScene;
    });
    manager.registerSceneFactory('stage', stageFactory);

    await manager.transitionTo('title');
    await manager.transitionTo('stage', { stageNumber: 1 });

    const stageInternal = stageScene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      threeScene: THREE.Scene;
      spaceship: { mesh: THREE.Group };
      airShield: { getMesh(): THREE.Mesh };
      bgStars: THREE.Points | null;
      companionManager: { getGroup(): THREE.Group } | null;
    };
    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;

    const firstSceneRef = stageInternal.threeScene;
    const firstShipRef = stageInternal.spaceship.mesh;
    const firstShieldRef = stageInternal.airShield.getMesh();
    const firstCompanionGroupRef = stageInternal.companionManager?.getGroup();

    await manager.transitionTo('title');
    saveState.unlockedPlanets = [1, 2, 3];
    await manager.transitionTo('stage', { stageNumber: 4 });

    stageInternal.countdownOverlay?.dispose();
    stageInternal.countdownOverlay = null;
    stageInternal.isStarting = false;

    expect(stageFactory).toHaveBeenCalledTimes(1);
    expect(stageInternal.threeScene).toBe(firstSceneRef);
    expect(stageInternal.spaceship.mesh).toBe(firstShipRef);
    expect(stageInternal.airShield.getMesh()).toBe(firstShieldRef);
    expect(stageInternal.bgStars).not.toBeNull();
    expect(stageInternal.companionManager?.getGroup()).toBe(firstCompanionGroupRef);
    expect(firstSceneRef.children.filter((child) => child === firstShipRef)).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child === firstShieldRef)).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child === stageInternal.bgStars)).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child === firstCompanionGroupRef)).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child.type === 'AmbientLight')).toHaveLength(1);
    expect(firstSceneRef.children.filter((child) => child.type === 'DirectionalLight')).toHaveLength(1);
  });
});
