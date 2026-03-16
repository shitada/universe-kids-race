# BGM Deduplication Contract: BGM 重複防止

**Feature**: 011-device-compat-audio-fix | **Date**: 2026-03-16

## Overview

BGM が二重再生される問題を世代カウンタと TitleScene のイベントリスナー修正で解決する。

## AudioManager BGM 世代管理

### 新規フィールド

```typescript
private bgmPlaying = false;
private bgmGeneration = 0;
```

### playBGM() 変更

```typescript
playBGM(stageNumber: number): void {
  if (!this.initialized || !this.ctx) return;
  this.ensureResumed();
  this.stopBGM();       // ← stopBGM 内で bgmGeneration++ される
  this.bgmGeneration++;
  this.bgmPlaying = true;

  const currentGen = this.bgmGeneration;
  // ... config setup ...

  const tick = () => {
    if (!this.initialized || !this.ctx) return;
    if (this.bgmGeneration !== currentGen) return;  // ← 世代不一致 → 停止
    // ... arpeggio, melody ...
    beat = (beat + 1) % totalBeats;
    this.bgmTimer = setTimeout(tick, beatInterval * 1000);
  };
  tick();
}
```

### stopBGM() 変更

```typescript
stopBGM(): void {
  this.bgmGeneration++;
  this.bgmPlaying = false;
  if (this.bgmTimer) {
    clearTimeout(this.bgmTimer);
    this.bgmTimer = null;
  }
  // ... 既存の oscillator/gain クリーンアップ ...
}
```

## TitleScene overlay pointerdown 変更

**Before**:
```typescript
this.overlay.addEventListener('pointerdown', () => {
  this.audioManager.initSync();
  this.audioManager.playBGM(0);
}, { once: true });
```

**After**:
```typescript
this.overlay.addEventListener('pointerdown', () => {
  this.audioManager.initSync();
}, { once: true });
```

**理由**: overlay タップは AudioContext の初期化のみに限定。BGM はシーン遷移先（StageScene）で再生される。タイトル画面の BGM は不要（ユーザーは素早く「あそぶ」を押す想定）。

## テスト要件

- `playBGM()` を2回連続呼び出しても、2つ目の BGM のみが再生される（1つ目の tick が停止）
- `stopBGM()` 呼び出し後、tick コールバックが再スケジュールされない
- `bgmPlaying` は playBGM 後に true、stopBGM 後に false
- TitleScene で overlay タップ + 「あそぶ」ボタンタップの連続操作で playBGM が1回だけ呼ばれる
