import type { Meteorite } from '../entities/Meteorite';
import type { Star } from '../entities/Star';

export type LODLevel = 'near' | 'mid' | 'far';

export interface LODTarget {
  position: { x: number; y: number; z: number };
  applyLOD(level: LODLevel): void;
}

export class LODSystem {
  static readonly NEAR_DISTANCE = 25;
  static readonly MID_DISTANCE = 50;
  private static readonly DISTANCE_SCALE_BY_TIER = [0.65, 0.82, 1];

  private static readonly NEAR_DISTANCE_SQUARED = LODSystem.NEAR_DISTANCE * LODSystem.NEAR_DISTANCE;
  private static readonly MID_DISTANCE_SQUARED = LODSystem.MID_DISTANCE * LODSystem.MID_DISTANCE;
  private distanceScale = 1;

  update(reference: { x: number; y: number; z: number }, targets: readonly LODTarget[]): void {
    const refX = reference.x;
    const refY = reference.y;
    const refZ = reference.z;

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const dx = target.position.x - refX;
      const dy = target.position.y - refY;
      const dz = target.position.z - refZ;
      target.applyLOD(this.resolveLevelFromDistanceSquared(dx * dx + dy * dy + dz * dz));
    }
  }

  setQualityTier(tier: number): void {
    this.distanceScale = LODSystem.getDistanceScale(tier);
  }

  static resolveLevel(distance: number): LODLevel {
    return LODSystem.resolveLevelFromDistanceSquared(distance * distance);
  }

  private resolveLevelFromDistanceSquared(distanceSquared: number): LODLevel {
    const distanceScaleSquared = this.distanceScale * this.distanceScale;
    if (distanceSquared < LODSystem.NEAR_DISTANCE_SQUARED * distanceScaleSquared) {
      return 'near';
    }
    if (distanceSquared < LODSystem.MID_DISTANCE_SQUARED * distanceScaleSquared) {
      return 'mid';
    }
    return 'far';
  }

  private static resolveLevelFromDistanceSquared(distanceSquared: number): LODLevel {
    if (distanceSquared < LODSystem.NEAR_DISTANCE_SQUARED) {
      return 'near';
    }
    if (distanceSquared < LODSystem.MID_DISTANCE_SQUARED) {
      return 'mid';
    }
    return 'far';
  }

  private static getDistanceScale(tier: number): number {
    const clampedTier = Math.max(0, Math.min(LODSystem.DISTANCE_SCALE_BY_TIER.length - 1, Math.round(tier)));
    return LODSystem.DISTANCE_SCALE_BY_TIER[clampedTier];
  }
}

export type StageLODTarget = Star | Meteorite;
