import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { FreePlayEffectSystem } from '../../../src/game/systems/FreePlayEffectSystem';

describe('FreePlayEffectSystem', () => {
  it('ランダム間隔の経過後に流星群・宇宙天候・にじ演出を開始する', () => {
    const randomValues = [0, 0.4, 0.2, 0.1, 0, 0.4];
    const system = new FreePlayEffectSystem({
      randomProvider: () => randomValues.shift() ?? 0,
    });
    const scene = new THREE.Scene();
    system.init(scene);

    const state = system.update(18, { x: 0, y: 0, z: 0 });

    expect(state.meteorShowerActive).toBe(true);
    expect(state.activeWeatherId).toBe('aurora-storm');
    expect(state.rainbowTrailActive).toBe(true);
  });

  it('現在の背景ステージに合わせた特別演出をランダム開始する', () => {
    const randomValues = [0.3, 0.2, 0, 0, 0.9];
    const system = new FreePlayEffectSystem({
      randomProvider: () => randomValues.shift() ?? 0,
    });
    const scene = new THREE.Scene();
    system.init(scene);
    system.setCurrentStage(7);

    const state = system.update(18, { x: 1, y: 0, z: -10 });

    expect(state.activeSpecialEventId).toBe('uranus-aurora');
  });

  it('clear で全演出を停止する', () => {
    const randomValues = [0, 0, 0, 0, 0];
    const system = new FreePlayEffectSystem({
      randomProvider: () => randomValues.shift() ?? 0,
    });
    const scene = new THREE.Scene();
    system.init(scene);

    system.update(18, { x: 0, y: 0, z: 0 });
    system.clear();

    expect(system.getState()).toEqual({
      meteorShowerActive: false,
      activeWeatherId: null,
      activeSpecialEventId: null,
      rainbowTrailActive: false,
    });
  });
});
