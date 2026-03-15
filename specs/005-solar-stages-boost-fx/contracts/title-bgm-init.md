# Contract: タイトルBGM初期化

**Feature**: `005-solar-stages-boost-fx`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

タイトル画面でユーザーの最初のタッチ操作をトリガーにAudioContextを初期化し、タイトルBGMを再生する。iPad Safariの自動再生制限に対応。

## Interface

### `TitleScene.enter()` — オーバーレイへのBGMリスナー追加

**変更点**:
createOverlay()内で、オーバーレイ全体に`pointerdown`リスナーを`{once: true}`オプションで登録する。

**リスナーの処理**:
```typescript
this.overlay.addEventListener('pointerdown', () => {
  this.audioManager.initSync();
  this.audioManager.playBGM(0);
}, { once: true });
```

**前提条件**:
- オーバーレイDOMが作成済みであること
- AudioManagerインスタンスが利用可能であること

**事後条件**:
- 最初のpointerdownイベントでAudioContextが初期化される
- タイトルBGM（stageNumber=0）が再生開始される
- リスナーは1回限りで自動的に削除される
- 2回目以降のタッチではBGM初期化リスナーは発火しない

### `AudioManager.initSync()` — 冪等化

**変更点**:
メソッド先頭に冪等性チェックを追加。

```typescript
initSync(): void {
  if (this.initialized) return;  // 追加
  // ... 既存処理
}
```

**前提条件**: なし
**事後条件**:
- 未初期化状態の場合: AudioContextが生成され、initialized=trueになる
- 初期化済み状態の場合: 何もせずreturn

### イベント伝播の制御

```
オーバーレイ (pointerdownリスナー, {once: true})
  └── タイトル文字 (ポインターイベントなし)
  └── 「あそぶ」ボタン (pointerdown, stopPropagation)
  └── 「あそびかた」ボタン (pointerdown, stopPropagation)
```

- 「あそぶ」ボタンは `e.stopPropagation()` でオーバーレイのリスナーへの伝播を防止
- オーバーレイの空白部分をタッチした場合にのみBGMリスナーが発火
- 「あそぶ」ボタン自身もinitSync()→playBGM(0)を呼ぶので、どこをタッチしてもBGMが開始される

### タイミング競合の回避

**シナリオ**: ユーザーがオーバーレイをタッチ → 即座に「あそぶ」ボタンをタッチ

1. オーバーレイのpointerdown → initSync() → playBGM(0) → BGM再生開始
2. 「あそぶ」ボタンのpointerdown → initSync() (冪等、何もしない) → playBGM(0) (stopBGM → 再playBGM) → requestTransition

playBGM(0)は内部でstopBGM()を呼んでから再生するため、二重再生にはならない。

## Validation Rules

- タイトル画面の任意の位置をタッチするとBGMが開始されること
- BGMリスナーは1回限りで発火すること（{once: true}）
- 「あそぶ」ボタンタッチでもAudioContext初期化+BGM再生が行われること
- initSync()が複数回呼ばれてもAudioContextが複数生成されないこと
- BGMが二重再生されないこと
