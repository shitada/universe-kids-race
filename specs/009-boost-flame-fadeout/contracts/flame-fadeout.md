# Contract: 炎フェードアウト演出

**Feature**: `009-boost-flame-fadeout`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

`StageScene` のブースト炎パーティクルに対して、(1) 放出条件から `flameEmitting` 依存を排除し炎の途切れを解消、(2) ブースト終了前の最後0.5秒間でパーティクル放出数とサイズを段階的に減少させるフェードアウト演出を追加する。

## Interface

### `StageScene` クラス（既存 — ロジック変更）

**定義箇所**: `src/game/scenes/StageScene.ts`

#### 変更1: 放出条件の修正（`update()` メソッド内）

```typescript
// 変更前
if (this.boostSystem.isActive() && this.flameEmitting) {
  this.emitFlameParticles();
}

// 変更後
if (this.boostSystem.isActive()) {
  this.emitFlameParticles();
}
```

**理由**: `flameEmitting` フラグが原因で、ブーストアクティブ中に炎放出が途切れるケースがある。`boostSystem.isActive()` を唯一の放出条件とする。

#### 変更2: `emitFlameParticles()` のフェードアウトロジック追加

```typescript
private emitFlameParticles(): void {
  if (!this.flamePositions || !this.flameColors || !this.flameLifetimes || !this.flameVelocities) return;
  const MAX = StageScene.MAX_FLAME_PARTICLES;
  const shipPos = this.spaceship.position;

  // フェードアウト計算
  const progress = this.boostSystem.getDurationProgress();
  const fadeStart = 0.83;
  const emitCount = progress < fadeStart
    ? 8
    : Math.round(8 * (1.0 - progress) / (1.0 - fadeStart));
  const sizeFraction = progress < fadeStart
    ? 1.0
    : (1.0 - progress) / (1.0 - fadeStart);

  for (let p = 0; p < emitCount; p++) {
    const idx = this.flameIndex % MAX;
    const i3 = idx * 3;
    const i2 = idx * 2;

    // 位置のスプレッドもフェード時に縮小
    this.flamePositions[i3] = shipPos.x + (Math.random() - 0.5) * sizeFraction;
    this.flamePositions[i3 + 1] = shipPos.y + (Math.random() - 0.5) * sizeFraction;
    this.flamePositions[i3 + 2] = shipPos.z + 2;

    const t = Math.random();
    this.flameColors[i3] = 1.0;
    this.flameColors[i3 + 1] = 0.4 * (1 - t) + 0.133 * t;
    this.flameColors[i3 + 2] = 0;

    this.flameLifetimes[idx] = 0.7;
    this.flameVelocities[i2] = 3 + Math.random() * 2;
    this.flameVelocities[i2 + 1] = (Math.random() - 0.5);

    this.flameIndex++;
  }

  // パーティクルサイズのスケール更新
  if (this.boostFlame) {
    (this.boostFlame.material as THREE.PointsMaterial).size = 0.5 * sizeFraction;
  }
}
```

#### フェードアウト計算の詳細

| パラメータ | 式 | 説明 |
|-----------|------|------|
| `progress` | `boostSystem.getDurationProgress()` | 0.0 → 1.0 |
| `fadeStart` | `0.83` | `DURATION * (1 - 0.83) = 0.51秒` ≈ 仕様の「最後の0.5秒」 |
| `emitCount` | `progress < fadeStart ? 8 : Math.round(8 * (1.0 - progress) / (1.0 - fadeStart))` | 8 → 0 |
| `sizeFraction` | `progress < fadeStart ? 1.0 : (1.0 - progress) / (1.0 - fadeStart)` | 1.0 → 0.0 |

#### フェードアウト中の段階例（60fps、残り0.5秒 = 30フレーム）

| progress | emitCount | sizeFraction | PointsMaterial.size |
|----------|-----------|-------------|---------------------|
| 0.83 | 8 | 1.0 | 0.50 |
| 0.87 | 6 | 0.76 | 0.38 |
| 0.90 | 5 | 0.59 | 0.29 |
| 0.93 | 3 | 0.41 | 0.21 |
| 0.97 | 1 | 0.18 | 0.09 |
| 1.00 | 0 | 0.0 | 0.00 |

#### 変更3: flameEmitting の役割変更

`flameEmitting` は放出条件から除外し、残存パーティクル cleanup 待ち専用に限定：

- **放出中**: `boostSystem.isActive()` が `true` → `emitFlameParticles()` 呼び出し
- **ブースト終了**: `flameEmitting = false`（新規パーティクル放出停止のマーカー）
- **cleanup**: `updateFlameParticles()` 内の `!this.flameEmitting && !hasLive` 判定は維持

#### 影響しないもの

- `initBoostFlame()`: 変更なし（ブースト発動時にオブジェクト初期化）
- `removeBoostFlame()`: 変更なし（隕石衝突 / cancel 時の即座解放）
- `updateFlameParticles()`: 変更なし（残存パーティクルの更新と cleanup ロジック）
- AirShield, CompanionManager: 変更なし

## 要件マッピング

| 要件 | 対応する変更 |
|------|------------|
| FR-001 (途切れ排除) | 放出条件から `flameEmitting` 除去 |
| FR-002 (進行割合取得) | `BoostSystem.getDurationProgress()` |
| FR-003 (放出数段階減少) | `emitCount` 計算 |
| FR-004 (サイズ段階縮小) | `sizeFraction` + `PointsMaterial.size` スケール |
| FR-005 (滑らかな減少) | 線形補間、`Math.round()` |
| FR-006 (フェード前通常表示) | `progress < fadeStart` 条件 |
| FR-007 (パーティクル上限維持) | `MAX_FLAME_PARTICLES` 変更なし |

## テスト要件

| テスト | 検証内容 |
|--------|---------|
| ブーストアクティブ中は `emitFlameParticles` が呼ばれる | `boostSystem.isActive()` のみで放出判定 |
| progress < 0.83 のとき emitCount = 8 | 通常フェーズのパーティクル放出数 |
| progress = 0.90 のとき emitCount ≈ 5 | フェードフェーズの中間値 |
| progress = 1.0 のとき emitCount = 0 | フェードフェーズの終端 |
| progress < 0.83 のとき PointsMaterial.size = 0.5 | 通常フェーズのサイズ |
| progress >= 0.83 のとき PointsMaterial.size < 0.5 | フェードフェーズのサイズ縮小 |
| ブースト終了後の残存パーティクル cleanup | `!flameEmitting && !hasLive` で removeBoostFlame() |
