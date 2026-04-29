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
   */
  check(spaceship: Spaceship, stars: Star[], meteorites: Meteorite[], companionBonus = 0): CollisionResult {
    const result = this.result;
    result.starCollisions.length = 0;
    result.meteoriteCollision = false;

    const sp = spaceship.position;

    // Star collisions (expanded by companion bonus) — squared distance comparison.
    // Per-frame perf: most stars within spawnAheadDistance are far on the Z axis
    // and cannot collide. Compute dz first and skip dx/dy/distSq when |dz| already
    // exceeds the collision radius.
    for (const star of stars) {
      if (star.isCollected) continue;
      const dz = sp.z - star.position.z;
      const collisionDist = 1.0 + star.radius + companionBonus;
      if (dz > collisionDist || dz < -collisionDist) continue;
      const dx = sp.x - star.position.x;
      const dy = sp.y - star.position.y;
      const distSq = dx * dx + dy * dy + dz * dz;
      if (distSq < collisionDist * collisionDist) {
        star.collect();
        result.starCollisions.push(star);
      }
    }

    // Meteorite collisions (skip during SLOWDOWN invincibility) — squared distance comparison.
    // Same Z-axis early-skip optimization as the star loop.
    if (spaceship.speedState !== 'SLOWDOWN') {
      for (const met of meteorites) {
        if (!met.isActive) continue;
        const dz = sp.z - met.position.z;
        const collisionDist = 1.0 + met.radius;
        if (dz > collisionDist || dz < -collisionDist) continue;
        const dx = sp.x - met.position.x;
        const dy = sp.y - met.position.y;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < collisionDist * collisionDist) {
          result.meteoriteCollision = true;
          break;
        }
      }
    }

    return result;
  }
}
