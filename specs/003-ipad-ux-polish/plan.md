# Implementation Plan: iPadゲーム体験改善 第2弾 — UXポリッシュ

**Branch**: `003-ipad-ux-polish` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/003-ipad-ux-polish/spec.md`

## Summary

既存の Three.js + TypeScript + Vite 宇宙レースゲーム（001+002で構築済み）に対する6項目のUI/UX改善。iPad SafariのAudioContext同期初期化修正（P1）、HUDステージ名の視認性保証（P1）、ホームボタン追加（P1）、チュートリアルDOMオーバーレイ（P2）、ブーストクールダウンインジケーター（P2）、ブーストボタンデザイン刷新（P3）。すべてDOM操作+CSSで実装し、Three.jsの3D描画には変更なし。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)  
**Primary Dependencies**: Three.js, Vite  
**Storage**: localStorage (SaveManager)  
**Testing**: Vitest  
**Target Platform**: iPad Safari（横向き固定）  
**Project Type**: web-app（ブラウザゲーム）  
**Performance Goals**: iPad Safari上で60fps維持  
**Constraints**: Three.js以外の外部ライブラリ不可、子供向け（5〜10歳）、ひらがな表記、YAGNI  
**Scale/Scope**: 8ステージ、シングルプレイヤー、DOM UI追加のみ

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | 全UIひらがな・絵文字。チュートリアルはアニメーションで視覚的に説明。ネガティブ表現なし |
| II. デザイン | ✅ PASS | Zen Maru Gothic使用。濃い青ベース配色維持。角丸・柔らかいシャドウのカード型UI |
| III. シンプル操作 | ✅ PASS | 追加操作はホームボタン（1タップ）のみ。チュートリアルは閲覧のみ。複雑操作の追加なし |
| IV. 3D 冒険体験 | ✅ PASS | Three.jsの3D描画には一切変更なし。DOM/CSSオーバーレイのみの変更 |
| V. 技術スタック | ✅ PASS | Three.js + TypeScript + Vite。外部ライブラリ追加なし。CSS+DOM APIのみ |
| VI. 開発ワークフロー | ✅ PASS | TDD。各機能は独立モジュール（TutorialOverlay, CooldownIndicator等） |

**全ゲート通過。違反なし。**

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | TutorialOverlayは手のアイコン+ひらがな説明。クールダウンは視覚的バー |
| II. デザイン | ✅ PASS | ブーストボタンはグラデーション+絵文字🚀+box-shadow。統一デザイン |
| III. シンプル操作 | ✅ PASS | ホームボタンは左上配置でプレイ領域と干渉しない |
| IV. 3D 冒険体験 | ✅ PASS | 変更なし |
| V. 技術スタック | ✅ PASS | 変更なし |
| VI. 開発ワークフロー | ✅ PASS | 各UIクラスに対応するユニットテスト作成 |

## Project Structure

### Documentation (this feature)

```text
specs/003-ipad-ux-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── audio-init.md    # AudioManager同期初期化コントラクト
│   └── hud-ui.md        # HUD UI要素コントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.ts                          # エントリーポイント（変更なし）
├── types/
│   └── index.ts                     # 型定義（変更なし）
├── game/
│   ├── audio/
│   │   └── AudioManager.ts          # ★修正: init()を同期化
│   ├── scenes/
│   │   ├── TitleScene.ts            # ★修正: 同期AudioContext初期化 + 「あそびかた」ボタン追加
│   │   ├── StageScene.ts            # ★修正: HUDにSceneManager渡し + cooldown progress取得
│   │   └── EndingScene.ts           # 変更なし
│   ├── systems/
│   │   └── BoostSystem.ts           # ★修正: getCooldownProgress()追加
│   └── SceneManager.ts              # 変更なし
├── ui/
│   ├── HUD.ts                       # ★修正: ステージ名z-index修正、ホームボタン追加、ブーストボタンデザイン刷新、クールダウンインジケーター追加
│   └── TutorialOverlay.ts           # ★新規: チュートリアルDOMオーバーレイ
tests/
├── unit/
│   ├── audio/
│   │   └── AudioManager.test.ts     # ★修正: 同期init()テスト
│   ├── ui/
│   │   ├── HUD.test.ts              # ★新規: HUD要素テスト
│   │   └── TutorialOverlay.test.ts  # ★新規: チュートリアルテスト
│   └── systems/
│       └── BoostSystem.test.ts      # ★修正: getCooldownProgress()テスト
```

**Structure Decision**: 既存のプロジェクト構造を維持。新規ファイルは `src/ui/TutorialOverlay.ts` の1ファイルのみ。他はすべて既存ファイルの修正。

## Complexity Tracking

> 違反なし。テーブル不要。
