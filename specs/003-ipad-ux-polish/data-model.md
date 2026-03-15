# Data Model: iPadゲーム体験改善 第2弾 — UXポリッシュ

**Feature**: `003-ipad-ux-polish`  
**Date**: 2026-03-15

## Entities

### 1. AudioManager（既存 — 修正）

AudioContext の初期化を同期メソッドに変更。

| フィールド | 型 | 説明 |
|-----------|------|------|
| ctx | `AudioContext \| null` | Web Audio API コンテキスト |
| initialized | `boolean` | 初期化成功フラグ |

**変更点**:
- `async init(): Promise<void>` → `initSync(): void` に変更
- 同期コールスタック内で `new AudioContext()` + `.resume()` を実行
- `await` を排除

**状態遷移**:
```
[未初期化] --initSync()--> [初期化済み (initialized=true)]
                      └--> [初期化失敗 (initialized=false)]
```

---

### 2. BoostSystem（既存 — 修正）

クールダウン進捗値の公開。

| フィールド | 型 | 説明 |
|-----------|------|------|
| active | `boolean` | ブースト発動中 |
| available | `boolean` | ブースト使用可能 |
| durationTimer | `number` | ブースト残り時間 (秒) |
| cooldownTimer | `number` | クールダウン残り時間 (秒) |

**追加メソッド**:
- `getCooldownProgress(): number` — 0.0（クールダウン開始）〜 1.0（使用可能）

**状態遷移**:
```
[Available] --activate()--> [Active] --duration expires--> [Cooldown] --timer expires--> [Available]
   (progress=1.0)           (progress=0.0)                (progress=0.0→1.0)            (progress=1.0)
```

---

### 3. HUD（既存 — 大幅修正）

ステージ名の視認性修正、ホームボタン追加、ブーストボタンデザイン刷新、クールダウンインジケーター追加。

| フィールド | 型 | 説明 |
|-----------|------|------|
| container | `HTMLDivElement \| null` | スコア/星の数コンテナ |
| stageNameEl | `HTMLDivElement \| null` | ステージ名表示要素 |
| scoreEl | `HTMLSpanElement \| null` | スコア表示 |
| starCountEl | `HTMLSpanElement \| null` | 星の数表示 |
| boostButton | `HTMLButtonElement \| null` | ブーストボタン |
| homeButton | `HTMLButtonElement \| null` | **新規**: ホームボタン |
| cooldownBar | `HTMLDivElement \| null` | **新規**: クールダウン進捗バー |
| cooldownContainer | `HTMLDivElement \| null` | **新規**: クールダウンバーのラッパー |
| onBoostCallback | `(() => void) \| null` | ブーストコールバック |
| onHomeCallback | `(() => void) \| null` | **新規**: ホームコールバック |

**追加メソッド**:
- `setHomeCallback(callback: () => void): void` — ホームボタンタップ時のコールバック設定
- `updateCooldown(progress: number): void` — クールダウン進捗の更新 (0.0〜1.0)

**DOM 構造 (`#hud` 内)**:
```
#hud (z-index: 10, pointer-events: none)
├── homeButton (position: absolute, top-left, pointer-events: auto)
├── stageNameEl (text-align: center, text-shadow, 1.5rem)
└── container (flex, space-between)
    ├── scoreDiv
    └── starDiv

#ui-overlay (z-index: 20, pointer-events: none)
├── boostButton (position: absolute, bottom-right, pointer-events: auto)
│   └── 🚀 ブースト! (gradient, box-shadow, pulse animation)
└── cooldownContainer (position: absolute, below boost button)
    └── cooldownBar (width: 0%→100%, transition)
```

---

### 4. TutorialOverlay（新規）

チュートリアル画面のDOMオーバーレイ。

| フィールド | 型 | 説明 |
|-----------|------|------|
| overlay | `HTMLDivElement \| null` | オーバーレイのルート要素 |
| visible | `boolean` | 表示中フラグ |

**メソッド**:
- `show(onClose: () => void): void` — チュートリアルオーバーレイを表示。閉じるボタンのコールバックを受け取る
- `hide(): void` — オーバーレイを非表示にしDOMから除去

**DOM 構造 (`#ui-overlay` 内)**:
```
overlay (position: fixed, full-screen, background: rgba, z-index: 30)
├── title "あそびかた" (Zen Maru Gothic, 2.5rem, gold)
├── cardsContainer (flex, gap)
│   ├── card1 "ひだり みぎ に タッチ"
│   │   └── 👆 hand icon (CSS animation: translateX left-right loop)
│   ├── card2 "🚀 ブースト ぼたんを タップ"
│   │   └── 🚀 icon (CSS animation: translateY pulse loop)
│   └── card3 "⭐ ほしを あつめて ゴール"
│       └── ⭐ icon (CSS animation: rotate + glow loop)
└── closeButton "とじる" (large, rounded, gradient)
```

---

### 5. TitleScene（既存 — 修正）

AudioContext の同期初期化呼び出しと「あそびかた」ボタンの追加。

**変更点**:
- pointerdown ハンドラ内で `audioManager.initSync()` を同期呼び出し（`init().then()` を置き換え）
- `createOverlay()` 内に「あそびかた」ボタン追加
- TutorialOverlay インスタンスを保持し、表示/非表示を制御

---

### 6. StageScene（既存 — 修正）

HUD へのホームコールバック設定とクールダウン進捗の受け渡し。

**変更点**:
- `enter()` 内で `hud.setHomeCallback()` を設定（SceneManager.requestTransition('title') を呼ぶ）
- `update()` 内で `hud.updateCooldown(boostSystem.getCooldownProgress())` を毎フレーム呼ぶ

## Relationships

```
TitleScene ──uses──> AudioManager.initSync()
TitleScene ──creates──> TutorialOverlay
StageScene ──creates──> HUD
StageScene ──reads──> BoostSystem.getCooldownProgress()
StageScene ──passes──> HUD.updateCooldown()
HUD ──calls──> onHomeCallback (→ SceneManager.requestTransition('title'))
HUD ──calls──> onBoostCallback (→ InputSystem.setBoostPressed())
```

## Validation Rules

- `getCooldownProgress()` は常に 0.0〜1.0 の範囲を返す
- `initSync()` は例外が発生しても `initialized = false` となりゲーム継続可能
- ホームボタンのコールバックは `null` チェック付きで呼ばれる
- TutorialOverlay の `show()` は重複呼び出しを無視する（既に表示中なら何もしない）
- クールダウン進捗の更新は requestAnimationFrame サイクル内で1回のみ
