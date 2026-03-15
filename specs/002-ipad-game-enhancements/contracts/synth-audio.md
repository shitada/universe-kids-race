# Contract: Synth Audio (Web Audio API)

**Date**: 2026-03-15
**Feature**: 002-ipad-game-enhancements

## Overview

Web Audio API の OscillatorNode / GainNode を使ったプログラム生成サウンドシステム。
既存の AudioManager を完全に書き換え、Three.js Audio 依存を除去する。

## AudioManager Interface

```typescript
type SFXType = 'starCollect' | 'rainbowCollect' | 'meteoriteHit' | 'boost' | 'stageClear';

interface AudioManager {
  /**
   * AudioContext を初期化する。
   * iPad Safari の自動再生制限のため、ユーザージェスチャー内で呼ぶこと。
   * 失敗時は initialized=false のまま、以降の全メソッドが no-op になる。
   */
  init(): Promise<void>;

  /**
   * ステージ番号に対応した BGM を生成・ループ再生する。
   * 既に再生中の BGM は停止してから切り替える。
   * stageNumber=0 はタイトル画面用 BGM。
   */
  playBGM(stageNumber: number): void;

  /** 現在の BGM を停止する */
  stopBGM(): void;

  /**
   * 効果音を再生する。
   * 複数の SFX を同時に再生可能（各 SFX は独立した OscillatorNode）。
   */
  playSFX(type: SFXType): void;

  /** 全サウンドを停止し、AudioContext をクローズする */
  dispose(): void;
}
```

## BGM Generation Details

### Architecture
- `AudioContext` をシングルトンとして管理
- BGM は 2 レイヤー: **メロディ**（OscillatorNode chain）+ **ベース**（持続低音）
- 音階スケジューリングは `AudioContext.currentTime` ベース（setInterval 不使用）
- ループ再生: シーケンス末尾で先頭に戻る

### Per-Stage BGM Parameters
- ステージ番号 → BGMConfig マッピング（AudioManager 内定数）
- 各 BGMConfig は melody（周波数配列）、tempo、waveform、volume を持つ
- タイトル画面（stageNumber=0）: 穏やかな sine wave アルペジオ
- 最終ステージ（太陽）: テンポ速めの華やかな square wave

### Volume Levels
- メロディ: 0.08〜0.12（iPad スピーカーで適切な音量、SFX を邪魔しない）
- ベース: 0.05〜0.08
- SFX: 0.15〜0.25（BGM より目立つ）

## SFX Generation Details

### Architecture
- 各 SFX 呼び出しで都度 OscillatorNode + GainNode を生成
- GainNode の `exponentialRampToValueAtTime()` でエンベロープ制御
- 再生完了後は自動で disconnect（メモリリーク防止）

### SFX Definitions

| Type | Waveform | Frequency Pattern | Duration | Description |
|------|----------|-------------------|----------|-------------|
| starCollect | sine | 880→1320Hz sweep | 0.15s | キラキラ上昇音 |
| rainbowCollect | sine | 440→880→1760Hz 3-note arpeggio | 0.3s | 華やかな上昇音 |
| meteoriteHit | sawtooth | 200→80Hz sweep down | 0.3s | 重い衝撃音 |
| boost | square | 440→880Hz fast sweep | 0.2s | 加速感 |
| stageClear | sine | C5→E5→G5→C6 arpeggio | 0.8s | 達成ジングル |

## Error Handling

- `init()` が例外をスローした場合: `initialized = false` のまま。以降の `playBGM()` / `playSFX()` は即座に return（no-op）
- AudioContext が `suspended` のまま resume できない場合: 同上
- ゲームプレイ自体には一切影響しない（音なしフォールバック）

## iPad Safari 固有対応

- `AudioContext` コンストラクタ: `new (window.AudioContext || (window as any).webkitAudioContext)()`
- `resume()` はユーザージェスチャーイベントハンドラ内で呼ぶ
- pointerdown イベントで init → AudioContext 生成 → resume → 即座に BGM 再生可能
