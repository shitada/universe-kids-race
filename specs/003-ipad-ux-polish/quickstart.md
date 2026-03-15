# Quickstart: 003-ipad-ux-polish

**Feature**: iPadゲーム体験改善 第2弾 — UXポリッシュ  
**Branch**: `003-ipad-ux-polish`

## 前提条件

- Node.js 18+
- npm
- iPad Safari でのテスト用に同一ネットワーク上の iPad（またはシミュレータ）

## セットアップ

```bash
git checkout 003-ipad-ux-polish
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

Vite dev server が `http://localhost:5173` で起動。iPad からアクセスする場合は `--host` オプションを使用:

```bash
npx vite --host
```

## テスト実行

```bash
npm run test          # 全テスト実行
npm run test -- --watch  # ウォッチモード
```

## ビルド

```bash
npm run build
```

## 変更対象ファイル一覧

### 修正ファイル（6ファイル）

| ファイル | 変更内容 |
|---------|---------|
| `src/game/audio/AudioManager.ts` | `init()` → `initSync()` 同期化 |
| `src/game/scenes/TitleScene.ts` | 同期AudioContext初期化 + 「あそびかた」ボタン |
| `src/game/scenes/StageScene.ts` | HUDホームコールバック + cooldown更新 |
| `src/game/systems/BoostSystem.ts` | `getCooldownProgress()` 追加 |
| `src/ui/HUD.ts` | ステージ名修正 + ホームボタン + ブーストデザイン + クールダウン |
| `tests/unit/systems/BoostSystem.test.ts` | `getCooldownProgress()` テスト追加 |

### 新規ファイル（3ファイル）

| ファイル | 内容 |
|---------|------|
| `src/ui/TutorialOverlay.ts` | チュートリアルDOMオーバーレイ |
| `tests/unit/ui/HUD.test.ts` | HUD要素テスト |
| `tests/unit/ui/TutorialOverlay.test.ts` | チュートリアルテスト |

### 変更なしファイル

- `src/main.ts` — エントリーポイント変更不要
- `src/types/index.ts` — 型定義変更不要
- `src/game/SceneManager.ts` — 既存API使用
- `src/game/scenes/EndingScene.ts` — 変更なし
- `index.html` — DOM構造変更なし（#hud, #ui-overlay は既存）

## iPad 実機テスト手順

1. `npx vite --host` で dev server を起動
2. iPad Safari で表示される IP アドレスにアクセス
3. 確認項目:
   - [ ] 「あそぶ」タップ後 BGM が鳴る
   - [ ] ステージ名が画面上部に見える
   - [ ] 🏠 ホームボタンが左上にありタップでタイトルに戻る
   - [ ] 「あそびかた」でチュートリアルが表示され、閉じられる
   - [ ] ブーストボタンがグラデーション+🚀デザイン
   - [ ] ブースト使用後にクールダウンバーが表示される
   - [ ] クールダウン完了時に光るエフェクト

## 実装順序（推奨）

1. **AudioManager同期化** (FR-001〜003) — 全テストの基盤
2. **BoostSystem.getCooldownProgress()** (FR-016〜019の前提) — 単純な追加
3. **HUDステージ名修正** (FR-004〜005) — CSS修正のみ
4. **ホームボタン追加** (FR-006〜009) — HUD拡張
5. **ブーストボタンデザイン刷新** (FR-020〜023) — CSS中心
6. **クールダウンインジケーター** (FR-016〜019) — HUD拡張+BoostSystem連携
7. **TutorialOverlay** (FR-010〜015) — 独立した新規クラス
