# Contract: 惑星図鑑DOMオーバーレイ

**Feature**: `007-encyclopedia-companions`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

タイトル画面の「ずかん」ボタンから開く惑星図鑑UI。TutorialOverlay と同じパターンで `#ui-overlay` にフルスクリーンDIVを生成する。11惑星のカードをギャラリー表示し、アンロック済みカードのタップで詳細（豆知識）を閲覧できる。

## Interface

### `EncyclopediaOverlay` クラス（新規）

**定義箇所**: `src/ui/EncyclopediaOverlay.ts`

#### `constructor()`

初期状態を設定。DOM要素はまだ生成しない。

**事後条件**:
- `overlayEl = null`
- `detailEl = null`
- `isShowingDetail = false`

#### `show(unlockedPlanets: number[], onClose: () => void): void`

ギャラリーオーバーレイを `#ui-overlay` に追加して表示する。

**事前条件**:
- `overlayEl === null`（二重表示防止。既に表示中なら即 return）

**事後条件**:
- `#ui-overlay` の子要素としてフルスクリーン DIV が追加される
- DIV のスタイル:
  - `position: absolute; inset: 0`
  - `background: rgba(0, 0, 32, 0.95)`
  - `pointer-events: auto; z-index: 30`
  - `display: flex; flex-direction: column; align-items: center; justify-content: center`
- タイトル「わくせいずかん」が上部に表示（Zen Maru Gothic, 2rem, #FFD700, bold）
- 11枚のカードグリッドが中央に表示
- 「もどる」ボタンが下部に表示

**カードグリッド仕様**:
- CSS Grid: `grid-template-columns: repeat(4, 1fr)`
- gap: `1rem`
- max-width: `90%`
- 配置: 4+4+3（最後の行は3枚、中央寄せ）

**個別カード仕様（アンロック）**:
- サイズ: 自動（グリッドセルに合わせる）、min-height: `120px`
- 背景: 惑星テーマカラーの半透明グラデーション
- border-radius: `16px`
- box-shadow: `0 4px 12px rgba(0,0,0,0.3)`
- 上部: 絵文字（2rem）
- 下部: 惑星名（Zen Maru Gothic, 1rem, #fff, bold）
- cursor: pointer
- pointerdown イベントで `showDetail(entry)` 呼び出し

**個別カード仕様（ロック）**:
- 背景: `#444`
- opacity: `0.6`
- テキスト: 「？？？」（Zen Maru Gothic, 1.2rem, #aaa, 中央配置）
- pointer-events: `none`（タップ不可）

**「もどる」ボタン仕様**:
- Zen Maru Gothic, 1.4rem, bold
- padding: `0.6rem 2rem`
- border-radius: `1.5rem`
- background: `rgba(255, 255, 255, 0.15)`
- color: `#fff`
- touch-action: `manipulation`
- pointerdown イベントで `hide()` → `onClose()` 呼び出し

#### `hide(): void`

オーバーレイを DOM から除去する。

**事後条件**:
- `overlayEl` が `#ui-overlay` から `remove()` される
- `overlayEl = null`
- `detailEl = null`
- `isShowingDetail = false`

#### `private showDetail(entry: PlanetEncyclopediaEntry): void`

カード詳細モーダルをオーバーレイ内に表示する。

**事前条件**:
- `isShowingDetail === false`（二重表示防止）

**事後条件**:
- `isShowingDetail = true`
- カードグリッドの上にフルスクリーンの詳細レイヤーが重なる
- 中央に拡大カード（max-width: 400px, max-height: 500px）:
  - 背景: 惑星テーマカラーのグラデーション
  - border-radius: `24px`
  - 絵文字: 4rem（上部中央）
  - 惑星名: 2rem, #FFD700, bold
  - 豆知識: 1.2rem, #fff, line-height 1.8, padding 1.5rem
- 「もどる」ボタン（カード下部）:
  - pointerdown で `hideDetail()` 呼び出し

#### `private hideDetail(): void`

詳細モーダルを閉じてギャラリーに戻る。

**事後条件**:
- `detailEl` が DOM から除去される
- `detailEl = null`
- `isShowingDetail = false`

## Integration with TitleScene

```typescript
// TitleScene.ts
private encyclopediaOverlay = new EncyclopediaOverlay();

// createOverlay() 内で「ずかん」ボタンを追加
const encyclopediaBtn = document.createElement('button');
encyclopediaBtn.textContent = 'ずかん';
// ... スタイル設定（あそびかたボタンと同等サイズ） ...
encyclopediaBtn.addEventListener('pointerdown', (e) => {
  e.stopPropagation();
  const saveData = this.saveManager.load();
  this.encyclopediaOverlay.show(saveData.unlockedPlanets, () => {
    // onClose: 何もしない（TitleScene は維持される）
  });
});

// exit() 内で
this.encyclopediaOverlay.hide();
```

## Data Dependencies

- `PLANET_ENCYCLOPEDIA` 配列（`PlanetEncyclopedia.ts`）から全11惑星のデータを参照
- `unlockedPlanets: number[]` で各カードの表示状態を判定
