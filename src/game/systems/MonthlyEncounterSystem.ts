import type { MonthlyEncounterId } from '../../types';
import { getMonthlyEncounterForMonth } from '../config/MonthlyEncounterConfig';
import type { Comet } from '../entities/Comet';
import { MonthlyEncounterEntity } from '../entities/MonthlyEncounterEntity';
import type { ShootingStar } from '../entities/ShootingStar';
import type { SpecialShootingStar } from '../entities/SpecialShootingStar';
import { EntityPool } from '../utils/EntityPool';

export interface MonthlyEncounterSpawnConfig {
  attemptInterval: number;
  spawnChance: number;
  introGraceSeconds: number;
  spawnAheadDistance: number;
  spawnZJitter: number;
  spawnYMin: number;
  spawnYRange: number;
  spawnX: number;
  spawnXJitter: number;
}

export interface MonthlyEncounterSpawnResult {
  newMonthlyEncounters: MonthlyEncounterEntity[];
}

export const MONTHLY_ENCOUNTER_SPAWN_CONFIG: MonthlyEncounterSpawnConfig = {
  attemptInterval: 1,
  spawnChance: 0.05,
  introGraceSeconds: 5,
  spawnAheadDistance: 88,
  spawnZJitter: 10,
  spawnYMin: -0.6,
  spawnYRange: 2.4,
  spawnX: 7.5,
  spawnXJitter: 1.2,
};

export class MonthlyEncounterSystem {
  private readonly config: MonthlyEncounterSpawnConfig;
  private readonly random: () => number;
  private readonly dateProvider: () => Date;
  private elapsed = 0;
  private attemptTimer = 0;
  private readonly result: MonthlyEncounterSpawnResult = {
    newMonthlyEncounters: [],
  };
  private readonly encounterPool = new EntityPool<
    MonthlyEncounterEntity,
    readonly [number, number, number, MonthlyEncounterId, -1 | 1]
  >(
    (x, y, z, encounterId, direction) => new MonthlyEncounterEntity(x, y, z, encounterId, direction),
    (entity, x, y, z, encounterId, direction) => entity.reset(x, y, z, encounterId, direction),
    (entity) => entity.recycle(),
    (entity) => entity.dispose(),
  );

  constructor(
    config: Partial<MonthlyEncounterSpawnConfig> = {},
    random: () => number = Math.random,
    dateProvider: () => Date = () => new Date(),
  ) {
    this.config = { ...MONTHLY_ENCOUNTER_SPAWN_CONFIG, ...config };
    this.random = random;
    this.dateProvider = dateProvider;
  }

  update(
    deltaTime: number,
    spaceshipZ: number,
    existingMonthlyEncounters: readonly MonthlyEncounterEntity[] = [],
    existingSpecialStars: readonly SpecialShootingStar[] = [],
    existingShootingStars: readonly ShootingStar[] = [],
    existingComets: readonly Comet[] = [],
  ): MonthlyEncounterSpawnResult {
    const result = this.result;
    result.newMonthlyEncounters.length = 0;
    this.elapsed += deltaTime;
    this.attemptTimer += deltaTime;

    if (
      this.hasActiveMonthlyEncounter(existingMonthlyEncounters) ||
      this.hasActiveRareSkyEvent(existingSpecialStars, existingShootingStars, existingComets)
    ) {
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
      const monthEntry = getMonthlyEncounterForMonth(this.dateProvider().getMonth() + 1);
      if (!monthEntry) {
        continue;
      }
      const direction = this.random() < 0.5 ? 1 : -1;
      const x = direction === 1
        ? -(this.config.spawnX + this.random() * this.config.spawnXJitter)
        : this.config.spawnX + this.random() * this.config.spawnXJitter;
      const y = this.config.spawnYMin + this.random() * this.config.spawnYRange;
      const z = spaceshipZ - this.config.spawnAheadDistance - this.random() * this.config.spawnZJitter;
      result.newMonthlyEncounters.push(this.encounterPool.acquire(x, y, z, monthEntry.id, direction));
      break;
    }

    return result;
  }

  releaseMonthlyEncounter(entity: MonthlyEncounterEntity): void {
    this.encounterPool.release(entity);
  }

  reset(): void {
    this.elapsed = 0;
    this.attemptTimer = 0;
  }

  recycleAll(): void {
    this.encounterPool.releaseAll();
  }

  dispose(): void {
    this.encounterPool.dispose();
  }

  private hasActiveMonthlyEncounter(existingMonthlyEncounters: readonly MonthlyEncounterEntity[]): boolean {
    for (const encounter of existingMonthlyEncounters) {
      if (!encounter.isCollected) {
        return true;
      }
    }
    return false;
  }

  private hasActiveRareSkyEvent(
    existingSpecialStars: readonly SpecialShootingStar[],
    existingShootingStars: readonly ShootingStar[],
    existingComets: readonly Comet[],
  ): boolean {
    for (const specialStar of existingSpecialStars) {
      if (!specialStar.isCollected) {
        return true;
      }
    }
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
