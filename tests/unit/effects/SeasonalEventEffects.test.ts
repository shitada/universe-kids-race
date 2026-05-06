import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { SeasonalEventEffects } from '../../../src/game/effects/SeasonalEventEffects';
import { SEASONAL_EVENT_CONFIGS } from '../../../src/game/config/SeasonalEventConfig';

const sakuraEvent = SEASONAL_EVENT_CONFIGS.find((config) => config.id === 'sakura')!;

describe('SeasonalEventEffects', () => {
  it('さくらまつり開始で花びら風メッシュを表示して前方に追従させる', () => {
    const scene = new THREE.Scene();
    const effects = new SeasonalEventEffects();
    effects.init(scene);
    effects.start(sakuraEvent);

    effects.update(0.16, 3, -20);

    const petals = effects.getGroup().children.filter(
      (child): child is THREE.Mesh => child instanceof THREE.Mesh && child.userData.seasonalEventHalo !== true,
    );
    const firstPetal = petals[0];

    expect(scene.children).toContain(effects.getGroup());
    expect(effects.isActive()).toBe(true);
    expect(effects.getGroup().visible).toBe(true);
    expect(effects.getGroup().position.x).toBe(3);
    expect(effects.getGroup().position.z).toBe(-38);
    expect(firstPetal.geometry).toBeInstanceOf(THREE.PlaneGeometry);
    expect((firstPetal.material as THREE.MeshBasicMaterial).color.getHex()).toBe(0xffb7c5);
  });

  it('さくらまつりの花びらは時間経過でゆらゆら落ちる', () => {
    const scene = new THREE.Scene();
    const effects = new SeasonalEventEffects();
    effects.init(scene);
    effects.start(sakuraEvent);

    effects.update(0.1, 0, 0);
    const petal = effects.getGroup().children.find(
      (child): child is THREE.Mesh => child instanceof THREE.Mesh && child.userData.seasonalEventHalo !== true,
    )!;
    const startY = petal.position.y;
    const startRotationZ = petal.rotation.z;

    effects.update(0.9, 0, 0);

    expect(petal.position.y).toBeLessThan(startY);
    expect(petal.rotation.z).toBeGreaterThan(startRotationZ);
  });

  it('clear で季節イベント演出を停止する', () => {
    const scene = new THREE.Scene();
    const effects = new SeasonalEventEffects();
    effects.init(scene);
    effects.start(sakuraEvent);
    effects.update(0.16, 0, 0);

    effects.clear();
    effects.update(0.16, 0, 0);

    expect(effects.isActive()).toBe(false);
    expect(effects.getGroup().visible).toBe(false);
  });
});
