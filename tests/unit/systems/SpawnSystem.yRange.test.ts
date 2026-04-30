import { describe, it, expect } from 'vitest';
import { SpawnSystem } from '../../../src/game/systems/SpawnSystem';
import type { StageConfig } from '../../../src/types';

const testConfig: StageConfig = {
  stageNumber: 1,
  destination: '月',
  stageLength: 500,
  meteoriteInterval: 0.05,
  starDensity: 10,
};

// Constitution I (子供ファースト) / III (左右移動のみ): 宇宙船は Y=0 固定で
// X しか動かせないため、Y スポーン範囲は CollisionSystem の当たり判定半径
// (star: 1.6 / meteorite: 2.0) の範囲内に収まっていなければならない。
// SpawnSystem は星に |y| ≤ 1.0、隕石に |y| ≤ 0.8 をクランプする。
describe('SpawnSystem Y spawn range (reachability)', () => {
  it('all spawned stars satisfy |y| <= 1.0 over many frames', () => {
    const system = new SpawnSystem();
    let shipZ = 0;
    let collected = 0;
    for (let i = 0; i < 200 && collected < 200; i++) {
      shipZ -= 5;
      const r = system.update(0.016, shipZ, testConfig);
      for (const s of r.newStars) {
        expect(Math.abs(s.position.y)).toBeLessThanOrEqual(1.0);
        collected++;
      }
    }
    expect(collected).toBeGreaterThan(50);
  });

  it('all spawned meteorites satisfy |y| <= 0.8 over many frames', () => {
    const system = new SpawnSystem();
    let shipZ = 0;
    let collected = 0;
    for (let i = 0; i < 400 && collected < 100; i++) {
      shipZ -= 5;
      const r = system.update(0.05, shipZ, testConfig);
      for (const m of r.newMeteorites) {
        expect(Math.abs(m.position.y)).toBeLessThanOrEqual(0.8);
        collected++;
      }
    }
    expect(collected).toBeGreaterThan(20);
  });
});
