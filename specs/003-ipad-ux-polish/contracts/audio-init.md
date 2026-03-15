# Contract: AudioManager 同期初期化

**Feature**: `003-ipad-ux-polish`  
**Date**: 2026-03-15  
**Type**: Internal Module Interface

## Overview

AudioManager の初期化メソッドを同期化し、iPad Safari の AudioContext autoplay policy に準拠させる。

## Interface

### `AudioManager.initSync(): void`

ユーザージェスチャーの同期コールスタック内で呼ばれることを前提とした AudioContext 初期化メソッド。

**前提条件**:
- ユーザージェスチャー（pointerdown 等）のイベントハンドラ **同期コールスタック内** で呼ばれること
- async/await や setTimeout/Promise.then を挟まないこと

**事後条件**:
- 成功時: `this.ctx` が `AudioContext` インスタンス、`this.initialized = true`
- 失敗時: `this.initialized = false`、例外は内部で catch される

**副作用**:
- `AudioContext.resume()` が呼ばれる（戻り値の Promise は待たない）

### 呼び出しパターン

```typescript
// ✅ 正しい: pointerdown の同期コールスタック内
button.addEventListener('pointerdown', (e) => {
  audioManager.initSync();  // ← 同期コールスタック内
  audioManager.playBGM(0);  // ← initSync 直後に呼べる
});

// ❌ 間違い: async/await で非同期化
button.addEventListener('pointerdown', async (e) => {
  await audioManager.init();  // ← ジェスチャーから離脱
});

// ❌ 間違い: setTimeout で遅延
button.addEventListener('pointerdown', (e) => {
  setTimeout(() => audioManager.initSync(), 0);  // ← ジェスチャーから離脱
});
```

### 既存メソッドとの互換性

| メソッド | 変更 | 備考 |
|---------|------|------|
| `init()` | 削除 | `initSync()` に置き換え |
| `initSync()` | 新規 | 同期版初期化 |
| `playBGM()` | 変更なし | `initialized` チェック済み |
| `playSFX()` | 変更なし | `initialized` チェック済み |
| `stopBGM()` | 変更なし | |
| `dispose()` | 変更なし | |

## Error Handling

- `AudioContext` のコンストラクタまたは `resume()` が例外を投げた場合、`catch` して `initialized = false` に設定
- ゲームプレイ自体は音なしで正常に継続される（`playBGM`/`playSFX` は `initialized` チェックで早期リターン）
