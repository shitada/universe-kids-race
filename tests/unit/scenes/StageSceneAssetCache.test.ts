// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import {
  StageScene,
  __resetStageSceneSharedAssetCachesForTest,
  __stageSceneSharedAssetCachesForTest,
} from '../../../src/game/scenes/StageScene';
import { getStageConfig } from '../../../src/game/config/StageConfig';
import { disposeObject3D } from '../../../src/game/utils/disposeObject3D';
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
  bgStars: THREE.Points | null;
  createDestinationPlanet: () => void;
  createBackground: () => void;
}

function buildPlanet(scene: StageScene, stageNumber: number): THREE.Group {
  const internals = scene as unknown as StageSceneInternals;
  internals.threeScene = new THREE.Scene();
  internals.stageNumber = stageNumber;
  internals.stageConfig = getStageConfig(stageNumber);
  internals.destinationPlanet = null;
  internals.createDestinationPlanet();
  return internals.destinationPlanet!;
}

function buildBackground(scene: StageScene): THREE.Points {
  const internals = scene as unknown as StageSceneInternals;
  internals.threeScene = new THREE.Scene();
  internals.bgStars = null;
  internals.createBackground();
  return internals.bgStars!;
}

function collectMeshes(group: THREE.Group): THREE.Mesh[] {
  const result: THREE.Mesh[] = [];
  group.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      result.push(child as THREE.Mesh);
    }
  });
  return result;
}

function makeFakeCtx(): CanvasRenderingContext2D {
  const noop = (): void => {};
  return new Proxy(
    {} as Record<string, unknown>,
    {
      get(target, prop) {
        if (prop in target) return target[prop as string];
        // 関数として呼ばれる可能性があるものはすべて noop。
        // setter で書き込まれるプロパティ (fillStyle / strokeStyle / lineWidth) は
        // get 時に undefined でよい。
        return noop;
      },
      set(target, prop, value) {
        target[prop as string] = value;
        return true;
      },
    },
  ) as unknown as CanvasRenderingContext2D;
}

beforeEach(() => {
  __resetStageSceneSharedAssetCachesForTest();
  // jsdom は getContext('2d') が null を返すため、最低限の Stub を当てる。
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

describe('StageScene shared asset cache', () => {
  it.each([2, 3, 5, 6, 7, 9, 10, 11])(
    'reuses geometry / material / texture for stage %i across re-entries',
    (stageNumber) => {
      const scene = createScene();
      const first = collectMeshes(buildPlanet(scene, stageNumber));
      const firstGeoms = first.map((m) => m.geometry);
      const firstMats = first.map((m) => m.material as THREE.Material);

      const second = collectMeshes(buildPlanet(scene, stageNumber));
      expect(second.length).toBe(first.length);

      for (let i = 0; i < first.length; i++) {
        expect(second[i].geometry).toBe(firstGeoms[i]);
        expect(second[i].material).toBe(firstMats[i]);
      }

      // CanvasTexture を使うステージはテクスチャ参照も同一であること
      for (let i = 0; i < first.length; i++) {
        const mat = first[i].material as THREE.MeshToonMaterial;
        const mat2 = second[i].material as THREE.MeshToonMaterial;
        if (mat.map) {
          expect(mat2.map).toBe(mat.map);
        }
      }
    },
  );

  it('reuses default-branch sphere geometry across stages, but separates material per planetColor', () => {
    const sceneA = createScene();
    const sceneB = createScene();
    const moon = collectMeshes(buildPlanet(sceneA, 1)); // Moon
    const mars = collectMeshes(buildPlanet(sceneB, 4)); // Mars

    expect(moon).toHaveLength(1);
    expect(mars).toHaveLength(1);

    // 同一 SphereGeometry(15, 24, 24) を共有
    expect(mars[0].geometry).toBe(moon[0].geometry);

    // planetColor が異なるので material は別インスタンス
    const moonColor = (moon[0].material as THREE.MeshToonMaterial).color.getHex();
    const marsColor = (mars[0].material as THREE.MeshToonMaterial).color.getHex();
    if (moonColor !== marsColor) {
      expect(mars[0].material).not.toBe(moon[0].material);
    }
  });

  it('keeps Earth cloud-layer texture and geometry shared across re-entries', () => {
    const scene = createScene();
    const meshes1 = collectMeshes(buildPlanet(scene, 11));
    const meshes2 = collectMeshes(buildPlanet(scene, 11));

    // Earth は (planet, cloud) の 2 メッシュ
    expect(meshes1).toHaveLength(2);
    expect(meshes2).toHaveLength(2);

    expect(meshes2[0].geometry).toBe(meshes1[0].geometry);
    expect(meshes2[1].geometry).toBe(meshes1[1].geometry);
    expect(meshes2[0].material).toBe(meshes1[0].material);
    expect(meshes2[1].material).toBe(meshes1[1].material);
  });

  it('marks every shared destination-planet mesh with userData.sharedAssets so disposeObject3D skips them', () => {
    const scene = createScene();
    const group = buildPlanet(scene, 11);
    const meshes = collectMeshes(group);
    const geoms = meshes.map((m) => m.geometry);
    const mats = meshes.map((m) => m.material as THREE.Material);

    // 全ての Mesh に shared フラグが付いている
    for (const mesh of meshes) {
      expect(mesh.userData.sharedAssets).toBe(true);
    }

    // disposeObject3D を通しても geometry / material は破棄されない
    const geomDisposeSpies = geoms.map((g) => vi.spyOn(g, 'dispose'));
    const matDisposeSpies = mats.map((m) => vi.spyOn(m, 'dispose'));
    disposeObject3D(group);
    for (const spy of geomDisposeSpies) {
      expect(spy).not.toHaveBeenCalled();
    }
    for (const spy of matDisposeSpies) {
      expect(spy).not.toHaveBeenCalled();
    }

    // 再入場しても同じ参照が返る (= キャッシュが破壊されていない)
    const meshes2 = collectMeshes(buildPlanet(scene, 11));
    for (let i = 0; i < meshes.length; i++) {
      expect(meshes2[i].geometry).toBe(geoms[i]);
      expect(meshes2[i].material).toBe(mats[i]);
    }
  });

  it('shares the bgStars geometry / material / position attribute across StageScene instances', () => {
    const sceneA = createScene();
    const sceneB = createScene();
    const bg1 = buildBackground(sceneA);
    const bg2 = buildBackground(sceneB);

    expect(bg2.geometry).toBe(bg1.geometry);
    expect(bg2.material).toBe(bg1.material);
    expect(bg2.geometry.getAttribute('position')).toBe(bg1.geometry.getAttribute('position'));
    expect(bg1.userData.sharedAssets).toBe(true);
    expect(bg2.userData.sharedAssets).toBe(true);

    // モジュールキャッシュにも一致する参照が入っている
    expect(__stageSceneSharedAssetCachesForTest.getBgStarsGeometry()).toBe(bg1.geometry);
    expect(__stageSceneSharedAssetCachesForTest.getBgStarsMaterial()).toBe(bg1.material);
  });
});
