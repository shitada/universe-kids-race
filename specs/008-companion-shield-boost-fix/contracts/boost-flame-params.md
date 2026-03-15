# Contract: ブースト炎パラメータ改善

**Feature**: `008-companion-shield-boost-fix`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

ブースト中の炎パーティクルのパラメータを調整し、より密度の高い豪華な噴射感を実現する。リングバッファの最大数、毎フレームの放出数、パーティクル寿命を増加させる。

## Interface

### `StageScene` クラス（既存 — パラメータ変更）

**定義箇所**: `src/game/scenes/StageScene.ts`

#### 定数変更

| 定数/パラメータ | 旧値 | 新値 | 場所 |
|---------------|------|------|------|
| `MAX_FLAME_PARTICLES` | 100 | 150 | `static readonly` フィールド |
| 放出ループ回数 | 5 | 8 | `emitFlameParticles()` 内 `for (let p = 0; p < N; p++)` |
| パーティクル寿命 | 0.5 | 0.7 | `emitFlameParticles()` 内 `this.flameLifetimes[idx] = N` |

#### `emitFlameParticles()` の変更

```typescript
// 変更前
for (let p = 0; p < 5; p++) {
  // ...
  this.flameLifetimes[idx] = 0.5;
  // ...
}

// 変更後
for (let p = 0; p < 8; p++) {
  // ...
  this.flameLifetimes[idx] = 0.7;
  // ...
}
```

#### 影響範囲

以下のメソッドは `MAX_FLAME_PARTICLES` を `StageScene.MAX_FLAME_PARTICLES` 経由で参照するため、コード変更不要:
- `initBoostFlame()`: Float32Array サイズが自動的に150ベースになる
- `updateFlameParticles()`: ループ範囲が自動的に150になる
- `emitFlameParticles()`: リングバッファのモジュロ演算が自動的に150ベースになる

#### パフォーマンス特性

| 指標 | 旧値 | 新値 |
|------|------|------|
| リングバッファ容量 | 100 particles | 150 particles |
| メモリ使用量（position + color + lifetime + velocity） | ≈3.2KB | ≈4.8KB |
| 毎フレーム放出数 | 5 | 8 |
| 毎秒放出数（60fps時） | 300 | 480 |
| パーティクル寿命 | 0.5秒 | 0.7秒 |
| 理論上の同時表示数 | min(300 × 0.5, 100) = 100 | min(480 × 0.7, 150) = 150 |

## テスト要件

| テスト | 検証内容 |
|--------|---------|
| MAX_FLAME_PARTICLES が 150 | 定数値の確認 |
| emitFlameParticles で 8 パーティクル放出 | 1回の呼び出しで flameIndex が 8 増加 |
| パーティクル寿命が 0.7 | 放出直後の lifetime 値確認 |
