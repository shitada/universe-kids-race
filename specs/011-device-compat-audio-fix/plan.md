# Implementation Plan: デバイス互換性 & オーディオ修正

**Branch**: `011-device-compat-audio-fix` | **Date**: 2026-03-16 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/011-device-compat-audio-fix/spec.md`

## Summary

既存の Three.js + TypeScript 宇宙レースゲームに4つの修正を実装する: (1) **Safari BGM 復帰** — AudioManager に `ensureResumed()` メソッドを追加し、AudioContext の suspended 状態を検出・再開する。`visibilitychange` イベントで復帰時に自動呼び出し。(2) **BGM 重複防止** — `bgmGeneration` カウンタを導入し、シーケンサーの tick コールバックで世代不一致を検出して停止。TitleScene のオーバーレイ `pointerdown` から `playBGM()` を除去。(3) **iPhone safe area** — viewport に `viewport-fit=cover` を追加し、CSS `env(safe-area-inset-*)` で HUD・ボタンをノッチ/Dynamic Island/ホームインジケータ領域から退避。(4) **PC キーボード操作** — InputSystem に `keydown`/`keyup` リスナーを追加し、ArrowLeft/Right で移動方向、Space でブーストを制御。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)
**Primary Dependencies**: Three.js, Vite
**Storage**: localStorage（既存）+ sessionStorage（既存）
**Testing**: Vitest (jsdom 環境)
**Target Platform**: iPad Safari（プライマリ）、iPhone Safari（US3）、PC ブラウザ（US4）
**Project Type**: web-app（ブラウザゲーム）
**Performance Goals**: iPad Safari 上で 60fps 維持
**Constraints**: Three.js 以外の外部ライブラリ不可、子供向け（5〜10歳）、YAGNI
**Scale/Scope**: AudioManager.ts 修正、InputSystem.ts 拡張、main.ts 修正、index.html CSS 修正、TitleScene.ts 修正、HUD.ts 修正

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | BGM 途切れ・重複は子供の集中を妨げる品質問題を解消。iPhone safe area でノッチに隠れるボタンを修正し操作性向上。キーボード操作で PC ユーザーも直感的に遊べる |
| II. デザイン | ✅ PASS | 既存の Zen Maru Gothic フォント、宇宙テーマの UI を維持。safe area 対応は既存デザインに影響なし |
| III. シンプル操作 | ✅ PASS | キーボード操作は左右矢印＋スペースの3キーのみ。既存タッチ操作は影響なし。同時押し不要 |
| IV. 3D 冒険体験 | ✅ PASS | 3D 描画に変更なし。オーディオ・入力・CSS のみ |
| V. 技術スタック | ⚠️ 要確認 | Constitution は「iPad Safari を唯一のターゲット」と規定。US3(iPhone) と US4(PC) はターゲット拡張に該当 → 下記 Complexity Tracking で正当化 |
| VI. 開発ワークフロー | ✅ PASS | TDD。AudioManager テスト拡張、InputSystem テスト拡張、インテグレーションテスト追加 |

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | BGM 復帰は 1 秒以内保証。44pt 以上のタップ領域で子供の指にも対応 |
| II. デザイン | ✅ PASS | safe area padding は既存レイアウトの外側マージンとして適用。iPad 表示はリグレッションなし |
| III. シンプル操作 | ✅ PASS | ArrowLeft/Right + Space。長押し不要。キーボードとタッチの共存は InputSystem 内部で透過的にマージ |
| IV. 3D 冒険体験 | ✅ PASS | 変更なし |
| V. 技術スタック | ✅ PASS（正当化済み） | iPhone/PC 対応は CSS と InputSystem の最小限変更。新ライブラリ追加なし。iPad Safari の動作は影響なし |
| VI. 開発ワークフロー | ✅ PASS | AudioManager テスト（ensureResumed, bgmGeneration）、InputSystem テスト（keyboard input merge）、TitleScene テスト（重複防止）追加 |

## Project Structure

### Documentation (this feature)

```text
specs/011-device-compat-audio-fix/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── audio-resume.md          # Safari BGM 復帰コントラクト
│   ├── bgm-dedup.md             # BGM 重複防止コントラクト
│   └── keyboard-input.md        # PC キーボード入力コントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.ts                              # ★修正: visibilitychange で audioManager.ensureResumed() 呼び出し
├── game/
│   ├── audio/
│   │   └── AudioManager.ts              # ★修正: ensureResumed(), bgmGeneration, bgmPlaying フラグ追加
│   ├── scenes/
│   │   └── TitleScene.ts                # ★修正: overlay pointerdown から playBGM(0) を除去
│   └── systems/
│       └── InputSystem.ts               # ★修正: keydown/keyup リスナー追加、keyboard 入力マージ
├── ui/
│   └── HUD.ts                           # ★修正: safe area inset 適用（ボタン位置調整）
└── types/
    └── index.ts                         # 既存（変更なし）

index.html                               # ★修正: viewport-fit=cover, safe area CSS

tests/
├── unit/
│   ├── audio/
│   │   └── AudioManager.test.ts         # ★修正: ensureResumed, bgmGeneration テスト追加
│   ├── systems/
│   │   └── InputSystem.test.ts          # ★修正: keyboard input テスト追加
│   └── scenes/
│       └── TitleScene.test.ts           # ★修正: BGM 重複防止テスト追加
└── integration/
    └── AudioResume.test.ts              # ★新規: Safari 復帰シナリオテスト
```

**Structure Decision**: 既存のディレクトリ構造を踏襲。AudioManager.ts・InputSystem.ts・TitleScene.ts・HUD.ts の修正が中心。index.html に CSS 追加。テストは既存の unit ディレクトリに追加し、インテグレーションテストを1件追加。

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| V. iPad Safari 唯一のターゲット → iPhone/PC 追加 | iPhone は保護者・子供の主要デバイス。PC はデスクトップ開発/テスト時の操作性向上に必須 | CSS safe area と keydown/keyup リスナーの追加のみで、iPad Safari の動作に影響なし。新ライブラリなし |
