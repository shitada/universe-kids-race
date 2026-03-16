# 🚀 うちゅう キッズ レース — Universe Kids Race

5〜10歳向けの宇宙冒険ゲーム。宇宙船を操縦して太陽系の11の惑星を旅しよう！

🎮 **プレイはこちら → [https://shitada.github.io/universe-kids-race/](https://shitada.github.io/universe-kids-race/)**

iPad Safari での横向きプレイに最適化されています。

---

## ゲーム概要

- 左右スワイプで宇宙船を操作し、⭐ を集めて 🪨 隕石をよけよう
- 🚀 ブーストで加速！炎の噴射エフェクトとエアシールドで迫力の演出
- 月 → 水星 → 金星 → 火星 → 木星 → 土星 → 天王星 → 海王星 → 冥王星 → 太陽 → 地球 の全11ステージ
- 各惑星にはプロシージャル3Dモデル（木星の縞模様、土星のリング、地球の海と大陸など）
- ステージクリアで 🪐 **わくせいずかん**（ひらがな豆知識カード）をゲット
- 🛸 **うちゅうのなかま**（エイリアンコンパニオン）がクリアごとに仲間入り
- 全ステージクリアで仲間たちがお祝い演出 🎉
- プログラマティック生成の BGM & 効果音（外部音声ファイル不要）

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| 3D レンダリング | [Three.js](https://threejs.org/) v0.170 |
| 言語 | TypeScript 5.7 |
| ビルド | [Vite](https://vitejs.dev/) 6 |
| テスト | [Vitest](https://vitest.dev/) 3 + jsdom |
| サウンド | Web Audio API（OscillatorNode / AudioBufferSourceNode） |
| デプロイ | GitHub Pages + GitHub Actions |
| 開発手法 | [Spec Kit](https://github.com/spec-kit/specify-cli) によるスペック駆動開発 |

## 開発

```bash
# 依存インストール
npm install

# 開発サーバー起動
npm run dev

# テスト実行
npm run test

# ビルド
npm run build
```

## プロジェクト構成

```
src/
├── game/
│   ├── audio/          # BGM・効果音 (Web Audio API)
│   ├── config/         # ステージ設定・惑星図鑑データ
│   ├── effects/        # パーティクル・エアシールド
│   ├── entities/       # 宇宙船・星・隕石・コンパニオン
│   ├── scenes/         # タイトル・ステージ・エンディング
│   ├── storage/        # セーブデータ管理
│   └── systems/        # 衝突・スポーン・ブースト・スコア
├── ui/                 # HUD・チュートリアル・図鑑オーバーレイ
└── types/              # 型定義
specs/                  # Spec Kit によるフィーチャー仕様書 (001〜010)
tests/                  # ユニットテスト・統合テスト (257テスト)
```

## ライセンス

MIT
