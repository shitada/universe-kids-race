import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Comet } from '../../../src/game/entities/Comet';

describe('Comet', () => {
  it('creates a visible comet with a trail effect group', () => {
    const comet = new Comet(-9, 0.1, -60, 1);

    expect(comet.isCollected).toBe(false);
    expect(comet.radius).toBeGreaterThan(1);
    expect(comet.mesh.visible).toBe(true);
    expect(comet.mesh.getObjectByName('comet-trail-effect')).toBeTruthy();
  });

  it('moves diagonally and animates the trail on update', () => {
    const comet = new Comet(-9, 0.1, -60, 1);
    const trail = comet.mesh.getObjectByName('comet-trail-effect');
    const before = {
      x: comet.mesh.position.x,
      y: comet.mesh.position.y,
      z: comet.mesh.position.z,
      trailScaleX: trail?.scale.x ?? 1,
    };

    comet.update(0.5);

    expect(comet.mesh.position.x).toBeGreaterThan(before.x);
    expect(comet.mesh.position.y).toBeLessThan(before.y);
    expect(comet.mesh.position.z).toBeGreaterThan(before.z);
    expect((trail?.scale.x ?? 1)).not.toBe(before.trailScaleX);
  });

  it('collect() hides the mesh and marks it collected', () => {
    const comet = new Comet(-9, 0.1, -60, 1);

    comet.collect();

    expect(comet.isCollected).toBe(true);
    expect(comet.mesh.visible).toBe(false);
  });

  it('reset() restores the comet and repositions the trail for the new direction', () => {
    const comet = new Comet(-9, 0.1, -60, 1);
    comet.collect();
    comet.update(0.5);

    comet.reset(9, -0.2, -90, -1);

    const trail = comet.mesh.getObjectByName('comet-trail-effect');
    expect(comet.isCollected).toBe(false);
    expect(comet.mesh.visible).toBe(true);
    expect(comet.position).toEqual({ x: 9, y: -0.2, z: -90 });
    expect(comet.mesh.position.x).toBe(9);
    expect(comet.mesh.position.y).toBe(-0.2);
    expect(comet.mesh.position.z).toBe(-90);
    expect(trail?.position.x).toBeGreaterThan(0);
  });

  it('recycle() detaches the mesh from its parent scene', () => {
    const comet = new Comet(-9, 0.1, -60, 1);
    const parent = new THREE.Group();
    parent.add(comet.mesh);

    comet.recycle();

    expect(comet.mesh.parent).toBeNull();
    expect(comet.mesh.visible).toBe(true);
    expect(comet.isCollected).toBe(false);
  });
});
