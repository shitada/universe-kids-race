import type { ConstellationDefinition, ConstellationPoint } from '../../types';
import type { Star } from '../entities/Star';

export interface ConstellationLineSegment {
  from: ConstellationPoint;
  to: ConstellationPoint;
}

export interface ConstellationCollectionResult {
  advanced: boolean;
  completed: boolean;
  lineSegment: ConstellationLineSegment | null;
}

const EMPTY_RESULT: ConstellationCollectionResult = {
  advanced: false,
  completed: false,
  lineSegment: null,
};

export class ConstellationSystem {
  private definition: ConstellationDefinition | null = null;
  private collectedPoints: ConstellationPoint[] = [];

  reset(definition?: ConstellationDefinition): void {
    this.definition = definition ?? null;
    this.collectedPoints.length = 0;
  }

  registerCollectedStar(star: Star): ConstellationCollectionResult {
    const definition = this.definition;
    if (!definition || star.constellationId !== definition.id || star.constellationStageNumber !== definition.stageNumber) {
      return EMPTY_RESULT;
    }
    if (star.constellationOrder === null || star.constellationOrder !== this.collectedPoints.length) {
      return EMPTY_RESULT;
    }

    const point = {
      x: star.position.x,
      y: star.position.y,
      z: star.position.z,
    };
    const previousPoint = this.collectedPoints[this.collectedPoints.length - 1] ?? null;
    this.collectedPoints.push(point);

    return {
      advanced: true,
      completed: this.collectedPoints.length === definition.points.length,
      lineSegment: previousPoint ? { from: previousPoint, to: point } : null,
    };
  }

  getDefinition(): ConstellationDefinition | null {
    return this.definition;
  }

  getCollectedCount(): number {
    return this.collectedPoints.length;
  }

  isCompleted(): boolean {
    return this.definition !== null && this.collectedPoints.length === this.definition.points.length;
  }
}
