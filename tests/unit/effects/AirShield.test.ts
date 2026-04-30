import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';

const { AirShield } = await import('../../../src/game/effects/AirShield');

describe('AirShield', () => {
  it('creates mesh with correct geometry and material', () => {
    const shield = new AirShield();
    const mesh = shield.getMesh();
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.geometry).toBeInstanceOf(THREE.SphereGeometry);

    const mat = mesh.material as THREE.MeshBasicMaterial;
    expect(mat.transparent).toBe(true);
    expect(mat.blending).toBe(THREE.AdditiveBlending);
    expect(mat.depthWrite).toBe(false);
    expect(mat.color.getHex()).toBe(0x44aaff);

    shield.dispose();
  });

  it('mesh is hidden by default after construction', () => {
    const shield = new AirShield();
    expect(shield.getMesh().visible).toBe(false);
    shield.dispose();
  });

  it('setBoostMode(true) makes mesh visible with elliptical scale and color 0x88ddff', () => {
    const shield = new AirShield();
    shield.setBoostMode(true);
    const mesh = shield.getMesh();
    const mat = mesh.material as THREE.MeshBasicMaterial;
    expect(mesh.visible).toBe(true);
    expect(mesh.scale.x).toBeCloseTo(1.0);
    expect(mesh.scale.y).toBeCloseTo(0.8);
    expect(mesh.scale.z).toBeCloseTo(2.0);
    expect(mat.color.getHex()).toBe(0x88ddff);
    shield.dispose();
  });

  it('setBoostMode(false) hides mesh and resets color', () => {
    const shield = new AirShield();
    shield.setBoostMode(true);
    shield.setBoostMode(false);
    const mesh = shield.getMesh();
    const mat = mesh.material as THREE.MeshBasicMaterial;
    expect(mesh.visible).toBe(false);
    expect(mat.color.getHex()).toBe(0x44aaff);
    shield.dispose();
  });

  it('update does not change opacity when not boosting (early return)', () => {
    const shield = new AirShield();
    const mat = shield.getMesh().material as THREE.MeshBasicMaterial;
    const initialOpacity = mat.opacity;
    for (let i = 0; i < 60; i++) {
      shield.update(1 / 60);
    }
    expect(mat.opacity).toBe(initialOpacity);
    shield.dispose();
  });

  it('boost mode animates opacity in range 0.25–0.35', () => {
    const shield = new AirShield();
    const mat = shield.getMesh().material as THREE.MeshBasicMaterial;

    shield.setBoostMode(true);
    const opacities: number[] = [];
    for (let i = 0; i < 60; i++) {
      shield.update(1 / 60);
      opacities.push(mat.opacity);
    }

    const min = Math.min(...opacities);
    const max = Math.max(...opacities);
    expect(min).toBeGreaterThanOrEqual(0.24);
    expect(max).toBeLessThanOrEqual(0.36);

    shield.dispose();
  });

  it('boost mode keeps scale fixed at elliptical (1.0, 0.8, 2.0) — no scale pulse', () => {
    const shield = new AirShield();
    const mesh = shield.getMesh();

    shield.setBoostMode(true);
    for (let i = 0; i < 60; i++) {
      shield.update(1 / 60);
      expect(mesh.scale.x).toBeCloseTo(1.0);
      expect(mesh.scale.y).toBeCloseTo(0.8);
      expect(mesh.scale.z).toBeCloseTo(2.0);
    }

    shield.dispose();
  });

  it('setPosition immediately updates mesh position when shield is active (BOOST)', () => {
    const shield = new AirShield();
    shield.setShieldMode('BOOST');
    shield.setPosition(3, 5, -10);
    const mesh = shield.getMesh();
    expect(mesh.position.x).toBe(3);
    expect(mesh.position.y).toBe(5);
    expect(mesh.position.z).toBe(-10);

    shield.dispose();
  });

  it('dispose cleans up geometry and material', () => {
    const shield = new AirShield();
    const mesh = shield.getMesh();
    const geo = mesh.geometry;
    const mat = mesh.material as THREE.MeshBasicMaterial;

    const geoDispose = vi.spyOn(geo, 'dispose');
    const matDispose = vi.spyOn(mat, 'dispose');

    shield.dispose();

    expect(geoDispose).toHaveBeenCalled();
    expect(matDispose).toHaveBeenCalled();
  });

  it('skips redundant writes when setBoostMode is called with the same value consecutively', () => {
    const shield = new AirShield();
    const mesh = shield.getMesh();
    const mat = mesh.material as THREE.MeshBasicMaterial;

    shield.setBoostMode(true);

    const colorSetHexSpy = vi.spyOn(mat.color, 'setHex');
    const scaleSetSpy = vi.spyOn(mesh.scale, 'set');

    shield.setBoostMode(true);
    shield.setBoostMode(true);
    shield.setBoostMode(true);

    expect(colorSetHexSpy).not.toHaveBeenCalled();
    expect(scaleSetSpy).not.toHaveBeenCalled();

    shield.dispose();
  });

  it('skips redundant writes when setBoostMode(false) is called repeatedly', () => {
    const shield = new AirShield();
    const mesh = shield.getMesh();
    const mat = mesh.material as THREE.MeshBasicMaterial;

    shield.setBoostMode(false);

    const colorSetHexSpy = vi.spyOn(mat.color, 'setHex');
    const scaleSetSpy = vi.spyOn(mesh.scale, 'set');

    for (let i = 0; i < 10; i++) {
      shield.setBoostMode(false);
    }

    expect(colorSetHexSpy).not.toHaveBeenCalled();
    expect(scaleSetSpy).not.toHaveBeenCalled();

    shield.dispose();
  });

  it('applies state correctly across false → true → false → true transitions', () => {
    const shield = new AirShield();
    const mesh = shield.getMesh();
    const mat = mesh.material as THREE.MeshBasicMaterial;

    shield.setBoostMode(false);
    expect(mesh.visible).toBe(false);
    expect(mat.color.getHex()).toBe(0x44aaff);

    shield.setBoostMode(true);
    expect(mesh.visible).toBe(true);
    expect(mat.color.getHex()).toBe(0x88ddff);
    expect(mesh.scale.x).toBeCloseTo(1.0);
    expect(mesh.scale.y).toBeCloseTo(0.8);
    expect(mesh.scale.z).toBeCloseTo(2.0);

    shield.setBoostMode(false);
    expect(mesh.visible).toBe(false);
    expect(mat.color.getHex()).toBe(0x44aaff);

    shield.setBoostMode(true);
    expect(mesh.visible).toBe(true);
    expect(mat.color.getHex()).toBe(0x88ddff);

    shield.dispose();
  });

  describe('INVINCIBLE mode', () => {
    it('setShieldMode("INVINCIBLE") shows mesh with pink color and rounded scale', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 1);
      const mesh = shield.getMesh();
      const mat = mesh.material as THREE.MeshBasicMaterial;
      expect(mesh.visible).toBe(true);
      expect(mat.color.getHex()).toBe(0xff88aa);
      expect(mesh.scale.x).toBeCloseTo(1.2);
      expect(mesh.scale.y).toBeCloseTo(1.0);
      expect(mesh.scale.z).toBeCloseTo(1.6);
      shield.dispose();
    });

    it('setShieldMode("OFF") after INVINCIBLE hides the mesh', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 1);
      shield.setShieldMode('OFF');
      const mesh = shield.getMesh();
      const mat = mesh.material as THREE.MeshBasicMaterial;
      expect(mesh.visible).toBe(false);
      expect(mat.color.getHex()).toBe(0x44aaff);
      shield.dispose();
    });

    it('opacity scales with opacityScale parameter (full at 1, zero at 0)', () => {
      const shieldFull = new AirShield();
      shieldFull.setShieldMode('INVINCIBLE', 1);
      const matFull = shieldFull.getMesh().material as THREE.MeshBasicMaterial;
      const opacitiesFull: number[] = [];
      for (let i = 0; i < 60; i++) {
        shieldFull.update(1 / 60);
        opacitiesFull.push(matFull.opacity);
      }
      const maxFull = Math.max(...opacitiesFull);
      expect(maxFull).toBeGreaterThan(0.4); // pulses up to ~0.5

      const shieldZero = new AirShield();
      shieldZero.setShieldMode('INVINCIBLE', 0);
      const matZero = shieldZero.getMesh().material as THREE.MeshBasicMaterial;
      for (let i = 0; i < 60; i++) {
        shieldZero.update(1 / 60);
      }
      expect(matZero.opacity).toBeCloseTo(0, 5);

      shieldFull.dispose();
      shieldZero.dispose();
    });

    it('opacity decreases monotonically as opacityScale ramps from 1 to 0', () => {
      const shield = new AirShield();
      const mat = shield.getMesh().material as THREE.MeshBasicMaterial;
      // Sample peak opacity at several scales (skip pulse by sampling at the
      // same phase of the sine wave: every full period at 3Hz = 1/3s).
      const period = 1 / 3;
      shield.setShieldMode('INVINCIBLE', 1);
      // Advance by one period at scale=1 to settle phase, then capture.
      shield.update(period);
      const op1 = mat.opacity;
      shield.setShieldMode('INVINCIBLE', 0.5);
      shield.update(period);
      const op05 = mat.opacity;
      shield.setShieldMode('INVINCIBLE', 0);
      shield.update(period);
      const op0 = mat.opacity;
      expect(op05).toBeLessThan(op1);
      expect(op0).toBeLessThan(op05);
      expect(op0).toBeCloseTo(0, 5);
      shield.dispose();
    });

    it('clamps negative opacityScale to 0', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', -0.5);
      const mat = shield.getMesh().material as THREE.MeshBasicMaterial;
      shield.update(1 / 60);
      expect(mat.opacity).toBeCloseTo(0, 5);
      shield.dispose();
    });

    it('clamps opacityScale > 1 to 1', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 5);
      const mat = shield.getMesh().material as THREE.MeshBasicMaterial;
      // Same phase trick to compare peaks deterministically.
      shield.update(1 / 3);
      const opHigh = mat.opacity;

      const ref = new AirShield();
      ref.setShieldMode('INVINCIBLE', 1);
      const matRef = ref.getMesh().material as THREE.MeshBasicMaterial;
      ref.update(1 / 3);
      const opRef = matRef.opacity;

      expect(opHigh).toBeCloseTo(opRef, 5);
      shield.dispose();
      ref.dispose();
    });

    it('transitions BOOST → INVINCIBLE updates color and scale', () => {
      const shield = new AirShield();
      shield.setShieldMode('BOOST');
      shield.setShieldMode('INVINCIBLE', 1);
      const mesh = shield.getMesh();
      const mat = mesh.material as THREE.MeshBasicMaterial;
      expect(mat.color.getHex()).toBe(0xff88aa);
      expect(mesh.scale.x).toBeCloseTo(1.2);
      expect(mesh.scale.z).toBeCloseTo(1.6);
      shield.dispose();
    });

    it('getMode reflects the current shield mode', () => {
      const shield = new AirShield();
      expect(shield.getMode()).toBe('OFF');
      shield.setShieldMode('BOOST');
      expect(shield.getMode()).toBe('BOOST');
      shield.setShieldMode('INVINCIBLE', 1);
      expect(shield.getMode()).toBe('INVINCIBLE');
      shield.setShieldMode('OFF');
      expect(shield.getMode()).toBe('OFF');
      shield.dispose();
    });
  });

  describe('setPosition deferral while OFF (matrixWorld update reduction)', () => {
    it('AC1: setPosition while mode === OFF does NOT mutate mesh.position', () => {
      const shield = new AirShield();
      const mesh = shield.getMesh();
      const before = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
      const positionSetSpy = vi.spyOn(mesh.position, 'set');

      shield.setPosition(7, 8, 9);

      expect(positionSetSpy).not.toHaveBeenCalled();
      expect(mesh.position.x).toBe(before.x);
      expect(mesh.position.y).toBe(before.y);
      expect(mesh.position.z).toBe(before.z);

      shield.dispose();
    });

    it('AC2: OFF→BOOST transition flushes the latest pending position before becoming visible', () => {
      const shield = new AirShield();
      shield.setPosition(11, 22, 33);
      shield.setPosition(44, 55, 66); // overwrite with the latest value
      shield.setShieldMode('BOOST');
      const mesh = shield.getMesh();
      expect(mesh.position.x).toBe(44);
      expect(mesh.position.y).toBe(55);
      expect(mesh.position.z).toBe(66);
      expect(mesh.visible).toBe(true);
      shield.dispose();
    });

    it('AC2: OFF→INVINCIBLE transition also flushes the latest pending position', () => {
      const shield = new AirShield();
      shield.setPosition(-1, -2, -3);
      shield.setShieldMode('INVINCIBLE', 1);
      const mesh = shield.getMesh();
      expect(mesh.position.x).toBe(-1);
      expect(mesh.position.y).toBe(-2);
      expect(mesh.position.z).toBe(-3);
      expect(mesh.visible).toBe(true);
      shield.dispose();
    });

    it('AC3: setPosition during BOOST is applied immediately to mesh.position', () => {
      const shield = new AirShield();
      shield.setShieldMode('BOOST');
      shield.setPosition(1, 2, 3);
      const mesh = shield.getMesh();
      expect(mesh.position.x).toBe(1);
      expect(mesh.position.y).toBe(2);
      expect(mesh.position.z).toBe(3);

      shield.setPosition(4, 5, 6);
      expect(mesh.position.x).toBe(4);
      expect(mesh.position.y).toBe(5);
      expect(mesh.position.z).toBe(6);
      shield.dispose();
    });

    it('AC3: setPosition during INVINCIBLE is applied immediately to mesh.position', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 1);
      shield.setPosition(9, 8, 7);
      const mesh = shield.getMesh();
      expect(mesh.position.x).toBe(9);
      expect(mesh.position.y).toBe(8);
      expect(mesh.position.z).toBe(7);
      shield.dispose();
    });

    it('after BOOST→OFF, subsequent setPosition is again deferred (no mesh.position.set)', () => {
      const shield = new AirShield();
      shield.setShieldMode('BOOST');
      shield.setPosition(1, 2, 3);
      shield.setShieldMode('OFF');
      const mesh = shield.getMesh();
      const positionSetSpy = vi.spyOn(mesh.position, 'set');

      shield.setPosition(10, 20, 30);

      expect(positionSetSpy).not.toHaveBeenCalled();
      // Still showing the last applied (pre-OFF) position.
      expect(mesh.position.x).toBe(1);
      expect(mesh.position.y).toBe(2);
      expect(mesh.position.z).toBe(3);

      // Re-activating flushes the new pending value.
      positionSetSpy.mockRestore();
      shield.setShieldMode('BOOST');
      expect(mesh.position.x).toBe(10);
      expect(mesh.position.y).toBe(20);
      expect(mesh.position.z).toBe(30);

      shield.dispose();
    });

    it('OFF→BOOST without any pending setPosition does not call mesh.position.set', () => {
      const shield = new AirShield();
      const positionSetSpy = vi.spyOn(shield.getMesh().position, 'set');
      shield.setShieldMode('BOOST');
      expect(positionSetSpy).not.toHaveBeenCalled();
      shield.dispose();
    });
  });

  describe('visibility skip when fully faded (fillrate optimization)', () => {
    it('INVINCIBLE with opacityScale=0 hides mesh after update to skip additive draw', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 0);
      shield.update(0.016);
      expect(shield.getMesh().visible).toBe(false);
      shield.dispose();
    });

    it('INVINCIBLE with opacityScale=1 keeps mesh visible after update', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 1);
      shield.update(0.016);
      expect(shield.getMesh().visible).toBe(true);
      shield.dispose();
    });

    it("setShieldMode('OFF') leaves mesh hidden immediately (no update needed)", () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 1);
      shield.setShieldMode('OFF');
      expect(shield.getMesh().visible).toBe(false);
      shield.dispose();
    });

    it('BOOST mode keeps mesh visible across update (opacity well above threshold)', () => {
      const shield = new AirShield();
      shield.setShieldMode('BOOST');
      for (let i = 0; i < 30; i++) {
        shield.update(1 / 60);
        expect(shield.getMesh().visible).toBe(true);
      }
      shield.dispose();
    });

    it('INVINCIBLE re-shows mesh when opacityScale ramps back above threshold', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 0);
      shield.update(0.016);
      expect(shield.getMesh().visible).toBe(false);
      // Caller updates opacityScale back above threshold; same mode so only
      // the scale is updated. update() should re-enable visibility.
      shield.setShieldMode('INVINCIBLE', 1);
      shield.update(0.016);
      expect(shield.getMesh().visible).toBe(true);
      shield.dispose();
    });

    it('setShieldMode(BOOST) sets a non-zero initial opacity so first frame is visible', () => {
      const shield = new AirShield();
      shield.setShieldMode('BOOST');
      const mat = shield.getMesh().material as THREE.MeshBasicMaterial;
      expect(mat.opacity).toBeGreaterThan(0.001);
      expect(shield.getMesh().visible).toBe(true);
    });

    it('setShieldMode(INVINCIBLE, 1) sets a non-zero initial opacity so first frame is visible', () => {
      const shield = new AirShield();
      shield.setShieldMode('INVINCIBLE', 1);
      const mat = shield.getMesh().material as THREE.MeshBasicMaterial;
      expect(mat.opacity).toBeGreaterThan(0.001);
      expect(shield.getMesh().visible).toBe(true);
    });
  });
});
