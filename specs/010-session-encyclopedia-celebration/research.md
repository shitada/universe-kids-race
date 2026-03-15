# Research: セッション管理・ずかん永続化・全クリアお祝い演出

**Feature**: `010-session-encyclopedia-celebration`
**Date**: 2026-03-15

## Research Task 1: sessionStorage によるセッション検出

### Decision
`sessionStorage` にキー `'universe-kids-race-session'` でフラグ（値: `'active'`）を設定する。main.ts の起動時にこのフラグの有無をチェックし、フラグが存在しなければ新規セッション＝Safari スワイプ終了後の再起動と判定して `saveManager.clear()` を実行する。

**実装箇所**: `src/main.ts` の先頭（シーン登録前）

```typescript
const SESSION_KEY = 'universe-kids-race-session';
if (!sessionStorage.getItem(SESSION_KEY)) {
  saveManager.clear();
  sessionStorage.setItem(SESSION_KEY, 'active');
}
```

### Rationale
- iPad Safari ではスワイプ終了（アプリキル）で `sessionStorage` が自動クリアされる — Web 標準の動作
- タブを閉じずにホーム画面 → 復帰した場合は `sessionStorage` が保持されるため、進行状態が維持される
- `localStorage` はスワイプ終了後も残るため、セッション検出には使えない
- SaveManager 自体は `localStorage` ベースのまま変更不要

### Alternatives Considered
1. **`beforeunload` / `pagehide` イベントでクリア** — iPad Safari ではスワイプ終了時にこれらのイベントが確実に発火しない。却下
2. **タイムスタンプベースのセッション判定** — 「最後のアクセスから N 分経過したらリセット」方式。しきい値の設定が困難で、子供のプレイ中断時間は予測不能。却下
3. **Service Worker でセッション管理** — 過剰な複雑さ。YAGNI 原則に反する。却下

---

## Research Task 2: EndingScene の選択的リセット設計

### Decision
EndingScene.enter() 内の `this.saveManager.clear()` を選択的リセットに置き換える。現在の saveData をロードし、`unlockedPlanets` を保持したまま `clearedStage` のみ 0 にリセットして保存し直す。

**現状の問題コード**:
```typescript
// EndingScene.enter() 内
this.saveManager.clear();
```

**修正方針**:
```typescript
const saveData = this.saveManager.load();
saveData.clearedStage = 0;
this.saveManager.save(saveData);
```

### Rationale
- `saveManager.clear()` は `localStorage.removeItem()` で全データ削除するため、ずかんデータも消える
- 選択的リセットにより、`unlockedPlanets` は load() で取得した状態がそのまま保持される
- Safari スワイプ終了時の全クリアは US1 の sessionStorage チェックで処理されるため、EndingScene では全消去不要
- SaveManager に新メソッドを追加せず、既存の load() / save() の組み合わせで実現 — YAGNI

### Alternatives Considered
1. **SaveManager に `resetProgress()` メソッドを追加** — `clearedStage` のみリセットする専用メソッド。ただし呼び出し箇所は EndingScene のみなので、専用メソッドは過剰。YAGNI 原則に従い却下
2. **unlockedPlanets を別の localStorage キーに分離** — キーが増えて管理が複雑化。既存の SaveData 構造で十分対応可能。却下

---

## Research Task 3: エイリアンお祝い演出の Three.js 実装パターン

### Decision
EndingScene に全11体のエイリアンコンパニオンメッシュを生成し、円形配置 → 順次ポップイン → バウンスアニメーション →テキスト表示の一連の演出を Three.js シーン上で実行する。

**演出タイムライン**:
| 時間 | 演出 |
|------|------|
| 0.0s〜2.2s | 各エイリアンが順番にポップイン（0.2s 間隔、scale 0→1 bounceイージング） |
| 2.2s〜 | 全エイリアンが一斉にバウンス（上下ジャンプ）を繰り返す |
| 2.5s〜 | 「みんな ありがとう！」テキストがオーバーレイに表示 |

**円形配置**:
- 半径: 3.0
- 各エイリアンの角度: `i * (2 * Math.PI / 11)` (i = 0〜10)
- Y 座標: 0（アニメーションで変動）
- Z 座標: 0（カメラから距離5の平面上）

**メッシュ生成**: `CompanionManager.createCompanionMesh()` は private メソッドのため、EndingScene 側で同等のロジックを実装するか、CompanionManager のメソッドをリファクタリングする。

→ **判断**: PLANET_ENCYCLOPEDIA データを直接参照し、EndingScene 内に独自の `createCelebrationCompanions()` メソッドを実装する。CompanionManager の createCompanionMesh は private であり、そのリファクタリングは StageScene の軌道ロジックとの結合が強く変更リスクが高い。同等のメッシュ生成ロジック（body sphere + eyes）を EndingScene 内で簡略化版として実装する。

→ **再考**: CompanionManager のコンストラクタに unlockedPlanets=[1..11] を渡して全メッシュを生成し、getGroup() で Three.js Group を取得する方法がある。ただし CompanionManager は軌道計算（orbitRadius, orbitSpeed 等）が含まれており、EndingScene では固定円形配置を使うため不適合。

→ **最終判断**: `createCompanionMesh` を static メソッドに変更するか、EndingScene で PLANET_ENCYCLOPEDIA から直接メッシュを生成する。メッシュ生成ロジックの重複を避けるため、**CompanionManager.createCompanionMesh を public static に変更**する。これにより EndingScene から `CompanionManager.createCompanionMesh(entry)` で呼び出せる。変更箇所は1行（`private` → `public static`）と、各 create* メソッドも static にする必要がある。

### Rationale
- CompanionManager の createCompanionMesh + 各 shape メソッド群は純粋関数（引数のみに依存、副作用なし）であり、static 化は自然
- メッシュ生成ロジックの重複回避（DRY）
- EndingScene は CompanionManager の軌道ロジックではなく、メッシュ生成機能のみを必要とする
- 既存テスト（CompanionManager.test.ts）への影響は minimal — static 化後もインスタンスメソッドとして呼び出し可能

**バウンスアニメーション**:
- ポップイン: scale を 0→1.2→1.0 にイージング（overshoot bounce）。各体 0.2s 間隔で遅延
- バウンス: `Math.abs(Math.sin(elapsed * 3))` で Y 座標を 0〜0.5 間で変動

### Alternatives Considered
1. **CSS アニメーションのみで実装** — DOM オーバーレイにエイリアン画像を配置。ただし 3D メッシュの質感が失われ、「3D 冒険体験」原則に反する。却下
2. **既存 CompanionManager をそのまま使用** — 軌道ロジックが EndingScene の円形固定配置と不適合。コンストラクタの引数も fixed-orbit 前提。却下
3. **GSAP などのアニメーションライブラリ追加** — Three.js 以外の外部ライブラリは Constitution Ⅴ に反する。却下

---

## Research Task 4: ブースト炎インテグレーションテストの設計

### Decision
新規テストファイル `tests/integration/BoostFlame.test.ts` を作成し、StageScene の update ループ内で `boostSystem.isActive()` が true の間に `emitFlameParticles` が呼び出されることを検証する。

**テスト方針**:
- StageScene の emitFlameParticles を spy/mock して呼び出し回数を検証
- BoostSystem を activate し、複数フレーム分の deltaTime で update を呼び出す
- ブースト有効期間中（3秒間）に emitFlameParticles が毎フレーム呼ばれることを確認

**注意**: StageScene は Three.js の WebGLRenderer に依存するため、jsdom 環境では WebGL コンテキストが利用不可。Three.js のモック/スタブが必要。

→ **判断**: StageScene 全体のインテグレーションテストは Three.js 依存が重く、セットアップが複雑すぎる。代わりに、BoostSystem の `isActive()` と `getDurationProgress()` の組み合わせでブースト炎ロジックの正確性を検証するユニットテスト的アプローチが適切。既存の `BoostSystem.test.ts` に炎持続確認のテストケースを追加する形で十分。

### Rationale
- Feature 009 の実装は既にコード上正しく動作しており、新規コード変更は不要
- `boostSystem.isActive()` が true を返す間ずっと炎が放出されることは、`StageScene.update()` のコード構造（`if (this.boostSystem.isActive()) { this.emitFlameParticles(); }`）から保証される
- BoostSystem 側の状態遷移（activate → active 期間 → deactivate）が正しいことをテストすれば、炎放出の持続性は論理的に保証される

### Alternatives Considered
1. **E2E テスト（Playwright/Puppeteer）** — iPad Safari 上での視覚テスト。セットアップコストが高く、CI 環境で再現困難。却下
2. **StageScene のスナップショットテスト** — Three.js レンダリング結果の比較。jsdom では WebGL 非対応。却下
