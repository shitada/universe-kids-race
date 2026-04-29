import type { Spaceship } from '../entities/Spaceship';
import type { Star } from '../entities/Star';
import type { Meteorite } from '../entities/Meteorite';

export interface CollisionResult {
  starCollisions: Star[];
  meteoriteCollision: boolean;
}

export class CollisionSystem {
  // Reusable result buffer to avoid per-frame GC allocations on the hot path.
  // NOTE: The returned object (and its `starCollisions` array) is owned by this
  // instance and is only valid until the next `check()` call. Callers must
  // consume it synchronously and must not retain references across frames.
  private readonly result: CollisionResult = {
    starCollisions: [],
    meteoriteCollision: false,
  };

  /**
   * Detects star/meteorite collisions for the current frame.
   *
   * Performance notes:
   * - Uses squared-distance comparison to avoid square root computation in the hot loop.
   * - Returns a reusable buffer; the result is only valid until the next
   *   `check()` call. Do not store references to the returned object or its
   *   `starCollisions` array beyond the current frame.
   * - `Star.radius` (0.6) and `Meteorite.radius` (1.0) are constant for every
   *   instance and never mutated, and `companionBonus` is fixed for a single
   *   `check()` call. We exploit that invariance by hoisting `collisionDist`
   *   and its square out of the per-entity loops, replacing N additions and N
   *   multiplications per loop with a single computation.
   */
  check(spaceship: Spaceship, stars: Star[], meteorites: Meteorite[], companionBonus = 0): CollisionResult {
    const result = this.result;
    result.starCollisions.length = 0;
    result.meteoriteCollision = false;

    const sp = spaceship.position;

    // Star collisions (expanded by companion bonus) — squared distance comparison.
    // Per-frame perf: most stars within spawnAheadDistance are far on the Z axis
    // and cannot collide. Compute dz first and skip dx/dy/distSq when |dz| already
    // exceeds the collision radius. `starCollisionDist(Sq)` is loop-invariant
    // because `Star.radius` is constant across all instances and `companionBonus`
    // is fixed within this call.
    if (stars.length > 0) {
      const starCollisionDist = 1.0 + stars[0].radius + companionBonus;
      const starCollisionDistSq = starCollisionDist * starCollisionDist;
      for (const star of stars) {
        if (star.isCollected) continue;
        const dz = sp.z - star.position.z;
        if (dz > starCollisionDist || dz < -starCollisionDist) continue;
        const dx = sp.x - star.position.x;
        const dy = sp.y - star.position.y;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < starCollisionDistSq) {
          star.collect();
          result.starCollisions.push(star);
        }
      }
    }

    // Meteorite collisions (skip during SLOWDOWN invincibility) — squared distance comparison.
    // Same Z-axis early-skip optimization as the star loop. `meteoriteCollisionDist(Sq)`
    // is loop-invariant because `Meteorite.radius` is constant across all instances.
    if (spaceship.speedState !== 'SLOWDOWN' && meteorites.length > 0) {
      const meteoriteCollisionDist = 1.0 + meteorites[0].radius;
      const meteoriteCollisionDistSq = meteoriteCollisionDist * meteoriteCollisionDist;
      for (const met of meteorites) {
        if (!met.isActive) continue;
        const dz = sp.z - met.position.z;
        if (dz > meteoriteCollisionDist || dz < -meteoriteCollisionDist) continue;
        const dx = sp.x - met.position.x;
        const dy = sp.y - met.position.y;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < meteoriteCollisionDistSq) {
          result.meteoriteCollision = true;
          break;
        }
      }
    }

    return result;
  }
}
