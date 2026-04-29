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
  boostFlame: THREE.Points | null;
  initBoostFlame(): void;
  resetBoostFlame(): void;
  emitFlameParticles(): void;
  removeBoostFlame(): void;
  disposeBoostFlame(): void;
}

function createScene(): StageInternal {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {} as InputSystem;
  const audioManager = {} as AudioManager;
  const saveManager = {} as SaveManager;
  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  const internal = scene as unknown as StageInternal;
  internal.threeScene = new THREE.Scene();
  internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
  return internal;
}

/**
 * Replace material.size with a getter/setter pair that tracks every assignment,
 * so the test can count how many times emitFlameParticles writes to it.
 */
function spyOnMaterialSize(material: THREE.PointsMaterial): {
  writes: number[];
  restore: () => void;
} {
  const writes: number[] = [];
  let backing = material.size;
  const desc = Object.getOwnPropertyDescriptor(material, 'size');
  Object.defineProperty(material, 'size', {
    configurable: true,
    enumerable: true,
    get(): number {
      return backing;
    },
    set(v: number) {
      writes.push(v);
      backing = v;
    },
  });
  return {
    writes,
    restore() {
      if (desc) {
        Object.defineProperty(material, 'size', desc);
      } else {
        delete (material as unknown as { size?: number }).size;
        (material as unknown as { size: number }).size = backing;
      }
    },
  };
}

describe('StageScene boostFlame.material.size redundant write suppression', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('writes material.size at most once while sizeFraction stays at 1.0 during boost', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();

    const material = internal.boostFlame!.material as THREE.PointsMaterial;
    const spy = spyOnMaterialSize(material);

    // progress stays below fadeStart (0.83), so sizeFraction === 1.0 every frame.
    for (let i = 0; i < 20; i++) {
      internal.emitFlameParticles();
    }

    // Size value used during full-emission phase is 0.5 * 1.0 === 0.5.
    expect(spy.writes.length).toBeLessThanOrEqual(1);
    for (const v of spy.writes) {
      expect(v).toBeCloseTo(0.5, 6);
    }
    expect(material.size).toBeCloseTo(0.5, 6);

    spy.restore();
  });

  it('updates material.size every frame once progress is past fadeStart', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();

    const material = internal.boostFlame!.material as THREE.PointsMaterial;

    // Push progress past fadeStart=0.83 (DURATION=3.0 -> 0.85*3.0 = 2.55s elapsed).
    internal.boostSystem.update(2.55);

    const spy = spyOnMaterialSize(material);

    const samples = 5;
    for (let i = 0; i < samples; i++) {
      internal.emitFlameParticles();
      // Advance a tiny bit so sizeFraction strictly decreases each step.
      internal.boostSystem.update(0.02);
    }

    // Each frame in the fade window must produce a distinct write.
    expect(spy.writes.length).toBe(samples);
    for (let i = 1; i < spy.writes.length; i++) {
      expect(spy.writes[i]).not.toBe(spy.writes[i - 1]);
    }

    spy.restore();
  });

  it('resets cached size on removeBoostFlame so the next boost cycle re-writes material.size', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();

    // First boost: prime the cache at 0.5.
    internal.emitFlameParticles();
    const material = internal.boostFlame!.material as THREE.PointsMaterial;
    expect(material.size).toBeCloseTo(0.5, 6);

    // End boost.
    internal.removeBoostFlame();

    // Tamper with size to simulate any external state drift between cycles.
    material.size = 0.123;

    // Start a fresh boost. resetBoostFlame writes the canonical 0.5 back,
    // and emitFlameParticles must not re-write it (cache should have been
    // primed to 0.5 by resetBoostFlame, after the prior removeBoostFlame
    // invalidated it from the previous cycle).
    internal.boostSystem.reset();
    internal.boostSystem.activate();

    const spy = spyOnMaterialSize(material);
    internal.resetBoostFlame();
    internal.emitFlameParticles();

    // resetBoostFlame must have written 0.5 (because the cache was -1 after
    // removeBoostFlame), and emitFlameParticles must not produce a duplicate
    // write while sizeFraction stays at 1.0.
    expect(spy.writes.length).toBe(1);
    expect(spy.writes[0]).toBeCloseTo(0.5, 6);
    expect(material.size).toBeCloseTo(0.5, 6);

    spy.restore();
  });

  it('resets cached size on disposeBoostFlame so a re-initialized flame writes size again', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();
    internal.emitFlameParticles();

    internal.disposeBoostFlame();
    expect(internal.boostFlame).toBeNull();

    // Re-create flame from scratch.
    internal.boostSystem.reset();
    internal.boostSystem.activate();
    internal.initBoostFlame();

    const material = internal.boostFlame!.material as THREE.PointsMaterial;
    const spy = spyOnMaterialSize(material);
    internal.resetBoostFlame();
    internal.emitFlameParticles();

    // resetBoostFlame must write 0.5 once (cache was -1 after dispose),
    // emit must not write again while sizeFraction stays at 1.0.
    expect(spy.writes.length).toBe(1);
    expect(spy.writes[0]).toBeCloseTo(0.5, 6);

    spy.restore();
  });
});
