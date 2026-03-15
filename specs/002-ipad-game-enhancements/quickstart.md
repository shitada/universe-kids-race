# Quickstart: 002-ipad-game-enhancements

**Date**: 2026-03-15

## Prerequisites

- Node.js 18+
- npm
- iPad Safari (実機テスト用) or Chrome DevTools (開発時)

## Setup

```bash
git checkout 002-ipad-game-enhancements
npm install
```

## Development

```bash
# 開発サーバー起動
npm run dev

# テスト実行
npm run test

# テスト（ウォッチモード）
npm run test:watch

# ビルド
npm run build
```

## Key Files to Modify

| File | Change |
|------|--------|
| `src/types/index.ts` | StageConfig に emoji, displayName, planetColor を追加。SFXType 定義追加 |
| `src/game/config/StageConfig.ts` | 3→8 ステージに拡張。新規フィールド値を設定 |
| `src/game/audio/AudioManager.ts` | 完全書き換え: Web Audio API ネイティブ実装 |
| `src/game/effects/ParticleBurst.ts` | 新規: パーティクルバーストシステム |
| `src/game/scenes/StageScene.ts` | パーティクル・サウンド統合、8ステージ惑星対応 |
| `src/game/scenes/TitleScene.ts` | 新 AudioManager 統合 |
| `src/game/scenes/EndingScene.ts` | 新 AudioManager 統合 |
| `src/ui/HUD.ts` | ステージ名表示用 DOM 要素追加 |

## New Files

| File | Purpose |
|------|---------|
| `src/game/effects/ParticleBurst.ts` | パーティクルバースト + プールマネージャ |
| `tests/unit/audio/AudioManager.test.ts` | サウンドシステムのユニットテスト |
| `tests/unit/effects/ParticleBurst.test.ts` | パーティクルのユニットテスト |
| `tests/unit/config/StageConfig.test.ts` | 8ステージ設定のバリデーションテスト |

## Testing Strategy

- **Unit tests**: AudioManager (mock AudioContext), ParticleBurst (mock THREE.Scene), StageConfig (data validation)
- **Integration tests**: StageFlow.test.ts を 8 ステージ対応に更新
- **Manual test**: iPad Safari 実機で音声再生・パーティクル表示・60fps を確認

## Architecture Notes

- AudioManager は Three.js Audio を使わず Web Audio API を直接使用（プログラム生成サウンドのため）
- パーティクルはオブジェクトプール（最大10同時バースト）で管理
- HUD のステージ名は StageConfig.emoji + StageConfig.displayName で表示
- 全サウンド機能は init 失敗時に no-op フォールバック（ゲームプレイに影響しない）
