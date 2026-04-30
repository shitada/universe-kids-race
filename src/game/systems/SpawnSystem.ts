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

  // Constitution I (子供ファースト) / III (左右移動のみ): 宇宙船は Y=0 固定で
  // X しか動かせない (Spaceship.update は y を変更しない)。CollisionSystem の
  // 当たり判定半径は star: ship(1.0)+star(0.6)=1.6 / meteorite: ship(1.0)+
  // meteorite(1.0)=2.0 のため、|y| がこの値を超えると X 操作だけでは収集/回避
  // できない「見えるのに取れない／避けられない」配置になり得る。
  // 衝突半径から安全マージン (約 0.6 / 1.2) を引いた範囲に Y を制限することで、
  // X 操作のみで全ての星が到達可能になる（隕石は逆に余裕を残して見た目の Y
  // ばらつきを保ちつつフェアな回避経路を確保）。
  private static readonly STAR_SPAWN_Y_HALF_RANGE = 1.0;
  private static readonly METEORITE_SPAWN_Y_HALF_RANGE = 0.8;

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
      let y = (Math.random() - 0.5) * 2 * SpawnSystem.STAR_SPAWN_Y_HALF_RANGE;
      let safe = this.isXySafeAgainstMeteorites(x, y, z, existingMeteorites, result.newMeteorites);
      for (let attempt = 0; !safe && attempt < SpawnSystem.MAX_REROLL; attempt++) {
        x = (Math.random() - 0.5) * 14;
        y = (Math.random() - 0.5) * 2 * SpawnSystem.STAR_SPAWN_Y_HALF_RANGE;
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
      let y = (Math.random() - 0.5) * 2 * SpawnSystem.METEORITE_SPAWN_Y_HALF_RANGE;
      let safe = this.isXySafeAgainstStars(x, y, z, existingStars, result.newStars);
      for (let attempt = 0; !safe && attempt < SpawnSystem.MAX_REROLL; attempt++) {
        x = (Math.random() - 0.5) * 14;
        y = (Math.random() - 0.5) * 2 * SpawnSystem.METEORITE_SPAWN_Y_HALF_RANGE;
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

  // NOTE on traversal order: `existing` (caller's live entity arrays) and
  // `sameFrame` (this frame's freshly spawned entities) are both maintained in
  // spawn order, which equals z-descending order — spawn z monotonically
  // decreases (lastStarSpawnZ -= starSpacing; meteorites spawn at shipZ-80-jitter
  // as the ship moves forward) and EntityScene's cleanupPassedObjects performs
  // in-place compaction that preserves order. The candidate `z` is always at
  // (or beyond) the head of the spawn frontier, so existing entries have z ≥ z.
  // Traversing from the tail visits the smallest z (closest dz) first; once
  // (p.z - z) > band, all earlier entries have even larger dz and can be
  // skipped. The `dz < -band` branch is retained as a safety net in case the
  // ordering invariant is ever violated by future changes.
  private isXySafeAgainstMeteorites(
    x: number,
    y: number,
    z: number,
    existing: readonly Meteorite[],
    sameFrame: readonly Meteorite[],
  ): boolean {
    const minSq = SpawnSystem.SAFE_XY_DISTANCE * SpawnSystem.SAFE_XY_DISTANCE;
    const band = SpawnSystem.SAFE_Z_BAND;
    for (let i = existing.length - 1; i >= 0; i--) {
      const p = existing[i].position;
      const dz = p.z - z;
      if (dz > band) break;
      if (dz < -band) continue;
      const dx = p.x - x;
      const dy = p.y - y;
      if (dx * dx + dy * dy < minSq) return false;
    }
    for (let i = sameFrame.length - 1; i >= 0; i--) {
      const p = sameFrame[i].position;
      const dz = p.z - z;
      if (dz > band) break;
      if (dz < -band) continue;
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
    for (let i = existing.length - 1; i >= 0; i--) {
      const p = existing[i].position;
      const dz = p.z - z;
      if (dz > band) break;
      if (dz < -band) continue;
      const dx = p.x - x;
      const dy = p.y - y;
      if (dx * dx + dy * dy < minSq) return false;
    }
    for (let i = sameFrame.length - 1; i >= 0; i--) {
      const p = sameFrame[i].position;
      const dz = p.z - z;
      if (dz > band) break;
      if (dz < -band) continue;
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

  /**
   * Return all currently active (acquired) entities to their pools without
   * disposing GPU resources. Unlike {@link dispose}, the underlying Mesh /
   * Material instances are retained for reuse on the next stage. Each
   * entity's `recycle()` runs via the pool's releaseFn, which detaches the
   * mesh from its parent so a subsequent `threeScene.clear()` is a no-op for
   * pooled entities.
   *
   * Constitution IV (60fps): used by StageScene.exit() so the next stage's
   * enter() reuses pooled Star / Meteorite Mesh + Material instances. This
   * eliminates per-stage Mesh / Material reallocation and lets the per-frame
   * MAX_STAR_SPAWNS_PER_FRAME throttle warm-start from the available pool.
   */
  recycleAll(): void {
    this.normalStarPool.releaseAll();
    this.rainbowStarPool.releaseAll();
    this.meteoritePool.releaseAll();
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
