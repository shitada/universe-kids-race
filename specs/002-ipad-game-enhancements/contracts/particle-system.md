# Contract: Particle System

**Date**: 2026-03-15
**Feature**: 002-ipad-game-enhancements

## Overview

Three.js の Points + BufferGeometry を使ったパーティクルバースト演出。
星の収集時に発生し、短時間で消滅する視覚フィードバック。

## ParticleBurst Interface

```typescript
interface ParticleBurstOptions {
  position: THREE.Vector3;   // バースト発生位置
  color: number;             // 基本色 (hex)
  particleCount: number;     // パーティクル数
  isRainbow: boolean;        // 虹色モード
}

interface ParticleBurst {
  /** バーストを初期化し、Three.js Scene に追加する */
  init(scene: THREE.Scene, options: ParticleBurstOptions): void;

  /** 毎フレーム更新。パーティクルの位置・サイズ・不透明度を更新する */
  update(deltaTime: number): void;

  /** バーストの寿命が尽きたか */
  isExpired(): boolean;

  /** Three.js オブジェクトを Scene から除去し、ジオメトリ/マテリアルを dispose する */
  dispose(scene: THREE.Scene): void;
}
```

## ParticleBurstManager Interface

```typescript
interface ParticleBurstManager {
  /** 新しいバーストを発生させる */
  emit(scene: THREE.Scene, options: ParticleBurstOptions): void;

  /** 全アクティブバーストを更新する */
  update(deltaTime: number): void;

  /** 期限切れバーストを回収する */
  cleanup(scene: THREE.Scene): void;

  /** 全バーストをクリアする */
  clear(scene: THREE.Scene): void;
}
```

## Implementation Details

### Particle Attributes (BufferGeometry)
- `position` (Float32Array): 各パーティクルの x, y, z
- `color` (Float32Array): 各パーティクルの r, g, b
- `size` (Float32Array): 各パーティクルの表示サイズ

### Animation Per Frame
1. 位置 += 速度 × deltaTime
2. 速度 *= 減衰係数 (0.95)
3. サイズ = 初期サイズ × (残り寿命 / 全寿命)
4. needsUpdate = true を設定

### Parameters

| Parameter | Normal Star | Rainbow Star |
|-----------|------------|-------------|
| particleCount | 20 | 50 |
| color | 0xFFDD00 (金色) | Random HSL per particle |
| speed | 5〜10 (random) | 8〜15 (random) |
| lifetime | 0.5s | 0.8s |
| initialSize | 0.3 | 0.5 |

### Material
```typescript
new THREE.PointsMaterial({
  size: initialSize,
  vertexColors: true,
  transparent: true,
  opacity: 1.0,
  blending: THREE.AdditiveBlending,  // 発光感
  depthWrite: false,                 // 半透明の正しい描画
  sizeAttenuation: true,
})
```

### Object Pool
- 最大同時バースト数: 10
- プール超過時: 最も古い（寿命の短い）バーストを即座に dispose して再利用
- パフォーマンス目標: iPad Safari で 10 バースト同時発生しても 60fps 維持

### Integration with StageScene
- `CollisionSystem.check()` が `starCollisions` を返す
- 各 starCollision に対して `ParticleBurstManager.emit()` を呼ぶ
- star.starType に応じて通常/虹色のパラメータを渡す
- `update()` と `cleanup()` は StageScene の update loop 内で毎フレーム呼ぶ
