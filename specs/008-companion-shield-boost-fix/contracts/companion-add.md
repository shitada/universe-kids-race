# Contract: コンパニオン動的追加

**Feature**: `008-companion-shield-boost-fix`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

ステージクリア時にコンパニオンを動的に追加し、スピン＋拡大の登場アニメーションで表示する。既存の constructor によるバッチ生成は変更せず、`addCompanion()` メソッドを追加する。

## Interface

### `CompanionManager` クラス（既存 — 拡張）

**定義箇所**: `src/game/entities/CompanionManager.ts`

#### `addCompanion(stageNumber: number): boolean`（新規）

指定ステージ番号に対応するコンパニオンを動的に作成・追加し、登場アニメーションを開始する。

**引数**:
- `stageNumber`: 追加する惑星の stageNumber（1〜11）

**戻り値**:
- `true`: コンパニオンが正常に追加された
- `false`: 該当する `PLANET_ENCYCLOPEDIA` エントリが見つからない場合

**事前条件**:
- なし（重複チェックは呼び出し側で行う）

**事後条件**:
- `PLANET_ENCYCLOPEDIA` から `stageNumber` に一致するエントリを検索
- `createCompanionMesh(entry)` でメッシュを生成
- 軌道パラメータを現在の `companions.length` に基づいて計算:
  ```
  count = this.companions.length  // 追加前の数
  angleOffset = count * (2π / (count + 1))
  orbitRadius = baseRadius + (count % 3) * 0.15
  orbitSpeed = 1.0 + count * 0.05
  orbitTilt = (count - (count + 1) / 2) * 0.15
  ```
  ※ baseRadius は `count + 1` で再計算:
  ```
  newCount = count + 1
  baseRadius = newCount <= 3 ? 2.0 : newCount <= 7 ? 2.5 : 3.0
  ```
- メッシュの初期スケールを `(0, 0, 0)` に設定
- `entranceTimer = 1.0` に設定（登場アニメーション開始）
- `companions` 配列に追加、`this.group` に追加

#### `update(deltaTime, shipX, shipY, shipZ)` の変更

**追加動作**:
- 各コンパニオンの `entranceTimer > 0` をチェック
- `entranceTimer > 0` の場合:
  ```
  entranceTimer -= deltaTime
  progress = Math.max(0, Math.min(1, 1 - entranceTimer))
  mesh.scale.setScalar(progress)
  mesh.rotation.y += deltaTime * 8  // 通常の4倍速スピン
  ```
  - オービット位置は通常通り計算される（表示位置は正しくオービット上）
- `entranceTimer <= 0` の場合:
  - 既存のロジックそのまま（通常オービット + `deltaTime * 2` の自転）

## StageScene 統合

### `onStageClear()` の変更

**追加処理**:
```
saveData = this.saveManager.load()
if (!saveData.unlockedPlanets.includes(this.stageNumber)):
    this.companionManager?.addCompanion(this.stageNumber)
```

### `showClearMessage()` の変更

**追加処理**:
- 既存の「ずかんカード ゲット！」テキストの下に追加:
  ```
  if (新規獲得):
      テキスト: "{emoji} {name}が なかまに なったよ！"
      スタイル: Zen Maru Gothic, 1.2rem, font-weight 700, color #FFD700
  ```

### `update()` のクリア中ブロック変更

**追加処理**:
```typescript
if (this.isCleared) {
    this.clearTimer += deltaTime;
    // 登場アニメーション進行のため更新継続
    this.companionManager?.update(deltaTime, shipX, shipY, shipZ);
    if (this.clearTimer >= this.clearDelay) {
        this.handleStageComplete();
    }
    return;
}
```

## テスト要件

| テスト | 検証内容 |
|--------|---------|
| `addCompanion` が新しいコンパニオンを追加する | `getCount()` が +1 になる |
| `addCompanion` がグループに追加する | `getGroup().children.length` が +1 になる |
| `addCompanion` 初期スケールが 0 | 追加直後の mesh.scale が (0,0,0) |
| `addCompanion` 登場アニメーション進行 | update() 後に scale > 0 |
| `addCompanion` アニメーション完了後に通常スケール | 1秒後に scale ≈ 1 |
| 無効な stageNumber で false 返却 | `addCompanion(99)` → false |
| 高速スピン中の回転速度 | entranceTimer > 0 時に rotation.y の増加量が通常の4倍 |
