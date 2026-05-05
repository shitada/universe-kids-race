import * as THREE from 'three';
import type { BonusStarState } from '../../types';

export interface BonusCollectionResult {
  collectedStars: BonusStarState[];
  totalCollected: number;
}

export class BonusCollectionSystem {
  private collectedCount = 0;

  collect(
    playerPosition: THREE.Vector3,
    stars: readonly BonusStarState[],
    collisionRadius = 1.45,
  ): BonusCollectionResult {
    const collectedStars: BonusStarState[] = [];
    const radiusSq = collisionRadius * collisionRadius;

    for (const star of stars) {
      if (star.isCollected) {
        continue;
      }

      if (playerPosition.distanceToSquared(star.position) > radiusSq) {
        continue;
      }

      star.isCollected = true;
      collectedStars.push(star);
    }

    this.collectedCount += collectedStars.length;

    return {
      collectedStars,
      totalCollected: this.collectedCount,
    };
  }

  getCollectedCount(): number {
    return this.collectedCount;
  }

  reset(): void {
    this.collectedCount = 0;
  }
}
