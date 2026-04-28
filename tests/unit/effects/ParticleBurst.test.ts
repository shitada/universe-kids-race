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

  it('pre-allocates a fixed pool of THREE.Points instances and never exceeds it', () => {
    const manager = new ParticleBurstManager();
    expect(manager.getPoolSize()).toBe(10);

    // Many consecutive emits must not allocate beyond the pool size.
    for (let i = 0; i < 100; i++) {
      manager.emit(scene, {
        position: new THREE.Vector3(i, 0, 0),
        color: 0xffdd00,
        particleCount: 50,
        isRainbow: i % 2 === 0,
      });
    }

    const pointsCount = scene.children.filter((c) => (c as THREE.Object3D).type === 'Points').length;
    expect(pointsCount).toBeLessThanOrEqual(10);
    expect(manager.getActiveCount()).toBeLessThanOrEqual(10);
  });

  it('reuses pool slots after expiry without leaking Points objects', () => {
    const manager = new ParticleBurstManager();

    // Fill the pool, expire everything, then re-emit. Children count must stay ≤ pool size.
    for (let cycle = 0; cycle < 5; cycle++) {
      for (let i = 0; i < 10; i++) {
        manager.emit(scene, {
          position: new THREE.Vector3(0, 0, 0),
          color: 0xffdd00,
          particleCount: 20,
          isRainbow: false,
        });
      }
      manager.update(1.0); // longer than maxLifetime → all expired
      manager.cleanup(scene);
      expect(manager.getActiveCount()).toBe(0);
      expect(scene.children.length).toBe(0);
    }
  });

  it('cleanup deactivates expired bursts without disposing pool resources', () => {
    const manager = new ParticleBurstManager();
    manager.emit(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 10,
      isRainbow: false,
    });
    manager.update(1.0);
    manager.cleanup(scene);
    expect(scene.children.length).toBe(0);

    // Pool slot should be reusable: a follow-up emit succeeds and re-attaches a Points child.
    manager.emit(scene, {
      position: new THREE.Vector3(1, 1, 1),
      color: 0x00ff00,
      particleCount: 10,
      isRainbow: false,
    });
    expect(manager.getActiveCount()).toBe(1);
    expect(scene.children.length).toBe(1);
  });

  it('dispose releases all pool resources', () => {
    const manager = new ParticleBurstManager();
    manager.emit(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 10,
      isRainbow: false,
    });
    manager.dispose(scene);
    expect(scene.children.length).toBe(0);
  });

  it('emit beyond pool capacity recycles the most-progressed slot', () => {
    const manager = new ParticleBurstManager();
    // Saturate the pool.
    for (let i = 0; i < 10; i++) {
      manager.emit(scene, {
        position: new THREE.Vector3(i, 0, 0),
        color: 0xffdd00,
        particleCount: 10,
        isRainbow: false,
      });
    }
    expect(manager.getActiveCount()).toBe(10);

    // Advance the oldest a bit so it's most progressed.
    manager.update(0.1);

    // One more emit; pool should still have 10 active slots, no extra Points added.
    manager.emit(scene, {
      position: new THREE.Vector3(99, 0, 0),
      color: 0x00ff00,
      particleCount: 10,
      isRainbow: false,
    });
    expect(manager.getActiveCount()).toBe(10);
    const pointsCount = scene.children.filter((c) => (c as THREE.Object3D).type === 'Points').length;
    expect(pointsCount).toBe(10);
  });
});

describe('ParticleBurst rendering invariants', () => {
  let scene: THREE.Scene;

  beforeEach(() => {
    scene = new THREE.Scene();
  });

  it('caps particleCount at 50 via draw range', () => {
    const burst = new ParticleBurst();
    burst.init(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffffff,
      particleCount: 200, // larger than max
      isRainbow: false,
    });
    const points = scene.children[0] as THREE.Points;
    const drawRange = points.geometry.drawRange;
    expect(drawRange.count).toBeLessThanOrEqual(50);
    // Position attribute is sized for max particles
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    expect(positionAttr.count).toBe(50);
  });

  it('uses 0.8s lifetime for rainbow and 0.5s for normal bursts', () => {
    const normal = new ParticleBurst();
    normal.init(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 20,
      isRainbow: false,
    });
    normal.update(0.49);
    expect(normal.isExpired()).toBe(false);
    normal.update(0.02);
    expect(normal.isExpired()).toBe(true);

    const rainbow = new ParticleBurst();
    rainbow.init(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 50,
      isRainbow: true,
    });
    rainbow.update(0.79);
    expect(rainbow.isExpired()).toBe(false);
    rainbow.update(0.02);
    expect(rainbow.isExpired()).toBe(true);
  });

  it('deactivate hides points and zeroes draw range without disposing', () => {
    const burst = new ParticleBurst();
    burst.init(scene, {
      position: new THREE.Vector3(0, 0, 0),
      color: 0xffdd00,
      particleCount: 20,
      isRainbow: false,
    });
    burst.deactivate(scene);
    expect(scene.children.length).toBe(0);
    expect(burst.isActive()).toBe(false);

    // Re-using the same instance is allowed (no dispose happened).
    burst.reset(scene, {
      position: new THREE.Vector3(1, 1, 1),
      color: 0x00ff00,
      particleCount: 10,
      isRainbow: false,
    });
    expect(burst.isActive()).toBe(true);
    expect(scene.children.length).toBe(1);
  });
});
