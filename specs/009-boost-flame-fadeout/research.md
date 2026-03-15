# Research: ブースト炎の持続保証＆フェードアウト演出

**Feature**: `009-boost-flame-fadeout`
**Date**: 2026-03-15

## Research Task 1: 炎パーティクルの途切れ原因分析

### Decision
`StageScene.update()` 内の炎放出条件 `this.boostSystem.isActive() && this.flameEmitting` が途切れの原因。`flameEmitting` フラグは `initBoostFlame()` で `true` になり、ブースト終了時に `false` になるが、特定タイミングで `flameEmitting` が `false` のままブーストが有効な状態が発生しうる。修正として、放出条件から `flameEmitting` を除去し `boostSystem.isActive()` のみに依存させる。

**現状の問題コード**:
```typescript
// StageScene.update() 内
if (this.boostSystem.isActive() && this.flameEmitting) {
  this.emitFlameParticles();
}
```

**修正方針**:
- 放出条件を `this.boostSystem.isActive()` のみに変更
- `flameEmitting` はブースト終了後の残存パーティクル消化待ち（cleanup）専用に限定
- `initBoostFlame()` は引き続きブースト発動時に呼ばれる（`boostFlame === null` の場合のみ初期化）

### Rationale
- `boostSystem.isActive()` はブーストの正規状態を反映する唯一の信頼できるソース
- `flameEmitting` フラグは冗長な二重管理で、状態の不整合を引き起こすリスクがある
- `flameEmitting` を完全削除せず cleanup 用に残すことで、ブースト終了後の残存パーティクルが自然に消えるまで Three.js オブジェクトを維持できる

### Alternatives Considered
1. **`flameEmitting` を `activate()` 直後に同期** — `boostSystem.activate()` の戻り値と同時に `flameEmitting = true` にする。既に `initBoostFlame()` で行っているが、根本的に二重管理の問題は残る。却下
2. **`flameEmitting` フラグ完全削除** — cleanup ロジックが複雑化する。残存パーティクルの自然消滅を待つ `updateFlameParticles()` の `!this.flameEmitting && !hasLive` 判定が使えなくなる。却下

---

## Research Task 2: BoostSystem.getDurationProgress() の設計

### Decision
`BoostSystem` に `getDurationProgress(): number` メソッドを追加する。返り値は `0.0`（ブースト開始直後）〜 `1.0`（ブースト終了時点）。ブースト非アクティブ時は `1.0` を返す。

**計算式**:
```typescript
getDurationProgress(): number {
  if (!this.active) return 1.0;
  return 1.0 - this.durationTimer / BoostSystem.DURATION;
}
```

**特性**:
- `activate()` 直後: `durationTimer = 3.0` → progress = `1.0 - 3.0/3.0 = 0.0`
- 1.5秒経過: `durationTimer = 1.5` → progress = `1.0 - 1.5/3.0 = 0.5`
- 2.5秒経過（フェード開始）: `durationTimer = 0.5` → progress = `1.0 - 0.5/3.0 ≈ 0.833`
- 終了: `durationTimer = 0` → progress = `1.0`
- 非アクティブ: `1.0`（既に終了扱い）

### Rationale
- 既存の `getCooldownProgress()` と同じパターン（0→1の進行割合）で一貫性がある
- `durationTimer` を直接公開せず、正規化された値を返すことでカプセル化を維持
- `active` でない場合に `1.0` を返すことで、呼び出し元が `isActive()` チェック忘れてもフェードアウト済み（放出0）として安全に動作

### Alternatives Considered
1. **`getRemainingTime()` で生の残り時間を公開** — 呼び出し元が `DURATION` 定数を知る必要があり、カプセル化違反。却下
2. **`durationTimer` を `public readonly` にする** — 直接書き換えのリスク。TypeScript の `readonly` は完全ではない。YAGNI。却下
3. **進行方向を逆にする（1→0）** — `getCooldownProgress()` と逆方向で混乱しやすい。0→1が経過を表す慣例に合わせる。却下

---

## Research Task 3: フェードアウト演出の数学的設計

### Decision
ブースト進行度 `progress >= 0.83`（残り約0.5秒）でフェードフェーズに入り、パーティクル放出数とサイズを線形に減少させる。

**放出数の計算**:
```typescript
const progress = this.boostSystem.getDurationProgress();
const fadeStart = 0.83;
const emitCount = progress < fadeStart
  ? 8
  : Math.round(8 * (1.0 - progress) / (1.0 - fadeStart));
```

**放出数の変化**（60fps、残り0.5秒 = 30フレーム）:
| progress | 残り時間 | emitCount |
|----------|---------|-----------|
| 0.83 | 0.51s | 8 |
| 0.87 | 0.39s | 6 |
| 0.90 | 0.30s | 5 |
| 0.93 | 0.21s | 3 |
| 0.97 | 0.09s | 1 |
| 1.00 | 0.00s | 0 |

**サイズの計算**:
```typescript
// emitFlameParticles() 内でパーティクル生成時にサイズスケールを記録
// PointsMaterial.size を毎フレーム更新するのではなく、
// フェード時にパーティクルの初期位置のスプレッドを縮小して「小さく見える」効果を出す
const sizeFraction = progress < fadeStart
  ? 1.0
  : (1.0 - progress) / (1.0 - fadeStart);
```

**サイズ演出方法**: `PointsMaterial.size` はグローバル値（全パーティクル共通）のため、フェード中に放出される新規パーティクルのスプレッド（位置のランダム幅）を縮小し、見た目の炎の「太さ」を減少させる。加えて `PointsMaterial.size` 自体もフェード時にスケールダウンする。

### Rationale
- `fadeStart = 0.83` は `DURATION = 3.0` のとき残り `3.0 * (1.0 - 0.83) = 0.51秒` に対応。仕様の「最後の0.5秒」に一致
- 線形減少は段階間のジャンプが目立たず、FR-005（滑らかな減少）を満たす
- `Math.round()` で整数パーティクル数に丸めつつ、30フレーム中に8→0の複数段階を経る（SC-003: 3段階以上）
- `PointsMaterial.size` のスケーリングは全パーティクルに影響するが、フェード中は残存パーティクルの寿命も短い（0.7秒）ため視覚的に許容される

### Alternatives Considered
1. **パーティクルごとに個別サイズ（BufferAttribute `size`）** — `PointsMaterial` にカスタムシェーダーを組み込む必要がある。Three.js 標準の `PointsMaterial` は `size` 属性を頂点ごとにサポートしない。外部シェーダー追加は Constitution V の YAGNI 違反。却下
2. **フェード開始を progress ではなく残り秒数で判定** — `durationTimer` を公開する必要がある。カプセル化違反。progress ベースで十分。却下
3. **非線形イージング（ease-out）のフェード** — 視覚的にはやや自然だが、線形で「少なくとも3段階以上」（SC-003）は十分満たせる。YAGNI。却下

---

## Research Task 4: flameEmitting フラグのリファクタリング

### Decision
`flameEmitting` フラグの役割を再定義する。放出条件からは除去し、残存パーティクル cleanup 専用にする。

**現状**:
- `initBoostFlame()`: `flameEmitting = true`
- `update()` 内放出条件: `boostSystem.isActive() && flameEmitting` ← 削除対象
- ブースト終了時: `flameEmitting = false`
- `updateFlameParticles()`: `!flameEmitting && !hasLive` で `removeBoostFlame()` ← 維持

**修正後のフロー**:
1. ブースト発動 → `initBoostFlame()` → `boostFlame` オブジェクト作成
2. 毎フレーム: `boostSystem.isActive()` なら `emitFlameParticles()` 呼び出し（`flameEmitting` 不要）
3. ブースト終了 → `flameEmitting = false`（新規放出停止のマーカー）
4. `updateFlameParticles()` が残存パーティクル更新を継続
5. 全パーティクル消滅（`!hasLive`）→ `removeBoostFlame()` で Three.js オブジェクト解放

### Rationale
- `boostSystem.isActive()` が放出のシングルソースオブトゥルースとなり、状態の不整合が発生しない
- `flameEmitting = false` は「もう新しいパーティクルは出さないが、既存のは消えるまで待つ」という意味に特化
- `removeBoostFlame()` は `flameEmitting = false` をリセットするため、連続ブースト時も正常動作

### Alternatives Considered
1. **`flameEmitting` 完全削除、`boostSystem.isActive()` で cleanup 判定** — `updateFlameParticles()` 内で `!boostSystem.isActive() && !hasLive` とする。BoostSystem への参照が StageScene の flame メソッド内に必要になり、メソッドシグネチャが変わる。現状の `flameEmitting` での分離の方がシンプル。却下
