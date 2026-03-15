# Quickstart: 007-encyclopedia-companions

**Feature**: わくせいずかん＆うちゅうのなかま（惑星図鑑 & エイリアンコンパニオン）
**Branch**: `007-encyclopedia-companions`

## 前提条件

- Node.js 18+
- npm
- iPad Safari でのテスト用に同一ネットワーク上の iPad（またはシミュレータ）

## セットアップ

```bash
git checkout 007-encyclopedia-companions
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
| src/types/index.ts | SaveData に `unlockedPlanets` 追加、`PlanetEncyclopediaEntry`・`CompanionShape` 型追加 |
| src/game/config/PlanetEncyclopedia.ts | **新規**: 全11惑星の図鑑データ・コンパニオン形状定義 |
| src/game/entities/CompanionManager.ts | **新規**: コンパニオン群管理・オービット計算・メッシュ生成 |
| src/ui/EncyclopediaOverlay.ts | **新規**: 惑星図鑑DOMオーバーレイ（ギャラリー+詳細表示） |
| src/game/storage/SaveManager.ts | `unlockedPlanets` バリデーション追加、DEFAULT_DATA 更新 |
| src/game/systems/CollisionSystem.ts | `check()` に `companionBonus` 引数追加 |
| src/game/scenes/TitleScene.ts | 「ずかん」ボタン追加、EncyclopediaOverlay 統合 |
| src/game/scenes/StageScene.ts | CompanionManager 統合、ステージクリア時のカード獲得テキスト、CollisionSystem 呼び出し拡張 |
| src/main.ts | トランジションハンドラーで unlockedPlanets 更新 |

## 新規テストファイル

| テストファイル | テスト対象 |
|--------------|-----------|
| tests/unit/config/PlanetEncyclopedia.test.ts | 図鑑データの整合性（全11惑星、ひらがなチェック等） |
| tests/unit/entities/CompanionManager.test.ts | オービット計算・追従・ボーナス・dispose |
| tests/unit/ui/EncyclopediaOverlay.test.ts | カード表示・ロック/アンロック状態・詳細表示 |

## 動作確認手順

### 惑星図鑑

1. タイトル画面で「ずかん」ボタンが表示されていることを確認
2. 「ずかん」をタップ → 図鑑画面が開き、11枚のカード枠が表示されること
3. 初回プレイ（未クリア）→ 全カードが「？？？」でロック表示されること
4. ステージ1をクリア → タイトルに戻り「ずかん」を開く → 月のカードがアンロック状態
5. 月のカードをタップ → 詳細画面で絵文字・惑星名・ひらがな豆知識が表示されること
6. 詳細画面の「もどる」→ ギャラリーに戻ること
7. ギャラリーの「もどる」→ タイトル画面に戻ること

### エイリアンコンパニオン

8. ステージ1をクリアし、ステージ2を開始 → 月テーマのコンパニオンが宇宙船周りを周回していること
9. 宇宙船を左右に移動 → コンパニオンのオービット中心が追従すること
10. 複数ステージをクリア → コンパニオン数が増え、それぞれ異なる軌道で周回すること
11. コンパニオンがいる状態で星に近づく → 通常より広い範囲で星を回収できること
12. 隕石がコンパニオンを通過 → 衝突判定が発生しないこと

### セーブデータ

13. ブラウザを閉じて再度開く → 獲得済みカード・コンパニオンが保持されていること
14. ステージ1を再クリア → カード・コンパニオンの重複獲得が発生しないこと
