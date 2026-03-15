# Contract: 楕円シールド（ブースト専用）

**Feature**: `008-companion-shield-boost-fix`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

エアシールドをデフォルト非表示にし、ブースト時のみ楕円形（進行方向に伸びた形状）で表示する。通常モードのパルスアニメーションを削除し、ブースト時のopacityパルスのみ残す。

## Interface

### `AirShield` クラス（既存 — 動作変更）

**定義箇所**: `src/game/effects/AirShield.ts`

#### `constructor()`

**変更点**:
- `this.mesh.visible = false` を追加（デフォルト非表示）
- 既存の geometry, material 設定は変更なし

**事後条件**:
- `mesh.visible === false`
- `material.opacity === 0.15`（初期値、非表示なので実質無関係）
- `isBoosting === false`

#### `setBoostMode(active: boolean): void`

**変更点**:
- `active === true`:
  - `mesh.visible = true`
  - `mesh.scale.set(1.0, 0.8, 2.0)` — 楕円形（X: 通常, Y: やや扁平, Z: 進行方向2倍）
  - `material.color.setHex(0x88ddff)` — 既存維持
- `active === false`:
  - `mesh.visible = false`
  - `material.color.setHex(0x44aaff)` — 既存維持

#### `update(deltaTime: number): void`

**変更点**:
- 通常モード（`!isBoosting`）: **早期リターン**（パルスアニメーション削除）
- ブースト モード（`isBoosting`）:
  ```
  elapsedTime += deltaTime
  pulse = Math.sin(elapsedTime * 5 * Math.PI * 2) * 0.5 + 0.5
  material.opacity = 0.25 + pulse * 0.10
  ```
  - **スケールのパルスアニメーション削除**（楕円形固定: 1.0, 0.8, 2.0）
  - opacity パルスのみ（0.25〜0.35の範囲で脈動）

## 動作パターン

| 状態 | visible | scale | opacity |
|------|---------|-------|---------|
| 通常飛行 | false | N/A | N/A |
| ブースト中 | true | (1.0, 0.8, 2.0) | 0.25〜0.35（パルス） |
| ブースト終了直後 | false | N/A | N/A |

## テスト要件

| テスト | 検証内容 |
|--------|---------|
| デフォルトで非表示 | constructor 後 `mesh.visible === false` |
| setBoostMode(true) で表示 | `mesh.visible === true` |
| setBoostMode(true) で楕円スケール | `scale === (1.0, 0.8, 2.0)` |
| setBoostMode(false) で非表示 | `mesh.visible === false` |
| 通常時の update で opacity 変化なし | `!isBoosting` 時に opacity が変わらない |
| ブースト時の update で opacity パルス | 0.25〜0.35 の範囲 |
| ブースト時にスケールがパルスしない | update 後も scale は (1.0, 0.8, 2.0) 固定 |
| 色の切り替え | boost → 0x88ddff, normal → 0x44aaff（既存維持） |
