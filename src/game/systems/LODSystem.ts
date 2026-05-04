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

  private static readonly NEAR_DISTANCE_SQUARED = LODSystem.NEAR_DISTANCE * LODSystem.NEAR_DISTANCE;
  private static readonly MID_DISTANCE_SQUARED = LODSystem.MID_DISTANCE * LODSystem.MID_DISTANCE;

  update(reference: { x: number; y: number; z: number }, targets: readonly LODTarget[]): void {
    const refX = reference.x;
    const refY = reference.y;
    const refZ = reference.z;

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const dx = target.position.x - refX;
      const dy = target.position.y - refY;
      const dz = target.position.z - refZ;
      target.applyLOD(LODSystem.resolveLevelFromDistanceSquared(dx * dx + dy * dy + dz * dz));
    }
  }

  static resolveLevel(distance: number): LODLevel {
    return LODSystem.resolveLevelFromDistanceSquared(distance * distance);
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
}

export type StageLODTarget = Star | Meteorite;
