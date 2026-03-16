# Keyboard Input Contract: PC キーボード操作

**Feature**: 011-device-compat-audio-fix | **Date**: 2026-03-16

## Overview

PC ブラウザでのキーボード操作を InputSystem に追加する。既存のポインター入力と共存する。

## InputSystem 拡張

### 新規フィールド

```typescript
private pressedKeys = new Set<string>();
```

### 新規イベントハンドラ

```typescript
private onKeyDown = (e: KeyboardEvent): void => {
  if (e.repeat) return;  // キーリピートは無視
  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      e.preventDefault();
      this.pressedKeys.add(e.key);
      this.updateDirection();
      break;
    case ' ':  // Space
      e.preventDefault();
      this.state.boostPressed = true;
      break;
  }
};

private onKeyUp = (e: KeyboardEvent): void => {
  switch (e.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      this.pressedKeys.delete(e.key);
      this.updateDirection();
      break;
    case ' ':  // Space
      // boostPressed は StageScene で消費されるが、安全のため keyup でもリセット
      break;
  }
};
```

### updateDirection() 変更

```typescript
private updateDirection(): void {
  let left = false;
  let right = false;

  // ポインター入力
  for (const side of this.activePointers.values()) {
    if (side === 'left') left = true;
    if (side === 'right') right = true;
  }

  // キーボード入力をマージ
  if (this.pressedKeys.has('ArrowLeft')) left = true;
  if (this.pressedKeys.has('ArrowRight')) right = true;

  if (left && right) {
    this.state.moveDirection = 0;
  } else if (left) {
    this.state.moveDirection = -1;
  } else if (right) {
    this.state.moveDirection = 1;
  } else {
    this.state.moveDirection = 0;
  }
}
```

### setup() 変更

```typescript
setup(canvas: HTMLCanvasElement): void {
  this.canvas = canvas;
  canvas.addEventListener('pointerdown', this.onPointerDown);
  canvas.addEventListener('pointerup', this.onPointerUp);
  canvas.addEventListener('pointercancel', this.onPointerCancel);
  canvas.addEventListener('pointerleave', this.onPointerUp);
  window.addEventListener('keydown', this.onKeyDown);
  window.addEventListener('keyup', this.onKeyUp);
}
```

### dispose() 変更

```typescript
dispose(): void {
  // ... 既存のポインターリスナー削除 ...
  window.removeEventListener('keydown', this.onKeyDown);
  window.removeEventListener('keyup', this.onKeyUp);
  this.pressedKeys.clear();
  this.state = { moveDirection: 0, boostPressed: false };
}
```

## キーマッピング

| Key | Action | Behavior |
|-----|--------|----------|
| ArrowLeft | 左移動 | keydown: moveDirection = -1, keyup: moveDirection = 0 |
| ArrowRight | 右移動 | keydown: moveDirection = 1, keyup: moveDirection = 0 |
| Space | ブースト | keydown: boostPressed = true（StageScene で消費） |

## 入力マージルール

- ポインター左 + キーボード右 → 左 AND 右 → moveDirection = 0
- ポインターなし + キーボード左 → moveDirection = -1
- ポインター右 + キーボードなし → moveDirection = 1
- ポインター左 + キーボード左 → moveDirection = -1（重複は無害）

## テスト要件

- ArrowLeft keydown で moveDirection が -1 になる
- ArrowRight keydown で moveDirection が 1 になる
- ArrowLeft + ArrowRight 同時押しで moveDirection が 0 になる
- Space keydown で boostPressed が true になる
- ArrowLeft keyup で moveDirection が 0 に戻る
- keydown の repeat=true イベントは無視される
- dispose() 後にキーボードイベントが反応しない
- ポインター左 + キーボード右で moveDirection が 0 になる（マージ動作）
