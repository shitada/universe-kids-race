// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  StageScene,
  __resetStageSceneSharedAssetCachesForTest,
  __stageSceneSharedAssetCachesForTest,
} from '../../../src/game/scenes/StageScene';
import { TOTAL_STAGES } from '../../../src/game/config/StageConfig';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(scheduleIdleTask?: (callback: () => void) => void): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => ({ moveDirection: 0, boostPressed: false }),
    setBoostPressed: vi.fn(),
    resetPointers: vi.fn(),
  } as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [],
      muted: false,
      bestStageStars: {},
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager, {
    scheduleIdleTask,
  });
}

describe('StageScene next-stage prewarm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    __resetStageSceneSharedAssetCachesForTest();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
      return {
        fillStyle: '',
        strokeStyle: '',
        lineWidth: 0,
        fillRect: () => {},
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        fill: () => {},
        stroke: () => {},
        lineTo: () => {},
        ellipse: () => {},
      } as unknown as CanvasRenderingContext2D;
    });
  });

  it('idle時に次ステージ1件だけをprewarmする', () => {
    const idleCallbacks: Array<() => void> = [];
    const scene = createScene((callback) => idleCallbacks.push(callback));

    scene.enter({ stageNumber: 8 });

    expect(idleCallbacks).toHaveLength(1);
    expect(__stageSceneSharedAssetCachesForTest.planetGeometryCache.has('pluto:sphere')).toBe(false);

    idleCallbacks[0]?.();

    expect(__stageSceneSharedAssetCachesForTest.planetGeometryCache.has('pluto:sphere')).toBe(true);
    expect(__stageSceneSharedAssetCachesForTest.planetGeometryCache.has('earth:sphere')).toBe(false);

    scene.exit();
  });

  it('exit後に実行されたidle callbackはprewarmしない', () => {
    const idleCallbacks: Array<() => void> = [];
    const scene = createScene((callback) => idleCallbacks.push(callback));

    scene.enter({ stageNumber: 8 });
    scene.exit();
    idleCallbacks[0]?.();

    expect(__stageSceneSharedAssetCachesForTest.planetGeometryCache.has('pluto:sphere')).toBe(false);
  });

  it('最終ステージでは次ステージprewarmをスケジュールしない', () => {
    const idleCallbacks: Array<() => void> = [];
    const scene = createScene((callback) => idleCallbacks.push(callback));

    scene.enter({ stageNumber: TOTAL_STAGES });

    expect(idleCallbacks).toHaveLength(0);

    scene.exit();
  });
});
