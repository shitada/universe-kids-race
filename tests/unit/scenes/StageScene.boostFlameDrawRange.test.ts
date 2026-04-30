// Migrated from StageScene internals to BoostFlameEffect after boost flame was extracted.
// Tests the drawRange / updateRanges GPU upload optimization that limits uploads
// to only the active particle range, not the entire MAX_PARTICLES buffer.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { BoostFlameEffect } from '../../../src/game/effects/BoostFlameEffect';

const SHIP = { x: 0, y: 0, z: 0 };

function getPositionAttr(fx: BoostFlameEffect): THREE.BufferAttribute {
  return fx.getObject()!.geometry.getAttribute('position') as THREE.BufferAttribute;
}

function getColorAttr(fx: BoostFlameEffect): THREE.BufferAttribute {
  return fx.getObject()!.geometry.getAttribute('color') as THREE.BufferAttribute;
}

function sumUpdateRangeLengths(attr: THREE.BufferAttribute): number {
  const ranges = (attr as unknown as { updateRanges?: Array<{ start: number; count: number }> }).updateRanges ?? [];
  return ranges.reduce((sum, r) => sum + r.count, 0);
}

describe('BoostFlameEffect drawRange / updateRanges optimization', () => {
  it('init() initializes drawRange.count to 0', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);

    expect(fx.getObject()).not.toBeNull();
    expect(fx.getObject()!.geometry.drawRange.count).toBe(0);
    expect(fx.getMaxAliveIndex()).toBe(-1);
    fx.dispose();
  });

  it('after a single emit cycle, drawRange.count equals the number of emitted slots and updateRanges is bounded', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();

    // After start (before any emit), nothing alive.
    expect(fx.getObject()!.geometry.drawRange.count).toBe(0);

    fx.emit(SHIP, 0);

    // Active phase emits 8 particles per frame.
    const drawCount = fx.getObject()!.geometry.drawRange.count;
    expect(drawCount).toBeGreaterThan(0);
    expect(drawCount).toBeLessThanOrEqual(8);

    const positionAttr = getPositionAttr(fx);
    const colorAttr = getColorAttr(fx);

    // Cumulative updateRanges length must not exceed (maxAliveIndex+1)*3.
    const limit = (fx.getMaxAliveIndex() + 1) * 3;
    expect(sumUpdateRangeLengths(positionAttr)).toBeLessThanOrEqual(limit);
    expect(sumUpdateRangeLengths(colorAttr)).toBeLessThanOrEqual(limit);
    // And specifically not the entire MAX_PARTICLES*3 buffer.
    expect(sumUpdateRangeLengths(positionAttr)).toBeLessThan(BoostFlameEffect.MAX_PARTICLES * 3);
    fx.dispose();
  });

  it('drawRange.count monotonically decreases to 0 after emission stops and lifetimes expire', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();

    // Emit some particles across multiple frames.
    for (let i = 0; i < 3; i++) {
      fx.emit(SHIP, 0);
      fx.update(0.016);
    }
    const peakCount = fx.getObject()!.geometry.drawRange.count;
    expect(peakCount).toBeGreaterThan(0);

    // Stop emission; let particles age out.
    fx.stopEmitting();

    let lastCount = peakCount;
    for (let i = 0; i < 60; i++) {
      if (!fx.getObject()) break;
      fx.update(0.05);
      const c = fx.getObject() ? fx.getObject()!.geometry.drawRange.count : 0;
      expect(c).toBeLessThanOrEqual(lastCount);
      lastCount = c;
      if (!fx.getObject() || !fx.getObject()!.visible) break;
    }

    // After all particles expire, remove() is called -> visible=false, drawRange.count=0.
    expect(fx.getObject()!.visible).toBe(false);
    expect(fx.getObject()!.geometry.drawRange.count).toBe(0);
    expect(fx.getMaxAliveIndex()).toBe(-1);
    fx.dispose();
  });

  it('remove() resets drawRange.count to 0 and maxAliveIndex to -1', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);

    expect(fx.getObject()!.geometry.drawRange.count).toBeGreaterThan(0);

    fx.remove();

    expect(fx.getObject()!.geometry.drawRange.count).toBe(0);
    expect(fx.getMaxAliveIndex()).toBe(-1);
    expect(fx.getObject()!.visible).toBe(false);
    fx.dispose();
  });
});
