import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { ConstellationCelebrationEffect } from '../../../src/game/effects/ConstellationCelebrationEffect';

describe('ConstellationCelebrationEffect', () => {
  it('shows a celebration burst and hides it after the animation completes', () => {
    const scene = new THREE.Scene();
    const effect = new ConstellationCelebrationEffect();
    effect.init(scene);

    effect.play({ x: 1, y: 2, z: 3 }, 0x66ccff);

    expect(effect.getObject().visible).toBe(true);
    expect(effect.getObject().position.toArray()).toEqual([1, 2, 3]);

    effect.update(0.2);
    expect(effect.getObject().visible).toBe(true);
    expect(effect.getObject().rotation.z).toBeGreaterThan(0);

    effect.update(1.2);
    expect(effect.getObject().visible).toBe(false);

    effect.dispose();
  });
});
