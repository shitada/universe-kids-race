import type { StarType } from '../../types';

type WorldPosition = Readonly<{ x: number; y: number; z: number }>;

export interface ScoreGainEvent {
  amount: number;
  kind: 'star' | 'bonus';
  stageScore: number;
  starCount: number;
  worldPosition?: WorldPosition;
  starType?: StarType;
}

export class ScoreSystem {
  private stageScore = 0;
  private totalScore = 0;
  private starCount = 0;
  private totalStarCount = 0;
  private shootingStarMultiplier = 1;
  private shootingStarMultiplierTimer = 0;
  private eventStarMultiplier = 1;
  private onScoreGain: ((event: ScoreGainEvent) => void) | null;

  constructor(onScoreGain?: (event: ScoreGainEvent) => void) {
    this.onScoreGain = onScoreGain ?? null;
  }

  setScoreGainListener(listener: ((event: ScoreGainEvent) => void) | null): void {
    this.onScoreGain = listener;
  }

  addStarScore(starType: StarType, worldPosition?: WorldPosition): void {
    const value = starType === 'RAINBOW'
      ? 500
      : starType === 'LOVELY'
        ? 1000
        : 100;
    const amount = value * this.getScoreMultiplier();
    this.stageScore += amount;
    this.starCount++;
    this.onScoreGain?.({
      amount,
      kind: 'star',
      stageScore: this.stageScore,
      starCount: this.starCount,
      starType,
      worldPosition,
    });
  }

  activateShootingStarBonus(duration: number): void {
    if (!Number.isFinite(duration) || duration <= 0) {
      return;
    }
    this.shootingStarMultiplier = 2;
    this.shootingStarMultiplierTimer = Math.max(this.shootingStarMultiplierTimer, duration);
  }

  setEventStarMultiplier(multiplier: number): void {
    if (!Number.isFinite(multiplier) || multiplier < 1) {
      this.eventStarMultiplier = 1;
      return;
    }
    this.eventStarMultiplier = multiplier;
  }

  addBonusScore(value: number, worldPosition?: WorldPosition): void {
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }
    const amount = Math.round(value);
    this.stageScore += amount;
    this.onScoreGain?.({
      amount,
      kind: 'bonus',
      stageScore: this.stageScore,
      starCount: this.starCount,
      worldPosition,
    });
  }

  update(deltaTime: number): void {
    if (this.shootingStarMultiplierTimer <= 0) {
      return;
    }
    this.shootingStarMultiplierTimer = Math.max(0, this.shootingStarMultiplierTimer - deltaTime);
    if (this.shootingStarMultiplierTimer === 0) {
      this.shootingStarMultiplier = 1;
    }
  }

  getStageScore(): number {
    return this.stageScore;
  }

  getStarCount(): number {
    return this.starCount;
  }

  getStageStats(): { stageScore: number; collectedStars: number } {
    return {
      stageScore: this.stageScore,
      collectedStars: this.starCount,
    };
  }

  getTotalScore(): number {
    return this.totalScore;
  }

  getTotalStarCount(): number {
    return this.totalStarCount;
  }

  getScoreMultiplier(): number {
    return this.shootingStarMultiplier * this.eventStarMultiplier;
  }

  setTotalScore(score: number): void {
    this.totalScore = score;
  }

  setTotalStarCount(count: number): void {
    this.totalStarCount = count;
  }

  finalizeStage(): { stageScore: number; totalScore: number; totalStarCount: number } {
    this.totalScore += this.stageScore;
    this.totalStarCount += this.starCount;
    const result = {
      stageScore: this.stageScore,
      totalScore: this.totalScore,
      totalStarCount: this.totalStarCount,
    };
    this.stageScore = 0;
    this.starCount = 0;
    return result;
  }

  resetStage(): void {
    this.stageScore = 0;
    this.starCount = 0;
    this.shootingStarMultiplier = 1;
    this.shootingStarMultiplierTimer = 0;
    this.eventStarMultiplier = 1;
  }

  reset(): void {
    this.stageScore = 0;
    this.totalScore = 0;
    this.starCount = 0;
    this.totalStarCount = 0;
    this.shootingStarMultiplier = 1;
    this.shootingStarMultiplierTimer = 0;
    this.eventStarMultiplier = 1;
  }
}
