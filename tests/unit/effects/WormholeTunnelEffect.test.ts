import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { WormholeTunnelEffect } from '../../../src/game/effects/WormholeTunnelEffect';
import type { WormholeTunnelConfig } from '../../../src/types';

function createConfig(overrides: Partial<WormholeTunnelConfig> = {}): WormholeTunnelConfig {
  return {
    sourceColor: 0x44bbff,
    targetColor: 0xffaa44,
    duration: 2.2,
    particleCount: 72,
    rayCount: 20,
    ...overrides,
  };
}

describe('WormholeTunnelEffect', () => {
  it('start と update でワームホール表示を有効にする', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 2000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, -10);
    camera.updateMatrixWorld(true);
    const effect = new WormholeTunnelEffect();

    effect.init(scene);
    effect.start(createConfig());
    effect.update(0.16, camera);

    expect(scene.children).toContain(effect.getGroup());
    expect(effect.isActive()).toBe(true);
    expect(effect.getGroup().visible).toBe(true);
    expect(effect.getParticleSystem().geometry.drawRange.count).toBeGreaterThan(0);
    expect(effect.getRaySystem().geometry.drawRange.count).toBeGreaterThan(0);
    expect(effect.getFlashMesh().visible).toBe(true);
  });

  it('粒子数と光線数を上限以内に抑える', () => {
    const scene = new THREE.Scene();
    const effect = new WormholeTunnelEffect();

    effect.init(scene);
    effect.start(createConfig({ particleCount: 999, rayCount: 999 }));

    expect(effect.getConfiguredParticleCount()).toBe(WormholeTunnelEffect.MAX_PARTICLES);
    expect(effect.getConfiguredRayCount()).toBe(WormholeTunnelEffect.MAX_RAYS);
    expect(effect.getParticleSystem().geometry.drawRange.count).toBeLessThanOrEqual(
      WormholeTunnelEffect.MAX_PARTICLES,
    );
    expect(effect.getRaySystem().geometry.drawRange.count).toBeLessThanOrEqual(
      WormholeTunnelEffect.MAX_RAYS * 2,
    );
  });

  it('clear で非表示に戻す', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    camera.updateMatrixWorld(true);
    const effect = new WormholeTunnelEffect();

    effect.init(scene);
    effect.start(createConfig());
    effect.update(0.2, camera);
    effect.clear();

    expect(effect.isActive()).toBe(false);
    expect(effect.getGroup().visible).toBe(false);
    expect(effect.getParticleSystem().geometry.drawRange.count).toBe(0);
    expect(effect.getRaySystem().geometry.drawRange.count).toBe(0);
    expect(effect.getFlashMesh().visible).toBe(false);
  });
});
