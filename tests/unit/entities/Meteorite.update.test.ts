import { describe, it, expect } from 'vitest';
import { Meteorite } from '../../../src/game/entities/Meteorite';

describe('Meteorite.update view-bracket optimization', () => {
  it('rotates as before when cameraZ is omitted (backward compat)', () => {
    const met = new Meteorite(0, 0, -200);
    const xBefore = met.mesh.rotation.x;
    const zBefore = met.mesh.rotation.z;
    met.update(0.5);
    expect(met.mesh.rotation.x).toBeCloseTo(xBefore + 0.5 * 0.5, 5);
    expect(met.mesh.rotation.z).toBeCloseTo(zBefore + 0.5 * 0.3, 5);
  });

  it('skips rotation when meteorite is far ahead of camera (z << cameraZ - 60)', () => {
    const cameraZ = 0;
    const met = new Meteorite(0, 0, -100); // 100 ahead, well outside 60
    const xBefore = met.mesh.rotation.x;
    const zBefore = met.mesh.rotation.z;
    met.update(0.5, cameraZ);
    expect(met.mesh.rotation.x).toBe(xBefore);
    expect(met.mesh.rotation.z).toBe(zBefore);
  });

  it('skips rotation when meteorite is behind camera beyond threshold', () => {
    const cameraZ = 0;
    const met = new Meteorite(0, 0, 10); // 10 behind, outside 5
    const xBefore = met.mesh.rotation.x;
    const zBefore = met.mesh.rotation.z;
    met.update(0.5, cameraZ);
    expect(met.mesh.rotation.x).toBe(xBefore);
    expect(met.mesh.rotation.z).toBe(zBefore);
  });

  it('updates rotation when meteorite is inside the view bracket', () => {
    const cameraZ = 0;
    const met = new Meteorite(0, 0, -30); // within ahead=60
    const xBefore = met.mesh.rotation.x;
    const zBefore = met.mesh.rotation.z;
    met.update(0.5, cameraZ);
    expect(met.mesh.rotation.x).toBeCloseTo(xBefore + 0.5 * 0.5, 5);
    expect(met.mesh.rotation.z).toBeCloseTo(zBefore + 0.5 * 0.3, 5);
  });

  it('boundary: exactly at cameraZ - 60 still updates (inclusive)', () => {
    const cameraZ = 0;
    const met = new Meteorite(0, 0, -60);
    const xBefore = met.mesh.rotation.x;
    met.update(0.25, cameraZ);
    expect(met.mesh.rotation.x).toBeCloseTo(xBefore + 0.25 * 0.5, 5);
  });

  it('boundary: exactly at cameraZ + 5 still updates (inclusive)', () => {
    const cameraZ = 0;
    const met = new Meteorite(0, 0, 5);
    const xBefore = met.mesh.rotation.x;
    met.update(0.25, cameraZ);
    expect(met.mesh.rotation.x).toBeCloseTo(xBefore + 0.25 * 0.5, 5);
  });

  it('resumes animation when camera advances and meteorite enters view', () => {
    const met = new Meteorite(0, 0, -100);
    const xInitial = met.mesh.rotation.x;

    // Far ahead: no update
    met.update(0.5, 0);
    expect(met.mesh.rotation.x).toBe(xInitial);

    // Camera advances so meteorite is now in view
    met.update(0.5, -50);
    expect(met.mesh.rotation.x).toBeCloseTo(xInitial + 0.5 * 0.5, 5);
  });
});
