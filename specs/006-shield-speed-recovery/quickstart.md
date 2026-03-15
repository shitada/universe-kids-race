# Quickstart: 006-shield-speed-recovery

**Feature**: エアシールドエフェクト追加・隕石衝突後の速度緩やか回復
**Branch**: `006-shield-speed-recovery`

## 前提条件

- Node.js 18+
- npm
- iPad Safari でのテスト用に同一ネットワーク上の iPad（またはシミュレータ）

## セットアップ

```bash
git checkout 006-shield-speed-recovery
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

iPad からアクセスする場合:

```bash
npx vite --host
```

## テスト実行

```bash
npm run test
```

## ビルド

```bash
npm run build
```

## 主な変更ファイル

| ファイル | 変更内容 |
|---------|---------|
| src/types/index.ts | SpeedState に `'RECOVERING'` 追加 |
| src/game/entities/Spaceship.ts | RECOVERY_DURATION 定数追加、getForwardSpeed() に RECOVERING ケース追加、update() で SLOWDOWN→RECOVERING 遷移 |
| src/game/effects/AirShield.ts | **新規**: エアシールドエフェクトクラス |
| src/game/scenes/StageScene.ts | AirShield の生成・更新・破棄を統合 |
| tests/unit/entities/Spaceship.test.ts | RECOVERING 状態のテスト追加 |
| tests/unit/effects/AirShield.test.ts | **新規**: AirShield のユニットテスト |

## 動作確認手順

1. ステージ開始後、宇宙船の周囲に青白いエアシールドが表示されることを確認
2. エアシールドがゆっくりパルス（明滅・拡縮）していることを確認
3. 左右移動時にエアシールドが宇宙船に追従することを確認
4. ブースト発動時にエアシールドが明るく大きくなることを確認
5. ブースト終了後、エアシールドが通常サイズに戻ることを確認（消えない）
6. 隕石に衝突し、3秒後に速度が徐々に回復することを体感確認
7. 回復中に再度隕石に衝突し、再び3秒減速→段階回復になることを確認
