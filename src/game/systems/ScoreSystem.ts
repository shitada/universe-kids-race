import type { StarType } from '../../types';

export class ScoreSystem {
  private stageScore = 0;
  private totalScore = 0;
  private starCount = 0;
  private totalStarCount = 0;

  addStarScore(starType: StarType): void {
    const value = starType === 'RAINBOW' ? 500 : 100;
    this.stageScore += value;
    this.starCount++;
  }

  getStageScore(): number {
    return this.stageScore;
  }

  getStarCount(): number {
    return this.starCount;
  }

  getTotalScore(): number {
    return this.totalScore;
  }

  getTotalStarCount(): number {
    return this.totalStarCount;
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
  }

  reset(): void {
    this.stageScore = 0;
    this.totalScore = 0;
    this.starCount = 0;
    this.totalStarCount = 0;
  }
}
