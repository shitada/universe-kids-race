# Audio Resume Contract: Safari BGM 復帰

**Feature**: 011-device-compat-audio-fix | **Date**: 2026-03-16

## Overview

Safari のバックグラウンド遷移で AudioContext が `suspended` になる問題を解決するためのコントラクト。

## AudioManager.ensureResumed()

```typescript
/**
 * AudioContext が suspended 状態なら resume() を呼ぶ。
 * ctx が null または initialized が false の場合は何もしない。
 */
ensureResumed(): void
```

**呼び出しポイント**:
1. `playBGM()` の冒頭（stopBGM() の前）
2. `playSFX()` の冒頭（early return の前）
3. `startBoostSFX()` の冒頭（early return の前）
4. `main.ts` の `visibilitychange` リスナー（`!document.hidden` 時）

**振る舞い**:
- `this.ctx` が null → return（何もしない）
- `this.ctx.state !== 'suspended'` → return（何もしない）
- `this.ctx.state === 'suspended'` → `this.ctx.resume()` を呼ぶ（Promise は await しない — fire-and-forget）

## AudioManager.initSync() 変更

```typescript
initSync(): void {
  if (this.initialized) {
    // 既に初期化済みだが suspended の場合は resume
    this.ensureResumed();
    return;
  }
  // ... 既存の初期化ロジック
}
```

## main.ts visibilitychange 変更

```typescript
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gameLoop.pause();
  } else {
    gameLoop.resume();
    audioManager.ensureResumed();
  }
});
```

## テスト要件

- `ensureResumed()` は ctx.state === 'suspended' の時に ctx.resume() を呼ぶ
- `ensureResumed()` は ctx が null の時に例外を投げない
- `ensureResumed()` は ctx.state === 'running' の時に resume() を呼ばない
- `initSync()` 2回目の呼び出しで ctx が suspended なら resume が呼ばれる
- `playBGM()` 呼び出し時に suspended なら ensureResumed 経由で resume される
