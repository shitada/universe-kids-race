# Data Model: コンパニオンタイミング修正・シールド楕円化・ブースト炎改善

**Feature**: `008-companion-shield-boost-fix`
**Date**: 2026-03-15

## Entities

### 1. CompanionData（既存 — 拡張）

コンパニオン個体の内部データ。`entranceTimer` を追加して登場アニメーション状態を管理。

| フィールド | 型 | 変更 | 説明 |
|-----------|------|------|------|
| `mesh` | `THREE.Group` | 既存 | コンパニオンの3Dメッシュグループ |
| `angleOffset` | `number` | 既存 | オービットの初期角度 |
| `orbitRadius` | `number` | 既存 | オービット半径 |
| `orbitSpeed` | `number` | 既存 | オービット角速度 (rad/s) |
| `orbitTilt` | `number` | 既存 | オービット面の傾き |
| `entranceTimer` | `number` | **新規** | 登場アニメーション残り時間（秒）。0以下なら通常状態 |

**定義箇所**: `src/game/entities/CompanionManager.ts`（内部インターフェース）

```typescript
interface CompanionData {
  mesh: THREE.Group;
  angleOffset: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitTilt: number;
  entranceTimer: number;  // 新規: <= 0 で通常状態
}
```

**状態遷移**:
- 初期状態（constructor で作成）: `entranceTimer = 0`（即座に通常状態）
- 動的追加（`addCompanion()` で作成）: `entranceTimer = 1.0`（1秒間アニメーション）
- アニメーション中: `entranceTimer -= deltaTime` 毎フレーム減算、`scale = 1 - entranceTimer`、高速スピン
- アニメーション完了: `entranceTimer <= 0` → 通常のオービット回転に移行

---

### 2. AirShield（既存 — 動作変更）

エアシールドの視覚表現。デフォルト非表示化と楕円形スケールの追加。データ構造変更なし。

| フィールド | 型 | 変更 | 説明 |
|-----------|------|------|------|
| `mesh` | `THREE.Mesh` | 既存 | シールドのメッシュ |
| `material` | `THREE.MeshBasicMaterial` | 既存 | シールドのマテリアル |
| `elapsedTime` | `number` | 既存 | アニメーション用経過時間 |
| `isBoosting` | `boolean` | 既存 | ブースト状態フラグ |

**定義箇所**: `src/game/effects/AirShield.ts`

**動作変更**:
- constructor: `mesh.visible = false`（デフォルト非表示）
- `setBoostMode(true)`: `mesh.visible = true`, `scale.set(1.0, 0.8, 2.0)`
- `setBoostMode(false)`: `mesh.visible = false`
- `update()`: `!isBoosting` 時は早期リターン（通常パルスアニメーション削除）
- `update()` ブースト時: opacity パルスのみ（スケールパルス削除、楕円形固定）

---

### 3. StageScene 炎パラメータ（既存 — 定数変更）

ブースト炎パーティクルの定数パラメータ。

| パラメータ | 旧値 | 新値 | 説明 |
|-----------|------|------|------|
| `MAX_FLAME_PARTICLES` | 100 | 150 | リングバッファの最大パーティクル数 |
| 放出数/frame | 5 | 8 | `emitFlameParticles()` 内のループ回数 |
| 寿命 | 0.5秒 | 0.7秒 | `flameLifetimes[idx]` の初期値 |

**定義箇所**: `src/game/scenes/StageScene.ts`

**影響**: `initBoostFlame()` の `Float32Array` サイズが `MAX` を参照するため自動的に150ベースになる。`updateFlameParticles()` のループも `MAX` を参照するため変更不要。

## 状態遷移図

### コンパニオン登場アニメーション

```
[constructor]                  [addCompanion()]
     |                              |
     v                              v
 entranceTimer = 0             entranceTimer = 1.0
 scale = (1,1,1)               scale = (0,0,0)
     |                              |
     v                              |  (update() 毎フレーム)
 通常オービット                      |  timer -= deltaTime
                                    |  scale = 1 - timer
                                    |  高速スピン (deltaTime * 8)
                                    |
                                    v  (timer <= 0)
                                通常オービット
```

### エアシールド表示状態

```
[constructor]            [setBoostMode(true)]         [setBoostMode(false)]
     |                         |                            |
     v                         v                            v
 visible = false          visible = true               visible = false
 (何も描画しない)          scale(1.0, 0.8, 2.0)        (何も描画しない)
                          opacity パルスアニメーション
```
