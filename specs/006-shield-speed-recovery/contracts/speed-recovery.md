# Contract: 速度緩やか回復（Gradual Speed Recovery）

**Feature**: `006-shield-speed-recovery`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

隕石衝突後の3秒間の減速期間が終了した後、速度が40%→100%へイーズアウト補間で約1秒かけて回復する。`SpeedState` に `'RECOVERING'` を追加し、`Spaceship.getForwardSpeed()` と `Spaceship.update()` を拡張する。

## Interface

### `SpeedState` 型拡張

**定義箇所**: `src/types/index.ts`

```typescript
// Before
export type SpeedState = 'NORMAL' | 'BOOST' | 'SLOWDOWN';

// After
export type SpeedState = 'NORMAL' | 'BOOST' | 'SLOWDOWN' | 'RECOVERING';
```

### `Spaceship` クラス変更

**定義箇所**: `src/game/entities/Spaceship.ts`

#### 新規定数

```typescript
const RECOVERY_DURATION = 1.0; // seconds
```

#### `getForwardSpeed(): number` 拡張

```typescript
getForwardSpeed(): number {
  switch (this.speedState) {
    case 'BOOST':
      return this.speed * BOOST_MULTIPLIER;
    case 'SLOWDOWN':
      return this.speed * SLOWDOWN_MULTIPLIER;
    case 'RECOVERING': {
      const progress = 1 - (this.speedStateTimer / RECOVERY_DURATION);
      const eased = 1 - (1 - progress) * (1 - progress); // ease-out quadratic
      const multiplier = SLOWDOWN_MULTIPLIER + (1 - SLOWDOWN_MULTIPLIER) * eased;
      return this.speed * multiplier;
    }
    default:
      return this.speed;
  }
}
```

**数値例**:
| 経過時間 | progress | eased | multiplier | speed (base=50) |
|---------|----------|-------|-----------|-----------------|
| 0.0s (開始) | 0.0 | 0.0 | 0.40 | 20.0 |
| 0.25s | 0.25 | 0.4375 | 0.6625 | 33.1 |
| 0.5s | 0.5 | 0.75 | 0.85 | 42.5 |
| 0.75s | 0.75 | 0.9375 | 0.9625 | 48.1 |
| 1.0s (完了) | 1.0 | 1.0 | 1.00 | 50.0 |

#### `update(deltaTime: number): void` 変更

SLOWDOWN タイマー終了時の遷移先を変更:

```typescript
// Before (SLOWDOWN timer expires)
this.speedState = 'NORMAL';
this.speedStateTimer = 0;

// After (SLOWDOWN timer expires)
this.speedState = 'RECOVERING';
this.speedStateTimer = RECOVERY_DURATION;

// RECOVERING timer expires → NORMAL
```

実装: `speedState !== 'NORMAL'` ブロック内でタイマー終了を検知した際に、現在が SLOWDOWN なら RECOVERING に遷移、RECOVERING なら NORMAL に遷移。

```typescript
if (this.speedState !== 'NORMAL') {
  this.speedStateTimer -= deltaTime;
  if (this.speedStateTimer <= 0) {
    if (this.speedState === 'SLOWDOWN') {
      this.speedState = 'RECOVERING';
      this.speedStateTimer = RECOVERY_DURATION;
    } else {
      this.speedState = 'NORMAL';
      this.speedStateTimer = 0;
    }
  }
}
```

#### `onMeteoriteHit(): void` 変更

RECOVERING 中にも被弾可能にする（SLOWDOWN のみ無敵）:

```typescript
// Before
onMeteoriteHit(): void {
  if (this.speedState === 'SLOWDOWN') return;
  this.speedState = 'SLOWDOWN';
  this.speedStateTimer = SPEED_STATE_DURATION;
}

// After — no change needed (only SLOWDOWN is invincible)
```

変更不要。RECOVERING 中は `speedState !== 'SLOWDOWN'` なので通常通り被弾する。

### `CollisionSystem` への影響

**変更不要**。衝突判定の無敵条件は `speedState !== 'SLOWDOWN'` であり、RECOVERING は SLOWDOWN ではないため衝突判定が有効。

## 状態遷移図

```
         隕石衝突        3秒経過         1秒経過
NORMAL ─────────→ SLOWDOWN ────────→ RECOVERING ────────→ NORMAL
  ↑                   ↑                    │
  │                   └────────────────────┘  隕石衝突
  │                                            (再度SLOWDOWN)
  │  ブースト発動
  ├──────────→ BOOST(3s) → NORMAL
  │
  └── RECOVERING中にブースト → BOOST(3s) → NORMAL
```

## エッジケース

1. **RECOVERING中に隕石衝突**: `onMeteoriteHit()` で SLOWDOWN に戻り、タイマー3秒リセット
2. **RECOVERING中にブースト発動**: `activateBoost()` で BOOST に変更。回復は中断
3. **RECOVERING中にステージクリア**: `reset()` で全状態 NORMAL にリセット
4. **BOOST中に隕石衝突（cancelBoost経由）**: BOOST → SLOWDOWN(3s) → RECOVERING(1s) → NORMAL
