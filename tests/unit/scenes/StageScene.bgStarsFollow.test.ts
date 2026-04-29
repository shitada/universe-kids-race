// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = { getState: () => ({ left: false, right: false, up: false, down: false, boostPressed: false }) } as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
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

describe('StageScene background stars follow spaceship', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('createBackground generates the expected number of bgStars points', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      bgStars: THREE.Points | null;
      createBackground(): void;
      threeScene: THREE.Scene;
    };
    internal.threeScene = new THREE.Scene();
    internal.createBackground();
    expect(internal.bgStars).not.toBeNull();
    const positions = internal.bgStars!.geometry.getAttribute('position');
    expect(positions.count).toBe(2000);
  });

  it('initial bgStars z values are distributed around 0 (±200), not behind the start', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      bgStars: THREE.Points | null;
      createBackground(): void;
      threeScene: THREE.Scene;
    };
    internal.threeScene = new THREE.Scene();
    internal.createBackground();
    const positions = internal.bgStars!.geometry.getAttribute('position');
    let minZ = Infinity;
    let maxZ = -Infinity;
    for (let i = 0; i < positions.count; i++) {
      const z = positions.getZ(i);
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    // Range expected: roughly (-200, 200)
    expect(minZ).toBeGreaterThanOrEqual(-200);
    expect(maxZ).toBeLessThanOrEqual(200);
    // Ensure both halves are populated (not all behind start)
    expect(minZ).toBeLessThan(0);
    expect(maxZ).toBeGreaterThan(0);
  });

  it('update() syncs bgStars.position.z with spaceship.position.z', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as {
      bgStars: THREE.Points | null;
      spaceship: { position: { x: number; y: number; z: number } };
      update(dt: number): void;
    };
    expect(internal.bgStars).not.toBeNull();
    expect(internal.spaceship).toBeDefined();

    // Simulate the spaceship having travelled deep into the stage.
    internal.spaceship.position.z = -1500;
    const shipZ1 = internal.spaceship.position.z;
    internal.update(0.016);
    // After update, ship may have moved slightly; bgStars should track current ship z.
    expect(internal.bgStars!.position.z).toBeCloseTo(internal.spaceship.position.z, 5);
    // And the follow value differs from initial 0, proving it actually moved.
    expect(Math.abs(internal.bgStars!.position.z - shipZ1)).toBeLessThan(5);
  });

  it('exit() releases bgStars and sets it to null (regression guard)', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as {
      bgStars: THREE.Points | null;
      exit(): void;
    };
    expect(internal.bgStars).not.toBeNull();
    internal.exit();
    expect(internal.bgStars).toBeNull();
  });
});
