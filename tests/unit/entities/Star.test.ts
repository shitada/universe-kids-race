import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { Star } from '../../../src/game/entities/Star';

describe('Star', () => {
  it('creates a NORMAL star with score 100', () => {
    const star = new Star(0, 0, -10, 'NORMAL');
    expect(star.starType).toBe('NORMAL');
    expect(star.scoreValue).toBe(100);
    expect(star.isCollected).toBe(false);
  });

  it('creates a RAINBOW star with score 500', () => {
    const star = new Star(0, 0, -10, 'RAINBOW');
    expect(star.starType).toBe('RAINBOW');
    expect(star.scoreValue).toBe(500);
  });

  it('marks as collected when collect is called', () => {
    const star = new Star(0, 0, -10);
    star.collect();
    expect(star.isCollected).toBe(true);
  });

  it('sets position correctly', () => {
    const star = new Star(3, 1, -20);
    expect(star.position.x).toBe(3);
    expect(star.position.y).toBe(1);
    expect(star.position.z).toBe(-20);
  });

  it('has a radius for collision', () => {
    const star = new Star(0, 0, -10);
    expect(star.radius).toBeGreaterThan(0);
  });

  it('disposes geometry and material on dispose()', () => {
    const star = new Star(0, 0, -10);
    const geoSpy = vi.spyOn(star.mesh.geometry, 'dispose');
    const matSpy = vi.spyOn(star.mesh.material as THREE.Material, 'dispose');

    star.dispose();

    expect(geoSpy).toHaveBeenCalledTimes(1);
    expect(matSpy).toHaveBeenCalledTimes(1);
  });
});
