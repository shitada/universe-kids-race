# Research: デバイス互換性 & オーディオ修正

**Feature**: 011-device-compat-audio-fix | **Date**: 2026-03-16

## R1: Safari AudioContext suspended 状態の再開パターン

**Decision**: `AudioContext.resume()` を `ensureResumed()` メソッドとして切り出し、再生系メソッドの冒頭と `visibilitychange` イベントで呼び出す

**Rationale**:
- Safari（iOS/macOS）は AudioContext をバックグラウンド遷移時に自動で `suspended` にする
- `resume()` は Promise を返すが、ユーザージェスチャーのコールスタック内であれば同期的に状態変更される
- `visibilitychange` の `!document.hidden` タイミングはユーザーの操作（タップでアプリ復帰）に紐づくため、resume が成功する
- `playBGM()` / `playSFX()` / `startBoostSFX()` の冒頭で呼べば、再生直前に確実に再開される
- `initSync()` でも既に初期化済みかつ suspended の場合は resume を呼ぶように修正

**Alternatives considered**:
- `setInterval` でポーリングして suspended を検出 → 不要な CPU 消費、ユーザージェスチャー外での resume は Safari で失敗する可能性
- AudioContext を毎回作り直す → 既存の oscillator/gain ノードが全て無効になり、複雑化

## R2: BGM 重複防止の世代カウンタパターン

**Decision**: `bgmGeneration` カウンタを導入し、シーケンサーの `tick()` コールバック内で世代不一致を検出して再スケジュールを停止する

**Rationale**:
- 現在の `stopBGM()` は `clearTimeout(bgmTimer)` で次の tick をキャンセルし、persistent oscillator を stop するが、`tick()` が既に実行中の場合は新しい setTimeout がセットされた後に clearTimeout が呼ばれる可能性がある（レースコンディション）
- `bgmGeneration` を `playBGM()` 呼び出しごとにインクリメントし、`tick()` のクロージャに世代番号をキャプチャすることで、古い世代の tick は自動的に停止する
- `stopBGM()` で `bgmGeneration++` も行い、停止後の tick も確実に無効化
- `bgmPlaying` フラグは再生状態の追跡に使用（将来の参照用）

**Alternatives considered**:
- ミューテックスやロック機構 → JavaScript はシングルスレッドなので不要。setTimeout のコールバック間のレース対策には世代カウンタで十分
- `playBGM()` の呼び出しをデバウンス → 正当な高速切り替え（シーン遷移）を遅延させてしまう

## R3: TitleScene BGM 重複の根本原因と修正

**Decision**: overlay の `pointerdown` リスナーから `playBGM(0)` を除去し、`initSync()` のみを呼ぶ

**Rationale**:
- 現在の TitleScene には2つの BGM 再生ポイントがある:
  1. overlay 全体の `pointerdown`（`{ once: true }`）→ `initSync()` + `playBGM(0)`
  2. 「あそぶ」ボタンの `pointerdown`（`stopPropagation` あり）→ `initSync()` + `playBGM(0)` + シーン遷移
- ユーザーが overlay をタップ → BGM 開始、すぐに「あそぶ」をタップ → 2つ目の playBGM が呼ばれる
- overlay の `pointerdown` は AudioContext 初期化（`initSync()`）だけに限定し、BGM はシーン遷移時に再生すれば十分
- タイトル画面で BGM を聴かせたい場合は「あそぶ」ボタン以外の領域タップ時に再生するが、ユーザーは素早く「あそぶ」を押す想定なのでタイトル BGM は不要

**Alternatives considered**:
- overlay の pointerdown を完全に削除 → iPad Safari では初回ユーザージェスチャーなしに AudioContext を作れないため、initSync() は残す必要あり
- playBGM 内でデバウンス → 正当な連続呼び出し（シーン遷移）を阻害

## R4: iPhone safe area の CSS 実装パターン

**Decision**: `viewport-fit=cover` + `env(safe-area-inset-*)` を body/HUD/ボタンに適用

**Rationale**:
- `viewport-fit=cover` を viewport meta に追加すると、ブラウザはノッチ/Dynamic Island 領域まで描画を拡張する
- `env(safe-area-inset-left)`, `env(safe-area-inset-right)`, `env(safe-area-inset-bottom)` で safe area 外のパディングを設定
- 横画面時: ノッチ側が `left` または `right`、ホームインジケータが `bottom`
- `@supports (padding: env(safe-area-inset-left))` でプログレッシブエンハンスメントし、非対応ブラウザ（iPad の一部旧バージョン）への影響を防ぐ
- Canvas（#game-canvas）は全画面のまま維持し、HUD/ボタンの UI 要素のみ safe area を適用
- `clamp()` でフォントサイズとボタンサイズを小画面に対応

**Alternatives considered**:
- JavaScript で safe area inset を取得して動的に適用 → CSS で十分対応可能。JS は不要な複雑さ
- Canvas 自体を safe area 内に収める → ゲームの没入感が損なわれる。3D 描画は全画面が望ましい

## R5: PC キーボード入力の実装パターン

**Decision**: InputSystem に `keydown`/`keyup` リスナーを追加し、押下中のキーを `Set<string>` で管理。`getState()` でポインター入力とマージ

**Rationale**:
- `keydown` / `keyup` は `window` に登録（canvas は focus を失うことがあるため）
- `Set<string>` で押下中のキーを管理し、`getState()` 呼び出し時にポインター方向とキーボード方向をマージ
- ArrowLeft → moveDirection -1、ArrowRight → +1、両方押し → 0（既存のポインター両サイド押しと同じロジック）
- Space の `keydown` → `boostPressed = true`。StageScene の update ループで消費（`setBoostPressed(false)`）されるため、keyup でのリセットは不要（ただし安全のため keyup でもリセット）
- `e.preventDefault()` は Space キーのみ（ページスクロール防止）。矢印キーは通常の Web ページでは問題ないが、念のため preventDefault
- キーリピートは `e.repeat` で無視（keydown の初回のみ処理）

**Alternatives considered**:
- canvas に `tabindex` を設定して focus → ユーザーが canvas 外をクリックすると focus が外れる。window リスナーの方が堅牢
- `keypress` イベント → 非推奨 API。`keydown`/`keyup` が正しいアプローチ
- ゲームパッド API → YAGNI。まずはキーボードのみ
