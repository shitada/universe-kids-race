# Data Model: iPadゲーム体験改善

**Date**: 2026-03-15
**Feature**: 002-ipad-game-enhancements

## Entities

### StageConfig (既存 — 拡張)

既存の `StageConfig` 型に表示用フィールドを追加。

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| stageNumber | number | ステージ番号 (1-8) | 1 ≤ n ≤ 8 |
| destination | string | 目的地名（漢字） | 非空文字列 |
| stageLength | number | ステージの長さ | > 0 |
| meteoriteInterval | number | 隕石出現間隔（秒） | > 0 |
| starDensity | number | 星の密度 | > 0 |
| emoji | string | 天体の絵文字 | 非空文字列 |
| displayName | string | HUD表示名（ひらがな） | 非空文字列 |
| planetColor | number | 天体の3Dモデル色 (hex) | valid hex color |

**新規フィールド**: `emoji`, `displayName`, `planetColor`

### BGMConfig (新規 — StageConfig 内に埋め込みまたは別定義)

BGM 生成パラメータ。AudioManager 内部で使用。

| Field | Type | Description |
|-------|------|-------------|
| tempo | number | BPM (120-140) |
| waveform | OscillatorType | メロディの波形 ('sine' \| 'square' \| 'triangle') |
| baseFrequency | number | ベース音の周波数 (Hz) |
| melody | number[] | 音階シーケンス（周波数の配列） |
| volume | number | マスターボリューム (0-1) |

**Notes**: BGMConfig はコード内定数として定義。StageConfig には含めない（関心の分離）。

### ParticleBurstConfig (新規)

パーティクルバースト生成パラメータ。

| Field | Type | Description |
|-------|------|-------------|
| position | {x, y, z} | バースト発生位置 |
| color | number | パーティクルの基本色 (hex) |
| particleCount | number | パーティクル数 (20 or 50) |
| speed | number | 初速 (5-15) |
| lifetime | number | 寿命（秒） (0.5-1.0) |
| isRainbow | boolean | 虹色モードか |

### SFXType (新規 — enum 拡張)

既存の `SoundEffect` 型を拡張。

| Value | Description |
|-------|-------------|
| 'starCollect' | 通常星の収集音 |
| 'rainbowCollect' | 虹色星の収集音 |
| 'meteoriteHit' | 隕石衝突音 |
| 'boost' | ブースト発動音 |
| 'stageClear' | ステージクリアジングル |

**変更**: 既存の `'starCollect'` を通常星用とし、`'rainbowCollect'` を追加。

### SaveData (既存 — 値域拡大)

| Field | Type | Description | 変更 |
|-------|------|-------------|------|
| clearedStage | number | クリア済みステージ数 | 0-3 → 0-8 |

**Notes**: 型定義自体は変更不要（number 型）。実行時の値域が広がるだけ。

## Relationships

```
StageConfig 1:1 BGMConfig    — ステージ番号で紐づく（BGMConfig はAudioManager内の定数マップ）
StageConfig 1:N ParticleBurst — ステージ中に複数のバーストが発生
Star 1:1 ParticleBurst       — 星の収集ごとに1バースト
Star.starType → SFXType      — NORMAL→'starCollect', RAINBOW→'rainbowCollect'
```

## State Transitions

### AudioContext State

```
[constructor] → suspended
  ↓ (user tap on title screen)
suspended → running  (AudioContext.resume())
  ↓ (init failure)
suspended → closed   (fallback: no sound)
```

### ParticleBurst Lifecycle

```
[created] → active
  ↓ (lifetime expires)
active → expired
  ↓ (cleanup)
expired → [recycled to pool]
```

### Stage Progression (updated: 3→8)

```
Title → Stage 1 (月) → Stage 2 (火星) → Stage 3 (木星) → Stage 4 (土星)
  → Stage 5 (天王星) → Stage 6 (海王星) → Stage 7 (冥王星) → Stage 8 (太陽) → Ending
```
