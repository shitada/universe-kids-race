# Quickstart: うちゅうの たび — 宇宙船キッズゲーム

**Date**: 2026-03-15
**Feature**: 001-space-travel-game

## Prerequisites

- Node.js 18+ 
- npm 9+

## Setup

```bash
# リポジトリをクローン
git clone <repo-url>
cd universe-kids-race
git checkout 001-space-travel-game

# 依存パッケージをインストール
npm install
```

## Development

```bash
# 開発サーバー起動 (Vite)
npm run dev
# → http://localhost:5173 で起動
# iPad Safari からアクセスする場合は --host オプション付きで起動

# テスト実行
npm run test

# テスト (watch モード)
npm run test:watch

# リント
npm run lint

# ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## Project Structure

```
src/
├── main.ts                    # Vite エントリーポイント
├── game/
│   ├── GameLoop.ts            # rAF ベースのゲームループ
│   ├── SceneManager.ts        # シーン遷移のステートマシン
│   ├── scenes/                # 各画面のシーン実装
│   │   ├── TitleScene.ts      #   タイトル画面
│   │   ├── StageScene.ts      #   ゲームプレイ画面
│   │   └── EndingScene.ts     #   エンディング画面
│   ├── entities/              # ゲームオブジェクト
│   │   ├── Spaceship.ts       #   宇宙船
│   │   ├── Star.ts            #   星（通常・虹色）
│   │   └── Meteorite.ts       #   隕石
│   ├── systems/               # ゲームシステム（ロジック）
│   │   ├── InputSystem.ts     #   タッチ入力
│   │   ├── CollisionSystem.ts #   当たり判定
│   │   ├── ScoreSystem.ts     #   スコア管理
│   │   ├── SpawnSystem.ts     #   オブジェクト生成
│   │   └── BoostSystem.ts     #   ブースト機能
│   ├── audio/
│   │   └── AudioManager.ts    #   BGM・効果音管理
│   ├── storage/
│   │   └── SaveManager.ts     #   localStorage 保存
│   └── config/
│       └── StageConfig.ts     #   ステージ別パラメータ
├── ui/
│   └── HUD.ts                 #   スコア・星数表示
└── types/
    └── index.ts               #   共通型定義

tests/
├── unit/                      # ユニットテスト
└── integration/               # 統合テスト
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm run test` | Vitest テスト実行 |
| `npm run test:watch` | Vitest ウォッチモード |
| `npm run preview` | ビルド結果プレビュー |

## Tech Stack

- **3D Engine**: Three.js
- **Language**: TypeScript
- **Build Tool**: Vite
- **Test Framework**: Vitest
- **Audio**: Web Audio API (Three.js Audio)
- **Storage**: localStorage
- **Target**: iPad Safari (landscape)
- **Deploy**: GitHub Pages
