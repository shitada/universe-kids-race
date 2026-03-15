# Contract: EndingScene 選択的リセット

**Feature**: `010-session-encyclopedia-celebration`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

EndingScene.enter() での `saveManager.clear()` を選択的リセットに置き換え、全クリア時にゲーム進行（clearedStage）のみをリセットし、ずかんデータ（unlockedPlanets）を保持する。

## Interface

### EndingScene.enter()（既存 — ロジック変更）

**定義箇所**: `src/game/scenes/EndingScene.ts`

#### 変更: saveManager.clear() → 選択的リセット

```typescript
// 変更前
this.saveManager.clear();

// 変更後
const saveData = this.saveManager.load();
saveData.clearedStage = 0;
this.saveManager.save(saveData);
```

**変更理由**:
- `clear()` は `localStorage.removeItem()` で全データ削除 → unlockedPlanets も消える
- 選択的リセットは load → modify → save の3ステップで clearedStage のみリセット
- unlockedPlanets は load() で取得した配列がそのまま save() で永続化される

## データフロー

```
EndingScene.enter()
  │
  ├── saveManager.load()
  │     → { clearedStage: 11, unlockedPlanets: [1,2,3,...,11] }
  │
  ├── saveData.clearedStage = 0
  │     → { clearedStage: 0, unlockedPlanets: [1,2,3,...,11] }
  │
  └── saveManager.save(saveData)
        → localStorage に保存
```

## セッション管理との連携

| シナリオ | EndingScene の処理 | sessionStorage の処理 |
|---------|-------------------|---------------------|
| 全クリア → タイトルに戻る | clearedStage=0、unlockedPlanets 保持 | フラグ維持（セッション継続） |
| 全クリア → Safari スワイプ終了 → 再起動 | （前回の選択的リセット済） | フラグなし → clear() で全削除 |
| 全クリア → 再プレイ → ステージ1クリア | ずかんにステージ1惑星が既存（重複なし） | フラグ維持 |

## テスト要件

| テストケース | 期待結果 |
|------------|---------|
| 全クリア（clearedStage=11, unlockedPlanets=[1..11]）後にエンディング到達 | clearedStage=0、unlockedPlanets=[1..11] が保存される |
| 部分クリア（clearedStage=5, unlockedPlanets=[1..5]）後にエンディング到達 | clearedStage=0、unlockedPlanets=[1..5] が保存される |
| エンディング後にタイトルに戻り、ずかんを確認 | 保存済みの unlockedPlanets が全て表示される |
