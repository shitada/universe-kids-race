# Data Model: デバイス互換性 & オーディオ修正

**Feature**: 011-device-compat-audio-fix | **Date**: 2026-03-16

## Entities

### AudioManager（拡張）

| Field | Type | Description |
|-------|------|-------------|
| ctx | `AudioContext \| null` | 既存。Web Audio API コンテキスト |
| initialized | `boolean` | 既存。AudioContext 初期化済みフラグ |
| bgmOscillators | `OscillatorNode[]` | 既存。BGM 永続オシレーター |
| bgmGains | `GainNode[]` | 既存。BGM ゲインノード |
| bgmTimer | `ReturnType<typeof setTimeout> \| null` | 既存。シーケンサー tick タイマー |
| **bgmPlaying** | `boolean` | **新規**。BGM 再生中フラグ。`playBGM()` で true、`stopBGM()` で false |
| **bgmGeneration** | `number` | **新規**。BGM 世代カウンタ。`playBGM()` と `stopBGM()` でインクリメント。tick クロージャが世代不一致を検出して自動停止 |
| boostNoiseSource | `AudioBufferSourceNode \| null` | 既存 |
| boostNoiseGain | `GainNode \| null` | 既存 |
| boostNoiseFilter | `BiquadFilterNode \| null` | 既存 |

**新規メソッド**:
- `ensureResumed(): void` — `ctx?.state === 'suspended'` なら `ctx.resume()` を呼ぶ。public メソッド（main.ts の visibilitychange から呼ぶため）

**変更メソッド**:
- `initSync()` — 既に initialized かつ ctx が suspended の場合、resume を呼ぶ
- `playBGM()` — 冒頭で `ensureResumed()` + `bgmGeneration++` + `bgmPlaying = true`。tick クロージャに世代番号をキャプチャ
- `stopBGM()` — `bgmGeneration++` + `bgmPlaying = false` を追加
- `playSFX()` — 冒頭で `ensureResumed()`
- `startBoostSFX()` — 冒頭で `ensureResumed()`

### InputSystem（拡張）

| Field | Type | Description |
|-------|------|-------------|
| state | `InputState` | 既存。`{ moveDirection: -1\|0\|1, boostPressed: boolean }` |
| canvas | `HTMLCanvasElement \| null` | 既存 |
| activePointers | `Map<number, 'left' \| 'right'>` | 既存。アクティブなポインター |
| **pressedKeys** | `Set<string>` | **新規**。押下中のキーコード。`keydown` で追加、`keyup` で削除 |

**新規メソッド**:
- `onKeyDown(e: KeyboardEvent): void` — ArrowLeft/Right を pressedKeys に追加、Space で boostPressed=true、preventDefault
- `onKeyUp(e: KeyboardEvent): void` — pressedKeys から削除

**変更メソッド**:
- `setup(canvas)` — `window.addEventListener('keydown', ...)` と `window.addEventListener('keyup', ...)` を追加
- `getState()` — `updateDirection()` 呼び出し結果にキーボード方向をマージして返す
- `updateDirection()` — ポインター方向計算後、pressedKeys から ArrowLeft/Right を考慮してマージ
- `dispose()` — window から keydown/keyup リスナーを削除、pressedKeys.clear()

### InputState（変更なし）

```typescript
interface InputState {
  moveDirection: -1 | 0 | 1;
  boostPressed: boolean;
}
```

既存の型定義に変更なし。キーボード入力はポインター入力と同じ InputState にマージされるため、下流のコード（StageScene 等）は変更不要。

## State Transitions

### AudioContext 状態

```
[初期] → initSync() → [running]
[running] → バックグラウンド遷移 → [suspended]
[suspended] → ensureResumed() / visibilitychange → [running]
[suspended] → playBGM() / playSFX() / startBoostSFX() → ensureResumed() → [running]
```

### BGM 世代管理

```
playBGM(stage=1):
  bgmGeneration = 1  →  tick(gen=1) runs
                         tick(gen=1) runs
                         ...

playBGM(stage=2):       ← bgmGeneration = 2, stopBGM() → gen++ = 2
  bgmGeneration = 3  →  tick(gen=1) sees gen≠3 → stops
                         tick(gen=3) runs (new BGM)

stopBGM():              ← bgmGeneration = 4
                         tick(gen=3) sees gen≠4 → stops
```

## Validation Rules

- `ensureResumed()` は ctx が null の場合は何もしない（初期化前の呼び出しに対して安全）
- `bgmGeneration` は `playBGM()` の冒頭で `stopBGM()` を呼ぶため、stopBGM のインクリメント + playBGM のインクリメントで2回増える。tick クロージャは playBGM 後の値をキャプチャ
- キーボード入力の `e.repeat` は無視（長押し時の連続 keydown イベント）。Set で管理しているため重複追加は無害だが、Space の boostPressed を何度もセットしないために repeat を弾く
- Space キーの `boostPressed` は StageScene の update ループで `setBoostPressed(false)` にリセットされるため、keydown で true にするだけでよい
