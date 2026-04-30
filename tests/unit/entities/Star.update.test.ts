import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Star } from '../../../src/game/entities/Star';

describe('Star.update view-bracket optimization', () => {
  it('rotates as before when cameraZ is omitted (backward compat)', () => {
    const star = new Star(0, 0, -200, 'NORMAL');
    const before = star.mesh.rotation.y;
    star.update(0.5);
    expect(star.mesh.rotation.y).toBeCloseTo(before + 0.5 * 2, 5);
  });

  it('skips Y rotation when star is far ahead of camera (z << cameraZ - 60)', () => {
    // Forward axis is -Z; ahead means z < cameraZ.
    const cameraZ = 0;
    const star = new Star(0, 0, -100, 'NORMAL'); // 100 ahead, well outside 60
    const before = star.mesh.rotation.y;
    star.update(0.5, cameraZ);
    expect(star.mesh.rotation.y).toBe(before);
  });

  it('skips Y rotation when star is behind the camera beyond threshold', () => {
    const cameraZ = 0;
    const star = new Star(0, 0, 10, 'NORMAL'); // 10 behind, outside 5
    const before = star.mesh.rotation.y;
    star.update(0.5, cameraZ);
    expect(star.mesh.rotation.y).toBe(before);
  });

  it('skips RAINBOW hue update when out of view bracket', () => {
    const cameraZ = 0;
    const star = new Star(0, 0, -100, 'RAINBOW');
    const mat = star.mesh.material as THREE.MeshToonMaterial;
    const colorBefore = mat.color.getHex();
    const emissiveBefore = mat.emissive.getHex();
    star.update(1.0, cameraZ);
    expect(mat.color.getHex()).toBe(colorBefore);
    expect(mat.emissive.getHex()).toBe(emissiveBefore);
  });

  it('updates rotation and hue when star is inside the view bracket', () => {
    const cameraZ = 0;
    const star = new Star(0, 0, -30, 'RAINBOW'); // within ahead=60
    const mat = star.mesh.material as THREE.MeshToonMaterial;
    const colorBefore = mat.color.getHex();
    const rotBefore = star.mesh.rotation.y;
    star.update(0.5, cameraZ);
    expect(star.mesh.rotation.y).toBeCloseTo(rotBefore + 0.5 * 2, 5);
    expect(mat.color.getHex()).not.toBe(colorBefore);
  });

  it('boundary: exactly at cameraZ - 60 still updates (inclusive)', () => {
    const cameraZ = 0;
    const star = new Star(0, 0, -60, 'NORMAL');
    const before = star.mesh.rotation.y;
    star.update(0.25, cameraZ);
    expect(star.mesh.rotation.y).toBeCloseTo(before + 0.25 * 2, 5);
  });

  it('boundary: exactly at cameraZ + 5 still updates (inclusive)', () => {
    const cameraZ = 0;
    const star = new Star(0, 0, 5, 'NORMAL');
    const before = star.mesh.rotation.y;
    star.update(0.25, cameraZ);
    expect(star.mesh.rotation.y).toBeCloseTo(before + 0.25 * 2, 5);
  });

  it('resumes animation when camera advances and star enters view', () => {
    const star = new Star(0, 0, -100, 'RAINBOW');
    const mat = star.mesh.material as THREE.MeshToonMaterial;
    const initialColor = mat.color.getHex();

    // Far ahead: no update
    star.update(0.5, 0);
    expect(mat.color.getHex()).toBe(initialColor);
    const rotAfterSkip = star.mesh.rotation.y;

    // Camera advances so star is now in view
    star.update(0.5, -50);
    expect(star.mesh.rotation.y).toBeGreaterThan(rotAfterSkip);
    expect(mat.color.getHex()).not.toBe(initialColor);
  });
});
