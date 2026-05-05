import { describe, expect, it } from 'vitest';
import { ConstellationSystem } from '../../../src/game/systems/ConstellationSystem';
import { getConstellationForStage } from '../../../src/game/config/ConstellationData';
import { Star } from '../../../src/game/entities/Star';

function createConstellationStar(stageNumber: number, order: number): Star {
  const definition = getConstellationForStage(stageNumber);
  if (!definition) {
    throw new Error(`Missing constellation for stage ${stageNumber}`);
  }
  const point = definition.points[order];
  const star = new Star(point.x, point.y, point.z, 'RAINBOW');
  star.setConstellationMarker(definition.id, stageNumber, order);
  return star;
}

describe('ConstellationSystem', () => {
  it('advances in order and completes after the final constellation star', () => {
    const system = new ConstellationSystem();
    const definition = getConstellationForStage(1);
    if (!definition) {
      throw new Error('Missing stage 1 constellation data');
    }

    system.reset(definition);

    const first = system.registerCollectedStar(createConstellationStar(1, 0));
    expect(first.advanced).toBe(true);
    expect(first.lineSegment).toBeNull();
    expect(first.completed).toBe(false);
    expect(system.getNextPoint()).toEqual(definition.points[1]);
    expect(system.getRemainingCount()).toBe(definition.points.length - 1);

    const second = system.registerCollectedStar(createConstellationStar(1, 1));
    expect(second.advanced).toBe(true);
    expect(second.lineSegment).toEqual({
      from: definition.points[0],
      to: definition.points[1],
    });
    expect(second.completed).toBe(false);

    system.registerCollectedStar(createConstellationStar(1, 2));
    const final = system.registerCollectedStar(createConstellationStar(1, 3));
    expect(final.completed).toBe(true);
    expect(system.isCompleted()).toBe(true);
    expect(system.getNextPoint()).toBeNull();
    expect(system.getRemainingCount()).toBe(0);
  });

  it('ignores stars from another stage or non-constellation stars', () => {
    const system = new ConstellationSystem();
    const definition = getConstellationForStage(1);
    if (!definition) {
      throw new Error('Missing stage 1 constellation data');
    }

    system.reset(definition);

    const plainStar = new Star(0, 0, 0);
    expect(system.registerCollectedStar(plainStar).advanced).toBe(false);

    const foreignStar = createConstellationStar(4, 0);
    expect(system.registerCollectedStar(foreignStar).advanced).toBe(false);
    expect(system.getCollectedCount()).toBe(0);
  });

  it('requires the expected order before drawing the next line', () => {
    const system = new ConstellationSystem();
    const definition = getConstellationForStage(1);
    if (!definition) {
      throw new Error('Missing stage 1 constellation data');
    }

    system.reset(definition);

    const skipped = system.registerCollectedStar(createConstellationStar(1, 1));
    expect(skipped.advanced).toBe(false);
    expect(skipped.lineSegment).toBeNull();

    const first = system.registerCollectedStar(createConstellationStar(1, 0));
    expect(first.advanced).toBe(true);
    expect(system.getCollectedCount()).toBe(1);
    expect(system.getNextPoint()).toEqual(definition.points[1]);
  });
});
