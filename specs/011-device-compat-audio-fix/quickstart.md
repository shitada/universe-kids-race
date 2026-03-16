# Quickstart: デバイス互換性 & オーディオ修正

**Feature**: 011-device-compat-audio-fix | **Date**: 2026-03-16

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
git checkout 011-device-compat-audio-fix
npm install
```

## Development

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run test       # Vitest (全テスト実行)
npm run build      # Production build
```

## Files to Modify

| File | Change |
|------|--------|
| `src/game/audio/AudioManager.ts` | `ensureResumed()`, `bgmGeneration`, `bgmPlaying` 追加 |
| `src/game/systems/InputSystem.ts` | `keydown`/`keyup` リスナー、`pressedKeys` Set 追加 |
| `src/game/scenes/TitleScene.ts` | overlay `pointerdown` から `playBGM(0)` 除去 |
| `src/main.ts` | `visibilitychange` で `audioManager.ensureResumed()` 呼び出し |
| `index.html` | `viewport-fit=cover`, safe area CSS 追加 |
| `src/ui/HUD.ts` | ボタン位置に safe area inset 適用 |

## Testing Strategy

### Unit Tests
- `tests/unit/audio/AudioManager.test.ts` — ensureResumed, bgmGeneration テスト
- `tests/unit/systems/InputSystem.test.ts` — keyboard input テスト
- `tests/unit/scenes/TitleScene.test.ts` — BGM 重複防止テスト

### Manual Testing
- **Safari BGM 復帰**: iPad/iPhone Safari でバックグラウンド遷移→復帰を繰り返し、BGM が 1 秒以内に再開されること
- **BGM 重複**: タイトル画面でオーバーレイ→「あそぶ」を素早くタップし、BGM が 1 つだけ再生されること
- **iPhone safe area**: iPhone（ノッチ付き）横画面で HUD・ボタンがノッチに重ならないこと
- **PC キーボード**: 矢印キーで左右移動、スペースでブーストが機能すること

## Implementation Order

1. **US1 (P1)**: AudioManager.ensureResumed() + main.ts visibilitychange
2. **US2 (P1)**: AudioManager bgmGeneration + TitleScene overlay 修正
3. **US4 (P2)**: InputSystem keyboard 対応
4. **US3 (P2)**: index.html viewport + CSS safe area + HUD 調整
