# Quickstart: 008-companion-shield-boost-fix

**Feature**: コンパニオンタイミング修正・シールド楕円化・ブースト炎改善
**Branch**: `008-companion-shield-boost-fix`

## 前提条件

- Node.js 18+
- npm
- iPad Safari でのテスト用に同一ネットワーク上の iPad（またはシミュレータ）

## セットアップ

```bash
git checkout 008-companion-shield-boost-fix
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
| src/game/entities/CompanionManager.ts | `addCompanion(stageNumber)` メソッド追加、`CompanionData` に `entranceTimer` 追加、登場アニメーション処理 |
| src/game/effects/AirShield.ts | デフォルト `visible=false`、`setBoostMode(true)` で楕円スケール `(1.0, 0.8, 2.0)` 適用、通常パルス削除 |
| src/game/scenes/StageScene.ts | `MAX_FLAME_PARTICLES` 100→150、放出数 5→8、寿命 0.5→0.7、クリア時コンパニオン演出追加、クリア中の companionManager.update() 呼び出し |
| tests/unit/entities/CompanionManager.test.ts | `addCompanion()` のユニットテスト追加 |
| tests/unit/effects/AirShield.test.ts | デフォルト非表示・楕円スケール・通常パルス削除のテスト追加/修正 |

## 手動テスト手順

### US1: コンパニオンタイミング

1. セーブデータをクリア（DevTools → Application → localStorage → 削除）
2. ステージ1をクリアする
3. クリアメッセージ「やったね！」の後に「🌙 つきの ずかんカード ゲット！」と「🌙 つきが なかまに なったよ！」が表示されることを確認
4. 月のコンパニオンがスピン＋拡大で登場することを確認
5. ステージ2が開始したら、月のコンパニオンがオービットで表示されていることを確認
6. ステージ1を再クリアし、「なかまに なったよ！」が表示されないことを確認

### US2: 楕円シールド

1. ステージ開始時にシールドが見えないことを確認
2. ブーストボタンをタップしてブーストを発動
3. 楕円形のシールドが表示されることを確認（進行方向に伸びた形状）
4. ブースト終了後にシールドが消えることを確認

### US3: ブースト炎

1. ブーストを発動して炎パーティクルを観察
2. 炎が途切れなく連続的に放出されることを確認
3. 炎の密度が以前より高く、尾が長いことを確認
4. ブースト終了後に炎が自然に消滅することを確認
