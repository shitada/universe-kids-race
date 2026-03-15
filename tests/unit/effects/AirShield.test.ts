import { describe, it, expect } from 'vitest';
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

  it('initializes with isBoosting false and elapsedTime 0', () => {
    const shield = new AirShield();
    // After construction, opacity should be at initial value
    const mat = shield.getMesh().material as THREE.MeshBasicMaterial;
    expect(mat.opacity).toBeCloseTo(0.15, 2);
    shield.dispose();
  });

  it('update animates opacity in normal mode (0.10–0.20)', () => {
    const shield = new AirShield();
    const mat = shield.getMesh().material as THREE.MeshBasicMaterial;

    // Collect opacity values over several frames
    const opacities: number[] = [];
    for (let i = 0; i < 60; i++) {
      shield.update(1 / 60);
      opacities.push(mat.opacity);
    }

    const min = Math.min(...opacities);
    const max = Math.max(...opacities);
    expect(min).toBeGreaterThanOrEqual(0.09); // slight tolerance
    expect(max).toBeLessThanOrEqual(0.21);

    shield.dispose();
  });

  it('update animates scale in normal mode (1.00–1.05)', () => {
    const shield = new AirShield();
    const mesh = shield.getMesh();

    const scales: number[] = [];
    for (let i = 0; i < 60; i++) {
      shield.update(1 / 60);
      scales.push(mesh.scale.x);
    }

    const min = Math.min(...scales);
    const max = Math.max(...scales);
    expect(min).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.06);

    shield.dispose();
  });

  it('setBoostMode switches color to 0x88ddff', () => {
    const shield = new AirShield();
    const mat = shield.getMesh().material as THREE.MeshBasicMaterial;

    shield.setBoostMode(true);
    expect(mat.color.getHex()).toBe(0x88ddff);

    shield.setBoostMode(false);
    expect(mat.color.getHex()).toBe(0x44aaff);

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

  it('boost mode animates scale in range 1.25–1.35', () => {
    const shield = new AirShield();
    const mesh = shield.getMesh();

    shield.setBoostMode(true);
    const scales: number[] = [];
    for (let i = 0; i < 60; i++) {
      shield.update(1 / 60);
      scales.push(mesh.scale.x);
    }

    const min = Math.min(...scales);
    const max = Math.max(...scales);
    expect(min).toBeGreaterThanOrEqual(1.24);
    expect(max).toBeLessThanOrEqual(1.36);

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
});
