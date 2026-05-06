import { describe, it, expect, vi } from 'vitest';
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

  it('adds 1000 for LOVELY star', () => {
    const system = new ScoreSystem();
    system.addStarScore('LOVELY');
    expect(system.getStageScore()).toBe(1000);
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

  it('applies the space weather star bonus while it is active', () => {
    const system = new ScoreSystem();

    system.setEventStarMultiplier(2);
    system.addStarScore('NORMAL');

    expect(system.getScoreMultiplier()).toBe(2);
    expect(system.getStageScore()).toBe(200);
    expect(system.getStarCount()).toBe(1);
  });

  it('stacks the space weather bonus with the shooting star bonus', () => {
    const system = new ScoreSystem();

    system.setEventStarMultiplier(2);
    system.activateShootingStarBonus(6);
    system.addStarScore('RAINBOW');

    expect(system.getScoreMultiplier()).toBe(4);
    expect(system.getStageScore()).toBe(2000);
    expect(system.getStarCount()).toBe(1);
  });

  it('clears the space weather bonus when resetStage is called', () => {
    const system = new ScoreSystem();

    system.setEventStarMultiplier(2);
    system.resetStage();
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

  it('notifies score gain listener with world position for collected stars', () => {
    const listener = vi.fn();
    const system = new ScoreSystem(listener);
    const worldPosition = { x: 1, y: 2, z: 3 };

    system.addStarScore('RAINBOW', worldPosition);

    expect(listener).toHaveBeenCalledWith({
      amount: 500,
      kind: 'star',
      stageScore: 500,
      starCount: 1,
      starType: 'RAINBOW',
      worldPosition,
    });
  });

  it('notifies score gain listener for bonus score events', () => {
    const listener = vi.fn();
    const system = new ScoreSystem(listener);
    const worldPosition = { x: -1, y: 4, z: -8 };

    system.addBonusScore(450, worldPosition);

    expect(listener).toHaveBeenCalledWith({
      amount: 450,
      kind: 'bonus',
      stageScore: 450,
      starCount: 0,
      worldPosition,
    });
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
