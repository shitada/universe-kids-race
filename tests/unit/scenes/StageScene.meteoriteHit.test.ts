// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene() {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState = { moveDirection: 0, boostPressed: false };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (v: boolean) => {
      inputState.boostPressed = v;
    },
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

  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  scene.enter({ stageNumber: 1 });
  // Bypass the start countdown so update() proceeds into the gameplay path.
  (scene as unknown as { countdownOverlay: { dispose(): void } | null }).countdownOverlay?.dispose();
  (scene as unknown as { isStarting: boolean }).isStarting = false;
  (scene as unknown as { countdownOverlay: unknown | null }).countdownOverlay = null;
  return { scene, audioManager };
}

describe('StageScene meteorite hit feedback', () => {
  it('hides the hit meteorite mesh and emits exactly one particle burst at the hit position', () => {
    const { scene } = createScene();
    const internal = scene as unknown as {
      collisionSystem: {
        check: (...args: unknown[]) => unknown;
      };
      particleBurstManager: { emit: (...args: unknown[]) => void };
      meteorites: Meteorite[];
      update: (dt: number) => void;
    };

    const hit = new Meteorite(2, 1, -30);
    expect(hit.mesh.visible).toBe(true);
    expect(hit.isActive).toBe(true);
    internal.meteorites = [hit];

    // Stub CollisionSystem to report a meteorite collision on this frame
    // without any star collisions.
    internal.collisionSystem = {
      check: () => ({
        starCollisions: [],
        meteoriteCollision: true,
        meteoriteHit: hit,
      }),
    };

    const emitSpy = vi.spyOn(internal.particleBurstManager, 'emit');

    internal.update(0.016);

    // The hit meteorite is released to the pool inside the same frame's
    // cleanupPassedObjects() pass. recycle() resets isActive=true and
    // mesh.visible=true so the instance is ready for re-use; the user-facing
    // "vanish" effect still happens because the mesh is detached from the
    // scene before the next render.
    expect(internal.meteorites).not.toContain(hit);
    expect(hit.mesh.parent).toBeNull();
    expect(emitSpy).toHaveBeenCalledTimes(1);

    const args = emitSpy.mock.calls[0];
    // emit(scene, x, y, z, color, count, rainbow)
    expect(args[1]).toBe(hit.position.x);
    expect(args[2]).toBe(hit.position.y);
    expect(args[3]).toBe(hit.position.z);
    // Subtle orange-ish burst, NOT the rainbow variant.
    expect(args[6]).toBe(false);
  });

  it('does not emit a particle burst when no meteorite collision occurs', () => {
    const { scene } = createScene();
    const internal = scene as unknown as {
      collisionSystem: { check: (...args: unknown[]) => unknown };
      particleBurstManager: { emit: (...args: unknown[]) => void };
      meteorites: Meteorite[];
      update: (dt: number) => void;
    };

    const met = new Meteorite(0, 0, -30);
    internal.meteorites = [met];
    internal.collisionSystem = {
      check: () => ({
        starCollisions: [],
        meteoriteCollision: false,
        meteoriteHit: null,
      }),
    };

    const emitSpy = vi.spyOn(internal.particleBurstManager, 'emit');

    internal.update(0.016);

    expect(emitSpy).not.toHaveBeenCalled();
    expect(met.mesh.visible).toBe(true);
    expect(met.isActive).toBe(true);
  });

  it('returns the hit meteorite to the pool inside the same frame', () => {
    const { scene } = createScene();
    const internal = scene as unknown as {
      collisionSystem: { check: (...args: unknown[]) => unknown };
      meteorites: Meteorite[];
      spawnSystem: {
        releaseMeteorite: (m: Meteorite) => void;
        getMeteoritePoolSize: () => number;
      };
      threeScene: { children: unknown[] };
      update: (dt: number) => void;
    };

    // Use the spawn system so the meteorite is owned by the pool — this lets
    // us assert that `getMeteoritePoolSize()` does not grow (the instance is
    // returned to the existing pool slot rather than a new allocation).
    const pool = (
      internal.spawnSystem as unknown as {
        meteoritePool: { acquire: (x: number, y: number, z: number) => Meteorite };
      }
    ).meteoritePool;
    const hit = pool.acquire(2, 1, -30);
    (internal.threeScene as unknown as { add: (o: unknown) => void }).add(hit.mesh);

    internal.meteorites = [hit];
    const poolSizeBefore = internal.spawnSystem.getMeteoritePoolSize();
    const meteoriteCountBefore = internal.meteorites.length;

    internal.collisionSystem = {
      check: () => ({
        starCollisions: [],
        meteoriteCollision: true,
        meteoriteHit: hit,
      }),
    };

    const releaseSpy = vi.spyOn(internal.spawnSystem, 'releaseMeteorite');

    internal.update(0.016);

    // Same-frame: the meteorite array shrinks by exactly one and the hit
    // meteorite is gone (no waiting for it to drift past behindThreshold).
    expect(internal.meteorites.length).toBe(meteoriteCountBefore - 1);
    expect(internal.meteorites).not.toContain(hit);

    // The release path went through SpawnSystem.releaseMeteorite (so the
    // pool's release hook ran), and no new pool slot was allocated.
    expect(releaseSpy).toHaveBeenCalledWith(hit);
    expect(internal.spawnSystem.getMeteoritePoolSize()).toBe(poolSizeBefore);

    // The hit mesh is detached from the scene graph.
    expect(hit.mesh.parent).toBeNull();
    expect(internal.threeScene.children).not.toContain(hit.mesh);

    // The same instance is reused on the next acquire — confirming it sits
    // in the available side of the pool rather than being orphaned.
    const reused = pool.acquire(0, 0, -50);
    expect(reused).toBe(hit);
    // recycle()/reset() restored visibility and the active flag.
    expect(reused.mesh.visible).toBe(true);
    expect(reused.isActive).toBe(true);
  });
});
