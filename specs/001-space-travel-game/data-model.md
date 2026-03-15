# Data Model: うちゅうの たび — 宇宙船キッズゲーム

**Date**: 2026-03-15
**Feature**: 001-space-travel-game

## Entities

### GameState (ゲーム状態)

ゲーム全体の状態を管理するルートエンティティ。

| Field | Type | Description |
|-------|------|-------------|
| currentScene | SceneType | 現在のシーン (TITLE / STAGE / ENDING) |
| currentStage | number (1-3) | 現在のステージ番号 |
| totalScore | number | 全ステージの累計スコア |
| isPaused | boolean | 一時停止中か |

**State Transitions**:
```
TITLE → STAGE(1) → STAGE(2) → STAGE(3) → ENDING → TITLE
```

---

### Spaceship (宇宙船)

プレイヤーが操作するキャラクター。

| Field | Type | Description |
|-------|------|-------------|
| position | { x, y, z } | 3D空間での位置 |
| speed | number | 現在の前進速度 |
| speedState | SpeedState | 速度状態 (NORMAL / BOOST / SLOWDOWN) |
| speedStateTimer | number | 速度状態の残り秒数 |
| boundaryMin | number | 左端の x 座標制限 |
| boundaryMax | number | 右端の x 座標制限 |

**SpeedState (速度状態遷移)**:
```
NORMAL → BOOST (ブーストボタン押下)
BOOST → NORMAL (3秒経過)
BOOST → SLOWDOWN (隕石接触でブースト解除)
NORMAL → SLOWDOWN (隕石接触)
SLOWDOWN → NORMAL (3秒経過)
```

**Validation Rules**:
- position.x は boundaryMin ≤ x ≤ boundaryMax を満たす
- speed は 0 以上
- speedStateTimer は 0 以上（0になったら NORMAL に遷移）

---

### Star (星)

収集対象アイテム。宇宙船が触れるとスコア加算。

| Field | Type | Description |
|-------|------|-------------|
| position | { x, y, z } | 3D空間での位置 |
| radius | number | 当たり判定の半径 |
| starType | StarType | 星の種類 (NORMAL / RAINBOW) |
| scoreValue | number | 取得時のスコア値 |
| isCollected | boolean | 収集済みか |

**StarType Values**:
| Type | scoreValue | 出現確率 |
|------|-----------|----------|
| NORMAL | 100 | 90% |
| RAINBOW | 500 | 10% |

**Validation Rules**:
- isCollected が true になったら再度取得不可
- position.z は宇宙船の前方（奥方向）に生成

---

### Meteorite (隕石)

障害物。宇宙船接触でスピードダウン。

| Field | Type | Description |
|-------|------|-------------|
| position | { x, y, z } | 3D空間での位置 |
| radius | number | 当たり判定の半径 |
| isActive | boolean | アクティブか（画面外で非アクティブ化） |

**Validation Rules**:
- ステージごとに出現頻度が異なる（StageConfig で定義）
- 宇宙船が SLOWDOWN 中に再接触しても追加のスピードダウンは発生しない（無敵時間）

---

### Stage (ステージ)

ゲームの区切り。難易度パラメータを保持。

| Field | Type | Description |
|-------|------|-------------|
| stageNumber | number (1-3) | ステージ番号 |
| destination | string | 目的地惑星名 |
| stageLength | number | ステージの奥行き（z方向の長さ） |
| meteoriteInterval | number | 隕石の出現間隔（秒） |
| starDensity | number | 星の密度（一定距離あたりの数） |
| progress | number (0-1) | 現在の進行度（0=開始、1=ゴール） |

**Stage Configuration**:
| Stage | destination | meteoriteInterval | 難易度 |
|-------|------------|-------------------|--------|
| 1 | 月 (Moon) | 3.0s | 簡単 |
| 2 | 火星 (Mars) | 2.0s | 中程度 |
| 3 | 土星 (Saturn) | 1.0s | 難しい |

---

### Score (スコア)

スコア管理エンティティ。

| Field | Type | Description |
|-------|------|-------------|
| stageScore | number | 現在のステージのスコア |
| totalScore | number | 全ステージの累計スコア |
| starCount | number | 現在のステージで集めた星の数 |
| totalStarCount | number | 全ステージで集めた星の総数 |

**Validation Rules**:
- stageScore, totalScore は 0 以上
- ステージクリア時に stageScore を totalScore に加算

---

### SaveData (セーブデータ)

localStorage に保存するデータ構造。

| Field | Type | Description |
|-------|------|-------------|
| clearedStage | number (0-3) | クリア済みのステージ番号 (0=未クリア) |

**Storage Key**: `universe-kids-race-save`

**Validation Rules**:
- clearedStage は 0, 1, 2, 3 のいずれか
- エンディング表示後に clearedStage = 0 にリセット
- JSON.parse 失敗時はデフォルト値 `{ clearedStage: 0 }` にフォールバック

---

### BoostState (ブースト状態)

ブースト機能の管理。

| Field | Type | Description |
|-------|------|-------------|
| isAvailable | boolean | ブーストが使用可能か |
| cooldownTimer | number | クールダウン残り秒数 |
| duration | number | ブースト持続時間 (3秒) |
| cooldown | number | クールダウン時間 (5秒) |

**State Transitions**:
```
AVAILABLE → ACTIVE (ボタン押下)
ACTIVE → COOLDOWN (3秒経過 or 隕石接触)
COOLDOWN → AVAILABLE (5秒経過)
```

## Relationships

```
GameState
├── has one → Spaceship
├── has one → Score
├── has one → Stage (current)
├── has one → BoostState
├── has many → Star[]
└── has many → Meteorite[]

Stage
├── configures → Meteorite spawn rate
└── configures → Star density

SaveData (independent, persisted to localStorage)
└── tracks → clearedStage from GameState
```
