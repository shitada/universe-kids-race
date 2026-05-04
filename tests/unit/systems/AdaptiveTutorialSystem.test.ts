import { describe, expect, it } from 'vitest';
import { AdaptiveTutorialSystem } from '../../../src/game/systems/AdaptiveTutorialSystem';

describe('AdaptiveTutorialSystem', () => {
  it('shows a meteorite hint after 3 seconds of not moving near danger', () => {
    const system = new AdaptiveTutorialSystem();

    const result = system.update({
      deltaTime: 3,
      moveDirection: 0,
      shipX: 0,
      shipZ: 0,
      boostAvailable: true,
      boostActive: false,
      meteorites: [{ isActive: true, position: { x: 0.4, z: -140 } }],
    });

    expect(result).toEqual({
      type: 'meteorite',
      message: 'ひだりみぎで よけよう！',
    });
  });

  it('does not show a meteorite hint while the player is already moving', () => {
    const system = new AdaptiveTutorialSystem();

    const result = system.update({
      deltaTime: 3.2,
      moveDirection: -1,
      shipX: 0,
      shipZ: 0,
      boostAvailable: true,
      boostActive: false,
      meteorites: [{ isActive: true, position: { x: 0.4, z: -140 } }],
    });

    expect(result).toBeNull();
  });

  it('shows a star hint after 5 missed stars', () => {
    const system = new AdaptiveTutorialSystem();
    system.recordMissedStars(5);

    const result = system.update({
      deltaTime: 0.1,
      moveDirection: 0,
      shipX: 0,
      shipZ: 0,
      boostAvailable: false,
      boostActive: false,
      meteorites: [],
    });

    expect(result).toEqual({
      type: 'stars',
      message: 'きらきら あつめよう⭐',
    });
  });

  it('shows a boost hint after 30 seconds of unused readiness', () => {
    const system = new AdaptiveTutorialSystem();

    const result = system.update({
      deltaTime: 30,
      moveDirection: 0,
      shipX: 0,
      shipZ: 0,
      boostAvailable: true,
      boostActive: false,
      meteorites: [],
    });

    expect(result).toEqual({
      type: 'boost',
      message: 'ブーストを つかってみよう！',
    });
  });

  it('limits each hint type to 3 times per stage', () => {
    const system = new AdaptiveTutorialSystem();
    const meteorFrame = {
      deltaTime: 3,
      moveDirection: 0 as const,
      shipX: 0,
      shipZ: 0,
      boostAvailable: false,
      boostActive: false,
      meteorites: [{ isActive: true, position: { x: 0.2, z: -140 } }],
    };
    const calmFrame = {
      ...meteorFrame,
      deltaTime: 8,
      meteorites: [],
    };

    expect(system.update(meteorFrame)?.type).toBe('meteorite');
    system.update(calmFrame);
    expect(system.update(meteorFrame)?.type).toBe('meteorite');
    system.update(calmFrame);
    expect(system.update(meteorFrame)?.type).toBe('meteorite');
    system.update(calmFrame);
    expect(system.update(meteorFrame)).toBeNull();
    expect(system.getHintCount('meteorite')).toBe(3);
  });
});
