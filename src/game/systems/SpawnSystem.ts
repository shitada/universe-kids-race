import type { StageConfig } from '../../types';
import { Star } from '../entities/Star';
import { Meteorite } from '../entities/Meteorite';
import { EntityPool } from '../utils/EntityPool';

export interface SpawnResult {
  newStars: Star[];
  newMeteorites: Meteorite[];
}

export class SpawnSystem {
  private lastStarSpawnZ = 0;
  private meteoriteTimer = 0;
  private spawnAheadDistance = 80;

  // NORMAL stars and meteorites are pooled to eliminate per-spawn Mesh
  // allocations on iPad Safari. RAINBOW stars are NOT pooled because they
  // own a per-instance animated material; their volume is also low (~10%).
  private readonly normalStarPool = new EntityPool<Star, readonly [number, number, number]>(
    (x, y, z) => new Star(x, y, z, 'NORMAL'),
    (star, x, y, z) => star.reset(x, y, z),
    (star) => star.recycle(),
    (star) => star.dispose(),
  );
  private readonly meteoritePool = new EntityPool<Meteorite, readonly [number, number, number]>(
    (x, y, z) => new Meteorite(x, y, z),
    (met, x, y, z) => met.reset(x, y, z),
    (met) => met.recycle(),
    (met) => met.dispose(),
  );

  update(deltaTime: number, spaceshipZ: number, config: StageConfig): SpawnResult {
    const result: SpawnResult = { newStars: [], newMeteorites: [] };

    // Spawn stars ahead based on density
    const starSpacing = 100 / config.starDensity;
    const targetZ = spaceshipZ - this.spawnAheadDistance;

    while (this.lastStarSpawnZ > targetZ) {
      this.lastStarSpawnZ -= starSpacing;
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 4;
      const isRainbow = Math.random() < 0.1;
      const star = isRainbow
        ? new Star(x, y, this.lastStarSpawnZ, 'RAINBOW')
        : this.normalStarPool.acquire(x, y, this.lastStarSpawnZ);
      result.newStars.push(star);
    }

    // Spawn meteorites based on interval
    this.meteoriteTimer += deltaTime;
    if (this.meteoriteTimer >= config.meteoriteInterval) {
      this.meteoriteTimer -= config.meteoriteInterval;
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 3;
      const z = spaceshipZ - this.spawnAheadDistance - Math.random() * 20;
      const met = this.meteoritePool.acquire(x, y, z);
      result.newMeteorites.push(met);
    }

    return result;
  }

  /**
   * Return a star to its pool (NORMAL) or fully dispose it (RAINBOW).
   * Use this in place of `star.dispose()` when the star leaves the play
   * area but the scene continues running.
   */
  releaseStar(star: Star): void {
    if (star.starType === 'RAINBOW') {
      star.dispose();
      return;
    }
    this.normalStarPool.release(star);
  }

  releaseMeteorite(met: Meteorite): void {
    this.meteoritePool.release(met);
  }

  reset(): void {
    this.lastStarSpawnZ = 0;
    this.meteoriteTimer = 0;
  }

  /** Permanently free all pooled GPU resources. Call from scene teardown. */
  dispose(): void {
    this.normalStarPool.dispose();
    this.meteoritePool.dispose();
  }

  /** Test/diagnostic helper: number of NORMAL stars allocated by the pool. */
  getNormalStarPoolSize(): number {
    return this.normalStarPool.getPoolSize();
  }

  /** Test/diagnostic helper: number of meteorites allocated by the pool. */
  getMeteoritePoolSize(): number {
    return this.meteoritePool.getPoolSize();
  }
}
