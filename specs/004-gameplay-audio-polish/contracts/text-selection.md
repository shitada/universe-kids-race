# Contract: テキスト選択・コンテキストメニュー無効化

**Feature**: `004-gameplay-audio-polish`
**Date**: 2026-03-15
**Type**: HTML/CSS/JS Configuration

## Overview

iPadタッチ操作中のテキスト選択とコンテキストメニュー表示を無効化し、ゲーム操作の中断を防止する。

## 変更対象

### index.html のみ

## CSS 追加仕様

`html, body` ルールに以下の3プロパティを追加:

```css
html, body {
  /* 既存のプロパティはそのまま維持 */
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000020;
  font-family: 'Zen Maru Gothic', sans-serif;

  /* 新規追加 */
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}
```

| プロパティ | 値 | 対象ブラウザ | 目的 |
|-----------|-----|------------|------|
| `user-select` | `none` | 全ブラウザ（標準） | テキスト選択無効化 |
| `-webkit-user-select` | `none` | Safari/WebKit | テキスト選択無効化（Safari対応） |
| `-webkit-touch-callout` | `none` | Safari | 長押し時のコールアウトメニュー無効化 |

## JavaScript 追加仕様

`<body>` 内、Viteモジュールスクリプトの **前** にインラインスクリプトを追加:

```html
<script>
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
</script>
```

**配置順序**:
```html
<body>
  <canvas id="game-canvas"></canvas>
  <div id="hud"></div>
  <div id="ui-overlay"></div>
  <script>document.addEventListener('contextmenu', function(e) { e.preventDefault(); });</script>
  <script type="module" src="/src/main.ts"></script>
</body>
```

## 対応範囲

| 要素 | テキスト選択 | コンテキストメニュー |
|------|------------|-------------------|
| body全体 | CSS で無効化 | document listener で無効化 |
| #game-canvas | body CSSで継承 | document listener でカバー |
| #hud | body CSSで継承 | document listener でカバー |
| #ui-overlay | body CSSで継承 | document listener でカバー |
| HUD内テキスト | body CSSで継承 | document listener でカバー |

## テスト方針

- CSS プロパティの適用確認はiPad実機テストで行う（jsdom ではタッチ操作のシミュレーションが困難）
- contextmenu イベントの preventDefault はユニットテストで検証可能だが、静的HTML変更のため実機確認を優先
