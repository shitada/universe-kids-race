import { describe, it, expect } from 'vitest';
import { ScoreSystem } from '../../../src/game/systems/ScoreSystem';

describe('ScoreSystem', () => {
  it('starts with zero score and star count', () => {
    const system = new ScoreSystem();
    expect(system.getStageScore()).toBe(0);
    expect(system.getStarCount()).toBe(0);
  });

  it('adds 100 for NORMAL star', () => {
    const system = new ScoreSystem();
    system.addStarScore('NORMAL');
    expect(system.getStageScore()).toBe(100);
    expect(system.getStarCount()).toBe(1);
  });

  it('adds 500 for RAINBOW star', () => {
    const system = new ScoreSystem();
    system.addStarScore('RAINBOW');
    expect(system.getStageScore()).toBe(500);
    expect(system.getStarCount()).toBe(1);
  });

  it('accumulates multiple stars', () => {
    const system = new ScoreSystem();
    system.addStarScore('NORMAL');
    system.addStarScore('NORMAL');
    system.addStarScore('RAINBOW');
    expect(system.getStageScore()).toBe(700);
    expect(system.getStarCount()).toBe(3);
  });

  it('doubles star score while shooting star bonus is active', () => {
    const system = new ScoreSystem();

    system.activateShootingStarBonus(6);
    system.addStarScore('NORMAL');
    system.addStarScore('RAINBOW');

    expect(system.getScoreMultiplier()).toBe(2);
    expect(system.getStageScore()).toBe(1200);
    expect(system.getStarCount()).toBe(2);
  });

  it('returns to normal score after the shooting star bonus expires', () => {
    const system = new ScoreSystem();

    system.activateShootingStarBonus(0.5);
    system.update(0.5);
    system.addStarScore('NORMAL');

    expect(system.getScoreMultiplier()).toBe(1);
    expect(system.getStageScore()).toBe(100);
  });

  it('adds bonus score without increasing the collected star count', () => {
    const system = new ScoreSystem();

    system.addBonusScore(1500);

    expect(system.getStageScore()).toBe(1500);
    expect(system.getStarCount()).toBe(0);
  });

  it('returns a stage stats snapshot for analytics', () => {
    const system = new ScoreSystem();
    system.addStarScore('NORMAL');
    system.addBonusScore(400);

    expect(system.getStageStats()).toEqual({
      stageScore: 500,
      collectedStars: 1,
    });
  });

  it('finalizeStage adds stageScore to totalScore and resets stage', () => {
    const system = new ScoreSystem();
    system.addStarScore('NORMAL');
    system.addStarScore('RAINBOW');
    const result = system.finalizeStage();
    expect(result.stageScore).toBe(600);
    expect(result.totalScore).toBe(600);
    expect(result.totalStarCount).toBe(2);
    expect(system.getStageScore()).toBe(0);
    expect(system.getStarCount()).toBe(0);
  });

  it('accumulates totalScore across stages', () => {
    const system = new ScoreSystem();
    system.addStarScore('NORMAL');
    system.finalizeStage();
    system.addStarScore('RAINBOW');
    const result = system.finalizeStage();
    expect(result.totalScore).toBe(600);
    expect(result.totalStarCount).toBe(2);
  });

  it('reset clears everything', () => {
    const system = new ScoreSystem();
    system.addStarScore('NORMAL');
    system.finalizeStage();
    system.reset();
    expect(system.getStageScore()).toBe(0);
    expect(system.getTotalScore()).toBe(0);
    expect(system.getScoreMultiplier()).toBe(1);
  });
});
