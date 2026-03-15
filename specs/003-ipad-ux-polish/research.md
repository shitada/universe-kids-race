# Research: iPadゲーム体験改善 第2弾 — UXポリッシュ

**Feature**: `003-ipad-ux-polish`  
**Date**: 2026-03-15

## Research Task 1: iPad Safari AudioContext 同期初期化パターン

### Decision
`AudioManager.init()` を同期メソッドに変更する。`new AudioContext()` と `.resume()` をユーザージェスチャーの pointerdown イベントハンドラ内で直接（同期的に）呼び出す。`async/await` は使わない。

### Rationale
iPad Safari は AudioContext の autoplay policy により、`AudioContext.resume()` がユーザージェスチャーの **同期コールスタック** 内で呼ばれた場合のみ成功する。現在のコードは `async init()` で `await this.ctx.resume()` としているため、Promise のマイクロタスクで実行がジェスチャーコールスタックから離脱し、Safari が「ユーザー操作なし」と判定してブロックする。

`.resume()` 自体は Promise を返すが、**呼び出すこと自体が同期コールスタック内であれば Safari はそれを認識する**。返された Promise の解決を待つ必要はない。

### Alternatives Considered
1. **`touchstart` で AudioContext をウォームアップし、後から resume** — 複雑で、2段階のユーザー操作が必要。却下
2. **silent AudioBuffer を再生してアンロック** — ハック的で将来の Safari 更新で壊れるリスクがある。却下
3. **ユーザーに「音声を有効にする」ボタンを別途表示** — UX悪化。子供に追加のステップを求めるのは不適切。却下

### Implementation Detail

```typescript
// Before (broken on iPad Safari):
async init(): Promise<void> {
  this.ctx = new AudioContext();
  await this.ctx.resume(); // ← ジェスチャーから離脱
}

// After (works on iPad Safari):
initSync(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx();
    this.ctx.resume(); // 同期コールスタック内で呼ぶ。Promiseは待たない
    this.initialized = true;
  } catch {
    this.initialized = false;
  }
}
```

TitleScene の pointerdown ハンドラ:
```typescript
button.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  this.audioManager.initSync(); // 同期呼び出し
  this.audioManager.playBGM(0);
  // ... scene transition
});
```

---

## Research Task 2: HUD ステージ名 視認性問題の分析

### Decision
現在の `#hud` 要素（z-index: 10）に追加されたステージ名は、構造上は表示されるが、以下の問題で iPad 実機で視認しにくい可能性がある:
1. `font-size: 1.2rem` が iPad の画面サイズに対して小さい
2. `padding: 0.5rem` が Safe Area を考慮していない
3. `pointer-events: none` は問題なし（テキスト表示のみ）

修正: `font-size` を `1.5rem` に増大、`text-shadow` を追加してコントラスト向上、`padding-top` に `env(safe-area-inset-top)` を加味。

### Rationale
iPad Safari は画面上端にステータスバーがなく Safe Area がほぼゼロだが、フルスクリーン PWA モードでは上部に若干のインセットが生じうる。`env(safe-area-inset-top)` で安全に対応する。

### Alternatives Considered
1. **ステージ名を `#ui-overlay` に移動** — z-index は高いが、pointer-events: auto が伝播してゲーム操作に干渉するリスク。却下
2. **Canvas 内に Three.js テキストで描画** — DOM より複雑で文字化けリスク。却下

---

## Research Task 3: ホームボタンの配置と干渉回避

### Decision
ホームボタンは HUD の左上（`#hud` 内）に配置する。`pointer-events: auto` を明示的に設定し、`position: absolute; top: 0.5rem; left: 1rem` で固定。ブーストボタン（右下）と十分な距離を確保。

### Rationale
- 左上はゲーム操作領域（画面中央〜下部の左右タッチ、右下のブースト）と最も離れている
- スマホ/タブレットの慣例で左上はナビゲーション（戻るボタン）の標準位置
- 子供が意図せず触れにくい位置

### Alternatives Considered
1. **右上** — スコア/星の数表示と近すぎる。却下
2. **左下** — 左手タッチ操作領域と干渉。却下
3. **確認ダイアログ付き** — 子供にとって余計なステップ。YAGNI。却下

---

## Research Task 4: CSS アニメーションのパフォーマンス（iPad Safari）

### Decision
チュートリアルのアニメーションとクールダウンインジケーターは純粋な CSS アニメーション（`@keyframes` + `animation`）と CSS `transform`/`opacity` のみで実装する。JavaScript による毎フレーム DOM 操作は最小限にする。

### Rationale
- `transform` と `opacity` は GPU コンポジターレイヤーで処理され、メインスレッドをブロックしない
- `width`/`height`/`left`/`top` のアニメーションは Layout を発生させ、パフォーマンスに悪影響
- クールダウンインジケーターの進捗更新は `style.width` (linear bar) または `conic-gradient` の角度変更で対応。`conic-gradient` はペイントのみで Layout なし

### Implementation Strategy
- **チュートリアル**: 手のアイコンの左右移動は `@keyframes` で `translateX()` を使用
- **クールダウンバー**: `div` の `width` を `BoostSystem.getCooldownProgress()` に基づいて更新（毎フレーム1回の style.width 変更は許容範囲）
- **ブーストボタン pulse**: CSS `animation: pulse 1.5s infinite` で継続アニメーション
- **クールダウン完了エフェクト**: CSS `@keyframes glow` で opacity + box-shadow を一瞬光らせる

### Alternatives Considered
1. **Canvas/WebGL でインジケーター描画** — 過剰。DOM + CSS で十分。却下
2. **requestAnimationFrame で JS アニメーション** — CSS animation の方が宣言的でシンプル。却下

---

## Research Task 5: TutorialOverlay の設計パターン

### Decision
`TutorialOverlay` は独立したクラスとして `src/ui/TutorialOverlay.ts` に配置する。DOM オーバーレイ(`#ui-overlay` に追加) として実装し、3つのステップ（移動・ブースト・目的）を CSS アニメーションで表示する。

### Rationale
- 既存の Scene アーキテクチャとは独立したUIコンポーネントで、Three.js Scene としての実装は不要
- 表示/非表示のみの単純なライフサイクル → `show()`/`hide()` メソッドで十分
- TitleScene が `TutorialOverlay.show()` を呼び、閉じるボタンの callback で `hide()` する

### Design
```
┌──────────────────────────────────────────┐
│           あそびかた                       │
│                                          │
│  🚀                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │ 👈👉  │  │ 🚀⬆️  │  │ ⭐🏁  │           │
│  │ ひだり│  │ブースト│  │ ほしを│           │
│  │ みぎ  │  │ ぼたん│  │あつめて│           │
│  │にタッチ│  │をタップ│  │ゴール │           │
│  └──────┘  └──────┘  └──────┘           │
│                                          │
│        [とじる]                           │
└──────────────────────────────────────────┘
```

3つのカードを横並びで表示。各カードに CSS アニメーション:
1. 移動カード: 手アイコン👆が左右に移動する `translateX` アニメーション
2. ブーストカード: ロケット🚀アイコンが上にパルスする `translateY` アニメーション
3. 目的カード: 星⭐が回転しながら光る `rotate` + `opacity` アニメーション

### Alternatives Considered
1. **Scene として実装** — Three.js シーンは不要でオーバーエンジニアリング。却下
2. **ステップ送り（prev/next）** — 子供が操作するには複雑。1画面表示がシンプル。却下
3. **自動進行スライドショー** — タイミングが合わず子供が読めないリスク。常時表示の方が安全。却下

---

## Research Task 6: BoostSystem クールダウン進捗の公開

### Decision
`BoostSystem` に `getCooldownProgress(): number` メソッドを追加する。0.0（クールダウン開始直後）〜 1.0（クールダウン完了 = 使用可能）の値を返す。

### Rationale
- HUD がクールダウンインジケーターを更新するために、毎フレーム BoostSystem から進捗値を取得する必要がある
- 既存の `isAvailable()` は boolean のみで進捗度合いが分からない
- StageScene の `update()` 内で `hud.updateCooldown(boostSystem.getCooldownProgress())` のように呼ぶ

### Implementation

```typescript
getCooldownProgress(): number {
  if (this.available) return 1.0;
  if (this.active) return 0.0;
  return 1.0 - (this.cooldownTimer / BoostSystem.COOLDOWN);
}
```

### Alternatives Considered
1. **タイマー値を直接公開してHUD側で計算** — カプセル化が壊れる。却下
2. **イベントベース（EventEmitter）** — YAGNI。ポーリングで十分。却下
