import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { Star } from '../../../src/game/entities/Star';

describe('Star', () => {
  it('creates a NORMAL star with score 100', () => {
    const star = new Star(0, 0, -10, 'NORMAL');
    expect(star.starType).toBe('NORMAL');
    expect(star.scoreValue).toBe(100);
    expect(star.isCollected).toBe(false);
  });

  it('creates a RAINBOW star with score 500', () => {
    const star = new Star(0, 0, -10, 'RAINBOW');
    expect(star.starType).toBe('RAINBOW');
    expect(star.scoreValue).toBe(500);
  });

  it('marks as collected when collect is called', () => {
    const star = new Star(0, 0, -10);
    star.collect();
    expect(star.isCollected).toBe(true);
  });

  it('sets position correctly', () => {
    const star = new Star(3, 1, -20);
    expect(star.position.x).toBe(3);
    expect(star.position.y).toBe(1);
    expect(star.position.z).toBe(-20);
  });

  it('has a radius for collision', () => {
    const star = new Star(0, 0, -10);
    expect(star.radius).toBeGreaterThan(0);
  });

  it('disposes only the per-instance RAINBOW material; shared geometry is preserved', () => {
    const star = new Star(0, 0, -10, 'RAINBOW');
    const geoSpy = vi.spyOn(star.mesh.geometry, 'dispose');
    const matSpy = vi.spyOn(star.mesh.material as THREE.Material, 'dispose');

    star.dispose();

    expect(geoSpy).not.toHaveBeenCalled();
    expect(matSpy).toHaveBeenCalledTimes(1);
  });

  it('does NOT dispose shared geometry/material for a NORMAL star', () => {
    const star = new Star(0, 0, -10, 'NORMAL');
    const geoSpy = vi.spyOn(star.mesh.geometry, 'dispose');
    const matSpy = vi.spyOn(star.mesh.material as THREE.Material, 'dispose');

    star.dispose();

    expect(geoSpy).not.toHaveBeenCalled();
    expect(matSpy).not.toHaveBeenCalled();
  });

  it('NORMAL stars share the same geometry and material references', () => {
    const stars = Array.from({ length: 100 }, () => new Star(0, 0, -10, 'NORMAL'));
    const geo = stars[0].mesh.geometry;
    const mat = stars[0].mesh.material;
    for (const s of stars) {
      expect(s.mesh.geometry).toBe(geo);
      expect(s.mesh.material).toBe(mat);
    }
  });

  it('RAINBOW star shares geometry but uses its own material', () => {
    const normal = new Star(0, 0, -10, 'NORMAL');
    const rainbow1 = new Star(0, 0, -10, 'RAINBOW');
    const rainbow2 = new Star(0, 0, -10, 'RAINBOW');

    expect(rainbow1.mesh.geometry).toBe(normal.mesh.geometry);
    expect(rainbow2.mesh.geometry).toBe(normal.mesh.geometry);
    expect(rainbow1.mesh.material).not.toBe(normal.mesh.material);
    expect(rainbow1.mesh.material).not.toBe(rainbow2.mesh.material);
  });

  it('disposing one star does not affect a sibling star created afterwards', () => {
    const a = new Star(0, 0, -10, 'NORMAL');
    a.dispose();
    const b = new Star(0, 0, -10, 'NORMAL');
    // Shared resources still usable
    expect(b.mesh.geometry).toBe(a.mesh.geometry);
    expect(b.mesh.material).toBe(a.mesh.material);
    expect((b.mesh.geometry as THREE.BufferGeometry).attributes.position).toBeDefined();
  });

  it('RAINBOW update keeps the same material instance across frames', () => {
    const star = new Star(0, 0, -10, 'RAINBOW');
    const matRef = star.mesh.material;
    for (let i = 0; i < 10; i++) {
      star.update(0.016);
    }
    expect(star.mesh.material).toBe(matRef);
  });

  it('RAINBOW update advances hue without allocating a new Color instance', () => {
    const star = new Star(0, 0, -10, 'RAINBOW');
    const mat = star.mesh.material as THREE.MeshToonMaterial;
    const colorRef = mat.color;
    const emissiveRef = mat.emissive;
    const initialHsl = { h: 0, s: 0, l: 0 };
    mat.color.getHSL(initialHsl);
    star.update(0.5);
    star.update(0.5);
    const afterHsl = { h: 0, s: 0, l: 0 };
    mat.color.getHSL(afterHsl);
    expect(afterHsl.h).not.toBe(initialHsl.h);
    // Color/emissive references are mutated in place, not replaced.
    expect(mat.color).toBe(colorRef);
    expect(mat.emissive).toBe(emissiveRef);
  });

  it('reset() repositions the star and clears transient state', () => {
    const star = new Star(1, 2, -3, 'NORMAL');
    star.collect();
    star.update(0.5);
    expect(star.isCollected).toBe(true);
    expect(star.mesh.visible).toBe(false);

    star.reset(7, 8, -9);

    expect(star.position).toEqual({ x: 7, y: 8, z: -9 });
    expect(star.mesh.position.x).toBe(7);
    expect(star.mesh.position.y).toBe(8);
    expect(star.mesh.position.z).toBe(-9);
    expect(star.mesh.rotation.x).toBe(0);
    expect(star.mesh.rotation.y).toBe(0);
    expect(star.mesh.rotation.z).toBe(0);
    expect(star.mesh.visible).toBe(true);
    expect(star.isCollected).toBe(false);
  });

  it('recycle() detaches mesh from parent and preserves shared resources', () => {
    const star = new Star(0, 0, -10, 'NORMAL');
    const parent = new THREE.Group();
    parent.add(star.mesh);
    star.update(0.5);
    star.collect();

    const geoSpy = vi.spyOn(star.mesh.geometry, 'dispose');
    const matSpy = vi.spyOn(star.mesh.material as THREE.Material, 'dispose');

    star.recycle();

    expect(star.mesh.parent).toBeNull();
    expect(star.mesh.rotation.y).toBe(0);
    expect(star.mesh.visible).toBe(true);
    expect(star.isCollected).toBe(false);
    expect(geoSpy).not.toHaveBeenCalled();
    expect(matSpy).not.toHaveBeenCalled();
  });

  it('reset() restores RAINBOW hue and color to the initial red', () => {
    const star = new Star(0, 0, -10, 'RAINBOW');
    const mat = star.mesh.material as THREE.MeshToonMaterial;
    const colorRef = mat.color;
    const emissiveRef = mat.emissive;
    // Drive hue forward.
    for (let i = 0; i < 30; i++) star.update(0.1);
    const movedHsl = { h: 0, s: 0, l: 0 };
    mat.color.getHSL(movedHsl);
    expect(movedHsl.h).toBeGreaterThan(0);

    star.reset(1, 2, -3);

    // Color/emissive references must be mutated in place, not replaced.
    expect(mat.color).toBe(colorRef);
    expect(mat.emissive).toBe(emissiveRef);
    expect(mat.color.getHex()).toBe(0xff0000);
    expect(mat.emissive.getHex()).toBe(0xff0000);
    // Subsequent update() resumes hue progression from 0.
    star.update(0.016);
    const tickHsl = { h: -1, s: 0, l: 0 };
    mat.color.getHSL(tickHsl);
    expect(tickHsl.h).toBeLessThan(movedHsl.h);
  });

  it('RAINBOW update keeps emissive RGB in sync with color and advances from initial red', () => {
    const star = new Star(0, 0, -10, 'RAINBOW');
    const mat = star.mesh.material as THREE.MeshToonMaterial;
    expect(mat.color.r).toBe(1);
    expect(mat.color.g).toBe(0);
    expect(mat.color.b).toBe(0);

    star.update(0.5);

    expect(mat.color.r === 1 && mat.color.g === 0 && mat.color.b === 0).toBe(false);
    expect(mat.emissive.r).toBe(mat.color.r);
    expect(mat.emissive.g).toBe(mat.color.g);
    expect(mat.emissive.b).toBe(mat.color.b);

    star.update(0.5);
    expect(mat.emissive.r).toBe(mat.color.r);
    expect(mat.emissive.g).toBe(mat.color.g);
    expect(mat.emissive.b).toBe(mat.color.b);
  });

  it('RAINBOW update calls setHSL only once per frame (color), not on emissive', () => {
    const star = new Star(0, 0, -10, 'RAINBOW');
    const mat = star.mesh.material as THREE.MeshToonMaterial;
    const colorSpy = vi.spyOn(mat.color, 'setHSL');
    const emissiveSpy = vi.spyOn(mat.emissive, 'setHSL');

    star.update(0.016);

    expect(colorSpy).toHaveBeenCalledTimes(1);
    expect(emissiveSpy).not.toHaveBeenCalled();
  });
});
