# Quickstart: 009-boost-flame-fadeout

**Feature**: ブースト炎の持続保証＆フェードアウト演出
**Branch**: `009-boost-flame-fadeout`

## 前提条件

- Node.js 18+
- npm
- iPad Safari でのテスト用に同一ネットワーク上の iPad（またはシミュレータ）

## セットアップ

```bash
git checkout 009-boost-flame-fadeout
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
| src/game/systems/BoostSystem.ts | `getDurationProgress()` メソッド追加（0.0→1.0 ブースト進行度） |
| src/game/scenes/StageScene.ts | 放出条件から `flameEmitting` 除去、`emitFlameParticles()` にフェードアウトロジック追加（放出数・サイズの段階的減少） |
| tests/unit/systems/BoostSystem.test.ts | `getDurationProgress()` のユニットテスト追加 |

## 手動テスト手順

### US1: ブースト中の炎が途切れず表示される

1. ステージを開始し、ブーストボタンをタップしてブーストを発動
2. 3秒間のブースト持続時間にわたって、炎エフェクトが途切れなく連続表示されることを確認
3. ブースト中盤（約1.5秒付近）で炎が点滅したり途切れたりしないことを確認
4. 複数回のブースト発動で再現テストを行う

### US2: ブースト終了時に炎が自然にフェードアウトする

1. ブーストを発動し、終了間際（残り約0.5秒）を注視する
2. 炎パーティクルの量が段階的に減少することを確認（唐突に消えない）
3. 炎パーティクルのサイズが段階的に縮小することを確認
4. ブースト終了後、残存パーティクルが自然に消滅することを確認
5. フェードアウト開始前（残り0.5秒超）の炎は通常の大きさ・量であることを確認

### Edge Case テスト

1. 隕石に衝突してブーストがキャンセルされた場合、炎が即座に消えることを確認
2. 連続ブースト（1回目の残存パーティクルがある状態で2回目発動）で、新しい炎が正常に表示されることを確認
