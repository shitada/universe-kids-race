# Research: コンパニオンタイミング修正・シールド楕円化・ブースト炎改善

**Feature**: `008-companion-shield-boost-fix`
**Date**: 2026-03-15

## Research Task 1: コンパニオン動的追加と登場アニメーション

### Decision
`CompanionManager` に `addCompanion(stageNumber: number)` メソッドを追加する。新しいコンパニオンは scale 0 から開始し、スピン＋拡大アニメーションで約1秒かけて登場する。アニメーションは `update()` メソッド内で毎フレーム進行させる。

**実装方針**:
- `addCompanion(stageNumber)`: 
  - `PLANET_ENCYCLOPEDIA` から該当エントリを検索
  - `createCompanionMesh(entry)` でメッシュ生成
  - 軌道パラメータを既存コンパニオン数に基づいて計算（既存constructorロジック流用）
  - メッシュの初期 scale を 0 に設定
  - `CompanionData` に `entranceTimer?: number` を追加（1.0秒からカウントダウン）
  - `companions` 配列に追加、`group` に追加
- `update()` 内でのアニメーション:
  - `entranceTimer > 0` のコンパニオンは特別処理
  - progress = 1 - (entranceTimer / 1.0) で 0→1 に進行
  - scale = progress（0→1に拡大）
  - rotation.y に追加の高速スピン（通常の4倍速: `deltaTime * 8`）
  - タイマーが0になったら通常のオービット回転に戻る
- 全コンパニオンの軌道パラメータ再計算は行わない（新しいコンパニオンのみ追加）

### Rationale
- 既存の `createCompanionMesh()` と軌道パラメータ計算ロジックを最大限に再利用
- `entranceTimer` フラグによりアニメーション状態管理がシンプル
- オービットパラメータの再計算を省略することで、既存コンパニオンの位置がジャンプしない
- update() 内でアニメーション進行させるためゲームループと統合済み

### Alternatives Considered
1. **GSAP/Tween ライブラリ** — Three.js 以外のライブラリ追加は Constitution V 違反。却下
2. **別クラスでアニメーション管理** — `CompanionEntranceAnimation` クラス。YAGNI。タイマー1つで十分。却下
3. **既存コンパニオンの軌道再計算** — 追加時に全体の `angleOffset` を再計算。既存コンパニオンの位置がジャンプし、視覚的に不自然。却下

---

## Research Task 2: ステージクリア時のコンパニオン獲得演出フロー

### Decision
`StageScene.showClearMessage()` 内で、新規獲得条件を判定し「なかまに なったよ！」テキストを表示。`onStageClear()` 内で `companionManager.addCompanion()` を呼び出して3D上のコンパニオンを即座に追加する。

**実装方針**:
- `onStageClear()` に以下を追加:
  - `saveManager.load()` で現在の `unlockedPlanets` を取得
  - `!unlockedPlanets.includes(this.stageNumber)` で新規かどうか判定
  - 新規の場合、`companionManager.addCompanion(this.stageNumber)` を呼び出し
- `showClearMessage()` に以下を追加:
  - 同じ新規判定で「{emoji} {name}が なかまに なったよ！」テキストを表示
  - 既存の「ずかんカード ゲット！」テキストの下に配置
- セーブデータの更新は既存の `main.ts` の `transitionHandler` で行われる（変更不要）
  - `handleStageComplete()` → `requestTransition('stage', ...)` → `transitionHandler` → `saveManager.save()`
- 演出中のタップ問題: `clearOverlay` には `pointer-events: none` 等の対策は不要（既存の `isCleared` フラグで `clearTimer` カウントアップ中は入力処理されない）

### Rationale
- セーブデータの判定で「初回クリア」を正確に検出できる（`unlockedPlanets` に含まれていなければ初回）
- セーブデータへの書き込みは `main.ts` の既存 `transitionHandler` に任せ、StageScene 側は表示のみに集中
- `addCompanion()` はクリア演出中（`isCleared = true`）に呼ばれるため、コンパニオンのオービット更新は停止しているが、登場アニメーションのためにクリア中も `companionManager.update()` を呼ぶ必要がある

### Alternatives Considered
1. **クリア演出を専用メソッドに分離** — `showCompanionEntrance()` を別メソッドに。現状の `showClearMessage()` 内に追加するだけで十分。YAGNI。却下
2. **演出タイミングをディレイ付きで分離** — クリアメッセージから1秒後にコンパニオン演出。`setTimeout` は ゲームループ外のタイミングで信頼性が低い。`clearTimer` カウントアップと並行して `update()` 内で処理する方が安全。却下

---

## Research Task 3: エアシールドのブースト専用楕円化

### Decision
`AirShield` のデフォルト状態を `mesh.visible = false` にする。`setBoostMode(true)` で `visible = true` + 楕円形スケール `(1.0, 0.8, 2.0)` を適用。`setBoostMode(false)` で `visible = false`。通常モードのパルスアニメーションを完全に削除する。

**実装方針**:
- constructor:
  - `this.mesh.visible = false`（デフォルト非表示）
- `setBoostMode(active)`:
  - `active = true`: `mesh.visible = true`, color を `0x88ddff` に
  - `active = false`: `mesh.visible = false`, color を `0x44aaff` に
- `update()`:
  - `if (!this.isBoosting) return;`（通常時は何もしない）
  - ブースト時のみ不透明度パルスアニメーション（既存のブースト時ロジック維持）
  - スケールは `setBoostMode(true)` で楕円形に固定し、パルスによるスケール変動は削除
  - ブースト時 opacity: `0.25 + pulse * 0.10`（既存維持）
  - ブースト時 scale: `(1.0, 0.8, 2.0)` 固定（パルスによるスケール変動を削除してスピード感を安定させる）

### Rationale
- `mesh.visible` はGPU描画をスキップするため、通常時のパフォーマンスが向上
- 楕円形は `scale.set(1.0, 0.8, 2.0)` で SphereGeometry を変形するだけ。新しいジオメトリ不要
- Z方向（進行方向）に2倍伸ばすことでスピード感を演出
- ブースト時のopacityパルスは維持し、視覚的なフィードバックを保持

### Alternatives Considered
1. **EllipsoidGeometry 自作** — 新しいジオメトリクラスを作成。scale で十分実現可能。YAGNI。却下
2. **楕円形のスケールにもパルス** — `(1.0 + pulse * 0.1, 0.8 + pulse * 0.08, 2.0 + pulse * 0.2)`。スピード感が不安定になる。固定スケールの方がクリーン。却下
3. **フェードイン/フェードアウト** — `visible` の切り替え時に opacity を 0→0.25 にアニメーション。ブーストは即座に発動するためフェードは不自然。却下

---

## Research Task 4: ブースト炎パーティクルのパラメータ最適化

### Decision
既存のリングバッファ方式を維持しつつ、パラメータを調整してパーティクル密度を増加させる。`MAX_FLAME_PARTICLES` を100→150、放出数を5→8/frame、寿命を0.5→0.7秒に変更。

**実装方針**:
- `StageScene` の定数変更:
  - `MAX_FLAME_PARTICLES`: 100 → 150
- `emitFlameParticles()` の変更:
  - ループ回数: `for (let p = 0; p < 5; ...)` → `for (let p = 0; p < 8; ...)`
  - 寿命: `this.flameLifetimes[idx] = 0.5` → `this.flameLifetimes[idx] = 0.7`
- 変更なし:
  - リングバッファのインデックス管理は既存のまま
  - 色の計算ロジック（orange→red グラデーション）は既存維持
  - `initBoostFlame()` のデータ構造初期化は MAX パラメータを参照するため自動対応
  - `updateFlameParticles()` の更新ロジックは MAX パラメータを参照するため自動対応

**パフォーマンス検証**:
- 150パーティクル × 3 float (position) = 450 float = 1.8KB
- 150パーティクル × 3 float (color) = 450 float = 1.8KB
- 合計約4KB。iPad Safari のメモリ/描画負荷として問題なし
- 8/frame × 60fps = 480 particle/sec、寿命 0.7秒 → 同時表示最大約336個だが MAX 150 でクランプされるため描画負荷は一定

### Rationale
- リングバッファ方式は既に堅牢に実装されており、パラメータ変更だけで改善可能
- 150パーティクルは iPad Safari でも問題ない負荷（既存100パーティクルの1.5倍）
- 寿命延長により炎の「尾」が長く見え、噴射感が向上
- 放出数増加により炎の密度が上がり途切れ感が軽減

### Alternatives Considered
1. **パーティクルテクスチャ追加** — 炎テクスチャ付き Sprite。テクスチャアセット管理が必要で Three.js 以外の依存が間接的に増える。PointsMaterial のままで十分。却下
2. **パーティクルサイズを大きくする** — PointsMaterial.size を 0.5→1.0 に。少数のパーティクルでも視覚的にカバー。ただし大きすぎるとドットが目立ち安っぽくなる。パーティクル数増加の方が自然。却下
3. **ShaderMaterial でカスタムシェーダー** — パーティクルの形状/色を GPU で制御。iPad Safari の WebGL1 互換性リスク。PointsMaterial で十分。YAGNI。却下

---

## Research Task 5: クリア演出中の companionManager.update() 呼び出し

### Decision
`StageScene.update()` のクリア中ブロック（`if (this.isCleared)`）内で `companionManager.update()` を呼び出し、登場アニメーションがクリア演出中も進行するようにする。

**実装方針**:
- 現在の `update()` 冒頭:
  ```typescript
  if (this.isCleared) {
    this.clearTimer += deltaTime;
    if (this.clearTimer >= this.clearDelay) {
      this.handleStageComplete();
    }
    return; // ← ここで全処理が打ち切られる
  }
  ```
- 修正後: `return` 前に `companionManager.update()` を追加
  ```typescript
  if (this.isCleared) {
    this.clearTimer += deltaTime;
    // コンパニオン登場アニメーション進行のため更新を継続
    this.companionManager?.update(
      deltaTime,
      this.spaceship.position.x,
      this.spaceship.position.y,
      this.spaceship.position.z,
    );
    if (this.clearTimer >= this.clearDelay) {
      this.handleStageComplete();
    }
    return;
  }
  ```

### Rationale
- `isCleared = true` 後は通常 `return` で全ゲームループ処理が打ち切られるため、コンパニオン更新も止まる
- 登場アニメーション（`entranceTimer` カウントダウン）を進行させるには明示的に `update()` を呼ぶ必要がある
- 宇宙船の位置は固定されている（移動更新が止まっている）ため、コンパニオンのオービットも安定

### Alternatives Considered
1. **アニメーションを DOM 側で完結** — CSS animation で「拡大＋スピン」を表現。3D 空間上のコンパニオンとの一致が取れない。却下
2. **clearDelay を延長してアニメーション完了を待つ** — clearDelay を 2.5→3.5 に。テンポ感が悪化する。アニメーションは1秒で完了するため既存の 2.5秒内に十分収まる。却下
