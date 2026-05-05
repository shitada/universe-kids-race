import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { LovelyStarBurstEffect } from '../../../src/game/effects/LovelyStarBurstEffect';

describe('LovelyStarBurstEffect', () => {
  it('emits and expires a pooled heart burst', () => {
    const scene = new THREE.Scene();
    const effect = new LovelyStarBurstEffect();
    effect.init(scene);

    effect.emit({ x: 1, y: 2, z: 3 });
    expect(effect.getPoolSize()).toBeGreaterThan(0);
    expect(effect.getActiveCount()).toBe(1);

    effect.update(1);
    expect(effect.getActiveCount()).toBe(0);
  });
});
