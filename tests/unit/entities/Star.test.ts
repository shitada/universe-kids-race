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
});
