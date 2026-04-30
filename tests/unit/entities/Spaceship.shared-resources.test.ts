import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { Spaceship } from '../../../src/game/entities/Spaceship';

describe('Spaceship shared resources', () => {
  it('shares geometry across instances for body, nose, and wings', () => {
    const a = new Spaceship();
    const b = new Spaceship();

    expect(a.mesh.children).toHaveLength(3);
    expect(b.mesh.children).toHaveLength(3);

    for (let i = 0; i < 3; i++) {
      const ma = a.mesh.children[i] as THREE.Mesh;
      const mb = b.mesh.children[i] as THREE.Mesh;
      expect(ma.geometry).toBe(mb.geometry);
      expect(ma.material).toBe(mb.material);
    }
  });

  it('preserves child mesh order, rotation, and position (no behavior change)', () => {
    const ship = new Spaceship();
    const [body, nose, wings] = ship.mesh.children as THREE.Mesh[];

    // Body cylinder rotated to align with -Z forward axis.
    expect(body.geometry).toBeInstanceOf(THREE.CylinderGeometry);
    expect(body.rotation.x).toBeCloseTo(Math.PI / 2);
    expect(body.position.z).toBe(0);

    // Nose cone in front (negative Z = forward).
    expect(nose.geometry).toBeInstanceOf(THREE.ConeGeometry);
    expect(nose.rotation.x).toBeCloseTo(Math.PI / 2);
    expect(nose.position.z).toBeCloseTo(-1.4);

    // Wings box behind body.
    expect(wings.geometry).toBeInstanceOf(THREE.BoxGeometry);
    expect(wings.position.z).toBeCloseTo(0.2);
  });

  it('uses MeshToonMaterial with the expected colors', () => {
    const ship = new Spaceship();
    const [body, nose, wings] = ship.mesh.children as THREE.Mesh[];
    const bodyMat = body.material as THREE.MeshToonMaterial;
    const noseMat = nose.material as THREE.MeshToonMaterial;
    const wingMat = wings.material as THREE.MeshToonMaterial;

    expect(bodyMat).toBeInstanceOf(THREE.MeshToonMaterial);
    expect(noseMat).toBeInstanceOf(THREE.MeshToonMaterial);
    expect(wingMat).toBeInstanceOf(THREE.MeshToonMaterial);
    expect(bodyMat.color.getHex()).toBe(0x4488ff);
    expect(noseMat.color.getHex()).toBe(0xff6644);
    expect(wingMat.color.getHex()).toBe(0x44aaff);
  });

  it('does not dispose shared geometry/material when an instance is disposed', () => {
    const a = new Spaceship();
    const b = new Spaceship();

    const sharedGeoms = (a.mesh.children as THREE.Mesh[]).map((m) => m.geometry);
    const sharedMats = (a.mesh.children as THREE.Mesh[]).map(
      (m) => m.material as THREE.Material,
    );

    const geomSpies = sharedGeoms.map((g) => vi.spyOn(g, 'dispose'));
    const matSpies = sharedMats.map((m) => vi.spyOn(m, 'dispose'));

    // Attach to a parent so dispose() can detach it.
    const parent = new THREE.Group();
    parent.add(a.mesh);

    a.dispose();

    // Shared resources must not be disposed by instance dispose().
    for (const spy of geomSpies) expect(spy).not.toHaveBeenCalled();
    for (const spy of matSpies) expect(spy).not.toHaveBeenCalled();

    // Detached from parent.
    expect(a.mesh.parent).toBeNull();

    // Geometry buffers still usable: position attribute array still has data.
    for (const g of sharedGeoms) {
      const pos = (g as THREE.BufferGeometry).getAttribute('position');
      expect(pos.array.length).toBeGreaterThan(0);
    }

    // Subsequent instance still references the same shared resources.
    for (let i = 0; i < 3; i++) {
      const mb = b.mesh.children[i] as THREE.Mesh;
      expect(mb.geometry).toBe(sharedGeoms[i]);
      expect(mb.material).toBe(sharedMats[i]);
    }

    // And a brand-new instance after dispose works too.
    const c = new Spaceship();
    for (let i = 0; i < 3; i++) {
      const mc = c.mesh.children[i] as THREE.Mesh;
      expect(mc.geometry).toBe(sharedGeoms[i]);
      expect(mc.material).toBe(sharedMats[i]);
    }
  });
});
