import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { StageAtmosphereEffect } from '../../../src/game/effects/StageAtmosphereEffect';
import { getStageAtmosphereConfig } from '../../../src/game/config/StageAtmosphereConfig';

describe('StageAtmosphereEffect', () => {
  it('開始すると背景グラデーションと粒子を表示する', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 2000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, -10);
    const effect = new StageAtmosphereEffect();

    effect.init(scene);
    effect.start(getStageAtmosphereConfig(1));
    effect.update(0.16, camera, 2, -24);

    expect(scene.children).toContain(effect.getGroup());
    expect(effect.isActive()).toBe(true);
    expect(effect.getBackdropMesh().visible).toBe(true);
    expect(effect.getBackdropMesh().material).toBeInstanceOf(THREE.MeshBasicMaterial);
    expect((effect.getBackdropMesh().material as THREE.MeshBasicMaterial).map).not.toBeNull();
    expect(effect.getParticleSystem().visible).toBe(true);
    expect(effect.getGroup().position.x).toBe(0);
    expect(effect.getParticleSystem().position.z).toBe(0);
  });

  it('低品質ティアでは粒子描画数を減らす', () => {
    const scene = new THREE.Scene();
    const effect = new StageAtmosphereEffect();

    effect.init(scene);
    effect.start(getStageAtmosphereConfig(6));
    effect.setQualityTier(0);

    expect(effect.getParticleSystem().geometry.drawRange.count).toBe(24);
  });

  it('clear で非表示に戻る', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    const effect = new StageAtmosphereEffect();

    effect.init(scene);
    effect.start(getStageAtmosphereConfig(10));
    effect.update(0.16, camera, 0, 0);
    effect.clear();

    expect(effect.isActive()).toBe(false);
    expect(effect.getGroup().visible).toBe(false);
    expect(effect.getParticleSystem().geometry.drawRange.count).toBe(0);
  });
});
