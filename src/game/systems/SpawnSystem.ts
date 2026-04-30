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

/**
 * SpawnSystem schedules star and meteorite placements ahead of the spaceship.
 *
 * Constitution I (子供ファースト): Stars and meteorites must never share the
 * same near-neighborhood (xy ≤ {@link SpawnSystem.SAFE_XY_DISTANCE} within
 * |dz| ≤ {@link SpawnSystem.SAFE_Z_BAND}). Because input is left/right only
 * (Constitution III), an unavoidable "go grab a star → hit a meteorite right
 * next to it" layout would feel unfair. Per spawn we re-roll xy up to
 * {@link SpawnSystem.MAX_REROLL} times against the safety margin and, if no
 * safe position is found, skip that single spawn (density loss is bounded).
 */
export class SpawnSystem {
  // Constitution IV: 60fps 維持のためのフレーム時間スパイク防止。
  // 1 フレームで Star プールが空のまま大量スポーンすると Mesh / Material 生成が
  // 集中してフレーム時間が跳ねるため、1 update() あたりのスポーン数を制限する。
  // 上限を超えた分は lastStarSpawnZ が保持されるので次フレーム以降で順次追いつく。
  private static readonly MAX_STAR_SPAWNS_PER_FRAME = 4;

  // Constitution I: star ↔ meteorite が「避けようがない近傍」に並ばないよう
  // スポーン時に xy 距離をチェックし、被ったら最大 MAX_REROLL 回 xy のみ再ロール、
  // それでも安全距離を満たさない場合はその 1 件をスキップする。
  // SAFE_Z_BAND は近傍判定のフィルタ幅で、走査対象を 0〜数件に絞る。
  private static readonly SAFE_XY_DISTANCE = 2.5;
  private static readonly SAFE_Z_BAND = 3.0;
  private static readonly MAX_REROLL = 4;

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
   * `existingStars` / `existingMeteorites` are read-only snapshots of the
   * scene's currently-live entities; they are scanned only for the safety
   * margin check and are never mutated. Callers that do not need the safety
   * margin (e.g. lightweight unit tests) may omit them.
   *
   * Performance notes:
   * - Returns a reusable buffer; the result is only valid until the next
   *   `update()` call. Do not store references to the returned object or its
   *   `newStars` / `newMeteorites` arrays beyond the current frame.
   * - Safety margin scan is bounded by the |dz| ≤ SAFE_Z_BAND early-out so
   *   the typical inner loop visits 0〜数件 even at high entity counts.
   */
  update(
    deltaTime: number,
    spaceshipZ: number,
    config: StageConfig,
    existingStars: readonly Star[] = [],
    existingMeteorites: readonly Meteorite[] = [],
  ): SpawnResult {
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
      const z = this.lastStarSpawnZ;
      const isRainbow = Math.random() < 0.1;
      let x = (Math.random() - 0.5) * 14;
      let y = (Math.random() - 0.5) * 4;
      let safe = this.isXySafeAgainstMeteorites(x, y, z, existingMeteorites, result.newMeteorites);
      for (let attempt = 0; !safe && attempt < SpawnSystem.MAX_REROLL; attempt++) {
        x = (Math.random() - 0.5) * 14;
        y = (Math.random() - 0.5) * 4;
        safe = this.isXySafeAgainstMeteorites(x, y, z, existingMeteorites, result.newMeteorites);
      }
      // Count this slot regardless to advance lastStarSpawnZ (already decremented)
      // and avoid an infinite reroll loop. If no safe xy was found, drop this spawn
      // entirely; per Constitution I, a missing star is preferable to an unfair pair.
      spawned++;
      if (!safe) continue;
      const star = isRainbow
        ? this.rainbowStarPool.acquire(x, y, z)
        : this.normalStarPool.acquire(x, y, z);
      result.newStars.push(star);
    }

    // Spawn meteorites based on interval
    this.meteoriteTimer += deltaTime;
    if (this.meteoriteTimer >= config.meteoriteInterval) {
      this.meteoriteTimer -= config.meteoriteInterval;
      const z = spaceshipZ - this.spawnAheadDistance - Math.random() * 20;
      let x = (Math.random() - 0.5) * 14;
      let y = (Math.random() - 0.5) * 3;
      let safe = this.isXySafeAgainstStars(x, y, z, existingStars, result.newStars);
      for (let attempt = 0; !safe && attempt < SpawnSystem.MAX_REROLL; attempt++) {
        x = (Math.random() - 0.5) * 14;
        y = (Math.random() - 0.5) * 3;
        safe = this.isXySafeAgainstStars(x, y, z, existingStars, result.newStars);
      }
      // If no safe xy was found, skip this meteorite. meteoriteTimer was already
      // reduced by one interval so the next meteorite arrives on the normal cadence.
      if (safe) {
        const met = this.meteoritePool.acquire(x, y, z);
        result.newMeteorites.push(met);
      }
    }

    return result;
  }

  private isXySafeAgainstMeteorites(
    x: number,
    y: number,
    z: number,
    existing: readonly Meteorite[],
    sameFrame: readonly Meteorite[],
  ): boolean {
    const minSq = SpawnSystem.SAFE_XY_DISTANCE * SpawnSystem.SAFE_XY_DISTANCE;
    const band = SpawnSystem.SAFE_Z_BAND;
    for (let i = 0; i < existing.length; i++) {
      const p = existing[i].position;
      if (Math.abs(p.z - z) > band) continue;
      const dx = p.x - x;
      const dy = p.y - y;
      if (dx * dx + dy * dy < minSq) return false;
    }
    for (let i = 0; i < sameFrame.length; i++) {
      const p = sameFrame[i].position;
      if (Math.abs(p.z - z) > band) continue;
      const dx = p.x - x;
      const dy = p.y - y;
      if (dx * dx + dy * dy < minSq) return false;
    }
    return true;
  }

  private isXySafeAgainstStars(
    x: number,
    y: number,
    z: number,
    existing: readonly Star[],
    sameFrame: readonly Star[],
  ): boolean {
    const minSq = SpawnSystem.SAFE_XY_DISTANCE * SpawnSystem.SAFE_XY_DISTANCE;
    const band = SpawnSystem.SAFE_Z_BAND;
    for (let i = 0; i < existing.length; i++) {
      const p = existing[i].position;
      if (Math.abs(p.z - z) > band) continue;
      const dx = p.x - x;
      const dy = p.y - y;
      if (dx * dx + dy * dy < minSq) return false;
    }
    for (let i = 0; i < sameFrame.length; i++) {
      const p = sameFrame[i].position;
      if (Math.abs(p.z - z) > band) continue;
      const dx = p.x - x;
      const dy = p.y - y;
      if (dx * dx + dy * dy < minSq) return false;
    }
    return true;
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
