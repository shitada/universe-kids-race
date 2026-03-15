# Contract: BoostSystem.getDurationProgress()

**Feature**: `009-boost-flame-fadeout`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

`BoostSystem` にブースト持続時間の進行度を返す `getDurationProgress()` メソッドを追加する。フェードアウト演出やその他のブースト進行度依存の演出に使用される。

## Interface

### `BoostSystem` クラス（既存 — メソッド追加）

**定義箇所**: `src/game/systems/BoostSystem.ts`

#### 新規メソッド

```typescript
/**
 * ブースト持続時間の進行度を返す。
 * @returns 0.0（ブースト開始直後）〜 1.0（ブースト終了）。非アクティブ時は 1.0。
 */
getDurationProgress(): number
```

#### 動作仕様

| 状態 | 戻り値 |
|------|--------|
| ブースト非アクティブ（`isActive() === false`） | `1.0` |
| ブースト開始直後（`activate()` 直後、`update()` 呼び出し前） | `0.0` |
| ブースト中盤（1.5秒経過） | `0.5` |
| フェード領域（2.5秒経過、残り0.5秒） | `≈ 0.833` |
| ブースト終了直前（`durationTimer ≈ 0`） | `≈ 1.0` |

#### 計算式

```typescript
getDurationProgress(): number {
  if (!this.active) return 1.0;
  return 1.0 - this.durationTimer / BoostSystem.DURATION;
}
```

#### 既存メソッドとの関係

| メソッド | 範囲 | 意味 |
|---------|------|------|
| `getDurationProgress()` (新規) | 0→1 | ブースト持続時間の消費割合 |
| `getCooldownProgress()` (既存) | 0→1 | クールダウンの回復割合 |
| `isActive()` (既存) | boolean | ブーストがアクティブか |

#### 不変条件

- `isActive() === true` のとき `getDurationProgress()` は `[0.0, 1.0)` の範囲
- `isActive() === false` のとき `getDurationProgress()` は常に `1.0`
- `activate()` → `getDurationProgress()` は `0.0`
- `update(DURATION)` 後 → `getDurationProgress()` は `1.0`（かつ `isActive()` は `false`）

## テスト要件

| テスト | 検証内容 |
|--------|---------|
| 非アクティブ時に 1.0 を返す | `new BoostSystem()` → `getDurationProgress() === 1.0` |
| ブースト開始直後に 0.0 を返す | `activate()` → `getDurationProgress() === 0.0` |
| 中盤で ≈0.5 を返す | `activate()` → `update(1.5)` → `getDurationProgress() ≈ 0.5` |
| 終了直前で ≈1.0 を返す | `activate()` → `update(2.9)` → `getDurationProgress() ≈ 0.967` |
| 終了後に 1.0 を返す | `activate()` → `update(3.1)` → `getDurationProgress() === 1.0` |
| cancel 後に 1.0 を返す | `activate()` → `cancel()` → `getDurationProgress() === 1.0` |
