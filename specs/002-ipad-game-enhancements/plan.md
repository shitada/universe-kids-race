# Implementation Plan: iPadゲーム体験改善 — サウンド・ステージ拡張・演出強化

**Branch**: `002-ipad-game-enhancements` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-ipad-game-enhancements/spec.md`

## Summary

既存の Three.js + TypeScript + Vite 宇宙旅行ゲーム（001-space-travel-game）に対する5つの改善を実装する。
Web Audio API の OscillatorNode/GainNode によるプログラム生成 BGM・効果音、StageConfig 拡張による8ステージ化（太陽系巡り）、Three.js Points パーティクルバースト演出、HUD ステージ名表示。

## Technical Context

**Language/Version**: TypeScript 5.7+ (strict mode)
**Primary Dependencies**: Three.js 0.170, Web Audio API (ブラウザ内蔵)
**Storage**: localStorage (既存 SaveManager — clearedStage 0→7 に拡張)
**Testing**: Vitest 3.0 (unit + integration)
**Target Platform**: iPad Safari (横向き固定)
**Project Type**: Web game (Vite SPA)
**Performance Goals**: iPad Safari で 60fps 維持
**Constraints**: 外部ライブラリ追加なし (Three.js 以外)、外部音声ファイル不要
**Scale/Scope**: 8ステージ、5種類の SFX、ステージごと BGM、パーティクルシステム

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 子供ファースト | ✅ PASS | ひらがな・絵文字でステージ名表示、ポップな BGM、達成感のある SFX |
| II. デザイン | ✅ PASS | Zen Maru Gothic、濃い青ベース配色、カートゥーン調維持 |
| III. シンプル操作 | ✅ PASS | 操作体系に変更なし（左右移動 + ブースト） |
| IV. 3D 冒険体験 | ✅ PASS | Three.js 描画、パーティクル追加でも 60fps 維持必須 |
| V. 技術スタック | ✅ PASS | Three.js + TS + Vite のみ、外部ライブラリ追加なし、Web Audio API はブラウザ内蔵 |
| VI. 開発ワークフロー | ✅ PASS | TDD、独立モジュール（SynthAudio, ParticleBurst 等） |

**Gate Result (pre-Phase 0)**: ALL PASS — Phase 0 に進む

### Post-Phase 1 Re-check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. 子供ファースト | ✅ PASS | displayName にひらがな・絵文字。SFX は明るいポップな音色 |
| II. デザイン | ✅ PASS | HUD は Zen Maru Gothic #FFD700。パーティクルは AdditiveBlending で発光感 |
| III. シンプル操作 | ✅ PASS | 操作体系一切変更なし |
| IV. 3D 冒険体験 | ✅ PASS | パーティクルプール上限 10、iPad 60fps 維持設計 |
| V. 技術スタック | ✅ PASS | Web Audio API はブラウザ標準。外部ライブラリ追加なし |
| VI. 開発ワークフロー | ✅ PASS | AudioManager / ParticleBurst / StageConfig それぞれ独立テスト可能 |

**Gate Result (post-Phase 1)**: ALL PASS — Phase 2 に進める

## Project Structure

### Documentation (this feature)

```text
specs/002-ipad-game-enhancements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── synth-audio.md   # Web Audio API サウンド生成インターフェース
│   ├── particle-system.md # パーティクルバーストインターフェース
│   └── stage-config.md  # 拡張ステージ設定
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── game/
│   ├── audio/
│   │   └── AudioManager.ts      # 既存 → Web Audio API でプログラム生成に書き換え
│   ├── config/
│   │   └── StageConfig.ts        # 既存 → 3→8 ステージに拡張
│   ├── entities/
│   │   ├── Star.ts               # 既存（変更なし）
│   │   ├── Spaceship.ts          # 既存（変更なし）
│   │   └── Meteorite.ts          # 既存（変更なし）
│   ├── effects/
│   │   └── ParticleBurst.ts      # 新規: パーティクルバースト演出
│   ├── scenes/
│   │   ├── TitleScene.ts         # 既存 → AudioManager 統合
│   │   ├── StageScene.ts         # 既存 → パーティクル・サウンド統合、8ステージ対応
│   │   └── EndingScene.ts        # 既存 → AudioManager 統合
│   └── systems/
│       └── (既存システム — 変更なし)
├── ui/
│   └── HUD.ts                    # 既存 → ステージ名表示追加
└── types/
    └── index.ts                  # 既存 → 新型定義追加

tests/
├── unit/
│   ├── audio/
│   │   └── AudioManager.test.ts  # 新規
│   ├── effects/
│   │   └── ParticleBurst.test.ts # 新規
│   └── config/
│       └── StageConfig.test.ts   # 新規
└── integration/
    └── StageFlow.test.ts         # 既存 → 8ステージ対応
```

**Structure Decision**: 既存のフラット構造を維持。新規モジュールは `effects/` ディレクトリに追加。
AudioManager はインプレース書き換え（既存がプレースホルダー実装のため）。

## Complexity Tracking

> 憲法違反なし — このセクションは不要
