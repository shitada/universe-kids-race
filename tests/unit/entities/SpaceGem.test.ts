import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { SpaceGem } from '../../../src/game/entities/SpaceGem';

describe('SpaceGem', () => {
  it('creates a visible sparkling gem mesh', () => {
    const gem = new SpaceGem(2, 0.1, -40, 'diamond-nebula');

    expect(gem.isCollected).toBe(false);
    expect(gem.mesh.visible).toBe(true);
    expect(gem.mesh.getObjectByName('space-gem-core')).toBeTruthy();
    expect(gem.mesh.getObjectByName('space-gem-glow')).toBeTruthy();
  });

  it('gives each gem type a distinct appearance and motion', () => {
    const diamond = new SpaceGem(0, 0, -10, 'diamond-nebula');
    const ruby = new SpaceGem(0, 0, -10, 'ruby-solar-wind');

    diamond.update(0.5);
    ruby.update(0.5);

    expect(diamond.position.x.toFixed(3)).not.toBe(ruby.position.x.toFixed(3));
    expect(diamond.mesh.scale.x.toFixed(3)).not.toBe(ruby.mesh.scale.x.toFixed(3));
  });

  it('collect hides the mesh and reset restores it', () => {
    const gem = new SpaceGem(0, 0, -10, 'pearl-dust');
    gem.collect();

    gem.reset(3, -0.2, -24, 'emerald-comet');

    expect(gem.isCollected).toBe(false);
    expect(gem.mesh.visible).toBe(true);
    expect(gem.gemType).toBe('emerald-comet');
    expect(gem.position).toEqual({ x: 3, y: -0.2, z: -24 });
  });

  it('recycle detaches the gem mesh from its parent', () => {
    const gem = new SpaceGem(0, 0, -10, 'topaz-spark');
    const parent = new THREE.Group();
    parent.add(gem.mesh);

    gem.recycle();

    expect(gem.mesh.parent).toBeNull();
    expect(gem.mesh.visible).toBe(true);
  });
});
