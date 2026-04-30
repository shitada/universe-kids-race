import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { SpawnSystem } from '../../../src/game/systems/SpawnSystem';
import type { StageConfig } from '../../../src/types';

const RAINBOW_INITIAL_COLOR = 0xff0000;

const testConfig: StageConfig = {
  stageNumber: 1,
  destination: '月',
  stageLength: 500,
  meteoriteInterval: 0.5,
  starDensity: 5,
};

// Drives the spawner across many frames so that pools allocate enough
// entities to make the recycleAll() reuse-vs-realloc difference observable.
function spawnAcrossFrames(system: SpawnSystem, frames: number): void {
  let z = 0;
  for (let i = 0; i < frames; i++) {
    z -= 50;
    system.update(0.2, z, testConfig);
  }
}

describe('SpawnSystem.recycleAll', () => {
  it('returns all active pooled entities to the available pool without disposing them', () => {
    const system = new SpawnSystem();
    spawnAcrossFrames(system, 20);

    const normalSize = system.getNormalStarPoolSize();
    const rainbowSize = system.getRainbowStarPoolSize();
    const meteoriteSize = system.getMeteoritePoolSize();
    // Sanity: at least one entity allocated so the assertion is meaningful.
    expect(normalSize + rainbowSize).toBeGreaterThan(0);
    expect(meteoriteSize).toBeGreaterThan(0);

    system.recycleAll();

    // Pool sizes (total ever-allocated) are preserved — Mesh / Material were
    // not reallocated, just returned to the pool.
    expect(system.getNormalStarPoolSize()).toBe(normalSize);
    expect(system.getRainbowStarPoolSize()).toBe(rainbowSize);
    expect(system.getMeteoritePoolSize()).toBe(meteoriteSize);
  });

  it('detaches recycled meshes from their parent scene', () => {
    const system = new SpawnSystem();
    const scene = new THREE.Scene();
    // Run a single update frame and attach freshly spawned meshes to a scene
    // (mirrors what StageScene.update does post-spawn).
    const result = system.update(1.0, -10, testConfig);
    for (const star of result.newStars) {
      scene.add(star.mesh);
      expect(star.mesh.parent).toBe(scene);
    }
    for (const met of result.newMeteorites) {
      scene.add(met.mesh);
      expect(met.mesh.parent).toBe(scene);
    }

    system.recycleAll();

    // recycle() must detach meshes from the scene graph so the next
    // threeScene.clear() / next-stage enter() does not leak references.
    for (const star of result.newStars) {
      expect(star.mesh.parent).toBeNull();
    }
    for (const met of result.newMeteorites) {
      expect(met.mesh.parent).toBeNull();
    }
  });

  it('reuses pooled entities on the next spawn cycle (no Mesh reallocation)', () => {
    // Simulate the StageScene lifecycle where spawned entities are eventually
    // released back to the pool (cleanupPassedObjects). Without simulating
    // release, the test would conflate "pool size grows because nothing is
    // released" with "pool size grows because recycleAll() didn't work".
    const system = new SpawnSystem();
    let z = 0;
    // Stage 1: spawn for 20 frames, release every spawn immediately so the
    // available pool always has supply for the next acquire.
    for (let i = 0; i < 20; i++) {
      z -= 50;
      const r = system.update(0.2, z, testConfig);
      for (const s of r.newStars) system.releaseStar(s);
      for (const m of r.newMeteorites) system.releaseMeteorite(m);
    }

    const normalSizeBefore = system.getNormalStarPoolSize();
    const rainbowSizeBefore = system.getRainbowStarPoolSize();
    const meteoriteSizeBefore = system.getMeteoritePoolSize();
    expect(normalSizeBefore).toBeGreaterThan(0);

    // recycleAll() in steady state is a no-op (nothing is currently active),
    // but the key invariant is that subsequent acquires never grow the pool
    // because the previously-allocated instances remain available.
    system.recycleAll();
    system.reset();

    z = 0;
    for (let i = 0; i < 20; i++) {
      z -= 50;
      const r = system.update(0.2, z, testConfig);
      for (const s of r.newStars) system.releaseStar(s);
      for (const m of r.newMeteorites) system.releaseMeteorite(m);
    }

    expect(system.getNormalStarPoolSize()).toBe(normalSizeBefore);
    expect(system.getRainbowStarPoolSize()).toBe(rainbowSizeBefore);
    expect(system.getMeteoritePoolSize()).toBe(meteoriteSizeBefore);
  });

  it('recycleAll on an active stage caps next-stage pool growth far below dispose+realloc baseline', () => {
    // End-to-end check: drive a "stage" with active (un-released) entities,
    // then start a second stage. With recycleAll() the second stage reuses
    // the still-allocated Mesh / Material instances; with dispose() it would
    // be forced to reallocate every entity from scratch. We assert the next
    // stage's max pool size is bounded by the previous stage's peak.
    const system = new SpawnSystem();
    let z = 0;
    for (let i = 0; i < 20; i++) {
      z -= 50;
      system.update(0.2, z, testConfig);
    }
    const normalPeak = system.getNormalStarPoolSize();
    const rainbowPeak = system.getRainbowStarPoolSize();
    const meteoritePeak = system.getMeteoritePoolSize();

    system.recycleAll();
    system.reset();

    z = 0;
    for (let i = 0; i < 20; i++) {
      z -= 50;
      system.update(0.2, z, testConfig);
    }

    // The recycled pool absorbs the second stage's peak concurrency. Some
    // small drift is allowed because the random NORMAL/RAINBOW selection can
    // shift the per-pool peak slightly between stages, but the total must not
    // approach the doubling that an unconditional dispose() would cause.
    expect(system.getNormalStarPoolSize()).toBeLessThanOrEqual(normalPeak + 5);
    expect(system.getRainbowStarPoolSize()).toBeLessThanOrEqual(rainbowPeak + 5);
    expect(system.getMeteoritePoolSize()).toBeLessThanOrEqual(meteoritePeak + 2);
    // And the total must be far less than the 2x growth that
    // dispose+reallocate would produce.
    expect(system.getNormalStarPoolSize() + system.getRainbowStarPoolSize()).toBeLessThan(
      (normalPeak + rainbowPeak) * 2,
    );
  });

  it('restores RAINBOW star initial color when re-acquired after recycleAll', () => {
    const system = new SpawnSystem();
    // Force enough star spawns to (statistically) produce at least one rainbow.
    // We loop until at least one rainbow appears, then mutate its hue to
    // simulate the per-frame color animation, recycle, re-acquire, and assert
    // the color was reset.
    let rainbow: ReturnType<typeof system.update>['newStars'][number] | undefined;
    for (let i = 0; i < 200 && !rainbow; i++) {
      const r = system.update(0.016, -50 - i * 50, testConfig);
      rainbow = r.newStars.find((s) => s.starType === 'RAINBOW');
    }
    expect(rainbow, 'expected at least one RAINBOW star in 200 frames').toBeDefined();
    const rainbowMat = rainbow!.mesh.material as THREE.MeshToonMaterial;

    // Mutate to non-initial hue to verify reset semantics on re-acquire.
    rainbowMat.color.setHex(0x00ff00);
    rainbowMat.emissive.setHex(0x00ff00);

    system.recycleAll();
    system.reset();

    // Drain rainbow pool by acquiring enough rainbow stars to retrieve the
    // recycled instance. Since acquire() pops from `available`, the recycled
    // RAINBOW star will be returned by the next RAINBOW acquisition.
    const sizeBefore = system.getRainbowStarPoolSize();
    let reused = false;
    for (let i = 0; i < 500 && !reused; i++) {
      const r = system.update(0.016, -50 - i * 50, testConfig);
      for (const s of r.newStars) {
        if (s === rainbow) {
          reused = true;
          break;
        }
      }
      // Bail out if pool started growing — would mean we never re-hit it.
      if (system.getRainbowStarPoolSize() > sizeBefore + 2) break;
    }

    expect(reused, 'recycled RAINBOW star should be reused, not reallocated').toBe(true);
    expect(rainbowMat.color.getHex()).toBe(RAINBOW_INITIAL_COLOR);
    expect(rainbowMat.emissive.getHex()).toBe(RAINBOW_INITIAL_COLOR);
  });
});
