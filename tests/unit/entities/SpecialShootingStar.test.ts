import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { SpecialShootingStar } from '../../../src/game/entities/SpecialShootingStar';

describe('SpecialShootingStar', () => {
  it('creates a visible special shooting star with glow and trail meshes', () => {
    const star = new SpecialShootingStar(-9, 0.4, -40, 'rainbow', 1);

    expect(star.isCollected).toBe(false);
    expect(star.mesh.visible).toBe(true);
    expect(star.mesh.getObjectByName('special-star-core')).toBeTruthy();
    expect(star.mesh.getObjectByName('special-star-trail')).toBeTruthy();
    expect(star.mesh.getObjectByName('special-star-aura')).toBeTruthy();
  });

  it('moves each special type on a distinct orbit pattern', () => {
    const rainbow = new SpecialShootingStar(-9, 0.4, -40, 'rainbow', 1);
    const gold = new SpecialShootingStar(-9, 0.4, -40, 'gold', 1);
    const silver = new SpecialShootingStar(-9, 0.4, -40, 'silver', 1);

    rainbow.update(0.5);
    gold.update(0.5);
    silver.update(0.5);

    expect(new Set([
      rainbow.position.x.toFixed(3),
      gold.position.x.toFixed(3),
      silver.position.x.toFixed(3),
    ]).size).toBe(3);
    expect(new Set([
      rainbow.position.y.toFixed(3),
      gold.position.y.toFixed(3),
      silver.position.y.toFixed(3),
    ]).size).toBeGreaterThan(1);
  });

  it('collect() hides the mesh and reset() restores the new start point', () => {
    const star = new SpecialShootingStar(-9, 0.4, -40, 'gold', 1);
    star.collect();
    star.update(0.3);

    star.reset(9, -0.2, -55, 'silver', -1);

    expect(star.isCollected).toBe(false);
    expect(star.mesh.visible).toBe(true);
    expect(star.specialType).toBe('silver');
    expect(star.position).toEqual({ x: 9, y: -0.2, z: -55 });
  });

  it('recycle() detaches the mesh from its parent scene', () => {
    const star = new SpecialShootingStar(-9, 0.4, -40, 'silver', 1);
    const parent = new THREE.Group();
    parent.add(star.mesh);

    star.recycle();

    expect(star.mesh.parent).toBeNull();
    expect(star.mesh.visible).toBe(true);
    expect(star.isCollected).toBe(false);
  });
});
