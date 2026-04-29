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
  boostFlame: THREE.Points | null;
  boostLinePositionAttr: THREE.BufferAttribute | null;
  boostFlamePositionAttr: THREE.BufferAttribute | null;
  boostFlameColorAttr: THREE.BufferAttribute | null;
  flameEmitting: boolean;
  initBoostLines(): void;
  initBoostFlame(): void;
  resetBoostFlame(): void;
  updateBoostEffects(): void;
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

describe('StageScene boost BufferAttribute caching', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('caches boostLines position attribute and avoids getAttribute calls in updateBoostEffects', () => {
    const internal = createScene();
    internal.initBoostLines();
    internal.boostSystem.activate();

    const cachedAttr = internal.boostLinePositionAttr;
    expect(cachedAttr).not.toBeNull();
    // Sanity: cached attr equals the geometry's actual attribute
    expect(internal.boostLines!.geometry.getAttribute('position')).toBe(cachedAttr);

    const getAttrSpy = vi.spyOn(THREE.BufferGeometry.prototype, 'getAttribute');

    for (let i = 0; i < 5; i++) {
      const prevVersion = cachedAttr!.version;
      internal.updateBoostEffects();
      expect(internal.boostLinePositionAttr).toBe(cachedAttr);
      expect(cachedAttr!.version).toBe(prevVersion + 1);
    }

    expect(getAttrSpy).not.toHaveBeenCalled();
    getAttrSpy.mockRestore();
  });

  it('caches boostFlame position/color attributes and avoids attribute lookups in updateFlameParticles', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();

    const cachedPos = internal.boostFlamePositionAttr;
    const cachedColor = internal.boostFlameColorAttr;
    expect(cachedPos).not.toBeNull();
    expect(cachedColor).not.toBeNull();
    expect(internal.boostFlame!.geometry.getAttribute('position')).toBe(cachedPos);
    expect(internal.boostFlame!.geometry.getAttribute('color')).toBe(cachedColor);

    const getAttrSpy = vi.spyOn(THREE.BufferGeometry.prototype, 'getAttribute');

    for (let i = 0; i < 5; i++) {
      const prevPosVer = cachedPos!.version;
      const prevColorVer = cachedColor!.version;
      internal.updateFlameParticles(0.016);
      expect(internal.boostFlamePositionAttr).toBe(cachedPos);
      expect(internal.boostFlameColorAttr).toBe(cachedColor);
      expect(cachedPos!.version).toBe(prevPosVer + 1);
      expect(cachedColor!.version).toBe(prevColorVer + 1);
    }

    expect(getAttrSpy).not.toHaveBeenCalled();
    getAttrSpy.mockRestore();
  });

  it('reuses boostFlame Points/attributes across removeBoostFlame and only releases them on disposeBoostFlame', () => {
    const internal = createScene();
    internal.boostSystem.activate();
    internal.initBoostFlame();
    internal.resetBoostFlame();

    const firstFlame = internal.boostFlame;
    const firstPos = internal.boostFlamePositionAttr;
    const firstColor = internal.boostFlameColorAttr;
    expect(firstFlame).not.toBeNull();
    expect(firstPos).not.toBeNull();
    expect(firstColor).not.toBeNull();

    // removeBoostFlame is a soft-disable: keep GPU resources, just hide & reset state.
    internal.removeBoostFlame();
    expect(internal.boostFlame).toBe(firstFlame);
    expect(internal.boostFlamePositionAttr).toBe(firstPos);
    expect(internal.boostFlameColorAttr).toBe(firstColor);
    expect(internal.boostFlame!.visible).toBe(false);
    expect(internal.flameEmitting).toBe(false);

    // Reset re-uses the same Points/attributes for the next boost.
    internal.resetBoostFlame();
    expect(internal.boostFlame).toBe(firstFlame);
    expect(internal.boostFlamePositionAttr).toBe(firstPos);
    expect(internal.boostFlameColorAttr).toBe(firstColor);
    expect(internal.boostFlame!.visible).toBe(true);
    expect(internal.flameEmitting).toBe(true);

    // Only disposeBoostFlame tears everything down.
    internal.disposeBoostFlame();
    expect(internal.boostFlame).toBeNull();
    expect(internal.boostFlamePositionAttr).toBeNull();
    expect(internal.boostFlameColorAttr).toBeNull();
  });

  it('keeps the same boostLines position attribute across boost on/off cycles', () => {
    const internal = createScene();
    internal.initBoostLines();

    const attr = internal.boostLinePositionAttr;
    expect(attr).not.toBeNull();

    internal.boostSystem.activate();
    internal.updateBoostEffects();
    expect(internal.boostLinePositionAttr).toBe(attr);

    // Deactivate (force boost off)
    internal.boostSystem.update(10);
    internal.updateBoostEffects();
    expect(internal.boostLinePositionAttr).toBe(attr);

    // Re-activate (boostLines is retained)
    internal.boostSystem.reset();
    internal.boostSystem.activate();
    internal.updateBoostEffects();
    expect(internal.boostLinePositionAttr).toBe(attr);
  });
});
