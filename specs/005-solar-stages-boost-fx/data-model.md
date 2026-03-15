# Data Model: 太陽系全惑星ステージ拡張・ブースト演出強化・タイトルBGM修正

**Feature**: `005-solar-stages-boost-fx`
**Date**: 2026-03-15

## Entities

### 1. StageConfig（既存 — 拡張）

ステージ構成データ。8→11ステージに拡張。型定義自体は変更なし。

| フィールド | 型 | 説明 |
|-----------|------|------|
| stageNumber | `number` | ステージ番号（1〜11） |
| destination | `string` | 目的地惑星名 |
| stageLength | `number` | ステージの長さ（z方向距離） |
| meteoriteInterval | `number` | 隕石出現間隔（秒） |
| starDensity | `number` | 星の出現密度 |
| emoji | `string` | 惑星の絵文字 |
| displayName | `string` | 表示名（「〇〇をめざせ！」） |
| planetColor | `number` | 惑星の基本色（hex） |

**新規エントリ（追加分）**:

| 番号 | destination | planetColor | emoji | displayName |
|------|------------|-------------|-------|-------------|
| 2 | 水星 | 0x888888 | ⚫ | 水星をめざせ！ |
| 3 | 金星 | 0xddaa44 | 🟡 | 金星をめざせ！ |
| 11 | 地球 | 0x2266aa | 🌍 | 地球をめざせ！ |

---

### 2. SFXType（既存 — 拡張）

効果音タイプの共用型。`'boostReady'`を追加。

| 値 | 変更 | 説明 |
|----|------|------|
| 'starCollect' | 既存 | 星収集時 |
| 'rainbowCollect' | 既存 | 虹星収集時 |
| 'meteoriteHit' | 既存 | 隕石衝突時 |
| 'boost' | 既存 | ブースト発動時（短いスイープ） |
| 'stageClear' | 既存 | ステージクリア時 |
| 'boostReady' | **新規** | ブーストクールダウン完了時（上昇スイープ「ピコーン！」） |

---

### 3. BGM_CONFIGS（既存 — 拡張）

BGMパラメータのレコード型。ステージ番号→BGMConfig マッピング。

**既存のキーのリマップ + 新規追加**:

| キー | 惑星 | 変更 |
|------|------|------|
| 0 | タイトル | 変更なし |
| 1 | 月 | 変更なし |
| 2 | 水星 | **新規追加** |
| 3 | 金星 | **新規追加** |
| 4 | 火星 | 旧2のデータ |
| 5 | 木星 | 旧3のデータ |
| 6 | 土星 | 旧4のデータ |
| 7 | 天王星 | 旧5のデータ |
| 8 | 海王星 | 旧6のデータ |
| 9 | 冥王星 | 旧7のデータ |
| 10 | 太陽 | 旧8のデータ |
| 11 | 地球 | **新規追加** |
| -1 | エンディング | 変更なし |

---

### 4. AudioManager（既存 — 拡張）

新規メソッドとプロパティを追加。

#### 新規プライベートフィールド

| フィールド | 型 | 説明 |
|-----------|------|------|
| boostNoiseSource | `AudioBufferSourceNode \| null` | ブースト噴射音のホワイトノイズソース |
| boostNoiseGain | `GainNode \| null` | 噴射音の音量制御（フェードアウト用） |
| boostNoiseFilter | `BiquadFilterNode \| null` | 噴射音のローパスフィルタ |

#### 新規パブリックメソッド

| メソッド | シグネチャ | 説明 |
|---------|----------|------|
| startBoostSFX | `(): void` | ブースト噴射音のループ再生を開始 |
| stopBoostSFX | `(): void` | 噴射音をフェードアウトして停止 |

#### initSync()の変更

冪等化: `if (this.initialized) return;` を先頭に追加。

---

### 5. 惑星3Dモデル（StageScene.createDestinationPlanet() 内部）

createDestinationPlanet()メソッド内で各惑星のモデルを分岐生成。新規クラスや型定義は追加しない。

| 惑星 | 球サイズ | 追加要素 | テクスチャ |
|------|---------|---------|-----------|
| 月(1) | 15 | — | なし（単色） |
| 水星(2) | 10 | — | canvasクレーター模様 |
| 金星(3) | 14 | — | canvas渦巻きパターン |
| 火星(4) | 15 | — | なし（単色） |
| 木星(5) | 20 | — | canvas縞模様 |
| 土星(6) | 15 | RingGeometry | なし |
| 天王星(7) | 16 | RingGeometry(横倒し) | なし |
| 海王星(8) | 16 | — | なし（単色） |
| 冥王星(9) | 8 | — | なし（小サイズ） |
| 太陽(10) | 25 | PointLight + パルスアニメ | なし（emissive） |
| 地球(11) | 15 | 雲レイヤー(15.5) | canvas海+大陸 |

---

### 6. ブースト炎パーティクル（StageScene 内部）

StageScene内で管理するリングバッファ方式のパーティクルシステム。

| フィールド | 型 | 説明 |
|-----------|------|------|
| boostFlamePoints | `THREE.Points \| null` | 炎パーティクルのPointsオブジェクト |
| boostFlameIndex | `number` | リングバッファの書き込みインデックス |
| boostFlameLifetimes | `Float32Array` | 各パーティクルの残り寿命 |

**定数**:
- MAX_FLAME_PARTICLES = 100
- FLAME_LIFETIME = 0.5 秒
- FLAME_EMIT_RATE = 毎フレーム5粒程度

---

### 7. SaveData（既存 — 制約変更）

| フィールド | 型 | 旧制約 | 新制約 |
|-----------|------|--------|--------|
| clearedStage | `number` | 0〜8 | 0〜11 |

---

## State Transitions

### ブースト状態 × 演出マトリクス

```
                  噴射音     炎パーティクル    通知音
available=true:   なし       なし              —
activate():       開始       放出開始          —
active=true:      持続再生    毎フレーム放出    —
duration終了:     フェードアウト  放出停止+残存フェード  —
cooldown中:       なし       なし              —
cooldown完了:     なし       なし              再生
```

### TitleScene BGM初期化フロー

```
enter()
  → オーバーレイ作成
  → overlay.addEventListener('pointerdown', handler, {once: true})

handler: (最初のタッチ)
  → AudioManager.initSync()
  → AudioManager.playBGM(0)

「あそぶ」ボタン: (stopPropagation)
  → AudioManager.initSync() // 冪等、初期化済みなら何もしない
  → AudioManager.playBGM(0) // stopBGM() → 再playBGM()
  → requestTransition('stage')
```
