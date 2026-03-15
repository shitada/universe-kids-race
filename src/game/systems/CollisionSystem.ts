import type { Spaceship } from '../entities/Spaceship';
import type { Star } from '../entities/Star';
import type { Meteorite } from '../entities/Meteorite';

export interface CollisionResult {
  starCollisions: Star[];
  meteoriteCollision: boolean;
}

export class CollisionSystem {
  check(spaceship: Spaceship, stars: Star[], meteorites: Meteorite[]): CollisionResult {
    const result: CollisionResult = {
      starCollisions: [],
      meteoriteCollision: false,
    };

    const sp = spaceship.position;

    // Star collisions
    for (const star of stars) {
      if (star.isCollected) continue;
      const dx = sp.x - star.position.x;
      const dy = sp.y - star.position.y;
      const dz = sp.z - star.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const collisionDist = 1.0 + star.radius; // spaceship radius ~1.0
      if (dist < collisionDist) {
        star.collect();
        result.starCollisions.push(star);
      }
    }

    // Meteorite collisions (skip during SLOWDOWN invincibility)
    if (spaceship.speedState !== 'SLOWDOWN') {
      for (const met of meteorites) {
        if (!met.isActive) continue;
        const dx = sp.x - met.position.x;
        const dy = sp.y - met.position.y;
        const dz = sp.z - met.position.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const collisionDist = 1.0 + met.radius;
        if (dist < collisionDist) {
          result.meteoriteCollision = true;
          break;
        }
      }
    }

    return result;
  }
}
