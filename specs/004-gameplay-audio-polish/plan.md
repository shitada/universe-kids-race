# Implementation Plan: ゲーム体験改善第3弾 — HUDステージ番号・テキスト選択防止・BGM強化

**Branch**: `004-gameplay-audio-polish` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-gameplay-audio-polish/spec.md`

## Summary

既存の Three.js + TypeScript + Vite 宇宙レースゲーム（001〜003で構築済み）に対する4項目の改善。HUDステージ番号表示（P1）、テキスト選択/コンテキストメニュー無効化（P1）、ステージBGM和音化（P2）、タイトルBGM強化（P2）。BGM改修は既存の単音メロディ+ベース構成を4レイヤー（メロディ・コードパッド・アルペジオ・ベース）に拡張し、8小節ループのコード進行を導入する。ステージごとに異なるキー・テンポ・音色・コード進行を定義。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)
**Primary Dependencies**: Three.js, Vite
**Storage**: localStorage (SaveManager)
**Testing**: Vitest (jsdom環境)
**Target Platform**: iPad Safari（横向き固定）
**Project Type**: web-app（ブラウザゲーム）
**Performance Goals**: iPad Safari上で60fps維持、BGMはiPad Air以降で音割れなし
**Constraints**: Three.js以外の外部ライブラリ不可、子供向け（5〜10歳）、ひらがな表記、YAGNI
**Scale/Scope**: 8ステージ + タイトル + エンディング、BGMは最大6同時OscillatorNode

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | ステージ番号付与で進行度を把握しやすく。テキスト選択無効化で操作中断を防止。和音BGMでより楽しい音楽体験 |
| II. デザイン | ✅ PASS | Zen Maru Gothic維持。HUDは既存のゴールドカラー(#FFD700)フォーマット踏襲。絵文字表記維持 |
| III. シンプル操作 | ✅ PASS | 操作追加なし。テキスト選択防止はユーザー操作の阻害要因を除去するだけ |
| IV. 3D 冒険体験 | ✅ PASS | Three.js 3D描画に変更なし。BGM改修はWeb Audio APIのみ |
| V. 技術スタック | ✅ PASS | Three.js + TypeScript + Vite。外部ライブラリ追加なし。Web Audio API + CSS変更のみ |
| VI. 開発ワークフロー | ✅ PASS | TDD。AudioManager拡張はユニットテスト対象。HUD表示変更もテスト対象 |

**全ゲート通過。違反なし。**

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | 「ステージN:」表記で番号付与。和音BGMは壮大な宇宙冒険感を強化。失敗的表現なし |
| II. デザイン | ✅ PASS | HUD表示フォーマット統一。BGM音色はカートゥーン調に合うソフトな波形(sine/triangle主体) |
| III. シンプル操作 | ✅ PASS | 変更なし |
| IV. 3D 冒険体験 | ✅ PASS | 変更なし |
| V. 技術スタック | ✅ PASS | OscillatorNode (Web Audio API標準)のみ使用。外部ライブラリなし |
| VI. 開発ワークフロー | ✅ PASS | BGMConfig定義のユニットテスト追加。既存テスト全パス維持 |

## Project Structure

### Documentation (this feature)

```text
specs/004-gameplay-audio-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── bgm-layers.md   # BGM多層構成・コード進行コントラクト
│   ├── hud-stage-number.md  # HUDステージ番号表示コントラクト
│   └── text-selection.md    # テキスト選択防止コントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.ts                          # 変更なし
├── types/
│   └── index.ts                     # 変更なし（StageConfigに既にstageNumberあり）
├── game/
│   ├── audio/
│   │   └── AudioManager.ts          # ★大幅修正: BGMConfig拡張、playBGM()を4レイヤー構成に改修
│   ├── config/
│   │   └── StageConfig.ts           # 変更なし（既存のstageNumber使用）
│   ├── scenes/
│   │   ├── TitleScene.ts            # ★軽微修正: タイトルBGMはstageNumber=0のまま（AudioManager側で対応）
│   │   ├── StageScene.ts            # ★修正: HUD.show()にステージ番号付き名称を渡す
│   │   └── EndingScene.ts           # 変更なし（stageNumber=-1のまま）
│   └── ...                          # その他変更なし
├── ui/
│   └── HUD.ts                       # 変更なし（show()のstageName引数はそのまま、呼び出し側で文字列を構成）
└── ...

index.html                           # ★修正: CSS user-select追加、contextmenu preventDefault追加

tests/
├── unit/
│   ├── audio/
│   │   └── AudioManager.test.ts     # ★修正: 4レイヤーBGMテスト追加
│   └── ui/
│       └── HUD.test.ts              # ★修正: ステージ番号付き名称テスト追加
└── integration/
    └── StageFlow.test.ts            # 変更なし
```

**Structure Decision**: 既存のプロジェクト構造をそのまま使用。AudioManager.tsの内部リファクタがメインの変更。新規ファイルの追加なし。

## Complexity Tracking

> 違反なし。追加の正当化は不要。
