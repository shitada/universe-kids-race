import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { PlanetRingEffect } from '../../../src/game/effects/PlanetRingEffect';

describe('PlanetRingEffect', () => {
  it('3本のリングを内側から順番に表示し、出現時にバーストを発火する', () => {
    const scene = new THREE.Scene();
    const planet = new THREE.Group();
    scene.add(planet);
    const burstManager = { emit: vi.fn() };
    const effect = new PlanetRingEffect();

    effect.start(scene, planet, 15, 0xffcc00, burstManager);
    expect(effect.isActive()).toBe(true);
    expect(planet.children).toContain(effect.getGroup());

    const rings = effect.getGroup().children as THREE.Mesh[];
    expect(rings).toHaveLength(3);
    expect(rings.every((ring) => ring.visible === false)).toBe(true);

    effect.update(0.12);
    expect(rings.filter((ring) => ring.visible).length).toBe(1);
    expect(burstManager.emit).toHaveBeenCalledTimes(1);

    effect.update(0.2);
    expect(rings.filter((ring) => ring.visible).length).toBeGreaterThanOrEqual(2);
    expect(burstManager.emit).toHaveBeenCalledTimes(2);

    effect.update(0.2);
    expect(rings.filter((ring) => ring.visible).length).toBe(3);
    expect(burstManager.emit).toHaveBeenCalledTimes(3);
  });

  it('演出終了後に自動クリーンアップして親オブジェクトから外れる', () => {
    const scene = new THREE.Scene();
    const planet = new THREE.Group();
    scene.add(planet);
    const effect = new PlanetRingEffect();

    effect.start(scene, planet, 18, 0x44ccff);
    effect.update(2);

    expect(effect.isActive()).toBe(false);
    expect(effect.getGroup().parent).toBeNull();
    expect(planet.children).not.toContain(effect.getGroup());
  });

  it('複数インスタンスで共有ジオメトリを使い回す', () => {
    const first = new PlanetRingEffect();
    const second = new PlanetRingEffect();

    const firstRings = first.getGroup().children as THREE.Mesh[];
    const secondRings = second.getGroup().children as THREE.Mesh[];

    expect(firstRings[0].geometry).toBe(secondRings[0].geometry);
  });
});
