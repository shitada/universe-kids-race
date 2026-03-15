# Data Model: ゲーム体験改善第3弾 — HUDステージ番号・テキスト選択防止・BGM強化

**Feature**: `004-gameplay-audio-polish`
**Date**: 2026-03-15

## Entities

### 1. BGMConfig（既存 — 大幅拡張）

BGMの多層構成を定義するインターフェース。既存の単音メロディ+ベース構成を4レイヤー（メロディ・コードパッド・アルペジオ・ベース）に拡張。

#### 旧定義（削除）

| フィールド | 型 | 説明 |
|-----------|------|------|
| melody | `number[]` | メロディ周波数配列 |
| tempo | `number` | BPM |
| waveform | `OscillatorType` | メロディ波形 |
| volume | `number` | メロディ音量 |
| bassFrequency | `number` | ベース周波数（単一） |
| bassVolume | `number` | ベース音量 |

#### 新定義

| フィールド | 型 | 説明 |
|-----------|------|------|
| tempo | `number` | BPM |
| beatsPerChord | `number` | 1コードあたりの拍数（通常4） |
| chords | `number[][]` | コード進行。各要素は3〜4音の周波数配列（8コードでループ） |
| bassNotes | `number[]` | 各コードのベース音周波数（chordsと同じ長さ） |
| melodyNotes | `number[][]` | 各コードに対するメロディ音配列（1コードあたり4音） |
| waveforms | `BGMWaveforms` | レイヤー別OscillatorType |
| volumes | `BGMVolumes` | レイヤー別音量 |

#### BGMWaveforms（新規）

| フィールド | 型 | 説明 |
|-----------|------|------|
| melody | `OscillatorType` | メロディレイヤーの波形 |
| pad | `OscillatorType` | コードパッドレイヤーの波形 |
| arpeggio | `OscillatorType` | アルペジオレイヤーの波形 |
| bass | `OscillatorType` | ベースレイヤーの波形 |

#### BGMVolumes（新規）

| フィールド | 型 | 説明 |
|-----------|------|------|
| melody | `number` | メロディ音量（0.0〜1.0） |
| pad | `number` | コードパッド音量（0.0〜1.0） |
| arpeggio | `number` | アルペジオ音量（0.0〜1.0） |
| bass | `number` | ベース音量（0.0〜1.0） |

---

### 2. AudioManager（既存 — 内部改修）

playBGM()を4レイヤー構成にリファクタ。外部インターフェースは変更なし。

| フィールド | 型 | 変更 | 説明 |
|-----------|------|------|------|
| ctx | `AudioContext \| null` | 変更なし | Web Audio APIコンテキスト |
| initialized | `boolean` | 変更なし | 初期化フラグ |
| bgmOscillators | `OscillatorNode[]` | **用途拡大** | 全持続音OSC（ベース1 + パッド3〜4） |
| bgmGains | `GainNode[]` | **用途拡大** | 全持続音のGainNode |
| bgmTimer | `ReturnType<typeof setTimeout> \| null` | **変更** | メインシーケンサータイマー |

**内部動作の変更**:

`playBGM(stageNumber)` の処理フロー:
```
1. stopBGM() — 既存BGM停止
2. BGMConfig取得
3. ベースOscillatorNode生成 → bgmOscillators に追加
4. パッドOscillatorNode 3〜4つ生成 → bgmOscillators に追加
5. メインシーケンサー開始:
   - 拍ごとにメロディ・アルペジオの一時ノードをスケジュール
   - コード変更タイミングでベース・パッドの周波数を更新
   - 8コード終了後にインデックスを0に戻してループ
```

**状態遷移**:
```
[停止] --playBGM(n)--> [再生中: 4レイヤー発音] --stopBGM()--> [停止]
                                    |
                           [8コード目終了] --ループ--> [1コード目に戻る]
```

---

### 3. StageScene（既存 — 軽微修正）

enter()メソッドでHUDに渡すステージ名文字列のフォーマットのみ変更。

| 変更箇所 | 旧 | 新 |
|---------|-----|-----|
| stageName構成 | `${emoji} ${displayName}` | `ステージ${stageNumber}: ${emoji} ${displayName}` |

---

### 4. index.html（既存 — CSS/JS追加）

テキスト選択とコンテキストメニューの無効化。

**CSS追加** (`html, body` ルールに追加):
| プロパティ | 値 | 目的 |
|-----------|------|------|
| user-select | none | テキスト選択無効化（標準） |
| -webkit-user-select | none | テキスト選択無効化（Safari） |
| -webkit-touch-callout | none | 長押しコールアウト無効化 |

**JS追加**:
| イベント | ハンドラ | 目的 |
|---------|---------|------|
| contextmenu (document) | `e.preventDefault()` | コンテキストメニュー無効化 |

## 周波数定数テーブル

コード進行で使用する主要な音名と周波数（Hz）の対応:

| 音名 | C3 | D3 | Eb3 | E3 | F3 | G3 | A3 | Bb3 | B3 |
|------|-----|-----|------|-----|-----|-----|-----|------|-----|
| Hz | 131 | 147 | 156 | 165 | 175 | 196 | 220 | 233 | 247 |

| 音名 | C4 | D4 | Eb4 | E4 | F4 | G4 | A4 | Bb4 | B4 |
|------|-----|-----|------|-----|-----|-----|-----|------|-----|
| Hz | 262 | 294 | 311 | 330 | 349 | 392 | 440 | 466 | 494 |

| 音名 | C5 | D5 | Eb5 | E5 | F5 | G5 | A5 | Bb5 | B5 |
|------|-----|-----|------|-----|-----|-----|-----|------|-----|
| Hz | 523 | 587 | 622 | 659 | 698 | 784 | 880 | 932 | 988 |
