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

    expect(hit.isActive).toBe(false);
    expect(hit.mesh.visible).toBe(false);
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
});
