# Implementation Plan: コンパニオンタイミング修正・シールド楕円化・ブースト炎改善

**Branch**: `008-companion-shield-boost-fix` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-companion-shield-boost-fix/spec.md`

## Summary

既存の Three.js + TypeScript 宇宙レースゲームにおける3つのポリッシュ改善: (1) **コンパニオンタイミング修正** — ステージクリア時に新しいコンパニオンが動的に追加され「なかまに なったよ！」演出が表示される。`CompanionManager.addCompanion(stageNumber)` メソッドを追加し、スピン＋拡大アニメーションで登場。(2) **エアシールド楕円化** — 通常時は非表示にし、ブースト時のみ楕円形（1.0, 0.8, 2.0）で表示。通常モードのパルスアニメーション削除。(3) **ブースト炎改善** — パーティクル放出数を5→8/frame、寿命を0.5→0.7秒、MAX_FLAME_PARTICLESを100→150に増加し、より豪華な噴射感を演出。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)
**Primary Dependencies**: Three.js, Vite
**Storage**: localStorage (SaveManager) — 変更なし
**Testing**: Vitest (jsdom環境)
**Target Platform**: iPad Safari（横向き固定）
**Project Type**: web-app（ブラウザゲーム）
**Performance Goals**: iPad Safari上で60fps維持（コンパニオン登場アニメーション + 楕円シールド + パーティクル150個）
**Constraints**: Three.js以外の外部ライブラリ不可、子供向け（5〜10歳）、YAGNI
**Scale/Scope**: 既存クラス3つの修正（CompanionManager, AirShield, StageScene）、新規ファイルなし

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | 「なかまに なったよ！」はひらがな＋絵文字。クリア演出が達成感を強化。ネガティブ表現なし |
| II. デザイン | ✅ PASS | コンパニオン登場はスピン＋拡大のカートゥーン調。楕円シールドは水色系で宇宙テーマ。Zen Maru Gothic フォント |
| III. シンプル操作 | ✅ PASS | 操作変更なし。コンパニオン演出は自動再生。シールド表示切り替えも自動 |
| IV. 3D 冒険体験 | ✅ PASS | 楕円シールドでスピード感増大。コンパニオン登場で仲間が増える視覚的な達成感 |
| V. 技術スタック | ✅ PASS | Three.js 標準API のみ使用（scale, visible, PointsMaterial）。外部ライブラリ追加なし |
| VI. 開発ワークフロー | ✅ PASS | TDD。CompanionManager.addCompanion() / AirShield の visibility / flame パラメータのユニットテスト |

**全ゲート通過。違反なし。**

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | 仲間獲得の喜びを即座にフィードバック。テキストはひらがな＋絵文字。演出中のタップでも中断されず安心 |
| II. デザイン | ✅ PASS | 登場アニメーション: scale 0→1 + rotation でカートゥーン的。楕円シールド: 既存の水色/半透明を維持。炎: 既存の色パレット維持 |
| III. シンプル操作 | ✅ PASS | 全変更は自動演出のみ。プレイヤーの操作フローに影響なし |
| IV. 3D 冒険体験 | ✅ PASS | パーティクル150個は既存100の50%増。コンパニオン1体追加は最大550ポリゴン→最大600ポリゴン。iPad Safari 60fps維持に問題なし |
| V. 技術スタック | ✅ PASS | mesh.visible, mesh.scale.set(), Float32Array 操作のみ。Three.js 標準API。外部ライブラリ不使用 |
| VI. 開発ワークフロー | ✅ PASS | addCompanion: メッシュ生成・軌道パラメータ・重複チェックのテスト。AirShield: visible=false/true切り替え・楕円スケールのテスト。Flame: パラメータ定数のテスト |

## Project Structure

### Documentation (this feature)

```text
specs/008-companion-shield-boost-fix/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── companion-add.md         # コンパニオン動的追加コントラクト
│   ├── shield-elliptical.md     # 楕円シールドコントラクト
│   └── boost-flame-params.md    # ブースト炎パラメータコントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── game/
│   ├── entities/
│   │   └── CompanionManager.ts      # ★修正: addCompanion() メソッド追加、登場アニメーション
│   ├── effects/
│   │   └── AirShield.ts             # ★修正: デフォルト非表示、ブースト専用楕円形、通常パルス削除
│   └── scenes/
│       └── StageScene.ts            # ★修正: クリア時のコンパニオン演出、炎パラメータ変更
└── ...

tests/
├── unit/
│   ├── entities/
│   │   └── CompanionManager.test.ts # ★修正: addCompanion() テスト追加
│   └── effects/
│       └── AirShield.test.ts        # ★修正: 非表示デフォルト・楕円形テスト追加
└── ...
```

**Structure Decision**: 既存ファイルの修正のみ。新規ファイル作成なし。3つの既存クラス（CompanionManager, AirShield, StageScene）と2つのテストファイルを修正。
