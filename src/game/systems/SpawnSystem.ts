import type { StageConfig } from '../../types';
import { Star } from '../entities/Star';
import { Meteorite } from '../entities/Meteorite';
import { ShootingStar } from '../entities/ShootingStar';
import { Comet } from '../entities/Comet';
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
  newShootingStars: ShootingStar[];
  newComets: Comet[];
}

export interface SpawnModifiers {
  meteoShowerActive?: boolean;
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
  private static readonly SHOOTING_STAR_STAGE_EVENT_CHANCE = 0.015;
  private static readonly SHOOTING_STAR_EVENT_START_BUFFER = 30;
  private static readonly SHOOTING_STAR_EVENT_END_BUFFER = 30;
  private static readonly SHOOTING_STAR_MIN_EVENT_BUFFER = 6;
  private static readonly SHOOTING_STAR_SPAWN_X = 9.2;
  private static readonly SHOOTING_STAR_SPAWN_Y_MIN = 0.2;
  private static readonly SHOOTING_STAR_SPAWN_Y_RANGE = 0.75;
  private static readonly METEO_SHOWER_SHOOTING_STAR_INTERVAL = 0.28;
  private static readonly METEO_SHOWER_MAX_SPAWNS_PER_FRAME = 2;
  private static readonly METEO_SHOWER_SPAWN_X = 10.5;
  private static readonly METEO_SHOWER_SPAWN_Y_HALF_RANGE = 1.2;
  private static readonly COMET_MIN_DELAY = 18;
  private static readonly COMET_DELAY_RANGE = 10;
  private static readonly COMET_SPAWN_X = 9.5;
  private static readonly COMET_SPAWN_Y_HALF_RANGE = 0.3;

  private lastStarSpawnZ = 0;
  private meteoriteTimer = 0;
  private stageElapsedTime = 0;
  private meteoShowerShootingStarTimer = 0;
  private rareShootingStarSpawnTime = Number.POSITIVE_INFINITY;
  private rareShootingStarWindowEnd = Number.NEGATIVE_INFINITY;
  private rareShootingStarSpawned = false;
  private shootingStarStageKey = '';
  private cometTimer = 0;
  private nextCometDelay = SpawnSystem.COMET_MIN_DELAY;
  private spawnAheadDistance = 80;
  private meteoriteIntervalMultiplier = 1;

  // Reusable result buffer to avoid per-frame GC allocations on the hot path.
  // NOTE: The returned object (and its arrays) is owned by this instance and
  // is only valid until the next `update()` call. Callers must consume it
  // synchronously and must not retain references across frames.
  private readonly result: SpawnResult = {
    newStars: [],
    newMeteorites: [],
    newShootingStars: [],
    newComets: [],
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
  private readonly shootingStarPool = new EntityPool<ShootingStar, readonly [number, number, number, -1 | 1]>(
    (x, y, z, direction) => new ShootingStar(x, y, z, direction),
    (shootingStar, x, y, z, direction) => shootingStar.reset(x, y, z, direction),
    (shootingStar) => shootingStar.recycle(),
    (shootingStar) => shootingStar.dispose(),
  );
  private readonly cometPool = new EntityPool<Comet, readonly [number, number, number, -1 | 1]>(
    (x, y, z, direction) => new Comet(x, y, z, direction),
    (comet, x, y, z, direction) => comet.reset(x, y, z, direction),
    (comet) => comet.recycle(),
    (comet) => comet.dispose(),
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
    existingShootingStars: readonly ShootingStar[] = [],
    existingComets: readonly Comet[] = [],
    modifiers: SpawnModifiers = {},
  ): SpawnResult {
    const result = this.result;
    result.newStars.length = 0;
    result.newMeteorites.length = 0;
    result.newShootingStars.length = 0;
    result.newComets.length = 0;
    this.ensureRareShootingStarPlan(config);
    this.stageElapsedTime += deltaTime;

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
      let safe = this.isXySafeAgainstEntities(x, y, z, existingMeteorites, result.newMeteorites);
      for (let attempt = 0; !safe && attempt < SpawnSystem.MAX_REROLL; attempt++) {
        x = (Math.random() - 0.5) * 14;
        y = (Math.random() - 0.5) * 2 * SpawnSystem.STAR_SPAWN_Y_HALF_RANGE;
        safe = this.isXySafeAgainstEntities(x, y, z, existingMeteorites, result.newMeteorites);
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
    const meteoriteInterval = config.meteoriteInterval * this.meteoriteIntervalMultiplier;
    if (this.meteoriteTimer >= meteoriteInterval) {
      this.meteoriteTimer -= meteoriteInterval;
      const z = spaceshipZ - this.spawnAheadDistance - Math.random() * 20;
      let x = (Math.random() - 0.5) * 14;
      let y = (Math.random() - 0.5) * 2 * SpawnSystem.METEORITE_SPAWN_Y_HALF_RANGE;
      let safe = this.isXySafeAgainstEntities(x, y, z, existingStars, result.newStars);
      for (let attempt = 0; !safe && attempt < SpawnSystem.MAX_REROLL; attempt++) {
        x = (Math.random() - 0.5) * 14;
        y = (Math.random() - 0.5) * 2 * SpawnSystem.METEORITE_SPAWN_Y_HALF_RANGE;
        safe = this.isXySafeAgainstEntities(x, y, z, existingStars, result.newStars);
      }
      // If no safe xy was found, skip this meteorite. meteoriteTimer was already
      // reduced by one interval so the next meteorite arrives on the normal cadence.
      if (safe) {
        const met = this.meteoritePool.acquire(x, y, z);
        result.newMeteorites.push(met);
      }
    }

    if (modifiers.meteoShowerActive) {
      this.meteoShowerShootingStarTimer += deltaTime;
      let spawnedMeteoShowerStars = 0;
      while (
        this.meteoShowerShootingStarTimer >= SpawnSystem.METEO_SHOWER_SHOOTING_STAR_INTERVAL &&
        spawnedMeteoShowerStars < SpawnSystem.METEO_SHOWER_MAX_SPAWNS_PER_FRAME
      ) {
        this.meteoShowerShootingStarTimer -= SpawnSystem.METEO_SHOWER_SHOOTING_STAR_INTERVAL;
        result.newShootingStars.push(this.spawnShootingStar(spaceshipZ, true, spawnedMeteoShowerStars));
        spawnedMeteoShowerStars++;
      }
    } else {
      this.meteoShowerShootingStarTimer = 0;
      if (
        this.shouldSpawnRareShootingStar(existingShootingStars, existingComets)
      ) {
        result.newShootingStars.push(this.spawnShootingStar(spaceshipZ, false, 0));
        this.rareShootingStarSpawned = true;
      }
    }

    this.cometTimer += deltaTime;
    if (
      this.cometTimer >= this.nextCometDelay &&
      !this.hasActiveShootingStar(existingShootingStars) &&
      !this.hasActiveComet(existingComets) &&
      result.newShootingStars.length === 0
    ) {
      const direction = Math.random() < 0.5 ? 1 : -1;
      const x = direction === 1 ? -SpawnSystem.COMET_SPAWN_X : SpawnSystem.COMET_SPAWN_X;
      const y = (Math.random() - 0.5) * 2 * SpawnSystem.COMET_SPAWN_Y_HALF_RANGE;
      const z = spaceshipZ - this.spawnAheadDistance - 14 - Math.random() * 18;
      const comet = this.cometPool.acquire(x, y, z, direction);
      result.newComets.push(comet);
      this.cometTimer = 0;
      this.nextCometDelay = SpawnSystem.sampleCometDelay();
    }

    return result;
  }

  private hasActiveShootingStar(existingShootingStars: readonly ShootingStar[]): boolean {
    for (const shootingStar of existingShootingStars) {
      if (!shootingStar.isCollected) {
        return true;
      }
    }
    return false;
  }

  private hasActiveComet(existingComets: readonly Comet[]): boolean {
    for (const comet of existingComets) {
      if (!comet.isCollected) {
        return true;
      }
    }
    return false;
  }

  /**
   * Constitution I (子供ファースト) safety margin check: returns true iff the
   * candidate (x, y, z) is at least {@link SpawnSystem.SAFE_XY_DISTANCE} away
   * in xy from every entity in `existing` (caller's live entities) and
   * `sameFrame` (this frame's freshly spawned entities) within
   * |dz| ≤ {@link SpawnSystem.SAFE_Z_BAND}. Used symmetrically for
   * star↔meteorite separation: stars are checked against meteorites and
   * vice-versa to prevent unavoidable "go grab a star → hit a meteorite right
   * next to it" layouts under left/right-only input (Constitution III).
   *
   * Traversal order invariant: both arrays are maintained in spawn order,
   * which equals z-descending order — spawn z monotonically decreases
   * (lastStarSpawnZ -= starSpacing; meteorites spawn at shipZ-80-jitter as the
   * ship moves forward) and EntityScene's cleanupPassedObjects performs
   * in-place compaction that preserves order. The candidate `z` is always at
   * (or beyond) the head of the spawn frontier, so existing entries have
   * z ≥ z. Traversing from the tail visits the smallest z (closest dz) first;
   * once (p.z - z) > band, all earlier entries have even larger dz and can be
   * skipped. The `dz < -band` branch is retained as a safety net in case the
   * ordering invariant is ever violated by future changes.
   */
  private isXySafeAgainstEntities<T extends { readonly position: { x: number; y: number; z: number } }>(
    x: number,
    y: number,
    z: number,
    existing: readonly T[],
    sameFrame: readonly T[],
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

  acquireStar(x: number, y: number, z: number, starType: 'NORMAL' | 'RAINBOW' = 'NORMAL'): Star {
    return starType === 'RAINBOW'
      ? this.rainbowStarPool.acquire(x, y, z)
      : this.normalStarPool.acquire(x, y, z);
  }

  releaseMeteorite(met: Meteorite): void {
    this.meteoritePool.release(met);
  }

  releaseShootingStar(shootingStar: ShootingStar): void {
    this.shootingStarPool.release(shootingStar);
  }

  releaseComet(comet: Comet): void {
    this.cometPool.release(comet);
  }

  reset(): void {
    this.lastStarSpawnZ = 0;
    this.meteoriteTimer = 0;
    this.stageElapsedTime = 0;
    this.meteoShowerShootingStarTimer = 0;
    this.rareShootingStarSpawnTime = Number.POSITIVE_INFINITY;
    this.rareShootingStarWindowEnd = Number.NEGATIVE_INFINITY;
    this.rareShootingStarSpawned = false;
    this.shootingStarStageKey = '';
    this.cometTimer = 0;
    this.nextCometDelay = SpawnSystem.COMET_MIN_DELAY;
    this.meteoriteIntervalMultiplier = 1;
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
    this.shootingStarPool.releaseAll();
    this.cometPool.releaseAll();
  }

  /** Permanently free all pooled GPU resources. Call from scene teardown. */
  dispose(): void {
    this.normalStarPool.dispose();
    this.rainbowStarPool.dispose();
    this.meteoritePool.dispose();
    this.shootingStarPool.dispose();
    this.cometPool.dispose();
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

  getShootingStarPoolSize(): number {
    return this.shootingStarPool.getPoolSize();
  }

  getCometPoolSize(): number {
    return this.cometPool.getPoolSize();
  }

  setMeteoriteIntervalMultiplier(multiplier: number): void {
    this.meteoriteIntervalMultiplier = Number.isFinite(multiplier) && multiplier >= 1 ? multiplier : 1;
  }

  getMeteoriteIntervalMultiplier(): number {
    return this.meteoriteIntervalMultiplier;
  }

  private static sampleCometDelay(): number {
    return SpawnSystem.COMET_MIN_DELAY + Math.random() * SpawnSystem.COMET_DELAY_RANGE;
  }

  private ensureRareShootingStarPlan(config: StageConfig): void {
    const stageKey = `${config.stageNumber}:${config.stageLength}`;
    if (this.shootingStarStageKey === stageKey) {
      return;
    }

    this.shootingStarStageKey = stageKey;
    this.stageElapsedTime = 0;
    this.rareShootingStarSpawned = false;
    this.rareShootingStarSpawnTime = Number.POSITIVE_INFINITY;
    this.rareShootingStarWindowEnd = Number.NEGATIVE_INFINITY;

    if (Math.random() >= SpawnSystem.SHOOTING_STAR_STAGE_EVENT_CHANCE) {
      return;
    }

    const estimatedStageDuration = config.stageLength / 50;
    const eventStartBuffer = Math.min(
      SpawnSystem.SHOOTING_STAR_EVENT_START_BUFFER,
      Math.max(SpawnSystem.SHOOTING_STAR_MIN_EVENT_BUFFER, estimatedStageDuration / 3),
    );
    const eventEndBuffer = Math.min(
      SpawnSystem.SHOOTING_STAR_EVENT_END_BUFFER,
      Math.max(SpawnSystem.SHOOTING_STAR_MIN_EVENT_BUFFER, estimatedStageDuration / 3),
    );
    const windowStart = eventStartBuffer;
    const windowEnd = Math.max(windowStart, estimatedStageDuration - eventEndBuffer);

    this.rareShootingStarWindowEnd = windowEnd;
    this.rareShootingStarSpawnTime = windowStart + Math.random() * Math.max(0, windowEnd - windowStart);
  }

  private shouldSpawnRareShootingStar(
    existingShootingStars: readonly ShootingStar[],
    existingComets: readonly Comet[],
  ): boolean {
    if (this.rareShootingStarSpawned) {
      return false;
    }
    if (!Number.isFinite(this.rareShootingStarSpawnTime)) {
      return false;
    }
    if (this.stageElapsedTime < this.rareShootingStarSpawnTime) {
      return false;
    }
    if (this.stageElapsedTime > this.rareShootingStarWindowEnd) {
      this.rareShootingStarSpawned = true;
      return false;
    }
    if (this.hasActiveShootingStar(existingShootingStars) || this.hasActiveComet(existingComets)) {
      return false;
    }
    return true;
  }

  private spawnShootingStar(spaceshipZ: number, meteoShowerActive: boolean, index: number): ShootingStar {
    const direction = meteoShowerActive
      ? ((index + Math.round(Math.random())) % 2 === 0 ? 1 : -1)
      : -1;
    const spawnX = meteoShowerActive ? SpawnSystem.METEO_SHOWER_SPAWN_X : SpawnSystem.SHOOTING_STAR_SPAWN_X;
    const xJitter = meteoShowerActive ? Math.random() * 1.8 : 0;
    const zJitter = meteoShowerActive ? Math.random() * 8 + index * 1.8 : Math.random() * 12;
    const x = direction === 1 ? -(spawnX + xJitter) : spawnX + xJitter;
    const y = meteoShowerActive
      ? (Math.random() - 0.5) * 2 * SpawnSystem.METEO_SHOWER_SPAWN_Y_HALF_RANGE
      : SpawnSystem.SHOOTING_STAR_SPAWN_Y_MIN + Math.random() * SpawnSystem.SHOOTING_STAR_SPAWN_Y_RANGE;
    const z = spaceshipZ - this.spawnAheadDistance - 8 - zJitter;
    return this.shootingStarPool.acquire(x, y, z, direction);
  }
}
