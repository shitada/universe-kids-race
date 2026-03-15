# Research: ゲーム体験改善第3弾 — HUDステージ番号・テキスト選択防止・BGM強化

**Feature**: `004-gameplay-audio-polish`
**Date**: 2026-03-15

## Research Task 1: Web Audio API 多層BGMアーキテクチャ

### Decision
現在のplayBGM()を全面改修し、4レイヤー同時再生構成にする。setTimeout ベースのシーケンサーで小節単位のループを制御する。

**レイヤー構成**:
1. **ベース**: 1つのOscillatorNode（持続音）。コード変更時に `frequency.setValueAtTime()` で周波数を切り替え
2. **コードパッド**: 3〜4つのOscillatorNode（持続音）。コード変更時に各ノードの周波数を切り替え
3. **アルペジオ**: コードの構成音を順番に鳴らす。コードごとに3〜4音をsetTimeoutで順次スケジューリング
4. **メロディ**: 既存のメロディシーケンサーと同様。各拍でOscillatorNodeを生成→発音→停止

**同時発音数**: 最大で ベース(1) + パッド(4) + アルペジオ(1) + メロディ(1) = **7 OscillatorNode**

### Rationale
- 現在のplayBGM()は ベース(1持続) + メロディ(1シーケンシャル) の2レイヤー構成
- コードパッドは持続音なのでOscillatorNodeを常時保持する方がシンプル
- アルペジオとメロディは一時的なノードを生成→停止する既存パターンを踏襲
- setTimeout ベースのスケジューリングは現在のメロディシーケンサーで動作実績あり

### Alternatives Considered
1. **AudioContext.currentTime ベースのスケジューリング** — より正確だが実装が複雑。setTimeout でもBGMレベルの精度は十分。却下
2. **AudioWorklet** — 低レベル制御が可能だが、YAGNI原則に反する。OscillatorNode で十分。却下
3. **Web Audio APIのGainNodeでレイヤーミキシング** — 各レイヤーにGainNodeを持たせることで音量バランス制御が容易。**採用**

### Implementation Detail

```typescript
// 持続音レイヤー（ベース・パッド）の周波数切り替え
// コード変更タイミングでsetValueAtTimeを使用
bassOsc.frequency.setValueAtTime(newFreq, ctx.currentTime);

// パッドは3-4つのOscillatorNodeの配列
padOscillators.forEach((osc, i) => {
  osc.frequency.setValueAtTime(chord[i], ctx.currentTime);
});
```

---

## Research Task 2: コード進行設計（8ステージ + タイトル + エンディング）

### Decision
各ステージのコード進行を以下の方針で設計する:

- **8小節（8コード）ループ**: 各コードは1小節（4拍）= `240 / tempo` 秒
- **冒険開始（Stage 1-2）**: メジャーキー、穏やか
- **中盤探索（Stage 3-5）**: マイナー混在、神秘的
- **終盤盛り上げ（Stage 6-8）**: テンション上昇、クライマックス感
- **タイトル（Stage 0）**: マイナー → メジャーの進行で冒険の予感
- **エンディング（Stage -1）**: メジャーキー、勝利感

**ステージ別キーとコード進行**:

| Stage | キー | テンポ(BPM) | コード進行 | 雰囲気 |
|-------|------|------------|-----------|--------|
| 0 (Title) | Am | 100 | Am → F → C → G → Am → F → G → C | 冒険の予感（マイナー→メジャー解決） |
| 1 (月) | C | 110 | C → Am → F → G → C → Em → F → G | 穏やか、出発 |
| 2 (火星) | D | 118 | D → Bm → G → A → D → F#m → G → A | やや活発 |
| 3 (木星) | Eb | 120 | Ebm → Cb → Gb → Db → Ebm → Cb → Db → Gb | 壮大、神秘的 |
| 4 (土星) | Em | 115 | Em → C → G → D → Em → Am → B → Em | ミステリアス |
| 5 (天王星) | F | 125 | Fm → Db → Ab → Eb → Fm → Db → Eb → Ab | 遠い宇宙感 |
| 6 (海王星) | G | 130 | G → Em → C → D → G → Bm → C → D | 力強い前進 |
| 7 (冥王星) | Am | 135 | Am → F → Dm → E → Am → G → F → E | 緊張感のあるマイナー |
| 8 (太陽) | C | 140 | C → G → Am → F → C → G → F → C | 勝利のクライマックス |
| -1 (Ending) | C | 108 | C → F → G → Am → F → G → C → C | 大団円、余韻 |

### Rationale
- 子供向けゲームなので不協和音は避け、基本的なメジャー/マイナーコードを使用
- 冒険の進行に合わせてテンポを段階的に上昇（100→140 BPM）
- タイトルはAm→Cへの解決でワクワク感を演出
- ステージ8（太陽・最終面）はCメジャーで明るく壮大に

### Alternatives Considered
1. **ジャズコード（7th, 9th等）** — 子供向けには複雑すぎる。基本三和音で十分。却下
2. **全ステージ同じキー** — 冒険の進行感が出ない。ステージごとに変えることで新鮮さを維持。却下
3. **16小節ループ** — 長すぎてメモリ/定義量が増える。8小節で十分な変化を表現できる。却下

---

## Research Task 3: iPad Safari でのOscillatorNode同時実行パフォーマンス

### Decision
iPad Air以降のデバイスで7つのOscillatorNode同時実行は問題なし。安全マージンを含め、10ノード以下を維持する設計とする。

### Rationale
- iPad Safari のWeb Audio API は少なくとも **32〜64チャンネル** の同時発音をサポート
- 現在のベース+メロディの2ノード → 最大7ノードへの増加は問題ない
- 各OscillatorNodeのCPU負荷は極めて軽量（ハードウェアアクセラレーション対象）
- アルペジオ・メロディの一時ノードは短寿命（`.stop()` 後にGC対象）

### Alternatives Considered
1. **OfflineAudioContext で事前レンダリング** — YAGNI。リアルタイム生成で十分。却下
2. **AudioBufferSourceNode で事前計算波形** — 柔軟性が低下。OscillatorNodeの方がコード変更時の周波数切り替えが容易。却下

---

## Research Task 4: CSS user-select と contextmenu の iPad Safari 対応

### Decision
以下の3つの対策を組み合わせる:

1. **CSS**: `body` に `user-select: none; -webkit-user-select: none; -webkit-touch-callout: none` を適用
2. **JS**: `#game-canvas` と `#ui-overlay` に `contextmenu` イベントの `preventDefault()` を追加
3. **CSS**: `body` に `-webkit-touch-callout: none` を適用（長押しメニュー抑制）

### Rationale
- iPad Safari は `-webkit-user-select: none` と `-webkit-touch-callout: none` を両方サポート
- `user-select: none` は標準プロパティだが、Safari では `-webkit-` プレフィックス版も必要
- `contextmenu` イベントの `preventDefault()` は長押し時のシステムメニューを抑制
- `body` に適用することでゲーム画面全体をカバー

### Implementation Detail

**index.html の `<style>` に追加**:
```css
html, body {
  /* 既存のスタイル */
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
```

**index.html の `<body>` 末尾にインラインスクリプト追加**（Viteモジュール読み込み前に実行）:
```html
<script>
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
</script>
```

### Alternatives Considered
1. **各DOM要素に個別適用** — 漏れのリスクがある。body全体に一括適用の方が確実。却下
2. **JavaScriptで動的にCSSを注入** — 不要な複雑さ。静的CSSで十分。却下
3. **contextmenuをbodyではなくdocumentに適用** — document全体でOK。**採用**（漏れなし）

---

## Research Task 5: HUDステージ番号表示の実装方針

### Decision
StageScene.enter() で stageName 文字列を構成し、HUD.show()に渡す。HUD.show()自体の変更は不要。

### Rationale
- 現在: `const stageName = \`${this.stageConfig.emoji} ${this.stageConfig.displayName}\``
- 変更後: `const stageName = \`ステージ${this.stageConfig.stageNumber}: ${this.stageConfig.emoji} ${this.stageConfig.displayName}\``
- HUD.show() は受け取った文字列をそのまま表示するので、呼び出し側の変更だけで完結
- StageConfig に stageNumber は既に存在するので、型や設定の変更は不要

### Alternatives Considered
1. **HUD.show()にstageNumberを別パラメータとして追加** — HUDがステージ番号のフォーマットを知る必要が生じ、責務が増える。却下
2. **StageConfigにformattedNameフィールドを追加** — YAGNI。文字列テンプレートリテラルで十分。却下

---

## Research Task 6: OscillatorType の選定（ステージ別音色）

### Decision
各レイヤーのOscillatorTypeをステージの雰囲気に合わせて設定する。

| レイヤー | 序盤(1-3) | 中盤(4-5) | 終盤(6-8) | タイトル | エンディング |
|---------|----------|----------|----------|---------|------------|
| メロディ | sine | triangle | square | sine | sine |
| パッド | sine | sine | triangle | sine | sine |
| アルペジオ | sine | triangle | triangle | triangle | triangle |
| ベース | sine | sine | sine | sine | sine |

### Rationale
- **sine**: 最も柔らかい。序盤の穏やかな雰囲気に適切。子供の耳に優しい
- **triangle**: sineよりやや豊かな倍音。中盤の神秘感に適切
- **square**: 最もはっきりした音色。終盤の盛り上がりに適切（ただし音量を下げて耳障りにならないように）
- **sawtooth**: 未使用。倍音が多すぎて子供向けには攻撃的すぎる

### Alternatives Considered
1. **全ステージ同じ音色**: 冒険の進行感が出ない。却下
2. **sawtooth を終盤で使用**: 子供の耳には刺激が強すぎる。squareをやや下げた音量で使う方が安全。却下
