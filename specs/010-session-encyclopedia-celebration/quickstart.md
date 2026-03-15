# Quickstart: 010-session-encyclopedia-celebration

**Feature**: セッション管理・ずかん永続化・全クリアお祝い演出
**Branch**: `010-session-encyclopedia-celebration`

## 前提条件

- Node.js 18+
- npm
- iPad Safari でのテスト用に同一ネットワーク上の iPad（またはシミュレータ）

## セットアップ

```bash
git checkout 010-session-encyclopedia-celebration
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
| src/main.ts | sessionStorage セッションフラグチェック追加。フラグ不在時に saveManager.clear() 実行 |
| src/game/scenes/EndingScene.ts | saveManager.clear() → 選択的リセット（clearedStage=0 のみ）。全11体エイリアンお祝い演出追加 |
| src/game/entities/CompanionManager.ts | createCompanionMesh + shape メソッド群を public static / private static に変更 |
| tests/unit/SaveManager.test.ts | セッション管理のテストケース追加 |
| tests/unit/scenes/EndingScene.test.ts | 選択的リセット、お祝い演出のテスト（新規） |
| tests/integration/BoostFlame.test.ts | ブースト炎持続動作のインテグレーションテスト（新規） |

## 手動テスト手順

### US1: Safari スワイプ終了リセット
1. iPad Safari でゲームを開く
2. 数ステージプレイして進行する
3. Safari をスワイプ終了（アプリキル）
4. Safari を再起動してゲームを開く
5. **確認**: ステージ1から開始されること

### US2: ずかん永続化
1. ゲームを全11ステージクリアする
2. エンディング画面が表示される
3. タイトルに戻る
4. ずかんボタンを押す
5. **確認**: 全11惑星が表示されること
6. Safari をスワイプ終了 → 再起動
7. **確認**: ずかんが空であること

### US3: お祝い演出
1. ゲームを全11ステージクリアする
2. エンディング画面が表示される
3. **確認**: エイリアンが順番にポップインで登場すること
4. **確認**: 全員登場後にバウンス（ジャンプ）すること
5. **確認**: 「みんな ありがとう！」テキストが表示されること
6. タイトルに戻るボタンが機能すること
