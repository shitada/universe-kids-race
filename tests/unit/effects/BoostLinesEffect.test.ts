import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';

const { BoostLinesEffect } = await import('../../../src/game/effects/BoostLinesEffect');

describe('BoostLinesEffect', () => {
  it('init adds a LineSegments to the scene with hidden visibility', () => {
    const scene = new THREE.Scene();
    const effect = new BoostLinesEffect();
    effect.init(scene);

    const obj = effect.getObject();
    expect(obj).toBeInstanceOf(THREE.LineSegments);
    expect(obj!.visible).toBe(false);
    expect(obj!.frustumCulled).toBe(false);
    expect(scene.children).toContain(obj);

    const positionAttr = (obj!.geometry as THREE.BufferGeometry).getAttribute('position');
    // 20 segments × 2 endpoints = 40 vertices
    expect(positionAttr.count).toBe(40);

    effect.dispose();
  });

  it('init is idempotent (second call is a no-op)', () => {
    const scene = new THREE.Scene();
    const effect = new BoostLinesEffect();
    effect.init(scene);
    const first = effect.getObject();
    effect.init(scene);
    expect(effect.getObject()).toBe(first);
    expect(scene.children.filter((c) => c === first).length).toBe(1);
    effect.dispose();
  });

  it('update with boostActive=true makes lines visible and marks needsUpdate', () => {
    const scene = new THREE.Scene();
    const effect = new BoostLinesEffect();
    effect.init(scene);
    const obj = effect.getObject()!;
    const positionAttr = (obj.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute;

    const versionBefore = positionAttr.version;
    effect.update(true, 1, -10);

    expect(obj.visible).toBe(true);
    expect(positionAttr.version).toBe(versionBefore + 1);

    // Position data should reference shipX/shipZ (x in [shipX-2, shipX+2])
    const arr = positionAttr.array as Float32Array;
    for (let i = 0; i < 20; i++) {
      const base = i * 6;
      const x = arr[base];
      const z = arr[base + 2];
      expect(x).toBeGreaterThanOrEqual(1 - 2);
      expect(x).toBeLessThanOrEqual(1 + 2);
      expect(z).toBeGreaterThanOrEqual(-10 + 2);
    }

    effect.dispose();
  });

  it('update with boostActive=false hides the lines', () => {
    const scene = new THREE.Scene();
    const effect = new BoostLinesEffect();
    effect.init(scene);
    effect.update(true, 0, 0);
    expect(effect.getObject()!.visible).toBe(true);
    effect.update(false, 0, 0);
    expect(effect.getObject()!.visible).toBe(false);
    effect.dispose();
  });

  it('skips redundant visibility writes when state is unchanged', () => {
    const scene = new THREE.Scene();
    const effect = new BoostLinesEffect();
    effect.init(scene);
    const obj = effect.getObject()!;

    // Already false after init; write should not occur.
    let writes = 0;
    Object.defineProperty(obj, 'visible', {
      get() { return (this as unknown as { _v: boolean })._v ?? false; },
      set(v: boolean) {
        writes++;
        (this as unknown as { _v: boolean })._v = v;
      },
      configurable: true,
    });

    effect.update(false, 0, 0);
    effect.update(false, 0, 0);
    effect.update(false, 0, 0);
    expect(writes).toBe(0);

    effect.update(true, 0, 0);
    expect(writes).toBe(1);
    effect.update(true, 0, 0);
    effect.update(true, 0, 0);
    expect(writes).toBe(1);

    effect.dispose();
  });

  it('dispose removes the lines from the scene and disposes resources', () => {
    const scene = new THREE.Scene();
    const effect = new BoostLinesEffect();
    effect.init(scene);
    const obj = effect.getObject()!;
    const geoSpy = vi.spyOn(obj.geometry, 'dispose');
    const matSpy = vi.spyOn(obj.material as THREE.Material, 'dispose');

    effect.dispose();

    expect(geoSpy).toHaveBeenCalled();
    expect(matSpy).toHaveBeenCalled();
    expect(scene.children).not.toContain(obj);
    expect(effect.getObject()).toBeNull();
  });

  it('update is a no-op before init', () => {
    const effect = new BoostLinesEffect();
    expect(() => effect.update(true, 0, 0)).not.toThrow();
    expect(() => effect.update(false, 0, 0)).not.toThrow();
  });
});
