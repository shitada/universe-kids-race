# Data Model: エアシールドエフェクト追加・隕石衝突後の速度緩やか回復

**Feature**: `006-shield-speed-recovery`
**Date**: 2026-03-15

## Entities

### 1. SpeedState（既存 — 拡張）

速度状態の共用型。`'RECOVERING'` を追加。

| 値 | 変更 | 説明 |
|----|------|------|
| `'NORMAL'` | 既存 | 通常速度（100%） |
| `'BOOST'` | 既存 | ブースト加速（200%） |
| `'SLOWDOWN'` | 既存 | 隕石衝突減速（40%）、3秒間 |
| `'RECOVERING'` | **新規** | 減速からの回復中（40%→100%、イーズアウト、約1秒間） |

**定義箇所**: `src/types/index.ts`

```typescript
export type SpeedState = 'NORMAL' | 'BOOST' | 'SLOWDOWN' | 'RECOVERING';
```

---

### 2. Spaceship（既存 — 拡張）

速度回復ロジックの追加。新規フィールドは不要（既存の `speedStateTimer` を再利用）。

#### 新規定数

| 定数 | 値 | 説明 |
|------|-----|------|
| `RECOVERY_DURATION` | `1.0` | 速度回復にかかる秒数 |

#### 状態遷移

```
NORMAL → (隕石衝突) → SLOWDOWN(3s) → RECOVERING(1s) → NORMAL
NORMAL → (ブースト) → BOOST(3s) → NORMAL
RECOVERING → (隕石衝突) → SLOWDOWN(3s) → RECOVERING(1s) → NORMAL
RECOVERING → (ブースト) → BOOST(3s) → NORMAL
```

#### getForwardSpeed() 拡張

| SpeedState | 計算式 |
|-----------|--------|
| `'NORMAL'` | `speed * 1.0` |
| `'BOOST'` | `speed * BOOST_MULTIPLIER (2.0)` |
| `'SLOWDOWN'` | `speed * SLOWDOWN_MULTIPLIER (0.4)` |
| `'RECOVERING'` | `speed * (SLOWDOWN_MULTIPLIER + (1 - SLOWDOWN_MULTIPLIER) * easeOutQuad(progress))` |

`progress = 1 - (speedStateTimer / RECOVERY_DURATION)` (0→1)
`easeOutQuad(t) = 1 - (1 - t)^2`

#### update() 変更

SLOWDOWN タイマー終了時の遷移先を NORMAL → RECOVERING に変更。RECOVERING タイマー終了時に NORMAL に遷移。

---

### 3. AirShield（新規）

宇宙船を包むエアシールドエフェクトの視覚表現。

**定義箇所**: `src/game/effects/AirShield.ts`

#### プロパティ

| フィールド | 型 | 説明 |
|-----------|------|------|
| `mesh` | `THREE.Mesh` | シールドの球体メッシュ |
| `material` | `THREE.MeshBasicMaterial` | シールドのマテリアル（透明・加算ブレンディング） |
| `elapsedTime` | `number` | パルスアニメーション用の累積時間 |
| `isBoosting` | `boolean` | ブーストモードかどうか |

#### メソッド

| メソッド | 引数 | 戻り値 | 説明 |
|---------|------|--------|------|
| `constructor()` | — | — | SphereGeometry + MeshBasicMaterial でメッシュ生成 |
| `update(deltaTime: number)` | deltaTime | void | パルスアニメーション更新。opacity・scaleを時間変化 |
| `setBoostMode(active: boolean)` | active | void | ブースト強調の切替 |
| `setPosition(x: number, y: number, z: number)` | x, y, z | void | 宇宙船への位置追従 |
| `getMesh(): THREE.Mesh` | — | THREE.Mesh | シーンへの追加用 |
| `dispose()` | — | void | ジオメトリ・マテリアルの破棄 |

#### ビジュアル仕様

| パラメータ | 通常時 | ブースト時 |
|-----------|--------|-----------|
| color | `0x44aaff` | `0x88ddff` |
| opacity 範囲 | 0.10 〜 0.20 | 0.25 〜 0.35 |
| scale 範囲 | 1.00 〜 1.05 | 1.25 〜 1.35 |
| パルス周波数 | 3 Hz | 5 Hz |

#### ジオメトリ仕様

| パラメータ | 値 |
|-----------|-----|
| radius | 1.5 |
| widthSegments | 16 |
| heightSegments | 16 |
| 頂点数 | ~624 |

---

## Relationships

```
StageScene
  ├── Spaceship (1:1) — 速度回復ロジック追加
  ├── AirShield (1:1) — 新規。毎フレーム position を Spaceship から同期
  └── BoostSystem (1:1) — 変更なし。isActive() を AirShield のブーストモード判定に使用
```

## Validation Rules

- `RECOVERY_DURATION` は正の数（> 0）
- RECOVERING 中の speed multiplier は `[SLOWDOWN_MULTIPLIER, 1.0]` の範囲内
- AirShield の opacity は `[0.0, 1.0]` の範囲内
- AirShield の scale は正の数（> 0）
