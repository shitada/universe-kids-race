import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { Meteorite } from '../../../src/game/entities/Meteorite';

describe('Meteorite', () => {
  it('creates with position and active state', () => {
    const met = new Meteorite(2, 1, -30);
    expect(met.position.x).toBe(2);
    expect(met.position.y).toBe(1);
    expect(met.position.z).toBe(-30);
    expect(met.isActive).toBe(true);
  });

  it('has a radius for collision', () => {
    const met = new Meteorite(0, 0, 0);
    expect(met.radius).toBeGreaterThan(0);
  });

  it('can be deactivated', () => {
    const met = new Meteorite(0, 0, 0);
    met.isActive = false;
    expect(met.isActive).toBe(false);
  });

  it('does NOT dispose shared geometry/material on dispose()', () => {
    const met = new Meteorite(0, 0, 0);
    const geoSpy = vi.spyOn(met.mesh.geometry, 'dispose');
    const matSpy = vi.spyOn(met.mesh.material as THREE.Material, 'dispose');

    met.dispose();

    expect(geoSpy).not.toHaveBeenCalled();
    expect(matSpy).not.toHaveBeenCalled();
  });

  it('removes the mesh from its parent on dispose()', () => {
    const met = new Meteorite(0, 0, 0);
    const parent = new THREE.Group();
    parent.add(met.mesh);
    expect(met.mesh.parent).toBe(parent);

    met.dispose();

    expect(met.mesh.parent).toBeNull();
  });

  it('100 meteorites share the same geometry and material references', () => {
    const mets = Array.from({ length: 100 }, () => new Meteorite(0, 0, 0));
    const geo = mets[0].mesh.geometry;
    const mat = mets[0].mesh.material;
    for (const m of mets) {
      expect(m.mesh.geometry).toBe(geo);
      expect(m.mesh.material).toBe(mat);
    }
  });

  it('disposing one meteorite does not break a sibling created afterwards', () => {
    const a = new Meteorite(0, 0, 0);
    a.dispose();
    const b = new Meteorite(0, 0, 0);
    expect(b.mesh.geometry).toBe(a.mesh.geometry);
    expect(b.mesh.material).toBe(a.mesh.material);
    expect((b.mesh.geometry as THREE.BufferGeometry).attributes.position).toBeDefined();
  });

  it('reset() repositions the meteorite and re-activates it', () => {
    const met = new Meteorite(1, 2, -3);
    met.isActive = false;
    met.update(0.5);
    expect(met.mesh.rotation.x).not.toBe(0);

    met.reset(7, 8, -9);

    expect(met.position).toEqual({ x: 7, y: 8, z: -9 });
    expect(met.mesh.position.x).toBe(7);
    expect(met.mesh.position.y).toBe(8);
    expect(met.mesh.position.z).toBe(-9);
    expect(met.mesh.rotation.x).toBe(0);
    expect(met.mesh.rotation.z).toBe(0);
    expect(met.isActive).toBe(true);
  });

  it('recycle() detaches mesh from parent and preserves shared resources', () => {
    const met = new Meteorite(0, 0, 0);
    const parent = new THREE.Group();
    parent.add(met.mesh);
    met.update(0.5);
    met.isActive = false;

    const geoSpy = vi.spyOn(met.mesh.geometry, 'dispose');
    const matSpy = vi.spyOn(met.mesh.material as THREE.Material, 'dispose');

    met.recycle();

    expect(met.mesh.parent).toBeNull();
    expect(met.mesh.rotation.x).toBe(0);
    expect(met.mesh.rotation.z).toBe(0);
    expect(met.isActive).toBe(true);
    expect(geoSpy).not.toHaveBeenCalled();
    expect(matSpy).not.toHaveBeenCalled();
  });
});
