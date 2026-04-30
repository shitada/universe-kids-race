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
  flameMaxAliveIndex: number;
  initBoostFlame(): void;
  resetBoostFlame(): void;
  emitFlameParticles(): void;
  updateFlameParticles(deltaTime: number): void;
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

function getPositionAttr(internal: StageInternal): THREE.BufferAttribute {
  return internal.boostFlame!.geometry.getAttribute('position') as THREE.BufferAttribute;
}

function getColorAttr(internal: StageInternal): THREE.BufferAttribute {
  return internal.boostFlame!.geometry.getAttribute('color') as THREE.BufferAttribute;
}

function sumUpdateRangeLengths(attr: THREE.BufferAttribute): number {
  const ranges = (attr as unknown as { updateRanges?: Array<{ start: number; count: number }> }).updateRanges ?? [];
  return ranges.reduce((sum, r) => sum + r.count, 0);
}

describe('StageScene boostFlame drawRange / updateRanges optimization', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('initBoostFlame() initializes drawRange.count to 0', () => {
    const internal = createScene();
    internal.initBoostFlame();

    expect(internal.boostFlame).not.toBeNull();
    expect(internal.boostFlame!.geometry.drawRange.count).toBe(0);
    expect(internal.flameMaxAliveIndex).toBe(-1);
  });

  it('after a single emit cycle, drawRange.count equals the number of emitted slots and updateRanges is bounded', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();

    // After reset (before any emit), nothing alive.
    expect(internal.boostFlame!.geometry.drawRange.count).toBe(0);

    internal.emitFlameParticles();

    // Active phase emits 8 particles per frame.
    const drawCount = internal.boostFlame!.geometry.drawRange.count;
    expect(drawCount).toBeGreaterThan(0);
    expect(drawCount).toBeLessThanOrEqual(8);

    const positionAttr = getPositionAttr(internal);
    const colorAttr = getColorAttr(internal);

    // Cumulative updateRanges length must not exceed (flameMaxAliveIndex+1)*3.
    const limit = (internal.flameMaxAliveIndex + 1) * 3;
    expect(sumUpdateRangeLengths(positionAttr)).toBeLessThanOrEqual(limit);
    expect(sumUpdateRangeLengths(colorAttr)).toBeLessThanOrEqual(limit);
    // And specifically not the entire 150*3 buffer.
    expect(sumUpdateRangeLengths(positionAttr)).toBeLessThan(150 * 3);
  });

  it('drawRange.count monotonically decreases to 0 after emission stops and lifetimes expire', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();

    // Emit some particles across multiple frames.
    for (let i = 0; i < 3; i++) {
      internal.emitFlameParticles();
      internal.updateFlameParticles(0.016);
    }
    const peakCount = internal.boostFlame!.geometry.drawRange.count;
    expect(peakCount).toBeGreaterThan(0);

    // Stop emission; let particles age out.
    // Force boostSystem to be inactive so updateFlameParticles can call removeBoostFlame.
    internal.boostSystem.update(10); // exceed duration -> isActive=false, progress=1
    // Manually mark emission stopped (mirrors what the main update loop would do).
    (internal as unknown as { flameEmitting: boolean }).flameEmitting = false;

    let lastCount = peakCount;
    for (let i = 0; i < 60; i++) {
      // Without the boostFlame becoming null, keep ticking.
      if (!internal.boostFlame) break;
      internal.updateFlameParticles(0.05);
      const c = internal.boostFlame ? internal.boostFlame.geometry.drawRange.count : 0;
      expect(c).toBeLessThanOrEqual(lastCount);
      lastCount = c;
      if (!internal.boostFlame || !internal.boostFlame.visible) break;
    }

    // After all particles expire, removeBoostFlame() is called -> visible=false, drawRange.count=0.
    expect(internal.boostFlame!.visible).toBe(false);
    expect(internal.boostFlame!.geometry.drawRange.count).toBe(0);
    expect(internal.flameMaxAliveIndex).toBe(-1);
  });

  it('removeBoostFlame() resets drawRange.count to 0 and flameMaxAliveIndex to -1', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();
    internal.emitFlameParticles();

    expect(internal.boostFlame!.geometry.drawRange.count).toBeGreaterThan(0);

    internal.removeBoostFlame();

    expect(internal.boostFlame!.geometry.drawRange.count).toBe(0);
    expect(internal.flameMaxAliveIndex).toBe(-1);
    expect(internal.boostFlame!.visible).toBe(false);
  });
});
