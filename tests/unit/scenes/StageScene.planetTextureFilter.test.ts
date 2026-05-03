// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import {
  __resetStageSceneSharedAssetCachesForTest,
  __stageSceneSharedAssetCachesForTest,
} from '../../../src/game/scenes/stageVisualAssets';
import { getStageConfig } from '../../../src/game/config/StageConfig';
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
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
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

interface StageSceneInternals {
  threeScene: THREE.Scene;
  stageConfig: ReturnType<typeof getStageConfig>;
  stageNumber: number;
  destinationPlanet: THREE.Group | null;
  createDestinationPlanet: () => void;
}

function buildPlanet(scene: StageScene, stageNumber: number): void {
  const internals = scene as unknown as StageSceneInternals;
  internals.threeScene = new THREE.Scene();
  internals.stageNumber = stageNumber;
  internals.stageConfig = getStageConfig(stageNumber);
  internals.destinationPlanet = null;
  internals.createDestinationPlanet();
}

function makeFakeCtx(): CanvasRenderingContext2D {
  const noop = (): void => {};
  return new Proxy(
    {} as Record<string, unknown>,
    {
      get(target, prop) {
        if (prop in target) return target[prop as string];
        return noop;
      },
      set(target, prop, value) {
        target[prop as string] = value;
        return true;
      },
    },
  ) as unknown as CanvasRenderingContext2D;
}

describe('StageScene planet CanvasTexture filter settings (Constitution IV)', () => {
  beforeEach(() => {
    __resetStageSceneSharedAssetCachesForTest();
    const origGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function patched(
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ): unknown {
      if (type === '2d') return makeFakeCtx();
      return (origGetContext as unknown as (...a: unknown[]) => unknown).call(this, type, ...rest);
    } as typeof HTMLCanvasElement.prototype.getContext;
    return () => {
      HTMLCanvasElement.prototype.getContext = origGetContext;
    };
  });

  it('disables mipmaps and uses LinearFilter for every cached planet CanvasTexture', () => {
    const scene = createScene();
    // 各惑星テクスチャを生成するステージ（地球の cloud レイヤ含む）を網羅
    for (const stage of [2, 3, 5, 6, 7, 9, 10, 11]) {
      buildPlanet(scene, stage);
    }

    const cache = __stageSceneSharedAssetCachesForTest.planetTextureCache;
    expect(cache.size).toBeGreaterThan(0);

    for (const [key, tex] of cache) {
      expect(tex, `texture for ${key}`).toBeInstanceOf(THREE.CanvasTexture);
      expect(tex.generateMipmaps, `generateMipmaps for ${key}`).toBe(false);
      expect(tex.minFilter, `minFilter for ${key}`).toBe(THREE.LinearFilter);
    }
  });
});
