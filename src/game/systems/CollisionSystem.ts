import type { Spaceship } from '../entities/Spaceship';
import type { Star } from '../entities/Star';
import type { Meteorite } from '../entities/Meteorite';
import type { ShootingStar } from '../entities/ShootingStar';
import type { Comet } from '../entities/Comet';
import type { SpecialShootingStar } from '../entities/SpecialShootingStar';

export interface CollisionResult {
  starCollisions: Star[];
  meteoriteCollision: boolean;
  shootingStarHit: ShootingStar | null;
  cometHit: Comet | null;
  specialShootingStarHit: SpecialShootingStar | null;
  // Reference to the Meteorite that triggered the collision this frame, or
  // null if no meteorite was hit. Callers should set `meteoriteHit.isActive
  // = false` after handling the hit so the same meteorite is skipped on
  // subsequent frames (the loop below early-continues on `!met.isActive`).
  // Lifetime: same as the enclosing CollisionResult buffer — only valid
  // until the next `check()` call.
  meteoriteHit: Meteorite | null;
}

export class CollisionSystem {
  // Reusable result buffer to avoid per-frame GC allocations on the hot path.
  // NOTE: The returned object (and its `starCollisions` array) is owned by this
  // instance and is only valid until the next `check()` call. Callers must
  // consume it synchronously and must not retain references across frames.
  private readonly result: CollisionResult = {
    starCollisions: [],
    meteoriteCollision: false,
    shootingStarHit: null,
    cometHit: null,
    specialShootingStarHit: null,
    meteoriteHit: null,
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
  check(
    spaceship: Spaceship,
    stars: Star[],
    meteorites: Meteorite[],
    companionBonus = 0,
    shootingStars: ShootingStar[] = [],
    comets: Comet[] = [],
    specialShootingStars: SpecialShootingStar[] = [],
  ): CollisionResult {
    const result = this.result;
    result.starCollisions.length = 0;
    result.meteoriteCollision = false;
    result.shootingStarHit = null;
    result.cometHit = null;
    result.specialShootingStarHit = null;
    result.meteoriteHit = null;

    const sp = spaceship.position;

    // Star collisions (expanded by companion bonus) — squared distance comparison.
    // Per-frame perf: most stars within spawnAheadDistance are far on the Z axis
    // and cannot collide. Compute dz first and skip dx/dy/distSq when |dz| already
    // exceeds the collision radius. `starCollisionDist(Sq)` is loop-invariant
    // because `Star.radius` is constant across all instances and `companionBonus`
    // is fixed within this call.
    //
    // Traversal order invariant (mirrors SpawnSystem.isXySafeAgainstEntities,
    // SpawnSystem.ts:183-192): `stars` is maintained in spawn order, which equals
    // z-descending order — spawn z monotonically decreases (lastStarSpawnZ -=
    // starSpacing) and StageScene.cleanupPassedObjects performs in-place
    // compaction that preserves order. Therefore `dz = sp.z - star.position.z`
    // is monotonically non-decreasing as the index grows: once `dz > starCollisionDist`,
    // every subsequent entry is even further ahead in -Z and cannot collide,
    // so we can `break` out of the loop. The opposite branch (`dz < -starCollisionDist`)
    // is kept as `continue` to act as a safety net in case the ordering invariant
    // is ever violated by future changes.
    if (stars.length > 0) {
      const starCollisionDist = 1.0 + stars[0].radius + companionBonus;
      const starCollisionDistSq = starCollisionDist * starCollisionDist;
      for (const star of stars) {
        if (star.isCollected) continue;
        const dz = sp.z - star.position.z;
        if (dz > starCollisionDist) break;
        if (dz < -starCollisionDist) continue;
        const dx = sp.x - star.position.x;
        const dy = sp.y - star.position.y;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < starCollisionDistSq) {
          star.collect();
          result.starCollisions.push(star);
        }
      }
    }

    if (shootingStars.length > 0) {
      const shootingStarCollisionDist = 1.0 + shootingStars[0].radius;
      const shootingStarCollisionDistSq = shootingStarCollisionDist * shootingStarCollisionDist;
      for (const shootingStar of shootingStars) {
        if (shootingStar.isCollected) continue;
        const dz = sp.z - shootingStar.position.z;
        if (dz > shootingStarCollisionDist) continue;
        if (dz < -shootingStarCollisionDist) continue;
        const dx = sp.x - shootingStar.position.x;
        const dy = sp.y - shootingStar.position.y;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < shootingStarCollisionDistSq) {
          shootingStar.collect();
          result.shootingStarHit = shootingStar;
          break;
        }
      }
    }

    if (comets.length > 0) {
      const cometCollisionDist = 1.0 + comets[0].radius;
      const cometCollisionDistSq = cometCollisionDist * cometCollisionDist;
      for (const comet of comets) {
        if (comet.isCollected) continue;
        const dz = sp.z - comet.position.z;
        if (dz > cometCollisionDist) continue;
        if (dz < -cometCollisionDist) continue;
        const dx = sp.x - comet.position.x;
        const dy = sp.y - comet.position.y;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < cometCollisionDistSq) {
          comet.collect();
          result.cometHit = comet;
          break;
        }
      }
    }

    if (specialShootingStars.length > 0) {
      const specialShootingStarCollisionDist = 1.0 + specialShootingStars[0].radius;
      const specialShootingStarCollisionDistSq = specialShootingStarCollisionDist * specialShootingStarCollisionDist;
      for (const specialShootingStar of specialShootingStars) {
        if (specialShootingStar.isCollected) continue;
        const dz = sp.z - specialShootingStar.position.z;
        if (dz > specialShootingStarCollisionDist) continue;
        if (dz < -specialShootingStarCollisionDist) continue;
        const dx = sp.x - specialShootingStar.position.x;
        const dy = sp.y - specialShootingStar.position.y;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < specialShootingStarCollisionDistSq) {
          specialShootingStar.collect();
          result.specialShootingStarHit = specialShootingStar;
          break;
        }
      }
    }

    // Meteorite collisions (skip during SLOWDOWN invincibility) — squared distance comparison.
    // Same Z-axis early-skip optimization as the star loop. `meteoriteCollisionDist(Sq)`
    // is loop-invariant because `Meteorite.radius` is constant across all instances.
    // Same z-descending order invariant applies (see star loop comment above and
    // SpawnSystem.ts:183-192): `meteorites` is in spawn order, so once
    // `dz > meteoriteCollisionDist`, every later entry is further ahead → break.
    if (spaceship.speedState !== 'SLOWDOWN' && meteorites.length > 0) {
      const meteoriteCollisionDist = 1.0 + meteorites[0].radius;
      const meteoriteCollisionDistSq = meteoriteCollisionDist * meteoriteCollisionDist;
      for (const met of meteorites) {
        if (!met.isActive) continue;
        const dz = sp.z - met.position.z;
        if (dz > meteoriteCollisionDist) break;
        if (dz < -meteoriteCollisionDist) continue;
        const dx = sp.x - met.position.x;
        const dy = sp.y - met.position.y;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < meteoriteCollisionDistSq) {
          result.meteoriteCollision = true;
          result.meteoriteHit = met;
          break;
        }
      }
    }

    return result;
  }
}
