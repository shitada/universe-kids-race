import { beforeEach, describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { ScorePopupEffect } from '../../../src/game/effects/ScorePopupEffect';

describe('ScorePopupEffect', () => {
  let scene: THREE.Scene;
  let effect: ScorePopupEffect;

  beforeEach(() => {
    scene = new THREE.Scene();
    effect = new ScorePopupEffect();
    effect.init(scene);
  });

  it('emits a sparkle burst with capped particle count', () => {
    effect.emit({ x: 1, y: 2, z: 3 }, 500);

    const points = scene.children.find((child) => (child as THREE.Points).isPoints) as THREE.Points | undefined;

    expect(points).toBeDefined();
    expect(points?.visible).toBe(true);
    expect(points?.geometry.drawRange.count).toBeLessThanOrEqual(20);
    expect(effect.getActiveCount()).toBe(1);
  });

  it('expires sparkle bursts after their lifetime', () => {
    effect.emit({ x: 0, y: 0, z: 0 }, 100);

    effect.update(1.1);

    expect(effect.getActiveCount()).toBe(0);
    expect(scene.children.some((child) => child.visible)).toBe(false);
  });

  it('reuses a fixed-size pool during rapid consecutive score gains', () => {
    for (let i = 0; i < 12; i++) {
      effect.emit({ x: i * 0.2, y: 0, z: -i }, 100);
    }

    const sparklePoints = scene.children.filter((child) => (child as THREE.Points).isPoints);

    expect(sparklePoints.length).toBe(effect.getPoolSize());
    expect(effect.getActiveCount()).toBeLessThanOrEqual(effect.getPoolSize());
    expect(
      sparklePoints.every((child) => (child as THREE.Points).geometry.drawRange.count <= 20),
    ).toBe(true);
  });
});
