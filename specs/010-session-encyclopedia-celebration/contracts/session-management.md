# Contract: sessionStorage セッション管理

**Feature**: `010-session-encyclopedia-celebration`
**Date**: 2026-03-15
**Type**: Application Startup Logic

## Overview

main.ts の起動時に sessionStorage のセッションフラグをチェックし、Safari スワイプ終了後の再起動を検出してゲームデータを全リセットする。

## Interface

### main.ts（既存 — ロジック追加）

**定義箇所**: `src/main.ts`

#### 追加箇所: saveManager 生成直後、シーン登録前

```typescript
const SESSION_KEY = 'universe-kids-race-session';

const saveManager = new SaveManager();

// Session check: reset all data after Safari swipe-kill
if (!sessionStorage.getItem(SESSION_KEY)) {
  saveManager.clear();
}
sessionStorage.setItem(SESSION_KEY, 'active');
```

**ポイント**:
- `sessionStorage.getItem()` がフラグなし（`null`）→ 新規セッション → `saveManager.clear()` で全削除
- フラグは毎回上書き設定（初回: 新規設定、継続: 再設定）
- `saveManager.clear()` は `localStorage.removeItem('universe-kids-race-save')` を実行
- `saveManager` の生成位置は変更しない。セッションチェックは生成直後に実行

## 動作マトリクス

| 状態 | sessionStorage | localStorage | 結果 |
|------|---------------|-------------|------|
| 初回アクセス | なし | なし | clear() → フラグ設定 → ステージ1開始 |
| セッション継続 | `'active'` | 進行データあり | スキップ → 進行データ維持 |
| Safari スワイプ終了後 | なし（自動クリア済） | 進行データあり | clear() → フラグ設定 → ステージ1開始 |
| タブ維持＋ホーム復帰 | `'active'` | 進行データあり | スキップ → 進行データ維持 |

## エラーハンドリング

- `sessionStorage` が利用不可の場合（極端に古いブラウザ／特殊モード）: 例外は try-catch で捕捉しない。sessionStorage は iPad Safari の標準機能であり、利用不可は想定外。利用不可の場合は従来通り localStorage のみで動作する（clear() が呼ばれないため進行データが残る）

## テスト要件

| テストケース | 期待結果 |
|------------|---------|
| sessionStorage にフラグなし + localStorage にデータあり | clear() が呼ばれ、データが削除される |
| sessionStorage にフラグあり + localStorage にデータあり | clear() が呼ばれず、データが維持される |
| sessionStorage にフラグなし + localStorage にデータなし | clear() が呼ばれる（空でも安全） |
| チェック後に sessionStorage にフラグが設定される | `getItem(SESSION_KEY)` が `'active'` を返す |
