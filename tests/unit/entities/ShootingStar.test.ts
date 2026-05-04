import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { ShootingStar } from '../../../src/game/entities/ShootingStar';

describe('ShootingStar', () => {
  it('creates a visible shooting star with a trail mesh', () => {
    const star = new ShootingStar(-8, 0.2, -40, 1);

    expect(star.isCollected).toBe(false);
    expect(star.radius).toBeGreaterThan(0);
    expect(star.mesh.visible).toBe(true);
    expect(star.mesh.getObjectByName('shooting-star-trail')).toBeTruthy();
    expect(star.mesh.getObjectByName('shooting-star-tail-glow')).toBeTruthy();
  });

  it('flows from the upper right toward the lower left on its custom arc', () => {
    const star = new ShootingStar(8, 0.8, -40, -1);
    const before = {
      x: star.mesh.position.x,
      y: star.mesh.position.y,
      z: star.mesh.position.z,
    };

    star.update(0.5);

    expect(star.mesh.position.x).toBeLessThan(before.x);
    expect(star.mesh.position.y).toBeLessThan(before.y);
    expect(star.mesh.position.z).toBeGreaterThan(before.z);
    expect(star.mesh.rotation.z).toBeLessThan(0);
  });

  it('collect() hides the mesh and marks it collected', () => {
    const star = new ShootingStar(-8, 0.2, -40, 1);

    star.collect();

    expect(star.isCollected).toBe(true);
    expect(star.mesh.visible).toBe(false);
  });

  it('reset() restores visibility and the new trajectory start point', () => {
    const star = new ShootingStar(-8, 0.2, -40, 1);
    star.collect();
    star.update(0.5);

    star.reset(8, -0.1, -60, -1);

    expect(star.isCollected).toBe(false);
    expect(star.mesh.visible).toBe(true);
    expect(star.position).toEqual({ x: 8, y: -0.1, z: -60 });
    expect(star.mesh.position.x).toBe(8);
    expect(star.mesh.position.y).toBe(-0.1);
    expect(star.mesh.position.z).toBe(-60);
    expect(star.scoreBonus).toBe(500);
  });

  it('recycle() detaches the mesh from its parent scene', () => {
    const star = new ShootingStar(-8, 0.2, -40, 1);
    const parent = new THREE.Group();
    parent.add(star.mesh);

    star.recycle();

    expect(star.mesh.parent).toBeNull();
    expect(star.mesh.visible).toBe(true);
    expect(star.isCollected).toBe(false);
  });
});
