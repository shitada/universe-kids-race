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

  it('setPosition updates mesh position', () => {
    const shield = new AirShield();
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
});
