import type { StageConfig } from '../../types';
import { Star } from '../entities/Star';
import { Meteorite } from '../entities/Meteorite';
import { EntityPool } from '../utils/EntityPool';

/**
 * Per-frame spawn output from {@link SpawnSystem.update}.
 *
 * NOTE: The object returned by `update()` (and its `newStars` / `newMeteorites`
 * arrays) is owned by the {@link SpawnSystem} instance and is only valid until
 * the next `update()` call. Callers must consume it synchronously and must not
 * retain references across frames.
 */
export interface SpawnResult {
  newStars: Star[];
  newMeteorites: Meteorite[];
}

export class SpawnSystem {
  // Constitution IV: 60fps 維持のためのフレーム時間スパイク防止。
  // 1 フレームで Star プールが空のまま大量スポーンすると Mesh / Material 生成が
  // 集中してフレーム時間が跳ねるため、1 update() あたりのスポーン数を制限する。
  // 上限を超えた分は lastStarSpawnZ が保持されるので次フレーム以降で順次追いつく。
  private static readonly MAX_STAR_SPAWNS_PER_FRAME = 4;

  private lastStarSpawnZ = 0;
  private meteoriteTimer = 0;
  private spawnAheadDistance = 80;

  // Reusable result buffer to avoid per-frame GC allocations on the hot path.
  // NOTE: The returned object (and its arrays) is owned by this instance and
  // is only valid until the next `update()` call. Callers must consume it
  // synchronously and must not retain references across frames.
  private readonly result: SpawnResult = {
    newStars: [],
    newMeteorites: [],
  };

  // NORMAL stars, RAINBOW stars, and meteorites are all pooled to eliminate
  // per-spawn Mesh / Material allocations on iPad Safari. RAINBOW stars own a
  // per-instance animated MeshToonMaterial; pooling preserves that material
  // across the instance's lifetime so hue animation reuses the same color
  // buffers and avoids GC churn from repeated material construction/disposal.
  private readonly normalStarPool = new EntityPool<Star, readonly [number, number, number]>(
    (x, y, z) => new Star(x, y, z, 'NORMAL'),
    (star, x, y, z) => star.reset(x, y, z),
    (star) => star.recycle(),
    (star) => star.dispose(),
  );
  private readonly rainbowStarPool = new EntityPool<Star, readonly [number, number, number]>(
    (x, y, z) => new Star(x, y, z, 'RAINBOW'),
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

  /**
   * Advances the spawner by `deltaTime` and returns any newly spawned stars
   * and meteorites for this frame.
   *
   * Performance notes:
   * - Returns a reusable buffer; the result is only valid until the next
   *   `update()` call. Do not store references to the returned object or its
   *   `newStars` / `newMeteorites` arrays beyond the current frame.
   */
  update(deltaTime: number, spaceshipZ: number, config: StageConfig): SpawnResult {
    const result = this.result;
    result.newStars.length = 0;
    result.newMeteorites.length = 0;

    // Spawn stars ahead based on density
    const starSpacing = 100 / config.starDensity;
    const targetZ = spaceshipZ - this.spawnAheadDistance;
    let spawned = 0;

    while (this.lastStarSpawnZ > targetZ) {
      if (spawned >= SpawnSystem.MAX_STAR_SPAWNS_PER_FRAME) break;
      this.lastStarSpawnZ -= starSpacing;
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 4;
      const isRainbow = Math.random() < 0.1;
      const star = isRainbow
        ? this.rainbowStarPool.acquire(x, y, this.lastStarSpawnZ)
        : this.normalStarPool.acquire(x, y, this.lastStarSpawnZ);
      result.newStars.push(star);
      spawned++;
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
   * Return a star to its pool. Both NORMAL and RAINBOW stars are pooled;
   * the per-instance RAINBOW material is preserved across reuses to avoid
   * per-spawn allocation churn. Use this in place of `star.dispose()` when
   * the star leaves the play area but the scene continues running.
   */
  releaseStar(star: Star): void {
    if (star.starType === 'RAINBOW') {
      this.rainbowStarPool.release(star);
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
    this.rainbowStarPool.dispose();
    this.meteoritePool.dispose();
  }

  /** Test/diagnostic helper: number of NORMAL stars allocated by the pool. */
  getNormalStarPoolSize(): number {
    return this.normalStarPool.getPoolSize();
  }

  /** Test/diagnostic helper: number of RAINBOW stars allocated by the pool. */
  getRainbowStarPoolSize(): number {
    return this.rainbowStarPool.getPoolSize();
  }

  /** Test/diagnostic helper: number of meteorites allocated by the pool. */
  getMeteoritePoolSize(): number {
    return this.meteoritePool.getPoolSize();
  }
}
