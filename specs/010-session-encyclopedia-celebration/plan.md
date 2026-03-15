# Implementation Plan: セッション管理・ずかん永続化・全クリアお祝い演出

**Branch**: `010-session-encyclopedia-celebration` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/010-session-encyclopedia-celebration/spec.md`

## Summary

既存の Three.js + TypeScript 宇宙レースゲームに4つの改善を実装する: (1) **Safari スワイプ終了リセット** — sessionStorage にセッションフラグを設置し、main.ts 起動時にフラグ不在を検出したら saveManager.clear() で全データをリセットする。(2) **ずかん永続化** — EndingScene の全クリア処理を saveManager.clear() から選択的リセット（clearedStage=0 のみリセット、unlockedPlanets 保持）に変更。(3) **全クリアお祝い演出** — EndingScene に全11体のエイリアンコンパニオンを円形配置し、順次ポップイン → バウンスアニメーション →「みんな ありがとう！」テキスト表示。(4) **ブースト炎検証** — Feature 009 実装のブースト炎動作をインテグレーションテストで保証。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)
**Primary Dependencies**: Three.js, Vite
**Storage**: localStorage（ゲーム永続データ）+ sessionStorage（セッションフラグ）
**Testing**: Vitest (jsdom 環境)
**Target Platform**: iPad Safari（横向き固定）
**Project Type**: web-app（ブラウザゲーム）
**Performance Goals**: iPad Safari 上で 60fps 維持
**Constraints**: Three.js 以外の外部ライブラリ不可、子供向け（5〜10歳）、YAGNI
**Scale/Scope**: main.ts 修正、EndingScene.ts 大幅修正、新規テスト追加

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | スワイプ終了で毎回新鮮な体験を提供。ずかん永続化でコレクション達成感を維持。お祝い演出で全クリアの喜びを最大化。テキストはひらがなのみ |
| II. デザイン | ✅ PASS | エイリアンは既存 CompanionManager のカートゥーン調メッシュを使用。テキストは Zen Maru Gothic。宇宙テーマの濃い青背景の手前に表示 |
| III. シンプル操作 | ✅ PASS | セッション管理は自動。お祝い演出は自動再生、完了後タップでタイトルに戻る操作のみ |
| IV. 3D 冒険体験 | ✅ PASS | 全11体のエイリアンが Three.js シーンに登場。ポップイン・バウンスアニメーションで3D演出を活用 |
| V. 技術スタック | ✅ PASS | Three.js + TypeScript + Vite。sessionStorage は Web 標準 API。外部ライブラリ追加なし |
| VI. 開発ワークフロー | ✅ PASS | TDD。セッション管理・ずかん永続化のユニットテスト、ブースト炎のインテグレーションテスト |

**全ゲート通過。違反なし。**

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | セッション自動リセットで「最初から遊びたい」期待に応答。ずかんコレクション維持で達成感。「みんな ありがとう！」のひらがなテキスト |
| II. デザイン | ✅ PASS | CompanionManager.createCompanionMesh() で生成した既存エイリアンメッシュ使用。Zen Maru Gothic フォント。濃い青背景＋カラフルなエイリアン |
| III. シンプル操作 | ✅ PASS | セッション管理は透過的。お祝い演出は自動進行、タップまたはボタンでタイトルへ |
| IV. 3D 冒険体験 | ✅ PASS | 11体のエイリアンメッシュ（合計11メッシュ、各数十ポリゴン）は iPad Safari で 60fps に影響なし |
| V. 技術スタック | ✅ PASS | sessionStorage（標準API）追加のみ。Three.js Group/Mesh/Tween は既存パターン踏襲 |
| VI. 開発ワークフロー | ✅ PASS | SaveManager テスト拡張、EndingScene ユニットテスト追加、ブースト炎インテグレーションテスト追加 |

## Project Structure

### Documentation (this feature)

```text
specs/010-session-encyclopedia-celebration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── session-management.md    # sessionStorage セッション管理コントラクト
│   ├── selective-reset.md       # EndingScene 選択的リセットコントラクト
│   └── celebration-animation.md # エイリアンお祝い演出コントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.ts                              # ★修正: セッションフラグチェック＆saveManager.clear() 追加
├── game/
│   ├── scenes/
│   │   └── EndingScene.ts               # ★大幅修正: 選択的リセット、お祝い演出追加
│   ├── entities/
│   │   └── CompanionManager.ts          # 既存（createCompanionMesh を EndingScene から利用）
│   ├── config/
│   │   └── PlanetEncyclopedia.ts        # 既存（11エントリ参照）
│   └── storage/
│       └── SaveManager.ts               # 既存（変更なし）
└── types/
    └── index.ts                         # 既存（変更なし）

tests/
├── unit/
│   ├── SaveManager.test.ts              # ★修正: セッション管理テスト追加
│   └── scenes/
│       └── EndingScene.test.ts          # ★新規: 選択的リセット、お祝い演出テスト
└── integration/
    └── BoostFlame.test.ts               # ★新規: ブースト炎インテグレーションテスト
```

**Structure Decision**: 既存のディレクトリ構造を踏襲。main.ts と EndingScene.ts の修正が中心。テストは既存の unit/integration ディレクトリに追加。
