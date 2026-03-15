# Contract: エアシールドエフェクト

**Feature**: `006-shield-speed-recovery`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

宇宙船を包む常時表示のエアシールドエフェクト。Three.js の SphereGeometry + MeshBasicMaterial で実装し、パルスアニメーションで「生きている」質感を演出する。ブースト中は視覚的に強調される。

## Interface

### `AirShield` クラス（新規）

**定義箇所**: `src/game/effects/AirShield.ts`

#### `constructor()`

SphereGeometry と MeshBasicMaterial を生成してメッシュを初期化する。

**事後条件**:
- `SphereGeometry(1.5, 16, 16)` が生成される
- `MeshBasicMaterial` が以下の設定で生成される:
  - `color: 0x44aaff`
  - `transparent: true`
  - `opacity: 0.15`
  - `blending: THREE.AdditiveBlending`
  - `depthWrite: false`
  - `side: THREE.FrontSide`
- `elapsedTime = 0`
- `isBoosting = false`

#### `update(deltaTime: number): void`

パルスアニメーションを更新する。

**通常モード** (`isBoosting === false`):
```
elapsedTime += deltaTime
pulse = Math.sin(elapsedTime * 3 * Math.PI * 2) * 0.5 + 0.5  // 0〜1, 3Hz
opacity = 0.10 + pulse * 0.10                                   // 0.10〜0.20
scale = 1.00 + pulse * 0.05                                     // 1.00〜1.05
```

**ブーストモード** (`isBoosting === true`):
```
elapsedTime += deltaTime
pulse = Math.sin(elapsedTime * 5 * Math.PI * 2) * 0.5 + 0.5  // 0〜1, 5Hz
opacity = 0.25 + pulse * 0.10                                   // 0.25〜0.35
scale = 1.25 + pulse * 0.10                                     // 1.25〜1.35
color = 0x88ddff
```

**事後条件**:
- `material.opacity` が更新される
- `mesh.scale` が均一に設定される (`set(s, s, s)`)

#### `setBoostMode(active: boolean): void`

ブースト強調モードを切り替える。

**事後条件**:
- `isBoosting` が `active` に設定される
- `active === true` のとき `material.color.setHex(0x88ddff)`
- `active === false` のとき `material.color.setHex(0x44aaff)`

#### `setPosition(x: number, y: number, z: number): void`

メッシュの位置を宇宙船の位置に同期する。

**事後条件**:
- `mesh.position.set(x, y, z)` が呼ばれる

#### `getMesh(): THREE.Mesh`

シーンに追加するためのメッシュを返す。

#### `dispose(): void`

ジオメトリとマテリアルを破棄する。

**事後条件**:
- `geometry.dispose()` が呼ばれる
- `material.dispose()` が呼ばれる

## StageScene 統合

### enter() での初期化

```typescript
this.airShield = new AirShield();
this.threeScene.add(this.airShield.getMesh());
```

### update() での更新

```typescript
// AirShield position sync (after spaceship.update)
this.airShield.setPosition(
  this.spaceship.position.x,
  this.spaceship.position.y,
  this.spaceship.position.z
);
this.airShield.setBoostMode(this.boostSystem.isActive());
this.airShield.update(deltaTime);
```

### exit() での破棄

```typescript
this.airShield.dispose();
```

## パフォーマンス要件

- SphereGeometry(1.5, 16, 16): 624頂点。GPU負荷は無視できるレベル
- MeshBasicMaterial: ライティング計算なし。最軽量マテリアル
- 毎フレームの更新: opacity, scale, position の設定のみ（sin 計算1回 + 代入数回）
- iPad Safari で既存エフェクト（炎パーティクル100粒、スターフィールド2000点）と同時表示しても60fps維持
