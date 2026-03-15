# Data Model: ブースト炎の持続保証＆フェードアウト演出

**Feature**: `009-boost-flame-fadeout`
**Date**: 2026-03-15

## Entities

### 1. BoostSystem（既存 — メソッド追加）

ブーストシステムの状態管理。`getDurationProgress()` を追加してブースト進行度を外部に公開。

| フィールド | 型 | 変更 | 説明 |
|-----------|------|------|------|
| `active` | `boolean` | 既存 | ブーストアクティブ状態 |
| `available` | `boolean` | 既存 | ブースト発動可能状態 |
| `durationTimer` | `number` | 既存 | ブースト残り時間（秒）。private 維持 |
| `cooldownTimer` | `number` | 既存 | クールダウン残り時間（秒） |

**新規メソッド**:

```typescript
getDurationProgress(): number {
  if (!this.active) return 1.0;
  return 1.0 - this.durationTimer / BoostSystem.DURATION;
}
```

**定義箇所**: `src/game/systems/BoostSystem.ts`

**進行度の値域**:
| 状態 | durationTimer | getDurationProgress() |
|------|-------------|----------------------|
| ブースト開始直後 | 3.0 | 0.0 |
| 中盤 | 1.5 | 0.5 |
| フェード開始 | 0.51 | 0.83 |
| 終了直前 | 0.0 | 1.0 |
| 非アクティブ | any | 1.0 |

---

### 2. StageScene 炎パーティクル制御（既存 — ロジック変更）

炎パーティクルの放出条件とフェードアウトロジック。

| フィールド | 型 | 変更 | 説明 |
|-----------|------|------|------|
| `boostFlame` | `THREE.Points \| null` | 既存 | パーティクルの Three.js オブジェクト |
| `flamePositions` | `Float32Array \| null` | 既存 | パーティクル位置バッファ |
| `flameColors` | `Float32Array \| null` | 既存 | パーティクル色バッファ |
| `flameLifetimes` | `Float32Array \| null` | 既存 | パーティクル残り寿命バッファ |
| `flameVelocities` | `Float32Array \| null` | 既存 | パーティクル速度バッファ |
| `flameIndex` | `number` | 既存 | リングバッファのインデックス |
| `flameEmitting` | `boolean` | **役割変更** | 放出条件から除外→cleanup待ち専用 |
| `MAX_FLAME_PARTICLES` | `150` | 既存 | リングバッファ最大数（変更なし） |

**定義箇所**: `src/game/scenes/StageScene.ts`

### 放出条件の変更

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

### フェードアウトパラメータ

| パラメータ | 値 | 説明 |
|-----------|------|------|
| `fadeStart` | `0.83` | フェード開始 progress 閾値（残り ≈ 0.5秒） |
| 通常放出数 | `8` | progress < fadeStart 時のパーティクル数/frame |
| フェード時放出数 | `8 * (1.0 - progress) / (1.0 - fadeStart)` | 線形減少（8→0） |
| 通常サイズ | `0.5` | 既存の PointsMaterial.size |
| フェード時サイズ | `0.5 * (1.0 - progress) / (1.0 - fadeStart)` | 線形縮小 |

## 状態遷移図

### ブースト炎のライフサイクル

```
[ブースト発動]
     |
     v
 initBoostFlame()
 boostFlame オブジェクト作成
     |
     |  (update() 毎フレーム, boostSystem.isActive() = true)
     v
 ┌─────────────────────────┐
 │  emitFlameParticles()   │
 │  progress < 0.83:       │
 │    emitCount = 8        │
 │    size = 0.5           │
 │  progress >= 0.83:      │
 │    emitCount = 8→0      │
 │    size = 0.5→0.0       │
 └─────────────────────────┘
     |
     |  (boostSystem.isActive() → false)
     v
 flameEmitting = false
 (新規放出停止)
     |
     |  (updateFlameParticles() で残存パーティクル消化)
     v
 !hasLive → removeBoostFlame()
 (Three.js オブジェクト解放)
```

### 隕石衝突 / cancel() 時のフロー

```
[隕石衝突 or boostSystem.cancel()]
     |
     v
 removeBoostFlame()
 (即座に Three.js オブジェクト解放、フェードアウトなし)
```
