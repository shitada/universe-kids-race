import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';

const { BoostFlameEffect } = await import('../../../src/game/effects/BoostFlameEffect');

const SHIP = { x: 0, y: 0, z: 0 };

describe('BoostFlameEffect', () => {
  it('init adds Points to scene, hidden by default with vertex-color additive material', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);

    const obj = fx.getObject();
    expect(obj).toBeInstanceOf(THREE.Points);
    expect(obj!.visible).toBe(false);
    expect(obj!.frustumCulled).toBe(false);
    expect(scene.children).toContain(obj);

    const mat = obj!.material as THREE.PointsMaterial;
    expect(mat.vertexColors).toBe(true);
    expect(mat.transparent).toBe(true);
    expect(mat.blending).toBe(THREE.AdditiveBlending);
    expect(mat.depthWrite).toBe(false);

    const pos = (obj!.geometry as THREE.BufferGeometry).getAttribute('position');
    expect(pos.count).toBe(BoostFlameEffect.MAX_PARTICLES);

    fx.dispose();
  });

  it('init parks all particles at z=99999 offscreen', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    const arr = ((fx.getObject()!.geometry as THREE.BufferGeometry).getAttribute('position').array) as Float32Array;
    for (let i = 0; i < BoostFlameEffect.MAX_PARTICLES; i++) {
      expect(arr[i * 3 + 2]).toBe(99999);
    }
    fx.dispose();
  });

  it('init is idempotent (no double-add)', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    const first = fx.getObject();
    fx.init(scene);
    expect(fx.getObject()).toBe(first);
    expect(scene.children.filter((c) => c === first).length).toBe(1);
    fx.dispose();
  });

  it('start() makes Points visible and enables emission', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    expect(fx.getObject()!.visible).toBe(true);
    expect(fx.isEmitting()).toBe(true);
    fx.dispose();
  });

  it('emit during active phase (progress<0.83) emits 8 particles per call', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();

    const obj = fx.getObject()!;
    const arr = (obj.geometry as THREE.BufferGeometry).getAttribute('position').array as Float32Array;

    fx.emit({ x: 1, y: 2, z: -3 }, 0.0);
    // First 8 particles should be near ship position, not 99999
    let movedCount = 0;
    for (let i = 0; i < BoostFlameEffect.MAX_PARTICLES; i++) {
      if (arr[i * 3 + 2] !== 99999) movedCount++;
    }
    expect(movedCount).toBe(8);
    // Material size should be base size (0.5) during active phase
    expect((obj.material as THREE.PointsMaterial).size).toBeCloseTo(0.5);

    fx.dispose();
  });

  it('emit during fade phase (progress>=0.83) reduces emission count and size', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    const obj = fx.getObject()!;
    const arr = (obj.geometry as THREE.BufferGeometry).getAttribute('position').array as Float32Array;

    // Reset offscreen markers from start()
    fx.emit(SHIP, 0.95);
    let movedCount = 0;
    for (let i = 0; i < BoostFlameEffect.MAX_PARTICLES; i++) {
      if (arr[i * 3 + 2] !== 99999) movedCount++;
    }
    // Round(8 * (1-0.95)/(1-0.83)) = round(8*0.05/0.17) ≈ round(2.35) = 2
    expect(movedCount).toBe(2);
    const expectedSize = 0.5 * ((1 - 0.95) / (1 - 0.83));
    expect((obj.material as THREE.PointsMaterial).size).toBeCloseTo(expectedSize, 5);

    fx.dispose();
  });

  it('emit at progress=1.0 is a no-op (no emission, size=0)', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    const obj = fx.getObject()!;
    const arr = (obj.geometry as THREE.BufferGeometry).getAttribute('position').array as Float32Array;
    fx.emit(SHIP, 1.0);
    for (let i = 0; i < BoostFlameEffect.MAX_PARTICLES; i++) {
      expect(arr[i * 3 + 2]).toBe(99999);
    }
    expect((obj.material as THREE.PointsMaterial).size).toBeCloseTo(0, 5);
    fx.dispose();
  });

  it('update advances live particles forward in z by velocity*dt', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    const obj = fx.getObject()!;
    const arr = (obj.geometry as THREE.BufferGeometry).getAttribute('position').array as Float32Array;

    fx.emit({ x: 0, y: 0, z: 0 }, 0);
    const z0Before: number[] = [];
    for (let i = 0; i < 8; i++) z0Before.push(arr[i * 3 + 2]);

    fx.update(0.1);
    for (let i = 0; i < 8; i++) {
      expect(arr[i * 3 + 2]).toBeGreaterThan(z0Before[i]);
    }
    fx.dispose();
  });

  it('update auto-removes (hides + resets) when emission stopped and all particles dead', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);
    fx.stopEmitting();
    expect(fx.isEmitting()).toBe(false);

    // Particle lifetime = 0.7s; advance well beyond
    fx.update(2.0);

    expect(fx.getObject()!.visible).toBe(false);
    const arr = (fx.getObject()!.geometry as THREE.BufferGeometry).getAttribute('position').array as Float32Array;
    for (let i = 0; i < BoostFlameEffect.MAX_PARTICLES; i++) {
      expect(arr[i * 3 + 2]).toBe(99999);
    }
    fx.dispose();
  });

  it('remove() hides Points and resets emission state immediately', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);
    expect(fx.getObject()!.visible).toBe(true);

    fx.remove();
    expect(fx.getObject()!.visible).toBe(false);
    expect(fx.isEmitting()).toBe(false);

    const arr = (fx.getObject()!.geometry as THREE.BufferGeometry).getAttribute('position').array as Float32Array;
    for (let i = 0; i < BoostFlameEffect.MAX_PARTICLES; i++) {
      expect(arr[i * 3 + 2]).toBe(99999);
    }
    fx.dispose();
  });

  it('start() after remove() re-shows and resets size to base', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0.95); // shrink size
    fx.remove();
    fx.start();
    expect(fx.getObject()!.visible).toBe(true);
    expect((fx.getObject()!.material as THREE.PointsMaterial).size).toBeCloseTo(0.5);
    fx.dispose();
  });

  it('stopEmitting allows live particles to keep updating until they expire', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);
    fx.stopEmitting();

    // After short dt (< lifetime), object should still be visible (live particles)
    fx.update(0.1);
    expect(fx.getObject()!.visible).toBe(true);

    // After long dt, particles die and auto-remove triggers
    fx.update(1.0);
    expect(fx.getObject()!.visible).toBe(false);
    fx.dispose();
  });

  it('dispose removes Points from scene and disposes geometry/material', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    const obj = fx.getObject()!;
    const geoSpy = vi.spyOn(obj.geometry, 'dispose');
    const matSpy = vi.spyOn(obj.material as THREE.PointsMaterial, 'dispose');

    fx.dispose();

    expect(geoSpy).toHaveBeenCalled();
    expect(matSpy).toHaveBeenCalled();
    expect(scene.children).not.toContain(obj);
    expect(fx.getObject()).toBeNull();
  });

  it('emit/update/remove before init are safe no-ops', () => {
    const fx = new BoostFlameEffect();
    expect(() => fx.start()).not.toThrow();
    expect(() => fx.emit(SHIP, 0)).not.toThrow();
    expect(() => fx.update(0.016)).not.toThrow();
    expect(() => fx.remove()).not.toThrow();
    expect(() => fx.stopEmitting()).not.toThrow();
    expect(() => fx.dispose()).not.toThrow();
  });

  it('update() never bumps colorAttr.version, even when particles die', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);
    const obj = fx.getObject()!;
    const colorAttr = (obj.geometry as THREE.BufferGeometry).getAttribute('color') as THREE.BufferAttribute;

    // Snapshot version after emit() (emit() legitimately bumps it).
    const baseVersion = colorAttr.version;

    // Multiple update() calls including ones that kill particles (lifetime=0.7s).
    fx.update(0.1);
    expect(colorAttr.version).toBe(baseVersion);
    fx.update(0.5);
    expect(colorAttr.version).toBe(baseVersion);
    // This update kills the remaining live particles.
    fx.update(0.5);
    expect(colorAttr.version).toBe(baseVersion);

    fx.dispose();
  });

  it('dead particle slots retain their color (not zeroed) and are reused on next emit', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit({ x: 5, y: 5, z: 5 }, 0);
    const obj = fx.getObject()!;
    const colors = (obj.geometry as THREE.BufferGeometry).getAttribute('color').array as Float32Array;
    const positions = (obj.geometry as THREE.BufferGeometry).getAttribute('position').array as Float32Array;

    // Snapshot color of slot 0 after first emit (8 particles fill slots 0..7).
    const r0 = colors[0];
    const g0 = colors[1];
    const b0 = colors[2];
    expect(r0).toBeCloseTo(1.0);

    // Kill all live particles by advancing past lifetime; emission still on so no remove().
    fx.update(1.0);

    // Slot 0 is parked offscreen, but its color is preserved (not zeroed).
    expect(positions[2]).toBe(99999);
    expect(colors[0]).toBe(r0);
    expect(colors[1]).toBe(g0);
    expect(colors[2]).toBe(b0);

    // Next emit reuses the next ring slots (8..15) with fresh colors.
    fx.emit({ x: -5, y: -5, z: -5 }, 0);
    expect(colors[8 * 3]).toBeCloseTo(1.0);
    expect(positions[8 * 3 + 2]).not.toBe(99999);
    // Slot 0 color is unchanged (not visited by the new emit).
    expect(colors[0]).toBe(r0);

    fx.dispose();
  });
});
