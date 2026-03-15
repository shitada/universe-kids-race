import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';

// Import after THREE is available
const { ParticleBurst, ParticleBurstManager } = await import('../../../src/game/effects/ParticleBurst');

describe('ParticleBurst', () => {
  let scene: THREE.Scene;

  beforeEach(() => {
    scene = new THREE.Scene();
  });

  it('adds Points to scene on init', () => {
    const burst = new ParticleBurst();
    burst.init(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 20,
      isRainbow: false,
    });
    // Scene should have at least one child (the Points object)
    expect(scene.children.length).toBeGreaterThan(0);
  });

  it('update moves particles and decreases lifetime', () => {
    const burst = new ParticleBurst();
    burst.init(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 20,
      isRainbow: false,
    });
    expect(burst.isExpired()).toBe(false);
    // Simulate time passing
    burst.update(0.6);
    expect(burst.isExpired()).toBe(true);
  });

  it('isExpired returns true after lifetime', () => {
    const burst = new ParticleBurst();
    burst.init(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 20,
      isRainbow: false,
    });
    burst.update(0.1);
    expect(burst.isExpired()).toBe(false);
    burst.update(0.5);
    expect(burst.isExpired()).toBe(true);
  });

  it('dispose removes from scene', () => {
    const burst = new ParticleBurst();
    burst.init(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 20,
      isRainbow: false,
    });
    expect(scene.children.length).toBeGreaterThan(0);
    burst.dispose(scene);
    expect(scene.children.length).toBe(0);
  });
});

describe('ParticleBurstManager', () => {
  let scene: THREE.Scene;

  beforeEach(() => {
    scene = new THREE.Scene();
  });

  it('respects pool limit of max 10', () => {
    const manager = new ParticleBurstManager();
    for (let i = 0; i < 12; i++) {
      manager.emit(scene, {
        position: new THREE.Vector3(i, 0, 0),
        color: 0xffdd00,
        particleCount: 20,
        isRainbow: false,
      });
    }
    // Should not crash even with more than 10
    // Scene children count should be ≤ 10 (oldest recycled)
    expect(scene.children.length).toBeLessThanOrEqual(10);
  });

  it('recycles oldest burst on overflow', () => {
    const manager = new ParticleBurstManager();
    for (let i = 0; i < 11; i++) {
      manager.emit(scene, {
        position: new THREE.Vector3(i, 0, 0),
        color: 0xffdd00,
        particleCount: 20,
        isRainbow: false,
      });
    }
    // Still functions correctly
    manager.update(0.016);
    manager.cleanup(scene);
  });

  it('clear removes all bursts', () => {
    const manager = new ParticleBurstManager();
    for (let i = 0; i < 5; i++) {
      manager.emit(scene, {
        position: new THREE.Vector3(0, 0, 0),
        color: 0xffdd00,
        particleCount: 20,
        isRainbow: false,
      });
    }
    manager.clear(scene);
    expect(scene.children.length).toBe(0);
  });
});
