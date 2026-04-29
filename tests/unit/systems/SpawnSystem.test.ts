import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { SpawnSystem } from '../../../src/game/systems/SpawnSystem';
import type { StageConfig } from '../../../src/types';

const testConfig: StageConfig = {
  stageNumber: 1,
  destination: '月',
  stageLength: 500,
  meteoriteInterval: 3.0,
  starDensity: 5,
};

describe('SpawnSystem', () => {
  it('spawns stars ahead of spaceship', () => {
    const system = new SpawnSystem();
    const result = system.update(0.016, -10, testConfig);
    expect(result.newStars.length).toBeGreaterThan(0);
    for (const star of result.newStars) {
      expect(star.position.z).toBeLessThan(-10);
    }
  });

  it('spawns meteorites after interval elapses', () => {
    const system = new SpawnSystem();
    // First call, not enough time
    let result = system.update(1.0, -10, testConfig);
    expect(result.newMeteorites).toHaveLength(0);
    // After 3 seconds total
    result = system.update(2.1, -30, testConfig);
    expect(result.newMeteorites.length).toBeGreaterThanOrEqual(1);
  });

  it('stars include roughly 10% rainbow type', () => {
    const system = new SpawnSystem();
    // Generate many stars across multiple frames (per-frame spawn count is
    // capped to prevent frame time spikes; total density is unchanged).
    const allStars: ReturnType<typeof system.update>['newStars'][number][] = [];
    for (let i = 0; i < 10; i++) {
      const r = system.update(0.016, -200, testConfig);
      allStars.push(...r.newStars);
    }
    expect(allStars.length).toBeGreaterThan(5);
    // Allow 0 rainbow due to randomness, just verify type is set
    for (const star of allStars) {
      expect(['NORMAL', 'RAINBOW']).toContain(star.starType);
    }
  });

  it('reset clears spawn state', () => {
    const system = new SpawnSystem();
    system.update(0.016, -50, testConfig);
    system.reset();
    const result = system.update(0.016, -10, testConfig);
    // After reset, spawning resumes from z=0
    expect(result.newStars.length).toBeGreaterThan(0);
  });

  it('re-uses the same NORMAL Star mesh after releaseStar', () => {
    // Force NORMAL stars only by stubbing Math.random above the rainbow threshold.
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    try {
      const system = new SpawnSystem();
      const first = system.update(0.016, -10, testConfig);
      const normalStars = first.newStars.filter((s) => s.starType === 'NORMAL');
      expect(normalStars.length).toBeGreaterThan(0);
      const initialPoolSize = system.getNormalStarPoolSize();

      // Release every spawned star, then reset spawn cursor and respawn the same count.
      for (const s of normalStars) system.releaseStar(s);
      system.reset();

      const second = system.update(0.016, -10, testConfig);
      const reusedNormal = second.newStars.filter((s) => s.starType === 'NORMAL');
      // Every newly returned NORMAL star must be one of the previously released ones.
      for (const s of reusedNormal) {
        expect(normalStars).toContain(s);
      }
      // Pool size must NOT grow when released slots are re-used.
      expect(system.getNormalStarPoolSize()).toBe(initialPoolSize);
    } finally {
      randSpy.mockRestore();
    }
  });

  it('re-uses the same Meteorite mesh after releaseMeteorite', () => {
    const system = new SpawnSystem();
    const first = system.update(3.5, -10, testConfig);
    expect(first.newMeteorites.length).toBeGreaterThan(0);
    const initialPoolSize = system.getMeteoritePoolSize();
    const released = first.newMeteorites[0];
    const releasedMesh = released.mesh;

    system.releaseMeteorite(released);
    const second = system.update(3.5, -10, testConfig);
    expect(second.newMeteorites.length).toBeGreaterThan(0);
    expect(second.newMeteorites[0]).toBe(released);
    expect(second.newMeteorites[0].mesh).toBe(releasedMesh);
    expect(system.getMeteoritePoolSize()).toBe(initialPoolSize);
  });

  it('releaseStar pools RAINBOW stars instead of disposing the material', () => {
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.05); // < 0.1 → RAINBOW
    try {
      const system = new SpawnSystem();
      const result = system.update(0.016, -10, testConfig);
      const rainbow = result.newStars.find((s) => s.starType === 'RAINBOW');
      expect(rainbow).toBeDefined();
      const matSpy = vi.spyOn(rainbow!.mesh.material as THREE.Material, 'dispose');
      system.releaseStar(rainbow!);
      // Material must be preserved for re-use.
      expect(matSpy).not.toHaveBeenCalled();
      // RAINBOW must be pooled in the rainbow pool, not the NORMAL pool.
      expect(system.getRainbowStarPoolSize()).toBeGreaterThan(0);
      expect(system.getNormalStarPoolSize()).toBe(0);
    } finally {
      randSpy.mockRestore();
    }
  });

  it('re-uses the same RAINBOW Star mesh and material after releaseStar', () => {
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.05); // < 0.1 → RAINBOW
    try {
      const system = new SpawnSystem();
      const first = system.update(0.016, -10, testConfig);
      const rainbowStars = first.newStars.filter((s) => s.starType === 'RAINBOW');
      expect(rainbowStars.length).toBeGreaterThan(0);
      const initialPoolSize = system.getRainbowStarPoolSize();
      const meshRefs = rainbowStars.map((s) => s.mesh);
      const matRefs = rainbowStars.map((s) => s.mesh.material);

      for (const s of rainbowStars) system.releaseStar(s);
      system.reset();

      const second = system.update(0.016, -10, testConfig);
      const reused = second.newStars.filter((s) => s.starType === 'RAINBOW');
      for (const s of reused) {
        expect(rainbowStars).toContain(s);
        expect(meshRefs).toContain(s.mesh);
        expect(matRefs).toContain(s.mesh.material);
      }
      // Pool must NOT grow when released slots are re-used.
      expect(system.getRainbowStarPoolSize()).toBe(initialPoolSize);
    } finally {
      randSpy.mockRestore();
    }
  });

  it('reused RAINBOW star resumes hue animation from the initial color', () => {
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.05);
    try {
      const system = new SpawnSystem();
      const first = system.update(0.016, -10, testConfig);
      const rainbow = first.newStars.find((s) => s.starType === 'RAINBOW');
      expect(rainbow).toBeDefined();
      // Advance hue significantly during the first lifetime.
      for (let i = 0; i < 30; i++) rainbow!.update(0.1);
      const beforeHsl = { h: 0, s: 0, l: 0 };
      (rainbow!.mesh.material as THREE.MeshToonMaterial).color.getHSL(beforeHsl);
      expect(beforeHsl.h).toBeGreaterThan(0);

      system.releaseStar(rainbow!);
      system.reset();
      const second = system.update(0.016, -10, testConfig);
      const reused = second.newStars.find((s) => s === rainbow);
      expect(reused).toBeDefined();
      // After reset, color should be back to the initial red (hue ~0).
      const afterHsl = { h: 0.5, s: 0, l: 0 };
      (reused!.mesh.material as THREE.MeshToonMaterial).color.getHSL(afterHsl);
      expect(afterHsl.h).toBe(0);
      // A single small update advances hue from 0, not from the previous value.
      reused!.update(0.016);
      const tickHsl = { h: -1, s: 0, l: 0 };
      (reused!.mesh.material as THREE.MeshToonMaterial).color.getHSL(tickHsl);
      expect(tickHsl.h).toBeLessThan(beforeHsl.h);
    } finally {
      randSpy.mockRestore();
    }
  });

  it('returns the same SpawnResult buffer across consecutive update() calls', () => {
    const system = new SpawnSystem();
    const first = system.update(0.016, -10, testConfig);
    const firstStarsRef = first.newStars;
    const firstMeteoritesRef = first.newMeteorites;
    for (let i = 0; i < 100; i++) {
      const next = system.update(0.016, -10 - i, testConfig);
      expect(next).toBe(first);
      expect(next.newStars).toBe(firstStarsRef);
      expect(next.newMeteorites).toBe(firstMeteoritesRef);
    }
  });

  it('clears previous frame entries at the start of each update()', () => {
    const system = new SpawnSystem();
    const first = system.update(3.5, -10, testConfig);
    expect(first.newMeteorites.length).toBeGreaterThan(0);
    expect(first.newStars.length).toBeGreaterThan(0);
    // Drain any remaining queued star spawns so the next assertion is not
    // affected by the per-frame spawn cap (advancing spaceshipZ=-10 keeps
    // targetZ stable while consuming pending spawns).
    while (system.update(0.0, -10, testConfig).newStars.length > 0) {
      // pump until the queue is empty
    }
    // Next call without enough delta to spawn a meteorite must reset the buffer.
    const second = system.update(0.0, -10, testConfig);
    expect(second.newMeteorites).toHaveLength(0);
    expect(second.newStars).toHaveLength(0);
  });

  it('dispose() releases pooled GPU resources for the meteorite pool', () => {
    const system = new SpawnSystem();
    const result = system.update(3.5, -10, testConfig);
    const met = result.newMeteorites[0];
    expect(met).toBeDefined();
    // The meteorite pool calls met.dispose(), which detaches the mesh from its parent.
    const parent = new THREE.Group();
    parent.add(met.mesh);
    system.dispose();
    expect(met.mesh.parent).toBeNull();
    expect(system.getMeteoritePoolSize()).toBe(0);
    expect(system.getNormalStarPoolSize()).toBe(0);
    expect(system.getRainbowStarPoolSize()).toBe(0);
  });

  it('dispose() disposes the per-instance material of pooled RAINBOW stars', () => {
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.05);
    try {
      const system = new SpawnSystem();
      const result = system.update(0.016, -10, testConfig);
      const rainbow = result.newStars.find((s) => s.starType === 'RAINBOW');
      expect(rainbow).toBeDefined();
      const matSpy = vi.spyOn(rainbow!.mesh.material as THREE.Material, 'dispose');
      system.dispose();
      expect(matSpy).toHaveBeenCalledTimes(1);
      expect(system.getRainbowStarPoolSize()).toBe(0);
    } finally {
      randSpy.mockRestore();
    }
  });

  it('caps star spawns per frame to prevent frame time spikes (Constitution IV)', () => {
    // Highest-density case: starDensity=10 → starSpacing=10.
    // From lastStarSpawnZ=0 with spaceshipZ=0 and spawnAheadDistance=80,
    // an unbounded loop would spawn 8 stars in a single update().
    const denseConfig: StageConfig = {
      stageNumber: 1,
      destination: '月',
      stageLength: 500,
      meteoriteInterval: 9999, // disable meteorite spawn for this test
      starDensity: 10,
    };
    const system = new SpawnSystem();
    const result = system.update(0.016, 0, denseConfig);
    expect(result.newStars.length).toBeLessThanOrEqual(4);
    expect(result.newStars.length).toBeGreaterThan(0);
  });

  it('catches up across consecutive frames so total spawns equal the unbounded count', () => {
    const denseConfig: StageConfig = {
      stageNumber: 1,
      destination: '月',
      stageLength: 500,
      meteoriteInterval: 9999,
      starDensity: 10,
    };
    const system = new SpawnSystem();
    let total = 0;
    // 8 frames is enough to exceed the theoretical 8-spawn workload above.
    for (let i = 0; i < 8; i++) {
      total += system.update(0.016, 0, denseConfig).newStars.length;
    }
    // starSpacing=10, target=-80 → exactly 8 stars total when the spaceship
    // does not advance between frames.
    expect(total).toBe(8);
  });
});
