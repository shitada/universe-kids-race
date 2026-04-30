import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';

// Import after THREE is available
const { ParticleBurst, ParticleBurstManager } = await import('../../../src/game/effects/ParticleBurst');

describe('ParticleBurst', () => {
  let scene: THREE.Scene;

  beforeEach(() => {
    scene = new THREE.Scene();
  });

  it('adds Points to scene on reset', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    // Scene should have at least one child (the Points object)
    expect(scene.children.length).toBeGreaterThan(0);
  });

  it('update moves particles and decreases lifetime', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    expect(burst.isExpired()).toBe(false);
    // Simulate time passing
    burst.update(0.6);
    expect(burst.isExpired()).toBe(true);
  });

  it('isExpired returns true after lifetime', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    burst.update(0.1);
    expect(burst.isExpired()).toBe(false);
    burst.update(0.5);
    expect(burst.isExpired()).toBe(true);
  });

  it('dispose removes from scene', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
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
      manager.emit(scene, i, 0, 0, 0xffdd00, 20, false);
    }
    // Should not crash even with more than 10
    // Scene children count should be ≤ 10 (oldest recycled)
    expect(scene.children.length).toBeLessThanOrEqual(10);
  });

  it('recycles oldest burst on overflow', () => {
    const manager = new ParticleBurstManager();
    for (let i = 0; i < 11; i++) {
      manager.emit(scene, i, 0, 0, 0xffdd00, 20, false);
    }
    // Still functions correctly
    manager.update(scene, 0.016);
    manager.cleanup(scene);
  });

  it('clear removes all bursts', () => {
    const manager = new ParticleBurstManager();
    for (let i = 0; i < 5; i++) {
      manager.emit(scene, 0, 0, 0, 0xffdd00, 20, false);
    }
    manager.clear(scene);
    expect(scene.children.length).toBe(0);
  });

  it('pre-allocates a fixed pool of THREE.Points instances and never exceeds it', () => {
    const manager = new ParticleBurstManager();
    expect(manager.getPoolSize()).toBe(10);

    // Many consecutive emits must not allocate beyond the pool size.
    for (let i = 0; i < 100; i++) {
      manager.emit(scene, i, 0, 0, 0xffdd00, 50, i % 2 === 0);
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
        manager.emit(scene, 0, 0, 0, 0xffdd00, 20, false);
      }
      manager.update(scene, 1.0); // longer than maxLifetime → all expired
      manager.cleanup(scene);
      expect(manager.getActiveCount()).toBe(0);
      expect(scene.children.length).toBe(0);
    }
  });

  it('cleanup deactivates expired bursts without disposing pool resources', () => {
    const manager = new ParticleBurstManager();
    manager.emit(scene, 0, 0, 0, 0xffdd00, 10, false);
    manager.update(scene, 1.0);
    manager.cleanup(scene);
    expect(scene.children.length).toBe(0);

    // Pool slot should be reusable: a follow-up emit succeeds and re-attaches a Points child.
    manager.emit(scene, 1, 1, 1, 0x00ff00, 10, false);
    expect(manager.getActiveCount()).toBe(1);
    expect(scene.children.length).toBe(1);
  });

  it('dispose releases all pool resources', () => {
    const manager = new ParticleBurstManager();
    manager.emit(scene, 0, 0, 0, 0xffdd00, 10, false);
    manager.dispose(scene);
    expect(scene.children.length).toBe(0);
  });

  it('update detaches expired bursts in a single pass without needing cleanup', () => {
    const manager = new ParticleBurstManager();
    manager.emit(scene, 0, 0, 0, 0xffdd00, 10, false);
    expect(scene.children.length).toBe(1);

    // One update past the lifetime should both expire AND detach the burst.
    manager.update(scene, 1.0);
    expect(manager.getActiveCount()).toBe(0);
    expect(scene.children.length).toBe(0);

    // A redundant cleanup call must remain a safe no-op.
    manager.cleanup(scene);
    expect(scene.children.length).toBe(0);
  });

  it('update on the expire frame skips per-particle GPU uploads', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    const points = scene.children[0] as THREE.Points;
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const sizeAttr = points.geometry.getAttribute('size') as THREE.BufferAttribute;

    // Snapshot the upload version after the initial reset (which marks dirty).
    const positionVersionBefore = positionAttr.version;
    const sizeVersionBefore = sizeAttr.version;

    // Step past the lifetime in a single frame; expired path must not bump
    // the version (otherwise WebGL would re-upload a buffer that is about
    // to be hidden via setDrawRange(0, 0)).
    const expired = burst.update(1.0);
    expect(expired).toBe(true);
    expect(positionAttr.version).toBe(positionVersionBefore);
    expect(sizeAttr.version).toBe(sizeVersionBefore);
    expect(burst.isActive()).toBe(false);
    expect(points.visible).toBe(false);
    expect(points.geometry.drawRange.count).toBe(0);
  });

  it('manager.update detaches expired bursts immediately so cleanup becomes redundant', () => {
    const manager = new ParticleBurstManager();
    manager.emit(scene, 0, 0, 0, 0xffdd00, 10, false);
    const points = scene.children[0] as THREE.Points;
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const versionBefore = positionAttr.version;

    manager.update(scene, 1.0);

    expect(scene.children.length).toBe(0);
    expect(manager.getActiveCount()).toBe(0);
    expect(points.visible).toBe(false);
    expect(points.geometry.drawRange.count).toBe(0);
    // No GPU upload requested for the expired buffer.
    expect(positionAttr.version).toBe(versionBefore);
  });
});

describe('ParticleBurst rendering invariants (legacy block)', () => {
  let scene: THREE.Scene;

  beforeEach(() => {
    scene = new THREE.Scene();
  });

  it('emit beyond pool capacity recycles the most-progressed slot', () => {
    const manager = new ParticleBurstManager();
    // Saturate the pool.
    for (let i = 0; i < 10; i++) {
      manager.emit(scene, i, 0, 0, 0xffdd00, 10, false);
    }
    expect(manager.getActiveCount()).toBe(10);

    // Advance the oldest a bit so it's most progressed.
    manager.update(scene, 0.1);

    // One more emit; pool should still have 10 active slots, no extra Points added.
    manager.emit(scene, 99, 0, 0, 0x00ff00, 10, false);
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
    burst.reset(scene, 0, 0, 0, 0xffffff, 200, false);
    const points = scene.children[0] as THREE.Points;
    const drawRange = points.geometry.drawRange;
    expect(drawRange.count).toBeLessThanOrEqual(50);
    // Position attribute is sized for max particles
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    expect(positionAttr.count).toBe(50);
  });

  it('uses 0.8s lifetime for rainbow and 0.5s for normal bursts', () => {
    const normal = new ParticleBurst();
    normal.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    normal.update(0.49);
    expect(normal.isExpired()).toBe(false);
    normal.update(0.02);
    expect(normal.isExpired()).toBe(true);

    const rainbow = new ParticleBurst();
    rainbow.reset(scene, 0, 0, 0, 0xffdd00, 50, true);
    rainbow.update(0.79);
    expect(rainbow.isExpired()).toBe(false);
    rainbow.update(0.02);
    expect(rainbow.isExpired()).toBe(true);
  });

  it('deactivate hides points and zeroes draw range without disposing', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    burst.deactivate(scene);
    expect(scene.children.length).toBe(0);
    expect(burst.isActive()).toBe(false);

    // Re-using the same instance is allowed (no dispose happened).
    burst.reset(scene, 1, 1, 1, 0x00ff00, 10, false);
    expect(burst.isActive()).toBe(true);
    expect(scene.children.length).toBe(1);
  });

  it('reset narrows attribute update ranges to the live particle slice (NORMAL=20)', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    const points = scene.children[0] as THREE.Points;
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = points.geometry.getAttribute('color') as THREE.BufferAttribute;
    const sizeAttr = points.geometry.getAttribute('size') as THREE.BufferAttribute;

    expect(positionAttr.updateRanges).toEqual([{ start: 0, count: 20 * 3 }]);
    expect(colorAttr.updateRanges).toEqual([{ start: 0, count: 20 * 3 }]);
    expect(sizeAttr.updateRanges).toEqual([{ start: 0, count: 20 }]);
  });

  it('reset narrows attribute update ranges to the live particle slice (RAINBOW=50)', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 50, true);
    const points = scene.children[0] as THREE.Points;
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = points.geometry.getAttribute('color') as THREE.BufferAttribute;
    const sizeAttr = points.geometry.getAttribute('size') as THREE.BufferAttribute;

    expect(positionAttr.updateRanges).toEqual([{ start: 0, count: 50 * 3 }]);
    expect(colorAttr.updateRanges).toEqual([{ start: 0, count: 50 * 3 }]);
    expect(sizeAttr.updateRanges).toEqual([{ start: 0, count: 50 }]);
  });

  it('update narrows per-frame GPU upload to position*3 / size of count', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    const points = scene.children[0] as THREE.Points;
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const sizeAttr = points.geometry.getAttribute('size') as THREE.BufferAttribute;

    // Step several non-expire frames; updateRanges must remain a single
    // [0, count*stride] entry — never grow unbounded.
    for (let i = 0; i < 5; i++) {
      const expired = burst.update(0.05);
      expect(expired).toBe(false);
      expect(positionAttr.updateRanges).toEqual([{ start: 0, count: 20 * 3 }]);
      expect(sizeAttr.updateRanges).toEqual([{ start: 0, count: 20 }]);
    }
  });

  it('update on the expire frame leaves updateRanges untouched (no extra push)', () => {
    const burst = new ParticleBurst();
    burst.reset(scene, 0, 0, 0, 0xffdd00, 20, false);
    const points = scene.children[0] as THREE.Points;
    const positionAttr = points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const sizeAttr = points.geometry.getAttribute('size') as THREE.BufferAttribute;

    const positionRangesBefore = positionAttr.updateRanges.slice();
    const sizeRangesBefore = sizeAttr.updateRanges.slice();

    const expired = burst.update(1.0);
    expect(expired).toBe(true);
    expect(positionAttr.updateRanges).toEqual(positionRangesBefore);
    expect(sizeAttr.updateRanges).toEqual(sizeRangesBefore);
  });
});

describe('ParticleBurstManager allocation invariants', () => {
  it('ParticleBurst.ts contains no per-emit THREE.Vector3 / THREE.Color allocations', async () => {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const url = await import('node:url');

    const here = path.dirname(url.fileURLToPath(import.meta.url));
    const sourcePath = path.resolve(here, '../../../src/game/effects/ParticleBurst.ts');
    const source = await fs.readFile(sourcePath, 'utf8');

    // The emit/reset hot path must not allocate. Field initializers (one-shot
    // per pool slot at construction time) are allowed and live on `this.`.
    const lines = source.split('\n');
    const isCodeLine = (line: string): boolean => {
      const trimmed = line.trim();
      return !trimmed.startsWith('*') && !trimmed.startsWith('//') && !trimmed.startsWith('/*');
    };
    const offendingVector3 = lines.filter(
      (line) => /new THREE\.Vector3\b/.test(line) && isCodeLine(line) && !/private readonly/.test(line),
    );
    const offendingColor = lines.filter(
      (line) => /new THREE\.Color\b/.test(line) && isCodeLine(line) && !/private readonly/.test(line),
    );

    expect(offendingVector3).toEqual([]);
    expect(offendingColor).toEqual([]);
  });
});
