# Research: エアシールドエフェクト追加・隕石衝突後の速度緩やか回復

**Feature**: `006-shield-speed-recovery`
**Date**: 2026-03-15

## Research Task 1: Three.jsでのエアシールド実装方式

### Decision
Three.js の SphereGeometry + MeshBasicMaterial（透明・AdditiveBlending）で実装する。ShaderMaterialは使わずMeshBasicMaterialで十分なパフォーマンスと視覚効果を達成する。

**実装方針**:
- `SphereGeometry(1.5, 16, 16)` — 宇宙船を包む程度のサイズ。セグメント数16で十分滑らかかつ軽量
- `MeshBasicMaterial` — ライティング計算不要で最も軽量。`transparent: true`, `opacity: 0.15`, `blending: THREE.AdditiveBlending`, `depthWrite: false`, `color: 0x44aaff`（青白い半透明）
- パルスアニメーション: `update()`内で`Math.sin()`で opacity を 0.1〜0.2 に揺らす。scale も 1.0〜1.05 で微妙に呼吸するように変化
- ブースト時強調: opacity を 0.3 に上げ、scale を 1.3 に拡大。color を `0x88ddff`（より明るい青白）に変更

### Rationale
- MeshBasicMaterialはGPU負荷が最小（フラグメントシェーダーが単純）
- SphereGeometry(1.5, 16, 16) は624頂点で軽量。iPad Safariでの60fps維持に問題なし
- ShaderMaterialは視覚的にリッチだが、iPad Safariでのシェーダーコンパイル時間とデバッグコストを考慮し却下
- AdditiveBlendingにより宇宙空間の暗い背景に自然に溶け込む発光表現が可能

### Alternatives Considered
1. **ShaderMaterial（カスタムシェーダー）** — フレネル効果やノイズパターンでよりリッチな表現が可能。しかしiPad Safariでのシェーダーコンパイル問題とデバッグコストが高い。YAGNI原則に反する。却下
2. **SpriteMaterial（ビルボード）** — 2Dスプライトでシールド表現。3D感が薄くなり没入感が損なわれる。却下
3. **パーティクルベース（Points）** — 既存の炎パーティクルと同様のアプローチ。常時表示のシールドにはパーティクル数が多くなりすぎる。却下

---

## Research Task 2: 速度回復のイージング実装

### Decision
Spaceship に新しい SpeedState `'RECOVERING'` を追加。SLOWDOWN タイマー終了時に NORMAL ではなく RECOVERING に遷移し、イーズアウト補間で SLOWDOWN_MULTIPLIER(0.4) → 1.0 に約1秒で回復する。

**実装方針**:
- `SpeedState` に `'RECOVERING'` を追加: `type SpeedState = 'NORMAL' | 'BOOST' | 'SLOWDOWN' | 'RECOVERING'`
- `RECOVERY_DURATION = 1.0`（秒）を定数として追加
- SLOWDOWN タイマー終了時: `speedState = 'RECOVERING'`, `speedStateTimer = RECOVERY_DURATION`
- `getForwardSpeed()` に RECOVERING ケースを追加:
  ```
  progress = 1 - (speedStateTimer / RECOVERY_DURATION)  // 0→1
  eased = 1 - (1 - progress)^2                          // ease-out quadratic
  multiplier = SLOWDOWN_MULTIPLIER + (1 - SLOWDOWN_MULTIPLIER) * eased
  return speed * multiplier
  ```
- RECOVERING タイマー終了時: `speedState = 'NORMAL'`

**イーズアウト関数**: `easeOutQuad(t) = 1 - (1 - t)^2`
- t=0 → 0（回復開始：0.4倍速のまま）
- t=0.5 → 0.75（半分経過で75%回復）
- t=1 → 1（回復完了：1.0倍速）

### Rationale
- イーズアウト（最初は速く、終盤はゆっくり）は加速感を自然に表現する
- 既存の `update()` メソッドの speedStateTimer パターンに完全に乗れるため、コード変更が最小限
- 1秒の回復時間はゲームテンポを損なわず、かつ段階的回復が体感できる適切な長さ
- Quadratic ease-out は計算が軽量（掛け算2回のみ）で iPad Safari でも問題ない

### Alternatives Considered
1. **ease-in-out (cubic)** — 開始も終了も滑らかだが、最初の回復が遅く感じる。子供向けゲームでは「回復が始まった」感覚を早く与えたいため却下
2. **線形補間** — 実装は最もシンプルだが、回復終了時の「ピタッと止まる」感が不自然。却下
3. **Spring/バネ系アニメーション** — オーバーシュート（100%を超えて戻る）が発生しうる。速度が100%を超えるのは仕様に反する。却下

---

## Research Task 3: RECOVERING状態での衝突・ブースト相互作用

### Decision
RECOVERING 状態での各種イベントは以下のように処理する。

| イベント | 動作 |
|---------|------|
| 隕石衝突 | SLOWDOWN にリセット。speedStateTimer = 3.0。CollisionSystem の無敵判定は SLOWDOWN のみなので RECOVERING 中は衝突可能 |
| ブースト発動 | 現在の回復途中の速度 × BOOST_MULTIPLIER を適用。speedState を BOOST に変更 |
| ステージクリア | reset() で全状態リセット |

### Rationale
- RECOVERING 中に被弾した場合、再度 SLOWDOWN に入るのはスペック FR-012 の要件
- CollisionSystem は `speedState !== 'SLOWDOWN'` で無敵判定しているため、RECOVERING 中は自動的に衝突判定が有効。コード変更不要
- ブースト発動時は activateBoost() が speedState を 'BOOST' に上書きするため、RECOVERING は自然に中断される

### Alternatives Considered
- なし（仕様から一意に決定される動作）

---

## Research Task 4: AirShield クラス設計

### Decision
新規クラス `AirShield` を `src/game/effects/AirShield.ts` に作成する。StageScene から生成・更新・破棄を制御する。

**クラス責務**:
- Three.js メッシュ（SphereGeometry + MeshBasicMaterial）の生成と管理
- パルスアニメーション（opacity・scale の時間変化）
- ブーストモード切替（通常 ↔ ブースト強調）
- 宇宙船メッシュへの追従（宇宙船の Group に add するか、毎フレーム position をコピー）

**StageScene への追従方式**: `spaceship.mesh` (THREE.Group) に直接 `add()` するのではなく、StageScene の `update()` で毎フレーム position をコピーする。理由: 宇宙船の damage wobble（rotation.z）がシールドにも影響するのを避けるため。

### Rationale
- 単一責任原則: シールドの視覚表現を StageScene から分離してテスト可能にする
- ParticleBurst と同じパターン（effects/ ディレクトリ内のエフェクトクラス）に準拠
- StageScene は既に肥大化しているため、新しい視覚要素はクラスとして切り出すべき

### Alternatives Considered
1. **StageScene に直接組み込む** — StageScene が既に650行超で肥大化している。シールド関連のコードを追加するとさらに可読性が低下。却下
2. **Spaceship クラスに組み込む** — Spaceship はゲームロジック（位置・速度・状態）を担当しており、視覚エフェクトの責務を持たせるのは責務の混在。却下
