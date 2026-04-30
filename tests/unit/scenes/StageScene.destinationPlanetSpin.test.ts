// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import {
  StageScene,
  __resetStageSceneSharedAssetCachesForTest,
} from '../../../src/game/scenes/StageScene';
import { TOTAL_STAGES } from '../../../src/game/config/StageConfig';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface StageSceneInternals {
  destinationPlanet: THREE.Group | null;
  destinationPlanetSpinTarget: THREE.Object3D | null;
  update(dt: number): void;
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

function createScene(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => ({ left: false, right: false, up: false, down: false, boostPressed: false }),
    setBoostPressed: vi.fn(),
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

function setupForStage(stageNumber: number): {
  scene: StageScene;
  internal: StageSceneInternals;
} {
  const scene = createScene();
  scene.enter({ stageNumber });
  const internal = scene as unknown as StageSceneInternals;
  return { scene, internal };
}

describe('StageScene destination planet self-rotation', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    __resetStageSceneSharedAssetCachesForTest();
    // jsdom returns null for getContext('2d'); stub it for canvas-textured planets.
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

  for (let stageNumber = 1; stageNumber <= TOTAL_STAGES; stageNumber++) {
    it(`stage ${stageNumber}: spin target's rotation.y increases after update()`, () => {
      const { internal } = setupForStage(stageNumber);
      expect(internal.destinationPlanet).not.toBeNull();
      expect(internal.destinationPlanetSpinTarget).not.toBeNull();

      const target = internal.destinationPlanetSpinTarget!;
      const before = target.rotation.y;
      internal.update(0.5);
      expect(target.rotation.y).toBeGreaterThan(before);
    });
  }

  it('Saturn (stage 6): only the sphere body spins; ring keeps its X-tilt', () => {
    const { internal } = setupForStage(6);
    const planet = internal.destinationPlanet!;
    const spinTarget = internal.destinationPlanetSpinTarget!;
    const ring = planet.children.find(
      (c): c is THREE.Mesh =>
        c instanceof THREE.Mesh && Math.abs(c.rotation.x - Math.PI / 3) < 1e-6,
    );
    expect(ring).toBeDefined();
    expect(spinTarget).not.toBe(planet);
    expect(spinTarget).not.toBe(ring);

    const ringRotXBefore = ring!.rotation.x;
    const ringRotYBefore = ring!.rotation.y;
    const groupRotYBefore = planet.rotation.y;

    internal.update(0.5);

    expect(spinTarget.rotation.y).toBeGreaterThan(0);
    // Ring tilt unchanged.
    expect(ring!.rotation.x).toBeCloseTo(ringRotXBefore, 6);
    expect(ring!.rotation.y).toBeCloseTo(ringRotYBefore, 6);
    // Group itself does not spin (ring stays in place).
    expect(planet.rotation.y).toBeCloseTo(groupRotYBefore, 6);
  });

  it('Uranus (stage 7): only the sphere body spins; sideways ring keeps its Z-rotation', () => {
    const { internal } = setupForStage(7);
    const planet = internal.destinationPlanet!;
    const spinTarget = internal.destinationPlanetSpinTarget!;
    const ring = planet.children.find(
      (c): c is THREE.Mesh =>
        c instanceof THREE.Mesh && Math.abs(c.rotation.z - Math.PI / 2) < 1e-6,
    );
    expect(ring).toBeDefined();
    expect(spinTarget).not.toBe(planet);
    expect(spinTarget).not.toBe(ring);

    const ringRotZBefore = ring!.rotation.z;
    const ringRotYBefore = ring!.rotation.y;
    const groupRotYBefore = planet.rotation.y;

    internal.update(0.5);

    expect(spinTarget.rotation.y).toBeGreaterThan(0);
    expect(ring!.rotation.z).toBeCloseTo(ringRotZBefore, 6);
    expect(ring!.rotation.y).toBeCloseTo(ringRotYBefore, 6);
    expect(planet.rotation.y).toBeCloseTo(groupRotYBefore, 6);
  });

  it('Sun (stage 10): scale pulse and Y rotation coexist', () => {
    const { internal } = setupForStage(10);
    const planet = internal.destinationPlanet!;
    const spinTarget = internal.destinationPlanetSpinTarget!;

    // Two updates: the pulse formula uses elapsedTime BEFORE incrementing it,
    // so a single call with sin(0)=0 would still leave scale at 1.0.
    internal.update(0.5);
    internal.update(0.5);

    // Pulse touches scale on the parent group.
    expect(planet.scale.x).not.toBe(1);
    expect(planet.scale.x).toBeCloseTo(planet.scale.y, 6);
    expect(planet.scale.x).toBeCloseTo(planet.scale.z, 6);
    // Spin happens on the sphere mesh, independent from scale.
    expect(spinTarget.rotation.y).toBeGreaterThan(0);
    expect(spinTarget.scale.x).toBe(1);
  });

  it('Earth (stage 11): sphere body and cloud layer rotate together via parent sub-group', () => {
    const { internal } = setupForStage(11);
    const spinTarget = internal.destinationPlanetSpinTarget!;
    expect(spinTarget).toBeInstanceOf(THREE.Group);
    const earthGroup = spinTarget as THREE.Group;
    // Sphere + cloud sphere
    expect(earthGroup.children.length).toBe(2);
    const sphere = earthGroup.children[0];
    const cloud = earthGroup.children[1];
    expect(sphere).toBeInstanceOf(THREE.Mesh);
    expect(cloud).toBeInstanceOf(THREE.Mesh);

    const sphereYBefore = sphere.rotation.y;
    const cloudYBefore = cloud.rotation.y;

    internal.update(0.5);

    // Both inherit the spin via the parent sub-group's rotation.
    expect(earthGroup.rotation.y).toBeGreaterThan(0);
    // Children's local rotation is unchanged — they ride along with the group.
    expect(sphere.rotation.y).toBeCloseTo(sphereYBefore, 6);
    expect(cloud.rotation.y).toBeCloseTo(cloudYBefore, 6);
  });
});
