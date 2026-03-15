# Implementation Plan: わくせいずかん＆うちゅうのなかま（惑星図鑑 & エイリアンコンパニオン）

**Branch**: `007-encyclopedia-companions` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/007-encyclopedia-companions/spec.md`

## Summary

既存の Three.js + TypeScript + Vite 宇宙レースゲーム（001〜006で構築済み）に2つの収集・報酬要素を追加する。(1) **惑星図鑑**: ステージクリアでひらがな豆知識カードを獲得し、タイトル画面の「ずかん」ボタンからDOM オーバーレイのギャラリーで閲覧。全11惑星。未クリアはロック表示。(2) **エイリアンコンパニオン**: ステージクリアで惑星テーマの幾何学体キャラクターが仲間に加わり、以降のステージで宇宙船の周りをオービット飛行。仲間の数に応じて星の引き寄せ範囲が拡大（base + count × 0.2）。SaveData を拡張し`unlockedPlanets: number[]`で獲得状態を管理。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)
**Primary Dependencies**: Three.js, Vite
**Storage**: localStorage (SaveManager) — SaveData インターフェース拡張
**Testing**: Vitest (jsdom環境)
**Target Platform**: iPad Safari（横向き固定）
**Project Type**: web-app（ブラウザゲーム）
**Performance Goals**: iPad Safari上で60fps維持（コンパニオン11体同時オービット + 既存エフェクト）
**Constraints**: Three.js以外の外部ライブラリ不可、子供向け（5〜10歳）、YAGNI、localStorage 5MB上限内
**Scale/Scope**: コンパニオン11体（各10〜50ポリゴン）、図鑑カード11枚（DOM要素）、SaveDataに配列1つ追加

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | 図鑑はひらがなの豆知識で教育的。絵文字・カラフルなカードで視覚的に楽しい。コンパニオンは「なかま」という温かいテーマ。失敗表現なし |
| II. デザイン | ✅ PASS | 図鑑はDOM オーバーレイで大きな角丸カード + Zen Maru Gothic。コンパニオンはカートゥーン調の幾何学体。宇宙テーマの配色 |
| III. シンプル操作 | ✅ PASS | 図鑑はタップで開く・タップでカード詳細・タップで戻る。コンパニオンは自動で宇宙船に追従。操作追加なし |
| IV. 3D 冒険体験 | ✅ PASS | コンパニオンのオービットが宇宙船の賑やかさを演出。仲間が増える視覚的な成長感 |
| V. 技術スタック | ✅ PASS | Three.js標準のジオメトリ（Sphere, Cone, Ring等）のみ。DOM オーバーレイはTutorialOverlayパターン踏襲。外部ライブラリ追加なし |
| VI. 開発ワークフロー | ✅ PASS | TDD。SaveManager/CompanionManager/EncyclopediaOverlay/CollisionSystem拡張のユニットテスト |

**全ゲート通過。違反なし。**

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | カード獲得演出でポジティブなフィードバック。「？？？」ロック表示で収集欲を刺激。大きなタップターゲット（最小44x44pt） |
| II. デザイン | ✅ PASS | 図鑑カード: 角丸16px、惑星テーマカラー背景、Zen Maru Gothic。コンパニオン: MeshToonMaterial でカートゥーン調。惑星テーマカラーで統一 |
| III. シンプル操作 | ✅ PASS | 図鑑: 「ずかん」タップ→カードタップ→「もどる」タップ。最大3タップ。コンパニオン: 操作不要、自動オービット |
| IV. 3D 冒険体験 | ✅ PASS | コンパニオン各10〜50ポリゴン。11体で最大550ポリゴン追加。iPad Safariで60fps維持に問題なし |
| V. 技術スタック | ✅ PASS | Three.js: SphereGeometry, ConeGeometry, RingGeometry, MeshToonMaterial。DOM: createElement API。外部ライブラリ不使用 |
| VI. 開発ワークフロー | ✅ PASS | CompanionManager: orbit計算・追従・星ボーナスのテスト。EncyclopediaOverlay: カード表示・ロック状態・詳細表示テスト。SaveManager: unlockedPlanets永続化テスト。CollisionSystem: companionBonus反映テスト |

## Project Structure

### Documentation (this feature)

```text
specs/007-encyclopedia-companions/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── encyclopedia-overlay.md    # 惑星図鑑DOMオーバーレイコントラクト
│   ├── companion-manager.md       # コンパニオン管理・オービットコントラクト
│   └── save-data-extension.md     # SaveData拡張コントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.ts                          # ★修正: SaveManager.save()でunlockedPlanets含める
├── types/
│   └── index.ts                     # ★修正: SaveData拡張、PlanetEncyclopediaEntry型追加、CompanionConfig型追加
├── game/
│   ├── config/
│   │   ├── StageConfig.ts           # 変更なし（既存のemoji/planetColor/destinationを活用）
│   │   ├── PlanetEncyclopedia.ts    # ★新規: 惑星ごとの豆知識・コンパニオン形状定義
│   ├── entities/
│   │   ├── CompanionManager.ts      # ★新規: コンパニオン群管理・オービット計算
│   │   └── Spaceship.ts             # 変更なし
│   ├── scenes/
│   │   ├── TitleScene.ts            # ★修正: 「ずかん」ボタン追加、EncyclopediaOverlay統合
│   │   ├── StageScene.ts            # ★修正: ステージクリア時のunlock処理、CompanionManager統合、CollisionSystem呼び出し拡張
│   │   └── EndingScene.ts           # 変更なし
│   ├── storage/
│   │   └── SaveManager.ts           # ★修正: unlockedPlanets のバリデーション追加
│   └── systems/
│       └── CollisionSystem.ts       # ★修正: check()にcompanionBonus引数追加、星の引き寄せ範囲拡大
├── ui/
│   ├── EncyclopediaOverlay.ts       # ★新規: 惑星図鑑DOMオーバーレイ（ギャラリー+詳細表示）
│   ├── HUD.ts                       # 変更なし
│   └── TutorialOverlay.ts           # 変更なし
└── ...

tests/
├── unit/
│   ├── config/
│   │   └── PlanetEncyclopedia.test.ts  # ★新規: 図鑑データバリデーション
│   ├── entities/
│   │   └── CompanionManager.test.ts    # ★新規: オービット計算・追従・ボーナスのテスト
│   ├── storage/
│   │   └── SaveManager.test.ts         # ★修正: unlockedPlanets永続化テスト追加
│   ├── systems/
│   │   └── CollisionSystem.test.ts     # ★修正: companionBonusテスト追加
│   └── ui/
│       └── EncyclopediaOverlay.test.ts # ★新規: カード表示・ロック状態テスト
└── integration/
```

**Structure Decision**: 既存プロジェクト構造を維持。新規ファイルは `PlanetEncyclopedia.ts`, `CompanionManager.ts`, `EncyclopediaOverlay.ts` とそれぞれのテスト。既存ファイル（types/index.ts, SaveManager.ts, CollisionSystem.ts, StageScene.ts, TitleScene.ts, main.ts）の修正は最小限の拡張に留める。

## Complexity Tracking

> 違反なし。追加の正当化は不要。
