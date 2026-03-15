# Contract: BGM多層構成・コード進行

**Feature**: `004-gameplay-audio-polish`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

AudioManager の playBGM() を4レイヤー構成（メロディ・コードパッド・アルペジオ・ベース）に改修し、ステージごとに異なるコード進行を再生する。

## Interface

### `AudioManager.playBGM(stageNumber: number): void`（既存 — 内部改修）

外部シグネチャは変更なし。内部でBGMConfigの新構造を使用して4レイヤーで再生する。

**前提条件**:
- `this.initialized === true` かつ `this.ctx !== null`
- `stageNumber` は -1, 0, 1〜8 のいずれか

**事後条件**:
- 既存のBGMが停止される（`stopBGM()` 呼び出し）
- 以下の4レイヤーが同時に再生される:
  1. **ベース**: 1つの持続OscillatorNode。コード変更時に周波数更新
  2. **コードパッド**: 3〜4つの持続OscillatorNode。コード変更時に各周波数更新
  3. **アルペジオ**: 拍ごとにコード構成音を順番に短発音
  4. **メロディ**: 拍ごとにメロディ音を短発音
- 8コード（8小節）でループ

**副作用**:
- `bgmOscillators[]` に持続ノード（ベース1 + パッド3〜4）が格納される
- `bgmGains[]` に対応するGainNodeが格納される
- `bgmTimer` にシーケンサーのsetTimeout IDが格納される

### シーケンサーのタイミング

```
1小節 = beatsPerChord拍 = beatsPerChord × (60/tempo) 秒

例: tempo=120, beatsPerChord=4 の場合
  1拍 = 0.5秒
  1小節 = 2.0秒
  8小節ループ = 16.0秒
```

各拍で行われる処理:
1. コード変更チェック（beat % beatsPerChord === 0 の場合）
   - ベースOSCの周波数を次のコードのベース音に更新
   - パッドOSCの周波数を次のコードの各音に更新
2. アルペジオノートのスケジューリング
   - 現在のコードの構成音を順番に（beat % chordLength でインデックス）
3. メロディノートのスケジューリング
   - 現在のコードに対応するメロディ音列から順番に

### `AudioManager.stopBGM(): void`（既存 — 変更なし）

**事後条件**:
- `bgmTimer` が clearTimeout で停止
- `bgmOscillators[]` の全OscillatorNodeが `.stop()` + `.disconnect()`
- `bgmGains[]` の全GainNodeが `.disconnect()`
- 配列がクリアされる

## BGMConfig データ構造

```typescript
interface BGMWaveforms {
  melody: OscillatorType;
  pad: OscillatorType;
  arpeggio: OscillatorType;
  bass: OscillatorType;
}

interface BGMVolumes {
  melody: number;
  pad: number;
  arpeggio: number;
  bass: number;
}

interface BGMConfig {
  tempo: number;
  beatsPerChord: number;
  chords: number[][];      // 8コードの配列。各コード = [freq1, freq2, freq3(, freq4)]
  bassNotes: number[];     // 8コードに対応するベース音
  melodyNotes: number[][]; // 8コードに対応するメロディ（各4音）
  waveforms: BGMWaveforms;
  volumes: BGMVolumes;
}
```

## BGM定義一覧（10パターン）

### Stage 0 (Title) — Am, 100 BPM
- 雰囲気: 冒険の予感、マイナー → メジャー解決
- 進行: Am → F → C → G → Am → F → G → C
- 波形: melody=sine, pad=sine, arpeggio=triangle, bass=sine

### Stage 1 (月) — C, 110 BPM
- 雰囲気: 穏やか、出発
- 進行: C → Am → F → G → C → Em → F → G
- 波形: melody=sine, pad=sine, arpeggio=sine, bass=sine

### Stage 2 (火星) — D, 118 BPM
- 雰囲気: やや活発
- 進行: D → Bm → G → A → D → F#m → G → A
- 波形: melody=sine, pad=sine, arpeggio=sine, bass=sine

### Stage 3 (木星) — Eb, 120 BPM
- 雰囲気: 壮大、神秘的
- 進行: Ebm → Cb → Gb → Db → Ebm → Cb → Db → Gb
- 波形: melody=sine, pad=sine, arpeggio=sine, bass=sine

### Stage 4 (土星) — Em, 115 BPM
- 雰囲気: ミステリアス
- 進行: Em → C → G → D → Em → Am → B → Em
- 波形: melody=triangle, pad=sine, arpeggio=triangle, bass=sine

### Stage 5 (天王星) — F, 125 BPM
- 雰囲気: 遠い宇宙感
- 進行: Fm → Db → Ab → Eb → Fm → Db → Eb → Ab
- 波形: melody=triangle, pad=sine, arpeggio=triangle, bass=sine

### Stage 6 (海王星) — G, 130 BPM
- 雰囲気: 力強い前進
- 進行: G → Em → C → D → G → Bm → C → D
- 波形: melody=square, pad=triangle, arpeggio=triangle, bass=sine

### Stage 7 (冥王星) — Am, 135 BPM
- 雰囲気: 緊張感のあるマイナー
- 進行: Am → F → Dm → E → Am → G → F → E
- 波形: melody=square, pad=triangle, arpeggio=triangle, bass=sine

### Stage 8 (太陽) — C, 140 BPM
- 雰囲気: 勝利のクライマックス
- 進行: C → G → Am → F → C → G → F → C
- 波形: melody=square, pad=triangle, arpeggio=triangle, bass=sine

### Stage -1 (Ending) — C, 108 BPM
- 雰囲気: 大団円、余韻
- 進行: C → F → G → Am → F → G → C → C
- 波形: melody=sine, pad=sine, arpeggio=triangle, bass=sine

## Error Handling

- `BGM_CONFIGS[stageNumber]` が見つからない場合、`BGM_CONFIGS[0]`（タイトル）をフォールバック
- OscillatorNode生成でエラーが発生した場合、そのレイヤーのみスキップ（他レイヤーは再生継続）
- stopBGM()では `.stop()` と `.disconnect()` をそれぞれ try-catch で保護

## Performance Contract

- 同時OscillatorNode数: 最大7（ベース1 + パッド4 + アルペジオ1 + メロディ1）
- アルペジオ/メロディの一時ノードは `.stop()` 後に参照を解放
- GainNode の `linearRampToValueAtTime` でノート終了時にフェードアウト（クリックノイズ防止）
