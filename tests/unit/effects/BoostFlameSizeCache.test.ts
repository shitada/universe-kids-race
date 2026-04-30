// Migrated from StageScene.boostFlameSizeCache.test.ts after BoostFlameEffect
// was extracted. The material.size redundant-write suppression is now a property
// of the effect class itself.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { BoostFlameEffect } from '../../../src/game/effects/BoostFlameEffect';

const SHIP = { x: 0, y: 0, z: 0 };
const FADE_START = 0.83;

function spyOnMaterialSize(material: THREE.PointsMaterial): { writes: number[]; restore: () => void } {
  const writes: number[] = [];
  let backing = material.size;
  const desc = Object.getOwnPropertyDescriptor(material, 'size');
  Object.defineProperty(material, 'size', {
    configurable: true,
    enumerable: true,
    get(): number { return backing; },
    set(v: number) { writes.push(v); backing = v; },
  });
  return {
    writes,
    restore() {
      if (desc) Object.defineProperty(material, 'size', desc);
      else {
        delete (material as unknown as { size?: number }).size;
        (material as unknown as { size: number }).size = backing;
      }
    },
  };
}

describe('BoostFlameEffect material.size redundant write suppression', () => {
  it('writes material.size at most once while sizeFraction stays at 1.0', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    const material = fx.getObject()!.material as THREE.PointsMaterial;
    const spy = spyOnMaterialSize(material);

    for (let i = 0; i < 20; i++) fx.emit(SHIP, 0); // progress < FADE_START

    expect(spy.writes.length).toBeLessThanOrEqual(1);
    for (const v of spy.writes) expect(v).toBeCloseTo(0.5, 6);
    expect(material.size).toBeCloseTo(0.5, 6);

    spy.restore();
    fx.dispose();
  });

  it('updates material.size every frame once progress is past fadeStart', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    const material = fx.getObject()!.material as THREE.PointsMaterial;

    const spy = spyOnMaterialSize(material);
    let progress = FADE_START + 0.02;
    const samples = 5;
    for (let i = 0; i < samples; i++) {
      fx.emit(SHIP, progress);
      progress += 0.01;
    }
    expect(spy.writes.length).toBe(samples);
    for (let i = 1; i < spy.writes.length; i++) {
      expect(spy.writes[i]).not.toBe(spy.writes[i - 1]);
    }
    spy.restore();
    fx.dispose();
  });

  it('resets cached size on remove() so the next boost cycle re-writes material.size', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);
    const material = fx.getObject()!.material as THREE.PointsMaterial;
    expect(material.size).toBeCloseTo(0.5, 6);

    fx.remove();
    // Tamper with size to simulate any external state drift between cycles.
    material.size = 0.123;

    const spy = spyOnMaterialSize(material);
    fx.start();
    fx.emit(SHIP, 0);

    // start() must re-write the canonical 0.5; emit at sizeFraction=1 must not duplicate.
    expect(spy.writes.length).toBe(1);
    expect(spy.writes[0]).toBeCloseTo(0.5, 6);
    expect(material.size).toBeCloseTo(0.5, 6);
    spy.restore();
    fx.dispose();
  });

  it('resets cached size on dispose() so a re-initialized flame writes size again', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);
    fx.dispose();
    expect(fx.getObject()).toBeNull();

    fx.init(scene);
    const material = fx.getObject()!.material as THREE.PointsMaterial;
    const spy = spyOnMaterialSize(material);
    fx.start();
    fx.emit(SHIP, 0);

    expect(spy.writes.length).toBe(1);
    expect(spy.writes[0]).toBeCloseTo(0.5, 6);
    spy.restore();
    fx.dispose();
  });
});
