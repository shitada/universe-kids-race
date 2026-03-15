# Research: iPadゲーム体験改善

**Date**: 2026-03-15
**Feature**: 002-ipad-game-enhancements

## R1: Web Audio API — OscillatorNode によるプログラム生成サウンド

### Decision
Web Audio API の OscillatorNode + GainNode を直接使用し、Three.js の Audio 機能は使わない。

### Rationale
- 既存の AudioManager は Three.js の `THREE.Audio` / `THREE.AudioListener` を使用し、外部音声ファイルの読み込みを前提としていた（プレースホルダー実装）
- 今回は音声ファイル不要のプログラム生成サウンドが要件。OscillatorNode で波形生成し、GainNode でエンベロープ制御すれば完結する
- Three.js Audio は内部で AudioContext を管理するが、OscillatorNode を直接扱う場合は AudioContext を自前管理する方がシンプル
- Three.js のPositionalAudio（3D空間音声）は不要 — iPad 単体スピーカーで空間的な効果は体感できない

### Alternatives Considered
1. **Three.js Audio + AudioBuffer に生成波形を書き込み** — 余分な抽象化レイヤー。OscillatorNode のリアルタイム生成の方が軽量
2. **Tone.js ライブラリ** — 憲法 V「外部ライブラリは Three.js 以外は原則追加しない」に違反
3. **AudioWorklet** — 高度すぎる。子供向けゲームのシンプルな効果音に不要

### Implementation Notes
- `AudioContext` を1つ管理し、BGM 用に複数 OscillatorNode を同時再生（和音）
- SFX は短寿命の OscillatorNode を都度生成 → GainNode でフェードアウト → 自動 disconnect
- iPad Safari の AudioContext resume は、タイトル画面の「あそぶ」ボタンタップ時に実行

---

## R2: iPad Safari AudioContext resume 対策

### Decision
タイトル画面の「あそぶ」ボタンの pointerdown イベントハンドラ内で `AudioContext.resume()` を呼ぶ。

### Rationale
- iPad Safari は自動再生ポリシーにより AudioContext が `suspended` 状態で起動する
- ユーザージェスチャー（タッチ）のイベントハンドラ内でのみ `resume()` が成功する
- 既存の TitleScene はすでに「あそぶ」ボタンの pointerdown で `audioManager.init()` を呼んでおり、パターンは確立済み
- AudioContext のインスタンスはアプリ全体で1つを使い回す（シーン遷移で再生成しない）

### Alternatives Considered
1. **各シーンの enter() で resume** — ユーザージェスチャーコンテキスト外で呼ばれる可能性があり不確実
2. **document 全体の touchstart で resume** — 意図しないタイミングで音が鳴る可能性
3. **resume ボタンを個別に配置** — UX が悪い。既存の「あそぶ」ボタンに統合が自然

---

## R3: プログラム生成 BGM のアプローチ

### Decision
OscillatorNode で簡易的な音階シーケンス（アルペジオ）をループ再生する。ステージごとに基本周波数・波形・テンポを変える。

### Rationale
- 子供向けのポップで明るい BGM が要件
- OscillatorNode 単体で「メロディ」を実現するには、タイマー（setInterval or AudioContext.currentTime ベース）で音階を切り替えるシーケンサーを実装する
- AudioContext.currentTime ベースのスケジューリングが正確で推奨（setInterval はタイマー精度が不安定）
- 波形は `sine`（柔らかい）と `square`（8bit ゲーム風）を組み合わせ
- 各ステージで異なる音階パターン（配列）を定義。最終ステージ「太陽」は長調でクライマックス感

### BGM 構成
- **メロディレイヤー**: square wave、音階シーケンスをループ
- **ベースレイヤー**: sine wave、ルート音を低音で持続
- **GainNode**: メロディ音量 0.08〜0.12、ベース音量 0.05〜0.08（iPad スピーカーで適切な音量）
- **テンポ**: BPM 120〜140（子供が楽しめるテンポ）

---

## R4: プログラム生成 SFX のアプローチ

### Decision
各効果音イベントに対して短寿命の OscillatorNode を生成し、GainNode のエンベロープで音の形を作る。

### Rationale
- SFX は瞬間的（0.1〜0.5秒）なので、OscillatorNode を `start()`/`stop()` で制御
- 複数 SFX の同時再生をサポート（星を連続収集するケース）
- GainNode の `exponentialRampToValueAtTime()` で自然なフェードアウト

### SFX 設計

| Effect | Waveform | Frequency | Duration | Notes |
|--------|----------|-----------|----------|-------|
| starCollect (通常) | sine | 880→1320Hz (sweep up) | 0.15s | キラキラ感 |
| starCollect (虹色) | sine | 440→880→1760Hz (arpeggio) | 0.3s | より華やか |
| meteoriteHit | sawtooth | 200→80Hz (sweep down) | 0.3s | 衝撃感 |
| boost | square | 440→880Hz (fast sweep) | 0.2s | 加速感 |
| stageClear | sine | C5-E5-G5-C6 arpeggio | 0.8s | 達成ジングル |

---

## R5: Three.js パーティクルシステム（Points + BufferGeometry）

### Decision
`THREE.Points` + `THREE.BufferGeometry` でパーティクルバーストを実装。各バーストは独立したオブジェクトプールエントリ。

### Rationale
- Three.js の Points は GPU 描画のため大量のパーティクルを効率的にレンダリング可能
- BufferGeometry の position/color attribute を毎フレーム更新することでアニメーション
- iPad Safari でも 200〜300 パーティクル程度なら 60fps 維持可能

### Implementation Notes
- **パーティクル数**: 通常の星 = 20個、虹色の星 = 50個
- **初速**: 放射状にランダム方向、速度 5〜15
- **寿命**: 0.5〜1.0秒
- **減衰**: 線形でサイズと不透明度が減少
- **オブジェクトプール**: 最大同時バースト数 = 10（それ以上は古いものを再利用）
- **色**: 通常星 = 金色(0xFFDD00)、虹色星 = ランダム HSL

---

## R6: StageConfig 8ステージ拡張

### Decision
既存の `STAGE_CONFIGS` 配列を3要素から8要素に拡張。各ステージの stageLength を2〜3倍に延長し、難易度を段階的に上昇させる。

### Rationale
- 既存の StageConfig 型は変更不要（stageNumber, destination, stageLength, meteoriteInterval, starDensity）
- ステージ順序: 月→火星→木星→土星→天王星→海王星→冥王星→太陽
- stageLength: 1000（月）〜 2500（太陽）、段階的に長く
- meteoriteInterval: 3.0s（月）→ 0.6s（太陽）、段階的に短く
- starDensity: 5（月）→ 10（太陽）、段階的に増加
- SaveData.clearedStage の範囲が 0〜7 に拡大（既存は 0〜3）

### Stage Parameters

| # | Destination | stageLength | meteoriteInterval | starDensity |
|---|-------------|-------------|-------------------|-------------|
| 1 | 月          | 1000        | 3.0               | 5           |
| 2 | 火星        | 1200        | 2.5               | 5           |
| 3 | 木星        | 1400        | 2.0               | 6           |
| 4 | 土星        | 1600        | 1.7               | 6           |
| 5 | 天王星      | 1800        | 1.4               | 7           |
| 6 | 海王星      | 2000        | 1.1               | 8           |
| 7 | 冥王星      | 2200        | 0.8               | 9           |
| 8 | 太陽        | 2500        | 0.6               | 10          |

---

## R7: HUD ステージ名表示

### Decision
既存の HUD クラスに DOM 要素を1つ追加。`show()` 時にステージ名を受け取り、上部中央に表示する。

### Rationale
- 既存 HUD はスコア（左）と星の数（右）をフレックスボックスで配置
- ステージ名は上部中央に別行で追加。既存レイアウトとの干渉を避けるため、container の上に挿入
- 表示形式: 「{絵文字} {天体名}をめざせ！」
- フォント: Zen Maru Gothic、色: #FFD700（金色）
- HUD.show() の引数にステージ名/絵文字情報を追加、または StageConfig にステージ表示情報を含める

### Stage Display Names

| # | Emoji | Display Text |
|---|-------|-------------|
| 1 | 🌙 | 月をめざせ！ |
| 2 | 🔴 | 火星をめざせ！ |
| 3 | 🟠 | 木星をめざせ！ |
| 4 | 🪐 | 土星をめざせ！ |
| 5 | 🔵 | 天王星をめざせ！ |
| 6 | 🫧 | 海王星をめざせ！ |
| 7 | ❄️ | 冥王星をめざせ！ |
| 8 | ☀️ | 太陽をめざせ！ |

---

## R8: 目的地惑星の3Dモデル拡張

### Decision
既存の `createDestinationPlanet()` の switch 文を8ケースに拡張。各天体は MeshToonMaterial でカートゥーン調。

### Rationale
- 既存で月(灰)、火星(赤)、土星(黄+リング)の3つが実装済み
- 追加5天体: 木星(オレンジ+縞模様)、天王星(水色)、海王星(青)、冥王星(白/灰)、太陽(黄+発光)
- 太陽は PointLight をアタッチして発光感を演出（最終ステージの特別感）
- SphereGeometry サイズはすべて radius=15（統一感）

---

## R9: AudioManager アーキテクチャ（書き換え方針）

### Decision
既存の AudioManager を完全に書き換え、Three.js Audio 依存を除去し、Web Audio API ネイティブ実装に置き換える。

### Rationale
- 既存 AudioManager は Three.js の AudioListener/Audio を使ったプレースホルダー
- メソッドシグネチャは変更: `playSpatialSFX` を廃止、`playSFX` はイベント名だけで呼べるようにする
- `playBGM(stageNumber)` でステージ番号を受け取り、対応する音楽を生成・再生
- AudioContext は singleton パターンで管理
- エラーハンドリング: init 失敗時は `initialized = false` のまま、全メソッドが no-op（既存と同じフォールバック方針）
