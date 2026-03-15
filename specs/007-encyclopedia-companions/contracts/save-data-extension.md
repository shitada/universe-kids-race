# Contract: SaveData拡張

**Feature**: `007-encyclopedia-companions`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

既存の `SaveData` インターフェースに `unlockedPlanets: number[]` を追加し、惑星図鑑カードとエイリアンコンパニオンの獲得状態を永続化する。後方互換性を維持し、旧フォーマットのセーブデータからの自動マイグレーションをサポートする。

## Interface Changes

### `SaveData` インターフェース（拡張）

**定義箇所**: `src/types/index.ts`

```typescript
// Before
export interface SaveData {
  clearedStage: number;
}

// After
export interface SaveData {
  clearedStage: number;
  unlockedPlanets: number[];
}
```

### `SaveManager.load()` バリデーション拡張

**定義箇所**: `src/game/storage/SaveManager.ts`

**DEFAULT_DATA 更新**:
```typescript
const DEFAULT_DATA: SaveData = { clearedStage: 0, unlockedPlanets: [] };
```

**バリデーションフロー**:
```
1. JSON.parse(raw) → data
2. clearedStage バリデーション（既存 — 変更なし）
3. unlockedPlanets バリデーション（新規）:
   a. typeof data.unlockedPlanets !== 'object' || !Array.isArray(data.unlockedPlanets)
      → data.unlockedPlanets = []
   b. data.unlockedPlanets = [...new Set(
        data.unlockedPlanets.filter(v => typeof v === 'number' && v >= 1 && v <= 11 && Number.isInteger(v))
      )]
4. return data
```

**事後条件**:
- 旧フォーマット（`unlockedPlanets` プロパティなし）→ `unlockedPlanets: []` が自動補完される
- 不正な値（文字列、範囲外、重複）→ 除外/修正される
- 正常な値 → そのまま返却される
- JSON パースエラー → `DEFAULT_DATA` が返される

### `SaveManager.save()` — 変更なし

既存の `JSON.stringify(data)` で `unlockedPlanets` も自動的にシリアライズされる。呼び出し側が正しい `SaveData` を渡す責任を持つ。

## Integration with main.ts

### トランジションハンドラーの拡張

```typescript
// main.ts — setTransitionHandler 内
sceneManager.setTransitionHandler((sceneType: SceneType, context?: SceneContext) => {
  if (sceneType === 'stage' && context?.stageNumber && context.stageNumber > 1) {
    const clearedStageNumber = context.stageNumber - 1;
    const saveData = saveManager.load();
    saveData.clearedStage = Math.max(saveData.clearedStage, clearedStageNumber);
    if (!saveData.unlockedPlanets.includes(clearedStageNumber)) {
      saveData.unlockedPlanets.push(clearedStageNumber);
    }
    saveManager.save(saveData);
  } else if (sceneType === 'ending') {
    const saveData = saveManager.load();
    saveData.clearedStage = 11;
    if (!saveData.unlockedPlanets.includes(11)) {
      saveData.unlockedPlanets.push(11);
    }
    saveManager.save(saveData);
  }
  sceneManager.transitionTo(sceneType, context);
});
```

**注意**: 既存の `saveManager.save({ clearedStage: ... })` を `saveManager.load()` → 修正 → `saveManager.save()` パターンに変更する。これにより `unlockedPlanets` の既存値が保持される。

## データサイズ見積もり

| 項目 | サイズ |
|------|--------|
| 既存 `clearedStage` | ~20 bytes |
| `unlockedPlanets` （最大11要素）| ~30 bytes |
| 合計 JSON | ~60 bytes |
| localStorage 5MB制限に対する割合 | 0.001% |

## Edge Cases

| ケース | 動作 |
|--------|------|
| 旧フォーマット `{"clearedStage":5}` | `unlockedPlanets: []` を自動補完。注: clearedStage=5 でも自動復元しない |
| 不正な配列 `{"clearedStage":3,"unlockedPlanets":"bad"}` | `unlockedPlanets: []` にフォールバック |
| 範囲外の値 `{"clearedStage":3,"unlockedPlanets":[1,2,99,-1]}` | `[1, 2]` にフィルタリング |
| 重複あり `{"clearedStage":3,"unlockedPlanets":[1,1,2,2]}` | `[1, 2]` に重複排除 |
| JSON パースエラー | `DEFAULT_DATA` 返却 |
| ステージ再クリア（unlockedPlanets に既に含まれる） | `includes()` で重複追加を防止 |
