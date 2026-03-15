# Quickstart: 005-solar-stages-boost-fx

**Feature**: 太陽系全惑星ステージ拡張・ブースト演出強化・タイトルBGM修正
**Branch**: `005-solar-stages-boost-fx`

## 前提条件

- Node.js 18+
- npm
- iPad Safari でのテスト用に同一ネットワーク上の iPad（またはシミュレータ）

## セットアップ

```bash
git checkout 005-solar-stages-boost-fx
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

iPad からアクセスする場合:

```bash
npx vite --host
```

## テスト実行

```bash
npm run test
```

## ビルド

```bash
npm run build
```

## 主な変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| src/game/config/StageConfig.ts | STAGE_CONFIGSを8→11に拡張 |
| src/game/audio/AudioManager.ts | BGM定義リマップ+追加、startBoostSFX/stopBoostSFX追加、boostReady SFX追加 |
| src/game/scenes/StageScene.ts | 惑星モデル特徴付け、炎パーティクル、クールダウン完了音検知 |
| src/game/scenes/TitleScene.ts | オーバーレイpointerdownでBGM初期化 |
| src/game/storage/SaveManager.ts | clearedStage上限を11に変更 |
| src/types/index.ts | SFXTypeに'boostReady'追加 |

## 動作確認手順

1. タイトル画面で画面をタッチ → BGMが再生されることを確認
2. 「あそぶ」でゲーム開始 → ステージ1（月）から順にプレイ
3. ステージ2（水星）・ステージ3（金星）が新規追加されていることを確認
4. 各ステージの惑星モデルが特徴的に描画されていることを確認
5. ブースト発動時に噴射音が持続し、ロケット周囲に炎パーティクルが出ることを確認
6. ブースト終了時に噴射音がフェードアウトし、炎パーティクルが消えることを確認
7. クールダウン完了時に「ピコーン！」通知音が鳴ることを確認
8. ステージ11（地球）をクリアするとエンディングに遷移することを確認
