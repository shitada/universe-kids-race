import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { BonusCollectionSystem } from '../../../src/game/systems/BonusCollectionSystem';
import type { BonusStarState } from '../../../src/types';

function createBonusStar(x: number, y = 0, z = 0): BonusStarState {
  return {
    mesh: new THREE.Mesh(),
    position: new THREE.Vector3(x, y, z),
    velocityY: 0,
    driftPhase: 0,
    rotationSpeed: 0,
    isCollected: false,
  };
}

describe('BonusCollectionSystem', () => {
  it('近くのボーナススターを1回だけ回収して合計数を増やす', () => {
    const system = new BonusCollectionSystem();
    const stars = [createBonusStar(0.5), createBonusStar(4)];

    const result = system.collect(new THREE.Vector3(0, 0, 0), stars);

    expect(result.collectedStars).toHaveLength(1);
    expect(result.collectedStars[0]).toBe(stars[0]);
    expect(stars[0].isCollected).toBe(true);
    expect(stars[1].isCollected).toBe(false);
    expect(result.totalCollected).toBe(1);
    expect(system.getCollectedCount()).toBe(1);
  });

  it('すでに回収済みや遠くのスターは数えず、resetで合計を戻す', () => {
    const system = new BonusCollectionSystem();
    const stars = [createBonusStar(0.4), createBonusStar(3.2), createBonusStar(0.3)];
    stars[2].isCollected = true;

    const result = system.collect(new THREE.Vector3(0, 0, 0), stars, 1.2);

    expect(result.collectedStars).toEqual([stars[0]]);
    expect(result.totalCollected).toBe(1);
    expect(system.getCollectedCount()).toBe(1);

    system.reset();

    expect(system.getCollectedCount()).toBe(0);
  });
});
