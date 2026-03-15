# Implementation Plan: ブースト炎の持続保証＆フェードアウト演出

**Branch**: `009-boost-flame-fadeout` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/009-boost-flame-fadeout/spec.md`

## Summary

既存の Three.js + TypeScript 宇宙レースゲームにおけるブースト炎パーティクルの2つの改善: (1) **炎の持続保証** — ブースト有効中に炎が途切れるバグを修正。`flameEmitting` フラグ依存を排除し、`boostSystem.isActive()` を直接チェックすることで毎フレーム確実にパーティクルを放出する。(2) **フェードアウト演出** — `BoostSystem.getDurationProgress()` メソッドを新規追加し、ブースト残り0.5秒（progress >= 0.83）でパーティクル放出数とサイズを線形に減少させ、自然な消滅演出を実現する。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)
**Primary Dependencies**: Three.js, Vite
**Storage**: N/A（変更なし）
**Testing**: Vitest (jsdom環境)
**Target Platform**: iPad Safari（横向き固定）
**Project Type**: web-app（ブラウザゲーム）
**Performance Goals**: iPad Safari上で60fps維持（パーティクル放出数の減少のみ、増加なし）
**Constraints**: Three.js以外の外部ライブラリ不可、子供向け（5〜10歳）、YAGNI
**Scale/Scope**: 既存クラス2つの修正（BoostSystem, StageScene）、新規ファイルなし

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | ブースト炎の途切れ修正は「壊れている」印象を排除。フェードアウトはブースト終了を優しく予告。ネガティブ表現なし |
| II. デザイン | ✅ PASS | 炎パーティクルの段階的縮小はカートゥーン調の演出に合致。宇宙テーマの噴射エフェクト品質向上 |
| III. シンプル操作 | ✅ PASS | 操作変更なし。フェードアウトは自動演出 |
| IV. 3D 冒険体験 | ✅ PASS | 炎の連続表示で没入感向上。フェードアウトで自然な視覚フィードバック |
| V. 技術スタック | ✅ PASS | Three.js 標準API（PointsMaterial.size）のみ。外部ライブラリ追加なし |
| VI. 開発ワークフロー | ✅ PASS | TDD。BoostSystem.getDurationProgress() のユニットテスト、StageScene フェードロジックのテスト |

**全ゲート通過。違反なし。**

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | 炎が途切れない安定表示で安心感。フェードアウトが「もうすぐ終わるよ」の視覚予告として機能 |
| II. デザイン | ✅ PASS | 炎のサイズ・量の段階的減少はロケット噴射の自然な表現。既存の色パレット維持 |
| III. シンプル操作 | ✅ PASS | プレイヤーの操作フローに影響なし |
| IV. 3D 冒険体験 | ✅ PASS | パーティクル数は最大150（既存維持）からフェード時に減少するため、パフォーマンス影響はゼロまたは微改善 |
| V. 技術スタック | ✅ PASS | `durationTimer` / `DURATION` の比率計算、`PointsMaterial.size` 操作のみ。Three.js 標準API |
| VI. 開発ワークフロー | ✅ PASS | getDurationProgress(): 境界値テスト（0.0, 0.5, 0.83, 1.0）。emitFlameParticles: フェード時の放出数・サイズ計算テスト |

## Project Structure

### Documentation (this feature)

```text
specs/009-boost-flame-fadeout/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── boost-duration-progress.md  # BoostSystem.getDurationProgress() コントラクト
│   └── flame-fadeout.md            # 炎フェードアウト演出コントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── game/
│   ├── systems/
│   │   └── BoostSystem.ts           # ★修正: getDurationProgress() メソッド追加
│   └── scenes/
│       └── StageScene.ts            # ★修正: flameEmitting依存排除、フェードアウトロジック追加
└── ...

tests/
├── unit/
│   └── systems/
│       └── BoostSystem.test.ts      # ★修正: getDurationProgress() テスト追加
└── ...
```

**Structure Decision**: 既存ファイルの修正のみ。新規ファイル作成なし。2つの既存クラス（BoostSystem, StageScene）と1つのテストファイルを修正。
