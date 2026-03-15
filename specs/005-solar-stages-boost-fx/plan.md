# Implementation Plan: 太陽系全惑星ステージ拡張・ブースト演出強化・タイトルBGM修正

**Branch**: `005-solar-stages-boost-fx` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/005-solar-stages-boost-fx/spec.md`

## Summary

既存の Three.js + TypeScript + Vite 宇宙レースゲーム（001〜004で構築済み）に対する6項目の改善。ステージ数を8→11に拡張し水星・金星・地球を追加（P1）。各惑星の3Dモデルをプロシージャル生成で特徴的に描画（P1）。タイトル画面のBGMをpointerdownで初期化・再生（P1）。ブースト中にホワイトノイズ噴射音を持続再生（P2）。ブースト中にオレンジ〜赤の炎パーティクルをロケット後方に放出（P2）。クールダウン完了時に通知音を再生（P3）。SaveManagerのclearedStage上限を11に変更し既存データ互換性を維持。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)
**Primary Dependencies**: Three.js, Vite
**Storage**: localStorage (SaveManager)
**Testing**: Vitest (jsdom環境)
**Target Platform**: iPad Safari（横向き固定）
**Project Type**: web-app（ブラウザゲーム）
**Performance Goals**: iPad Safari上で60fps維持、パーティクル追加時もフレーム落ちなし
**Constraints**: Three.js以外の外部ライブラリ不可、子供向け（5〜10歳）、ひらがな表記、YAGNI
**Scale/Scope**: 11ステージ + タイトル + エンディング、BGMは最大7同時OscillatorNode + ブースト噴射音用ノード

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | 太陽系全惑星を巡る壮大な冒険。各惑星の特徴的な3Dモデルで視覚的に楽しい。通知音で操作タイミング把握。失敗表現なし |
| II. デザイン | ✅ PASS | 3Dモデルはカートゥーン調（MeshToonMaterial）。宇宙テーマの配色維持。絵文字表示維持 |
| III. シンプル操作 | ✅ PASS | 操作追加なし。ブースト演出は既存操作の視聴覚フィードバック強化のみ |
| IV. 3D 冒険体験 | ✅ PASS | 惑星3Dモデルの特徴付けで没入感向上。炎パーティクルでブーストの迫力向上 |
| V. 技術スタック | ✅ PASS | Three.js + TypeScript + Vite。外部ライブラリ追加なし。Web Audio API標準機能のみ |
| VI. 開発ワークフロー | ✅ PASS | TDD。StageConfig・AudioManager・BoostSystem・SaveManagerの拡張はユニットテスト対象 |

**全ゲート通過。違反なし。**

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | 地球帰還の物語性。惑星モデルは一目で識別可能。噴射音・炎パーティクルで爽快感向上。通知音は短く邪魔にならない |
| II. デザイン | ✅ PASS | MeshToonMaterial維持。惑星リングはDoubleSide。炎パーティクルはAdditiveBlending。カートゥーン調統一 |
| III. シンプル操作 | ✅ PASS | 変更なし |
| IV. 3D 冒険体験 | ✅ PASS | 惑星モデルのプロシージャル生成で各惑星が視覚的に区別可能。炎パーティクルで速度感強化 |
| V. 技術スタック | ✅ PASS | AudioBufferSourceNode（ホワイトノイズ）+ BiquadFilterNode（ローパス）= Web Audio API標準。THREE.Points（パーティクル）= Three.js標準 |
| VI. 開発ワークフロー | ✅ PASS | 全モジュールにユニットテスト追加。既存テスト全パス維持 |

## Project Structure

### Documentation (this feature)

```text
specs/005-solar-stages-boost-fx/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── stage-expansion.md      # ステージ構成拡張・惑星モデルコントラクト
│   ├── boost-effects.md        # ブースト噴射音・炎パーティクル・通知音コントラクト
│   └── title-bgm-init.md       # タイトルBGM初期化コントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.ts                          # 変更なし
├── types/
│   └── index.ts                     # ★修正: SFXTypeに'boostReady'追加
├── game/
│   ├── audio/
│   │   └── AudioManager.ts          # ★修正: BGM_CONFIGSに水星・金星・地球追加。startBoostSFX()/stopBoostSFX()追加。boostReady SFX追加
│   ├── config/
│   │   └── StageConfig.ts           # ★修正: STAGE_CONFIGSを8→11に拡張。水星(2)・金星(3)追加、既存シフト、地球(11)最終
│   ├── scenes/
│   │   ├── TitleScene.ts            # ★修正: オーバーレイにpointerdownリスナー追加（{once:true}）でAudioContext初期化+playBGM(0)
│   │   ├── StageScene.ts            # ★修正: createDestinationPlanet()で惑星モデル特徴付け。ブースト炎パーティクル追加。クールダウン完了音検知。handleStageComplete()の閾値を11に変更
│   │   └── EndingScene.ts           # 変更なし
│   ├── effects/
│   │   └── ParticleBurst.ts         # 変更なし（炎パーティクルはStageScene内で直接THREE.Pointsを管理）
│   ├── systems/
│   │   └── BoostSystem.ts           # 変更なし（状態検知はStageScene側で行う）
│   └── storage/
│       └── SaveManager.ts           # ★修正: clearedStage上限を8→11に変更
├── ui/
│   └── HUD.ts                       # 変更なし
└── ...

tests/
├── unit/
│   ├── audio/
│   │   └── AudioManager.test.ts     # ★修正: 新BGM定義テスト、startBoostSFX/stopBoostSFXテスト、boostReady SFXテスト
│   ├── config/
│   │   └── StageConfig.test.ts      # ★修正: 11ステージ分のテスト
│   ├── systems/
│   │   └── BoostSystem.test.ts      # 変更なし
│   └── SaveManager.test.ts          # ★修正: clearedStage上限11テスト
└── integration/
    └── StageFlow.test.ts            # ★修正: 11ステージフローテスト
```

**Structure Decision**: 既存のプロジェクト構造をそのまま使用。新規ファイルの追加なし。StageConfig・AudioManager・StageScene・TitleScene・SaveManagerの既存ファイルを修正。

## Complexity Tracking

> 違反なし。追記不要。
