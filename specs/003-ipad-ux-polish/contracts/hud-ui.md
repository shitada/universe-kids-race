# Contract: HUD UI 要素

**Feature**: `003-ipad-ux-polish`  
**Date**: 2026-03-15  
**Type**: Internal Module Interface

## Overview

HUD クラスの拡張。ステージ名視認性修正、ホームボタン追加、ブーストボタンデザイン刷新、クールダウンインジケーター追加。

## DOM 配置コントラクト

### レイヤー構造

```
#game-canvas (z-index: auto)
#hud         (z-index: 10, pointer-events: none)
#ui-overlay  (z-index: 20, pointer-events: none)
```

### HUD 要素配置マップ

```
┌─────────────────────────────────────────────┐
│ 🏠 (home)                                    │  ← #hud 内, absolute top-left
│          🌙 つきを めざせ！                    │  ← #hud 内, center
│ スコア: 1234              ⭐ 12               │  ← #hud 内, flex space-between
│                                              │
│                                              │
│                                              │
│                                              │
│                                              │
│                              ┌──────────┐   │
│                              │ 🚀       │   │  ← #ui-overlay 内, absolute bottom-right
│                              │ブースト!  │   │
│                              └──────────┘   │
│                              [====      ]   │  ← クールダウンバー
└─────────────────────────────────────────────┘
```

## Interface

### `HUD.show(stageName?: string): void`

**変更**: ステージ名の CSS を拡張（font-size 増大、text-shadow 追加）、ホームボタンを追加。

### `HUD.setHomeCallback(callback: () => void): void` **新規**

ホームボタンタップ時のコールバックを設定する。

**前提条件**: `show()` が先に呼ばれていること  
**事後条件**: ホームボタンの pointerdown イベントでコールバックが実行される

### `HUD.updateCooldown(progress: number): void` **新規**

クールダウンインジケーターの進捗を更新する。

**パラメータ**: `progress` — 0.0（クールダウン開始）〜 1.0（使用可能）  
**更新頻度**: 毎フレーム（GameLoop の update 内で呼ばれる）  
**パフォーマンス**: `style.width` の1プロパティ変更のみ。Layout は幅変更で発生するが、要素がコンポジットレイヤー外の小さな要素のため影響は軽微

### `HUD.hide(): void`

**変更**: ホームボタン、クールダウンインジケーターも含めて全DOM要素を除去。

## ブーストボタン デザインコントラクト

### 基本スタイル

```css
/* グラデーション背景 */
background: linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77);
/* 角丸 */
border-radius: 2rem;
/* テキスト */
content: '🚀 ブースト!';
font-family: 'Zen Maru Gothic', sans-serif;
font-size: 1.3rem;
font-weight: 700;
/* シャドウ */
box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
/* ボーダー削除 */
border: none;
color: #fff;
```

### アニメーション

| 状態 | アニメーション | CSS |
|------|--------------|-----|
| 使用可能（待機中） | 穏やかなパルス | `animation: pulse 2s ease-in-out infinite` |
| タップ時 | 縮小→拡大バウンス | `transform: scale(0.9)` → `scale(1.1)` → `scale(1.0)` |
| クールダウン中 | アニメーション停止、グレーアウト | `opacity: 0.5; filter: grayscale(0.8); animation: none` |
| クールダウン完了 | 光るフラッシュ | `@keyframes glow { box-shadow + scale }` 1回再生 |

### クールダウンインジケーター

```
[ブーストボタン]
[████████░░░░░░] ← 進捗バー (width: {progress * 100}%)
```

- コンテナ: `width: 80px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.2)`
- バー: `height: 100%; border-radius: 3px; background: linear-gradient(90deg, #00ddff, #00ff88); transition: width 0.1s`
- 完了時: バー全体が一瞬光る (`box-shadow: 0 0 10px #00ff88`)

## ホームボタン デザインコントラクト

```css
position: absolute;
top: 0.8rem;
left: 1rem;
font-size: 1.8rem;
background: rgba(255, 255, 255, 0.15);
border: none;
border-radius: 50%;
width: 3rem;
height: 3rem;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
pointer-events: auto;
touch-action: manipulation;
content: '🏠';
```

- ブーストボタン（右下）との距離: 画面の対角線上で最大距離
- タッチターゲット: 48px × 48px 以上（Apple HIG 準拠）

## TutorialOverlay コントラクト

### `TutorialOverlay.show(onClose: () => void): void`

`#ui-overlay` にフルスクリーンのチュートリアルオーバーレイを追加する。

**パラメータ**: `onClose` — 閉じるボタンタップ時のコールバック  
**前提条件**: `#ui-overlay` が存在すること  
**事後条件**: オーバーレイ DOM が追加され、CSS アニメーションが開始される  
**重複呼び出し**: 既に表示中の場合は何もしない

### `TutorialOverlay.hide(): void`

オーバーレイ DOM を除去する。

**事後条件**: オーバーレイの全 DOM 要素が除去される  
**未表示時**: 何もしない

### カード CSS アニメーション

| カード | アイコン | アニメーション | CSS |
|--------|---------|--------------|-----|
| 移動 | 👆 | 左右往復 | `@keyframes swipe { 0%,100% { translateX(-20px) } 50% { translateX(20px) } }` 2s infinite |
| ブースト | 🚀 | 上下パルス | `@keyframes boostPulse { 0%,100% { translateY(0) } 50% { translateY(-10px) } }` 1.5s infinite |
| 目的 | ⭐ | 回転+光る | `@keyframes starGlow { 0% { rotate(0) opacity(0.7) } 50% { rotate(180deg) opacity(1) } 100% { rotate(360deg) opacity(0.7) } }` 3s infinite |
