// Migrated from StageScene.boostLinesVisibility.test.ts after BoostLinesEffect
// was extracted. The visibility cache invariants (no redundant writes when state
// is unchanged) are now properties of the effect class itself.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { BoostLinesEffect } from '../../../src/game/effects/BoostLinesEffect';

function spyOnVisible(obj: THREE.Object3D): { writes: boolean[]; restore: () => void } {
  const writes: boolean[] = [];
  let backing = obj.visible;
  const desc = Object.getOwnPropertyDescriptor(obj, 'visible');
  Object.defineProperty(obj, 'visible', {
    configurable: true,
    enumerable: true,
    get(): boolean { return backing; },
    set(v: boolean) { writes.push(v); backing = v; },
  });
  return {
    writes,
    restore() {
      if (desc) Object.defineProperty(obj, 'visible', desc);
      else {
        delete (obj as unknown as { visible?: boolean }).visible;
        (obj as unknown as { visible: boolean }).visible = backing;
      }
    },
  };
}

describe('BoostLinesEffect visibility redundant write suppression', () => {
  it('writes visible=false at most once when boost stays inactive across many frames', () => {
    const scene = new THREE.Scene();
    const fx = new BoostLinesEffect();
    fx.init(scene);
    const spy = spyOnVisible(fx.getObject()!);
    for (let i = 0; i < 60; i++) fx.update(false, 0, 0);
    expect(spy.writes.length).toBe(0);
    expect(fx.getObject()!.visible).toBe(false);
    spy.restore();
    fx.dispose();
  });

  it('writes visible only on transitions across boost on/off cycles', () => {
    const scene = new THREE.Scene();
    const fx = new BoostLinesEffect();
    fx.init(scene);
    const spy = spyOnVisible(fx.getObject()!);

    fx.update(false, 0, 0);
    fx.update(false, 0, 0);
    expect(spy.writes).toEqual([]);

    fx.update(true, 0, 0);
    expect(spy.writes).toEqual([true]);
    fx.update(true, 0, 0);
    fx.update(true, 0, 0);
    expect(spy.writes).toEqual([true]);

    fx.update(false, 0, 0);
    expect(spy.writes).toEqual([true, false]);
    fx.update(false, 0, 0);
    fx.update(false, 0, 0);
    expect(spy.writes).toEqual([true, false]);

    fx.update(true, 0, 0);
    expect(spy.writes).toEqual([true, false, true]);

    spy.restore();
    fx.dispose();
  });

  it('init primes the visibility cache to false on a freshly-created effect', () => {
    const scene = new THREE.Scene();
    const fx = new BoostLinesEffect();
    fx.init(scene);
    expect(fx.getObject()!.visible).toBe(false);

    // Activate boost to move cache to true, then dispose to simulate stage exit.
    fx.update(true, 0, 0);
    fx.dispose();

    // New effect (next stage) must re-prime the cache to false: first inactive
    // update produces no redundant write.
    const fx2 = new BoostLinesEffect();
    fx2.init(scene);
    expect(fx2.getObject()!.visible).toBe(false);
    const spy = spyOnVisible(fx2.getObject()!);
    for (let i = 0; i < 5; i++) fx2.update(false, 0, 0);
    expect(spy.writes.length).toBe(0);
    spy.restore();
    fx2.dispose();
  });
});
