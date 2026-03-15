# Quickstart: 004-gameplay-audio-polish

**Feature**: ゲーム体験改善第3弾 — HUDステージ番号・テキスト選択防止・BGM強化
**Branch**: `004-gameplay-audio-polish`

## 前提条件

- Node.js 18+
- npm
- iPad Safari でのテスト用に同一ネットワーク上の iPad（またはシミュレータ）

## セットアップ

```bash
git checkout 004-gameplay-audio-polish
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
npm run test          # 全テスト実行
npm run test -- --watch  # ウォッチモード
```

## ビルド

```bash
npm run build
```

## 変更対象ファイル一覧

### 修正ファイル（4ファイル）

| ファイル | 変更内容 |
|---------|---------|
| `src/game/audio/AudioManager.ts` | BGMConfig拡張、playBGM()を4レイヤー構成に改修 |
| `src/game/scenes/StageScene.ts` | HUD.show()にステージ番号付き名称を渡す |
| `index.html` | CSS user-select追加、contextmenu preventDefault追加 |
| `tests/unit/audio/AudioManager.test.ts` | 4レイヤーBGMテスト追加 |

### 変更なしファイル

- `src/main.ts` — エントリーポイント変更不要
- `src/types/index.ts` — 型定義変更不要
- `src/ui/HUD.ts` — show()引数は呼び出し側で変更するためHUD自体は変更不要
- `src/game/config/StageConfig.ts` — 既存のstageNumberをそのまま使用
- `src/game/scenes/TitleScene.ts` — playBGM(0)はそのまま (AudioManager側で和音対応)
- `src/game/scenes/EndingScene.ts` — playBGM(-1)はそのまま

## iPad 実機テスト手順

1. `npx vite --host` で dev server を起動
2. iPad Safari で表示される IP アドレスにアクセス
3. 確認項目:
   - [ ] タイトル画面で和音BGMが再生される
   - [ ] 「あそぶ」タップ後、ステージBGMが和音構成で再生される
   - [ ] HUD上部に「ステージ1: 🌙 月をめざせ！」形式で表示される
   - [ ] 各ステージでBGMの雰囲気（テンポ・音色・キー）が異なる
   - [ ] テキスト要素を長押ししてもテキスト選択が発生しない
   - [ ] 画面長押しでコンテキストメニューが表示されない
   - [ ] ステージ遷移時にBGMが二重再生されない
   - [ ] BGM音割れや極端な遅延がない

## 開発の推奨順序

1. **HUDステージ番号** — StageScene.tsの1行変更のみ。最もシンプル
2. **テキスト選択防止** — index.htmlのCSS/JS追加のみ。AudioManager非依存
3. **BGM和音化** — AudioManager.tsの大幅改修。BGMConfigの新構造定義 → playBGM()改修 → テスト
4. **タイトルBGM和音化** — BGM和音化と同時にBGM_CONFIGS[0]を新構造にすれば完了
