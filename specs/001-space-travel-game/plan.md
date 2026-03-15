# Implementation Plan: うちゅうの たび — 宇宙船キッズゲーム

**Branch**: `001-space-travel-game` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-space-travel-game/spec.md`

## Summary

宇宙船を操作して星々を旅する子供向け3Dブラウザゲーム。Three.js + TypeScript + Vite で構築し、iPad Safari 横向き固定で動作する。宇宙船が画面奥に自動前進し、タッチ操作で左右移動。星を集めてスコアを稼ぎ、隕石を避けながら3ステージ（月→火星→土星）を順にクリアしてエンディングを目指す。ゲームオーバーなし設計で5〜10歳の子供が安心して遊べる。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2022 target)
**Primary Dependencies**: Three.js (3D描画), Vite (ビルドツール), Vitest (テスト)
**Storage**: localStorage (ステージ進行状況の保存)
**Testing**: Vitest (ユニットテスト)
**Target Platform**: iPad Safari 横向き固定 (GitHub Pages デプロイ)
**Project Type**: browser-game (SPA)
**Performance Goals**: 60fps on iPad Safari
**Constraints**: Three.js 以外の外部ライブラリは原則追加しない、オフライン対応不要、iPad Safari のみサポート
**Scale/Scope**: 3ステージ、5画面（タイトル・ステージ1〜3・エンディング）、主要エンティティ5種（宇宙船・星・隕石・ステージ・スコア）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | 子供ファースト | PASS | ひらがな中心、ゲームオーバーなし、5〜10歳向けUI設計 |
| II | デザイン | PASS | カートゥーン調3Dモデル、MeshToonMaterial、濃い青ベース配色、Zen Maru Gothic フォント |
| III | シンプル操作 | PASS | 左右タッチ移動のみ + ブーストボタン。同時押し・長押しなし |
| IV | 3D 冒険体験 | PASS | Three.js 3D描画、奥に進む没入感、iPad Safari 60fps 維持 |
| V | 技術スタック | PASS | Three.js + TypeScript + Vite、外部ライブラリ追加なし、YAGNI 徹底 |
| VI | 開発ワークフロー | PASS | TDD (Vitest)、独立モジュール構成、シンプルで読みやすいコード |

**Gate Result**: ALL PASS — Phase 0 に進行可能

## Project Structure

### Documentation (this feature)

```text
specs/001-space-travel-game/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (internal module interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── main.ts              # エントリーポイント (Vite)
├── game/
│   ├── GameLoop.ts      # requestAnimationFrame ベースのゲームループ
│   ├── SceneManager.ts  # ステートマシンによるシーン管理
│   ├── scenes/
│   │   ├── TitleScene.ts
│   │   ├── StageScene.ts
│   │   └── EndingScene.ts
│   ├── entities/
│   │   ├── Spaceship.ts
│   │   ├── Star.ts
│   │   └── Meteorite.ts
│   ├── systems/
│   │   ├── InputSystem.ts       # タッチ入力処理
│   │   ├── CollisionSystem.ts   # 当たり判定
│   │   ├── ScoreSystem.ts       # スコア管理
│   │   ├── SpawnSystem.ts       # 星・隕石の生成
│   │   └── BoostSystem.ts       # ブースト管理
│   ├── audio/
│   │   └── AudioManager.ts      # Web Audio API (Three.js Audio) 管理
│   ├── storage/
│   │   └── SaveManager.ts       # localStorage 保存/読込
│   └── config/
│       └── StageConfig.ts       # ステージ別パラメータ定義
├── ui/
│   └── HUD.ts                   # スコア・星数の画面表示
└── types/
    └── index.ts                 # 共通型定義

tests/
├── unit/
│   ├── entities/
│   │   ├── Spaceship.test.ts
│   │   ├── Star.test.ts
│   │   └── Meteorite.test.ts
│   ├── systems/
│   │   ├── CollisionSystem.test.ts
│   │   ├── ScoreSystem.test.ts
│   │   ├── SpawnSystem.test.ts
│   │   └── BoostSystem.test.ts
│   ├── SceneManager.test.ts
│   └── SaveManager.test.ts
└── integration/
    └── StageFlow.test.ts
```

**Structure Decision**: シングルプロジェクト構成。`src/game/` にゲームロジックを集約し、エンティティ・システム・シーンを独立モジュールとして分離。Constitution VI「各ゲーム機能は独立したモジュール」に準拠。

## Complexity Tracking

> Constitution Check に違反なし。追加の正当化は不要。
