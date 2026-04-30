// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { BoostSystem } from '../../../src/game/systems/BoostSystem';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface StageInternal {
  threeScene: THREE.Scene;
  spaceship: { position: { x: number; y: number; z: number } };
  boostSystem: BoostSystem;
  boostLines: THREE.LineSegments | null;
  boostLinePositions: Float32Array | null;
  boostLinePositionAttr: THREE.BufferAttribute | null;
  boostJitterCursor: number;
  lastBoostLinesVisible: boolean | null;
  initBoostLines(): void;
  updateBoostEffects(): void;
}

function createScene(): StageInternal {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {} as InputSystem;
  const audioManager = {
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    stopBoostSFX: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {} as SaveManager;
  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  const internal = scene as unknown as StageInternal;
  internal.threeScene = new THREE.Scene();
  internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
  return internal;
}

describe('StageScene boost line jitter table (Math.random hot-path reduction)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('uses the precomputed jitter table instead of Math.random() during boost', () => {
    const internal = createScene();
    internal.initBoostLines();
    internal.boostSystem.activate();

    const randomSpy = vi.spyOn(Math, 'random');
    try {
      internal.updateBoostEffects();
      // Acceptance criteria: <= 10 Math.random() calls per frame (target ~0).
      expect(randomSpy).toHaveBeenCalledTimes(0);

      randomSpy.mockClear();
      for (let i = 0; i < 60; i++) {
        internal.updateBoostEffects();
      }
      expect(randomSpy.mock.calls.length).toBeLessThanOrEqual(10 * 60);
      // Stronger guarantee: this hot path should issue zero Math.random() calls.
      expect(randomSpy).toHaveBeenCalledTimes(0);
    } finally {
      randomSpy.mockRestore();
    }
  });

  it('keeps boost line endpoints within the original distribution ranges', () => {
    const internal = createScene();
    internal.initBoostLines();
    internal.spaceship.position.x = 1.5;
    internal.spaceship.position.z = -10;
    const shipX = internal.spaceship.position.x;
    const shipZ = internal.spaceship.position.z;
    internal.boostSystem.activate();

    for (let frame = 0; frame < 30; frame++) {
      internal.updateBoostEffects();
      const pos = internal.boostLinePositions!;
      for (let i = 0; i < 20; i++) {
        const base = i * 6;
        const sx = pos[base];
        const sy = pos[base + 1];
        const sz = pos[base + 2];
        const ex = pos[base + 3];
        const ey = pos[base + 4];
        const ez = pos[base + 5];

        expect(sx).toBeGreaterThanOrEqual(shipX - 2);
        expect(sx).toBeLessThanOrEqual(shipX + 2);
        expect(sy).toBeGreaterThanOrEqual(-1.5);
        expect(sy).toBeLessThanOrEqual(1.5);
        expect(sz).toBeGreaterThanOrEqual(shipZ + 2);
        expect(sz).toBeLessThanOrEqual(shipZ + 10);

        // Each line segment is vertical-z aligned: x/y identical, z extends forward 2..5.
        expect(ex).toBe(sx);
        expect(ey).toBe(sy);
        expect(ez - sz).toBeGreaterThanOrEqual(2);
        expect(ez - sz).toBeLessThanOrEqual(5);
      }
    }
  });

  it('advances the jitter cursor each frame so consecutive frames differ', () => {
    const internal = createScene();
    internal.initBoostLines();
    internal.boostSystem.activate();

    internal.boostJitterCursor = 0;
    internal.updateBoostEffects();
    const cursorAfter1 = internal.boostJitterCursor;
    const snapshot1 = Float32Array.from(internal.boostLinePositions!);

    internal.updateBoostEffects();
    const cursorAfter2 = internal.boostJitterCursor;
    const snapshot2 = Float32Array.from(internal.boostLinePositions!);

    expect(cursorAfter1).not.toBe(0);
    expect(cursorAfter2).not.toBe(cursorAfter1);

    let differs = false;
    for (let i = 0; i < snapshot1.length; i++) {
      if (snapshot1[i] !== snapshot2[i]) {
        differs = true;
        break;
      }
    }
    expect(differs).toBe(true);
  });

  it('flags the position attribute for GPU upload and toggles visibility on/off as before', () => {
    const internal = createScene();
    internal.initBoostLines();
    const attr = internal.boostLinePositionAttr!;

    // Inactive: visible stays false.
    internal.updateBoostEffects();
    expect(internal.boostLines!.visible).toBe(false);

    // Activate: GPU upload flagged (version bumps) and visibility flips on.
    const versionBefore = attr.version;
    internal.boostSystem.activate();
    internal.updateBoostEffects();
    expect(attr.version).toBeGreaterThan(versionBefore);
    expect(internal.boostLines!.visible).toBe(true);

    // Deactivate: visibility flips back off.
    internal.boostSystem.update(10);
    expect(internal.boostSystem.isActive()).toBe(false);
    internal.updateBoostEffects();
    expect(internal.boostLines!.visible).toBe(false);
  });
});
