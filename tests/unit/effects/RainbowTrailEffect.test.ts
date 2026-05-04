import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { RainbowTrailEffect } from '../../../src/game/effects/RainbowTrailEffect';

describe('RainbowTrailEffect', () => {
  it('starts with six rainbow bands and becomes visible when activated', () => {
    const effect = new RainbowTrailEffect();

    expect(effect.group.visible).toBe(false);
    expect(effect.group.children).toHaveLength(6);

    effect.start(new THREE.Vector3(1, 2, 3));

    expect(effect.isActive()).toBe(true);
    expect(effect.group.visible).toBe(true);

    const colors = effect.group.children.map((child) =>
      (((child as THREE.Line).material) as THREE.LineBasicMaterial).color.getHex(),
    );
    expect(colors).toEqual([0xff5f6d, 0xff9f43, 0xffe066, 0x6bff95, 0x4dabf7, 0xb197fc]);
  });

  it('tracks the spaceship path while active and clears itself after six seconds', () => {
    const effect = new RainbowTrailEffect();

    effect.start(new THREE.Vector3(0, 0, 0));
    effect.update(0.2, new THREE.Vector3(1, 0.5, -2));

    const firstBand = effect.group.children[0] as THREE.Line;
    const positions = (firstBand.geometry.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;

    expect(Array.from(positions)).toContain(1);
    expect(Array.from(positions)).toContain(-2);

    effect.update(5.7, new THREE.Vector3(2, 0.5, -20));
    expect(effect.isActive()).toBe(true);

    effect.update(0.2, new THREE.Vector3(2, 0.5, -22));
    expect(effect.isActive()).toBe(false);
    expect(effect.group.visible).toBe(false);
  });
});
