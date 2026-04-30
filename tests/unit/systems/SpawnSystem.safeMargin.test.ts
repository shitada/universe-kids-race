import { describe, it, expect, vi } from 'vitest';
import { SpawnSystem } from '../../../src/game/systems/SpawnSystem';
import { Star } from '../../../src/game/entities/Star';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { StageConfig } from '../../../src/types';

const SAFE_XY_DISTANCE = 2.5;
const SAFE_Z_BAND = 3.0;

const denseStars: StageConfig = {
  stageNumber: 1,
  destination: '月',
  stageLength: 500,
  meteoriteInterval: 9999, // disable meteorite spawn
  starDensity: 5,
};

const denseMeteorites: StageConfig = {
  stageNumber: 1,
  destination: '月',
  stageLength: 500,
  meteoriteInterval: 0.001, // ensure a meteorite spawns immediately
  starDensity: 0.0001, // effectively disable star spawn
};

function xyDistance(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

describe('SpawnSystem safe margin (Constitution I)', () => {
  it('rerolls star xy when the first roll collides with an existing meteorite', () => {
    // Sequence of Math.random() returns. Order of consumption inside update():
    //   per star: rainbowCheck, x, y [, x', y' on reroll ...]
    //
    // First star (z = -spacing = -20):
    //   rainbow=0.5 (NORMAL), x=0.5→0, y=0.5→0  (collides with meteorite at (0,0,-20))
    //   reroll #1: x=0.95→6.3, y=0.5→0 (safe; |dx|=6.3 ≥ 2.5)
    // Then per-frame cap=4 may spawn more stars; we only assert about the first.
    const seq = [0.5, 0.5, 0.5, 0.95, 0.5];
    let i = 0;
    const randSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i] ?? 0.95;
      i++;
      return v;
    });
    try {
      const system = new SpawnSystem();
      const meteorite = new Meteorite(0, 0, -20);
      const result = system.update(0.016, 0, denseStars, [], [meteorite]);
      expect(result.newStars.length).toBeGreaterThan(0);
      const first = result.newStars[0];
      // First spawn z is at -spacing = -20 (within SAFE_Z_BAND of meteorite z=-20)
      expect(first.position.z).toBe(-20);
      // After the reroll, xy must be safe against the meteorite.
      expect(xyDistance(first.position, meteorite.position)).toBeGreaterThanOrEqual(
        SAFE_XY_DISTANCE,
      );
      meteorite.dispose();
      system.dispose();
    } finally {
      randSpy.mockRestore();
    }
  });

  it('skips the star spawn when MAX_REROLL is exhausted (lastStarSpawnZ still advances)', () => {
    // Math.random always returns 0.5 → x=0, y=0, NORMAL. Always collides.
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    try {
      const system = new SpawnSystem();
      // Place a meteorite directly at (0,0) within the band of the first
      // star spawn slot (z = -starSpacing = -20).
      const meteorite = new Meteorite(0, 0, -20);
      const result = system.update(0.016, 0, denseStars, [], [meteorite]);
      // No star at z=-20 should be emitted (always collides), but later slots
      // may also collide and be skipped. Critically: no newStar collides.
      for (const star of result.newStars) {
        if (Math.abs(star.position.z - meteorite.position.z) <= SAFE_Z_BAND) {
          expect(xyDistance(star.position, meteorite.position)).toBeGreaterThanOrEqual(
            SAFE_XY_DISTANCE,
          );
        }
      }
      // lastStarSpawnZ must have advanced (otherwise we'd loop forever).
      // With per-frame cap=4 and starSpacing=20, we consume 4 slots regardless of skips,
      // so a follow-up call advancing further must not re-spawn at z=-20.
      const second = system.update(0.0, 0, denseStars, [], [meteorite]);
      for (const star of second.newStars) {
        expect(star.position.z).toBeLessThan(-20);
      }
      meteorite.dispose();
      system.dispose();
    } finally {
      randSpy.mockRestore();
    }
  });

  it('rerolls meteorite xy when the first roll collides with an existing star', () => {
    // Use spaceshipZ=100 so targetZ=20 > lastStarSpawnZ(0) → star spawn loop is skipped
    // and we control the random sequence consumed by the meteorite spawn alone.
    //
    // For meteorite spawn the consumption order inside update() is:
    //   z-jitter, x, y [, x', y' on reroll ...]
    //
    // z = spaceshipZ(100) - spawnAheadDistance(80) - random*20 = 20 - 0.5*20 = 10
    // first attempt: x=0.5→0, y=0.5→0 collides with star at (0,0,10)
    // reroll: x=0.95→6.3, y=0.5→0 → safe
    const seq = [0.5, 0.5, 0.5, 0.95, 0.5];
    let i = 0;
    const randSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i] ?? 0.95;
      i++;
      return v;
    });
    try {
      const system = new SpawnSystem();
      const star = new Star(0, 0, 10, 'NORMAL');
      const result = system.update(0.016, 100, denseMeteorites, [star], []);
      expect(result.newMeteorites.length).toBe(1);
      const met = result.newMeteorites[0];
      expect(met.position.z).toBe(10);
      expect(xyDistance(met.position, star.position)).toBeGreaterThanOrEqual(
        SAFE_XY_DISTANCE,
      );
      star.dispose();
      system.dispose();
    } finally {
      randSpy.mockRestore();
    }
  });

  it('skips the meteorite spawn when MAX_REROLL is exhausted but timer carries forward normally', () => {
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    try {
      const system = new SpawnSystem();
      // spaceshipZ=100 skips star spawn; meteorite z = 20 - 0.5*20 = 10.
      const star = new Star(0, 0, 10, 'NORMAL');
      const first = system.update(0.001, 100, denseMeteorites, [star], []);
      expect(first.newMeteorites).toHaveLength(0);
      // No meteorite ever overlaps the star, regardless of how many intervals elapse.
      for (let frame = 0; frame < 20; frame++) {
        const r = system.update(0.001, 100, denseMeteorites, [star], []);
        for (const m of r.newMeteorites) {
          if (Math.abs(m.position.z - star.position.z) <= SAFE_Z_BAND) {
            expect(xyDistance(m.position, star.position)).toBeGreaterThanOrEqual(
              SAFE_XY_DISTANCE,
            );
          }
        }
      }
      star.dispose();
      system.dispose();
    } finally {
      randSpy.mockRestore();
    }
  });

  it('emits no star/meteorite pair within the safety margin across a full simulation', () => {
    // Run a realistic 60s simulation with both stars and meteorites enabled, then
    // assert no pair (star, meteorite) violates the safety margin.
    const cfg: StageConfig = {
      stageNumber: 1,
      destination: '月',
      stageLength: 5000,
      meteoriteInterval: 1.0,
      starDensity: 5,
    };
    const system = new SpawnSystem();
    const stars: Star[] = [];
    const meteorites: Meteorite[] = [];
    const dt = 1 / 60;
    let z = 0;
    for (let t = 0; t < 60; t += dt) {
      z -= 30 * dt; // simulate spaceship moving forward at 30 u/s
      const r = system.update(dt, z, cfg, stars, meteorites);
      for (const s of r.newStars) stars.push(s);
      for (const m of r.newMeteorites) meteorites.push(m);
    }
    expect(stars.length).toBeGreaterThan(0);
    expect(meteorites.length).toBeGreaterThan(0);
    for (const s of stars) {
      for (const m of meteorites) {
        if (Math.abs(s.position.z - m.position.z) <= SAFE_Z_BAND) {
          expect(xyDistance(s.position, m.position)).toBeGreaterThanOrEqual(
            SAFE_XY_DISTANCE,
          );
        }
      }
    }
    system.dispose();
  });

  it('ignores existing entities outside SAFE_Z_BAND even when xy collides (tail-walk early break)', () => {
    // Regression for the tail-walk early-break optimization. Existing arrays are
    // maintained in z-descending order (spawn order). Place a colliding entity
    // far away in z (dz > band) at the head of the array and a non-colliding
    // entity inside the band at the tail. The tail-walk must early-break before
    // ever reaching the head, and the spawn must succeed at the deterministic
    // colliding xy without rerolling.
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    try {
      const system = new SpawnSystem();
      // Star spawn slot: z = -starSpacing = -20. SAFE_Z_BAND = 3.0.
      // Far entity at z = +50 collides on xy (would force reroll if scanned),
      // but |dz| = 70 ≫ band so it must be ignored. With tail-walk it is not
      // even visited because the in-band tail entity (z = -22) breaks earlier.
      const farColliding = new Meteorite(0, 0, 50);
      const nearSafe = new Meteorite(8, 0, -22); // |dz|=2 in band, |dx|=8 safe
      const existingMeteorites = [farColliding, nearSafe]; // z-descending
      const result = system.update(0.016, 0, denseStars, [], existingMeteorites);
      expect(result.newStars.length).toBeGreaterThan(0);
      // First star must spawn at the deterministic (0,0,-20) — no reroll fired.
      const first = result.newStars[0];
      expect(first.position.x).toBe(0);
      expect(first.position.y).toBe(0);
      expect(first.position.z).toBe(-20);
      farColliding.dispose();
      nearSafe.dispose();
      system.dispose();
    } finally {
      randSpy.mockRestore();
    }
  });

  it('detects collision with the band-tail entity even when head entries are far out of band', () => {
    // Mirror of the above: the in-band tail entity actually collides on xy and
    // must trigger a reroll. The head entry is far out of band and irrelevant.
    // Sequence: per star → rainbowCheck, x, y [, x', y' on reroll].
    const seq = [0.5, 0.5, 0.5, 0.95, 0.5];
    let i = 0;
    const randSpy = vi.spyOn(Math, 'random').mockImplementation(() => {
      const v = seq[i] ?? 0.95;
      i++;
      return v;
    });
    try {
      const system = new SpawnSystem();
      // Far entity (out of band): irrelevant to safety.
      const farSafe = new Meteorite(8, 0, 50);
      // Tail entity (in band, colliding): must force a reroll.
      const nearColliding = new Meteorite(0, 0, -20);
      const existingMeteorites = [farSafe, nearColliding]; // z-descending
      const result = system.update(0.016, 0, denseStars, [], existingMeteorites);
      expect(result.newStars.length).toBeGreaterThan(0);
      const first = result.newStars[0];
      expect(first.position.z).toBe(-20);
      expect(xyDistance(first.position, nearColliding.position)).toBeGreaterThanOrEqual(
        SAFE_XY_DISTANCE,
      );
      farSafe.dispose();
      nearColliding.dispose();
      system.dispose();
    } finally {
      randSpy.mockRestore();
    }
  });

  it('matches legacy behavior when no nearby existing entities are passed (backward-compatible default)', () => {
    // With no existing stars / meteorites, no rerolls should ever fire and the
    // emitted positions must be deterministic given a fixed Math.random sequence.
    const randSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    try {
      const system = new SpawnSystem();
      const result = system.update(0.016, 0, denseStars);
      expect(result.newStars.length).toBeGreaterThan(0);
      for (const s of result.newStars) {
        // x = (0.5-0.5)*14 = 0, y = (0.5-0.5)*4 = 0
        expect(s.position.x).toBe(0);
        expect(s.position.y).toBe(0);
      }
      system.dispose();
    } finally {
      randSpy.mockRestore();
    }
  });
});
