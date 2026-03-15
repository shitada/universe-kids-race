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
  });
});
