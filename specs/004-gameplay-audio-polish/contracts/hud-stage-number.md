# Contract: HUDステージ番号表示

**Feature**: `004-gameplay-audio-polish`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

HUDのステージ名表示に番号を追加し「ステージN: [emoji] [目的地名]をめざせ！」形式にする。変更はStageScene側のみ。

## Interface

### `HUD.show(stageName?: string): void`（変更なし）

HUD.show() の引数・動作は一切変更しない。受け取った文字列をそのまま表示する。

### `StageScene.enter(context: SceneContext): void`（呼び出し側変更）

HUD.show() に渡す stageName 文字列のフォーマットを変更する。

**旧フォーマット**:
```typescript
const stageName = `${this.stageConfig.emoji} ${this.stageConfig.displayName}`;
// 結果例: "🌙 月をめざせ！"
```

**新フォーマット**:
```typescript
const stageName = `ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${this.stageConfig.displayName}`;
// 結果例: "ステージ1: 🌙 月をめざせ！"
```

## フォーマット仕様

| ステージ | 表示文字列 |
|---------|-----------|
| 1 | ステージ1: 🌙 月をめざせ！ |
| 2 | ステージ2: 🔴 火星をめざせ！ |
| 3 | ステージ3: 🟠 木星をめざせ！ |
| 4 | ステージ4: 🪐 土星をめざせ！ |
| 5 | ステージ5: 🔵 天王星をめざせ！ |
| 6 | ステージ6: 🫧 海王星をめざせ！ |
| 7 | ステージ7: ❄️ 冥王星をめざせ！ |
| 8 | ステージ8: ☀️ 太陽をめざせ！ |

## データ依存

- `stageNumber`: StageConfig.stageNumber（1〜8）。既に存在するフィールド
- `emoji`: StageConfig.emoji。既に存在するフィールド
- `displayName`: StageConfig.displayName。既に存在するフィールド

## テスト方針

- HUD.test.ts: `show('ステージ1: 🌙 月をめざせ！')` を渡して表示テキストを検証
- StageScene の結合テストは既存の StageFlow.test.ts でカバー
