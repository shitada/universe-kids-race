// Migrated from StageScene.boostAttrCache.test.ts after BoostLines/BoostFlame
// were extracted into dedicated effect modules. The same caching invariants
// (no per-frame getAttribute, version bumps only when buffers actually change)
// are now properties of the effect classes themselves.
import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { BoostLinesEffect } from '../../../src/game/effects/BoostLinesEffect';
import { BoostFlameEffect } from '../../../src/game/effects/BoostFlameEffect';

const SHIP = { x: 0, y: 0, z: 0 };

function getPosAttr(obj: THREE.LineSegments | THREE.Points): THREE.BufferAttribute {
  return (obj.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute;
}
function getColorAttr(obj: THREE.Points): THREE.BufferAttribute {
  return (obj.geometry as THREE.BufferGeometry).getAttribute('color') as THREE.BufferAttribute;
}

describe('boost effect BufferAttribute caching', () => {
  it('BoostLinesEffect.update does not call getAttribute every frame and bumps version on writes', () => {
    const scene = new THREE.Scene();
    const fx = new BoostLinesEffect();
    fx.init(scene);
    const lines = fx.getObject()!;
    const cachedAttr = getPosAttr(lines);

    const getAttrSpy = vi.spyOn(THREE.BufferGeometry.prototype, 'getAttribute');
    for (let i = 0; i < 5; i++) {
      const prevVersion = cachedAttr.version;
      fx.update(true, 0, 0);
      expect(cachedAttr.version).toBe(prevVersion + 1);
    }
    expect(getAttrSpy).not.toHaveBeenCalled();
    getAttrSpy.mockRestore();
    fx.dispose();
  });

  it('BoostFlameEffect.update does not call getAttribute every frame and bumps position version on live moves', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    const obj = fx.getObject()!;
    const cachedPos = getPosAttr(obj);
    const cachedColor = getColorAttr(obj);

    fx.emit(SHIP, 0);
    const getAttrSpy = vi.spyOn(THREE.BufferGeometry.prototype, 'getAttribute');
    for (let i = 0; i < 5; i++) {
      const prevPosVer = cachedPos.version;
      fx.update(0.016);
      expect(cachedPos.version).toBe(prevPosVer + 1);
    }
    expect(getAttrSpy).not.toHaveBeenCalled();
    getAttrSpy.mockRestore();
    expect(getColorAttr(obj)).toBe(cachedColor);
    fx.dispose();
  });

  it('BoostFlameEffect retains the same Points/attributes across remove() and only releases them on dispose()', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    const firstFlame = fx.getObject();
    const firstPos = getPosAttr(firstFlame!);
    const firstColor = getColorAttr(firstFlame!);

    fx.remove();
    expect(fx.getObject()).toBe(firstFlame);
    expect(getPosAttr(firstFlame!)).toBe(firstPos);
    expect(getColorAttr(firstFlame!)).toBe(firstColor);
    expect(firstFlame!.visible).toBe(false);
    expect(fx.isEmitting()).toBe(false);

    fx.start();
    expect(fx.getObject()).toBe(firstFlame);
    expect(firstFlame!.visible).toBe(true);
    expect(fx.isEmitting()).toBe(true);

    fx.dispose();
    expect(fx.getObject()).toBeNull();
  });

  it('BoostLinesEffect keeps the same position attribute across boost on/off cycles', () => {
    const scene = new THREE.Scene();
    const fx = new BoostLinesEffect();
    fx.init(scene);
    const lines = fx.getObject()!;
    const attr = getPosAttr(lines);

    fx.update(true, 0, 0);
    expect(getPosAttr(lines)).toBe(attr);
    fx.update(false, 0, 0);
    expect(getPosAttr(lines)).toBe(attr);
    fx.update(true, 0, 0);
    expect(getPosAttr(lines)).toBe(attr);
    fx.dispose();
  });

  it('BoostFlameEffect.update does not bump versions while invisible (after remove)', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.remove();
    expect(fx.getObject()!.visible).toBe(false);

    const cachedPos = getPosAttr(fx.getObject()!);
    const cachedColor = getColorAttr(fx.getObject()!);
    const startPosVer = cachedPos.version;
    const startColorVer = cachedColor.version;

    for (let i = 0; i < 10; i++) fx.update(0.016);

    expect(cachedPos.version).toBe(startPosVer);
    expect(cachedColor.version).toBe(startColorVer);
    fx.dispose();
  });

  it('BoostFlameEffect.update does not bump color version when no particles die', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);

    const cachedPos = getPosAttr(fx.getObject()!);
    const cachedColor = getColorAttr(fx.getObject()!);
    const prevPosVer = cachedPos.version;
    const prevColorVer = cachedColor.version;

    // Single small step: lifetimes 0.7 -> ~0.684, nobody dies.
    fx.update(0.016);
    expect(cachedPos.version).toBe(prevPosVer + 1);
    expect(cachedColor.version).toBe(prevColorVer);
    fx.dispose();
  });

  it('BoostFlameEffect.update bumps position version but never color version when particles die', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();
    fx.emit(SHIP, 0);

    const cachedPos = getPosAttr(fx.getObject()!);
    const cachedColor = getColorAttr(fx.getObject()!);
    const prevPosVer = cachedPos.version;
    const prevColorVer = cachedColor.version;

    // Big enough deltaTime to kill all live particles (lifetimes start at 0.7).
    // Color version must NOT bump: dead particles are parked at OFFSCREEN_Z and
    // their color slots are reused on the next emit() rather than zeroed here.
    fx.update(1.0);
    expect(cachedPos.version).toBe(prevPosVer + 1);
    expect(cachedColor.version).toBe(prevColorVer);
    fx.dispose();
  });

  it('BoostFlameEffect.emit bumps versions only when at least one particle is emitted', () => {
    const scene = new THREE.Scene();
    const fx = new BoostFlameEffect();
    fx.init(scene);
    fx.start();

    const cachedPos = getPosAttr(fx.getObject()!);
    const cachedColor = getColorAttr(fx.getObject()!);

    // Normal emit during boost (progress=0) -> emitCount > 0 -> versions advance.
    const prevPosVer = cachedPos.version;
    const prevColorVer = cachedColor.version;
    fx.emit(SHIP, 0);
    expect(cachedPos.version).toBe(prevPosVer + 1);
    expect(cachedColor.version).toBe(prevColorVer + 1);

    // progress=1 -> emitCount == 0 -> no version bump.
    const stalePosVer = cachedPos.version;
    const staleColorVer = cachedColor.version;
    fx.emit(SHIP, 1);
    expect(cachedPos.version).toBe(stalePosVer);
    expect(cachedColor.version).toBe(staleColorVer);
    fx.dispose();
  });
});
