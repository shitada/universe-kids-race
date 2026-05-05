import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { StageSpecialEffects } from '../../../src/game/effects/StageSpecialEffects';
import type { StageSpecialEventConfig } from '../../../src/types';

function createConfig(overrides: Partial<StageSpecialEventConfig> = {}): StageSpecialEventConfig {
  return {
    stageNumber: 1,
    id: 'moon-rabbit',
    style: 'rabbit',
    startProgress: 0.25,
    duration: 3,
    message: 'つきの うさぎさんだ！',
    accentColor: 0xdff4ff,
    ...overrides,
  };
}

describe('StageSpecialEffects', () => {
  it('開始するとグループを表示し、宇宙船の前方に追従させる', () => {
    const scene = new THREE.Scene();
    const effects = new StageSpecialEffects();
    effects.init(scene);
    effects.start(createConfig({ style: 'bubble' }));

    effects.update(true, 0.16, 2, -30);

    expect(scene.children).toContain(effects.getGroup());
    expect(effects.getGroup().visible).toBe(true);
    expect(effects.getGroup().position.x).toBe(2);
    expect(effects.getGroup().position.z).toBeLessThan(-30);
  });

  it('土星リング演出ではリング本体を表示する', () => {
    const scene = new THREE.Scene();
    const effects = new StageSpecialEffects();
    effects.init(scene);
    effects.start(createConfig({ style: 'ring', stageNumber: 6, id: 'saturn-ring' }));

    effects.update(true, 0.16, 0, -10);

    const ring = effects.getGroup().children.find((child) => child.userData.stageSpecialRing === true);
    expect(ring?.visible).toBe(true);
  });

  it('clear で非表示に戻る', () => {
    const scene = new THREE.Scene();
    const effects = new StageSpecialEffects();
    effects.init(scene);
    effects.start(createConfig());
    effects.update(true, 0.16, 0, 0);

    effects.clear();
    effects.update(false, 0.16, 0, 0);

    expect(effects.getGroup().visible).toBe(false);
    expect(effects.isActive()).toBe(false);
  });
});
