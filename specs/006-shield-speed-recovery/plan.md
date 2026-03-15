# Implementation Plan: エアシールドエフェクト追加・隕石衝突後の速度緩やか回復

**Branch**: `006-shield-speed-recovery` | **Date**: 2026-03-15 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-shield-speed-recovery/spec.md`

## Summary

既存の Three.js + TypeScript + Vite 宇宙レースゲーム（001〜005で構築済み）に対する2つの改善。(1) 宇宙船を包む常時表示のエアシールド（空気の幕）エフェクトを追加。SphereGeometry + MeshBasicMaterial（透明・AdditiveBlending）で実装し、パルスアニメーションで「生きている」質感を演出。ブースト中は明るく大きく強調される。(2) 隕石衝突後の3秒間の減速期間終了後、速度が40%→100%へ瞬時ではなくイーズアウト補間で約1秒かけて段階的に回復するよう改善。SpeedStateに'RECOVERING'を追加し、Spaceshipの速度計算を拡張。

## Technical Context

**Language/Version**: TypeScript 5.x (ES2020+)
**Primary Dependencies**: Three.js, Vite
**Storage**: localStorage (SaveManager) — 本機能では変更なし
**Testing**: Vitest (jsdom環境)
**Target Platform**: iPad Safari（横向き固定）
**Project Type**: web-app（ブラウザゲーム）
**Performance Goals**: iPad Safari上で60fps維持（エアシールド + 既存炎パーティクル同時表示）
**Constraints**: Three.js以外の外部ライブラリ不可、子供向け（5〜10歳）、YAGNI
**Scale/Scope**: SphereGeometry(1.5,16,16)=624頂点追加のみ。パフォーマンス影響は軽微

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | エアシールドは宇宙船の存在感を高め、視覚的に楽しい。速度回復の滑らか化は唐突な変化を無くし快適なプレイ体験を提供 |
| II. デザイン | ✅ PASS | 青白い半透明のシールドは宇宙テーマの配色に合致。AdditiveBlendingで宇宙空間に自然に溶け込む |
| III. シンプル操作 | ✅ PASS | 操作追加なし。エアシールドは自動表示。速度回復も自動 |
| IV. 3D 冒険体験 | ✅ PASS | エアシールドの3D球体が宇宙船を包む没入感。パルスアニメーションで「生きている」質感 |
| V. 技術スタック | ✅ PASS | Three.js標準のSphereGeometry + MeshBasicMaterial。外部ライブラリ追加なし |
| VI. 開発ワークフロー | ✅ PASS | TDD。AirShield・Spaceship(RECOVERING)のユニットテストを追加 |

**全ゲート通過。違反なし。**

### Post-Design Re-check

| 原則 | ステータス | 根拠 |
|------|-----------|------|
| I. 子供ファースト | ✅ PASS | エアシールドのパルスが「守られている」安心感を演出。速度回復のイーズアウトにより体験が滑らか |
| II. デザイン | ✅ PASS | MeshBasicMaterial + AdditiveBlending。カートゥーン調の世界観に調和する青白い半透明表現 |
| III. シンプル操作 | ✅ PASS | 変更なし |
| IV. 3D 冒険体験 | ✅ PASS | SphereGeometry(1.5,16,16)の3Dシールドが宇宙船を包む。ブースト時の強調で迫力向上 |
| V. 技術スタック | ✅ PASS | Three.js標準機能のみ。SphereGeometry + MeshBasicMaterial。数学関数(sin, quadratic)のみ |
| VI. 開発ワークフロー | ✅ PASS | AirShield: constructor/update/setBoostMode/dispose テスト。Spaceship: RECOVERING状態遷移テスト、getForwardSpeedイーズアウトテスト、エッジケーステスト |

## Project Structure

### Documentation (this feature)

```text
specs/006-shield-speed-recovery/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── air-shield.md           # エアシールドエフェクトコントラクト
│   └── speed-recovery.md       # 速度緩やか回復コントラクト
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── main.ts                          # 変更なし
├── types/
│   └── index.ts                     # ★修正: SpeedStateに'RECOVERING'追加
├── game/
│   ├── effects/
│   │   ├── ParticleBurst.ts         # 変更なし
│   │   └── AirShield.ts             # ★新規: エアシールドエフェクトクラス
│   ├── entities/
│   │   └── Spaceship.ts             # ★修正: RECOVERY_DURATION追加、getForwardSpeed()にRECOVERINGケース追加、update()でSLOWDOWN→RECOVERING遷移
│   ├── scenes/
│   │   └── StageScene.ts            # ★修正: AirShieldの生成・更新・破棄を統合
│   ├── systems/
│   │   ├── BoostSystem.ts           # 変更なし
│   │   └── CollisionSystem.ts       # 変更なし（RECOVERING中は衝突判定有効のまま）
│   └── ...
└── ...

tests/
├── unit/
│   ├── entities/
│   │   └── Spaceship.test.ts        # ★修正: RECOVERING状態テスト追加
│   ├── effects/
│   │   └── AirShield.test.ts        # ★新規: AirShieldユニットテスト
│   └── systems/
│       └── CollisionSystem.test.ts  # ★修正: RECOVERING中の衝突判定テスト追加
└── integration/
```

**Structure Decision**: 既存プロジェクト構造を維持。新規ファイルは `src/game/effects/AirShield.ts` と `tests/unit/effects/AirShield.test.ts` の2ファイルのみ。既存ファイルの修正は最小限。

## Complexity Tracking

> 違反なし。追加の正当化は不要。
