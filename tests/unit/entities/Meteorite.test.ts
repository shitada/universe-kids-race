import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { Meteorite } from '../../../src/game/entities/Meteorite';

describe('Meteorite', () => {
  it('creates with position and active state', () => {
    const met = new Meteorite(2, 1, -30);
    expect(met.position.x).toBe(2);
    expect(met.position.y).toBe(1);
    expect(met.position.z).toBe(-30);
    expect(met.isActive).toBe(true);
  });

  it('has a radius for collision', () => {
    const met = new Meteorite(0, 0, 0);
    expect(met.radius).toBeGreaterThan(0);
  });

  it('can be deactivated', () => {
    const met = new Meteorite(0, 0, 0);
    met.isActive = false;
    expect(met.isActive).toBe(false);
  });

  it('disposes geometry and material on dispose()', () => {
    const met = new Meteorite(0, 0, 0);
    const geoSpy = vi.spyOn(met.mesh.geometry, 'dispose');
    const matSpy = vi.spyOn(met.mesh.material as THREE.Material, 'dispose');

    met.dispose();

    expect(geoSpy).toHaveBeenCalledTimes(1);
    expect(matSpy).toHaveBeenCalledTimes(1);
  });
});
