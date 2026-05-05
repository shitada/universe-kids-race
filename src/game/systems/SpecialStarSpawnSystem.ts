import type { SpecialShootingStarType } from '../../types';
import { SPECIAL_STAR_SPAWN_CONFIG, pickSpecialShootingStarType, type SpecialStarSpawnConfig } from '../config/SpecialStarConfig';
import { SpecialShootingStar } from '../entities/SpecialShootingStar';
import type { ShootingStar } from '../entities/ShootingStar';
import type { Comet } from '../entities/Comet';
import { EntityPool } from '../utils/EntityPool';

export interface SpecialStarSpawnResult {
  newSpecialStars: SpecialShootingStar[];
}

export class SpecialStarSpawnSystem {
  private readonly config: SpecialStarSpawnConfig;
  private readonly random: () => number;
  private elapsed = 0;
  private attemptTimer = 0;
  private readonly result: SpecialStarSpawnResult = {
    newSpecialStars: [],
  };
  private readonly specialStarPool = new EntityPool<
    SpecialShootingStar,
    readonly [number, number, number, SpecialShootingStarType, -1 | 1]
  >(
    (x, y, z, specialType, direction) => new SpecialShootingStar(x, y, z, specialType, direction),
    (specialStar, x, y, z, specialType, direction) => specialStar.reset(x, y, z, specialType, direction),
    (specialStar) => specialStar.recycle(),
    (specialStar) => specialStar.dispose(),
  );

  constructor(config: Partial<SpecialStarSpawnConfig> = {}, random: () => number = Math.random) {
    this.config = { ...SPECIAL_STAR_SPAWN_CONFIG, ...config };
    this.random = random;
  }

  update(
    deltaTime: number,
    spaceshipZ: number,
    existingSpecialStars: readonly SpecialShootingStar[] = [],
    existingShootingStars: readonly ShootingStar[] = [],
    existingComets: readonly Comet[] = [],
  ): SpecialStarSpawnResult {
    const result = this.result;
    result.newSpecialStars.length = 0;
    this.elapsed += deltaTime;
    this.attemptTimer += deltaTime;

    if (this.hasActiveSpecialStar(existingSpecialStars) || this.hasActiveSkyEvent(existingShootingStars, existingComets)) {
      return result;
    }

    while (this.attemptTimer >= this.config.attemptInterval) {
      this.attemptTimer -= this.config.attemptInterval;
      if (this.elapsed < this.config.introGraceSeconds) {
        continue;
      }
      if (this.random() >= this.config.spawnChance) {
        continue;
      }

      const specialType = pickSpecialShootingStarType(this.random());
      const direction = this.random() < 0.5 ? 1 : -1;
      const x = direction === 1
        ? -(this.config.spawnX + this.random() * this.config.spawnXJitter)
        : this.config.spawnX + this.random() * this.config.spawnXJitter;
      const y = this.config.spawnYMin + this.random() * this.config.spawnYRange;
      const z = spaceshipZ - this.config.spawnAheadDistance - this.random() * this.config.spawnZJitter;
      result.newSpecialStars.push(this.specialStarPool.acquire(x, y, z, specialType, direction));
      break;
    }

    return result;
  }

  releaseSpecialStar(specialStar: SpecialShootingStar): void {
    this.specialStarPool.release(specialStar);
  }

  reset(): void {
    this.elapsed = 0;
    this.attemptTimer = 0;
  }

  recycleAll(): void {
    this.specialStarPool.releaseAll();
  }

  dispose(): void {
    this.specialStarPool.dispose();
  }

  private hasActiveSpecialStar(existingSpecialStars: readonly SpecialShootingStar[]): boolean {
    for (const specialStar of existingSpecialStars) {
      if (!specialStar.isCollected) {
        return true;
      }
    }
    return false;
  }

  private hasActiveSkyEvent(existingShootingStars: readonly ShootingStar[], existingComets: readonly Comet[]): boolean {
    for (const shootingStar of existingShootingStars) {
      if (!shootingStar.isCollected) {
        return true;
      }
    }
    for (const comet of existingComets) {
      if (!comet.isCollected) {
        return true;
      }
    }
    return false;
  }
}
