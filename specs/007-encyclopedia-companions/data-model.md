# Data Model: わくせいずかん＆うちゅうのなかま（惑星図鑑 & エイリアンコンパニオン）

**Feature**: `007-encyclopedia-companions`
**Date**: 2026-03-15

## Entities

### 1. SaveData（既存 — 拡張）

ゲームの永続化データ。`unlockedPlanets` を追加して図鑑・コンパニオン両方の獲得状態を管理。

| フィールド | 型 | 変更 | 説明 |
|-----------|------|------|------|
| `clearedStage` | `number` | 既存 | クリア済み最大ステージ番号（0〜11） |
| `unlockedPlanets` | `number[]` | **新規** | アンロック済み惑星の stageNumber 配列（例: [1, 2, 5]）|

**定義箇所**: `src/types/index.ts`

```typescript
export interface SaveData {
  clearedStage: number;
  unlockedPlanets: number[];
}
```

**デフォルト値**: `{ clearedStage: 0, unlockedPlanets: [] }`

**バリデーション規則**:
- `unlockedPlanets` が配列でない → `[]` にフォールバック
- 配列内の値が `number` でない、または 1〜11 の範囲外 → 除外
- 重複排除: `[...new Set(arr)]`
- 旧フォーマット（プロパティなし）→ `unlockedPlanets: []` を自動補完

---

### 2. PlanetEncyclopediaEntry（新規）

惑星ごとの図鑑・コンパニオン定義データ。静的設定データとして `PlanetEncyclopedia.ts` に定義。

| フィールド | 型 | 説明 |
|-----------|------|------|
| `stageNumber` | `number` | 対応するステージ番号（1〜11） |
| `name` | `string` | 惑星名（例: "月"） |
| `emoji` | `string` | 惑星絵文字（例: "🌙"） |
| `trivia` | `string` | ひらがな豆知識テキスト |
| `planetColor` | `number` | テーマカラー（16進数） |
| `companionShape` | `CompanionShape` | コンパニオンの形状バリエーション |

**定義箇所**: `src/types/index.ts`（型定義）、`src/game/config/PlanetEncyclopedia.ts`（データ）

```typescript
export type CompanionShape = 'basic' | 'ringed' | 'radiant' | 'horned' | 'icy' | 'bubble';

export interface PlanetEncyclopediaEntry {
  stageNumber: number;
  name: string;
  emoji: string;
  trivia: string;
  planetColor: number;
  companionShape: CompanionShape;
}
```

#### 全11惑星データ

| stageNumber | name | emoji | companionShape | planetColor | trivia（抜粋） |
|------------|------|-------|---------------|-------------|---------|
| 1 | 月 | 🌙 | basic | 0xcccccc | つきは ちきゅうの まわりを... |
| 2 | 水星 | ⚫ | basic | 0x888888 | すいせいは たいように... |
| 3 | 金星 | 🟡 | basic | 0xddaa44 | きんせいは ちきゅうと... |
| 4 | 火星 | 🔴 | horned | 0xcc4422 | かせいは あかい いろを... |
| 5 | 木星 | 🟠 | basic | 0xdd8844 | もくせいは たいようけいで... |
| 6 | 土星 | 🪐 | ringed | 0xddaa44 | どせいの わっかは... |
| 7 | 天王星 | 🔵 | icy | 0x66ccdd | てんのうせいは よこに... |
| 8 | 海王星 | 🫧 | bubble | 0x2244cc | かいおうせいは たいようから... |
| 9 | 冥王星 | ❄️ | icy | 0xbbaaaa | めいおうせいは とっても... |
| 10 | 太陽 | ☀️ | radiant | 0xffcc00 | たいようは じぶんで... |
| 11 | 地球 | 🌍 | basic | 0x2266aa | ちきゅうは わたしたちの... |

---

### 3. CompanionManager（新規）

全コンパニオンのライフサイクルとオービット計算を管理するクラス。

**定義箇所**: `src/game/entities/CompanionManager.ts`

#### プロパティ

| フィールド | 型 | 説明 |
|-----------|------|------|
| `companions` | `CompanionInstance[]` | アクティブなコンパニオンのリスト |
| `elapsedTime` | `number` | オービット角度計算用の累積時間 |
| `group` | `THREE.Group` | 全コンパニオンを含むグループ（シーンに追加用） |

#### CompanionInstance（内部型）

| フィールド | 型 | 説明 |
|-----------|------|------|
| `mesh` | `THREE.Group` | コンパニオンの3Dメッシュグループ |
| `orbitRadius` | `number` | 軌道半径 |
| `orbitSpeed` | `number` | 角速度（rad/s） |
| `orbitTilt` | `number` | 軌道面の傾き（rad） |
| `angleOffset` | `number` | 初期角度オフセット（rad） |

#### メソッド

| メソッド | 引数 | 戻り値 | 説明 |
|---------|------|--------|------|
| `constructor(unlockedPlanets: number[])` | unlockedPlanets | — | コンパニオンメッシュを生成しオービット初期化 |
| `update(deltaTime: number, shipX: number, shipY: number, shipZ: number)` | deltaTime, ship position | void | オービット位置を更新し宇宙船に追従 |
| `getCount()` | — | number | 現在のコンパニオン数を返す |
| `getStarAttractionBonus()` | — | number | 星の引き寄せボーナス（count × 0.2）を返す |
| `getGroup()` | — | THREE.Group | シーン追加用のグループを返す |
| `dispose()` | — | void | 全ジオメトリ・マテリアルの破棄 |

#### オービット計算

```
for each companion:
  angle = companion.angleOffset + elapsedTime * companion.orbitSpeed
  localX = companion.orbitRadius * cos(angle)
  localY = companion.orbitRadius * sin(angle) * cos(companion.orbitTilt)
  localZ = companion.orbitRadius * sin(angle) * sin(companion.orbitTilt)
  companion.mesh.position.set(shipX + localX, shipY + localY, shipZ + localZ)
  companion.mesh.rotation.y += deltaTime * 2  // 自転
```

#### コンパニオン形状生成

| CompanionShape | 構造 | ポリゴン目安 |
|---------------|------|------------|
| `basic` | Sphere(0.3,6,6) + Cone(0.12,0.25,6) × 2（耳） | ~30 |
| `ringed` | basic + Ring(0.35,0.5,8) | ~40 |
| `radiant` | Sphere(0.3,6,6) + Cone(0.08,0.2,4) × 3（放射） | ~40 |
| `horned` | basic + Cone(0.06,0.3,4) × 2（角） | ~35 |
| `icy` | basic（IcosahedronGeometry(0.3,0)で角張った体） | ~25 |
| `bubble` | Sphere(0.3,8,8)（透明度高め）+ 小Sphere(0.1) × 2 | ~40 |

#### 軌道パラメータ自動計算

```
count = companions.length
baseRadius = count <= 3 ? 2.0 : count <= 7 ? 2.5 : 3.0

for i in 0..count-1:
  angleOffset = i * (2π / count)
  orbitRadius = baseRadius + (i % 3) * 0.15  // 微小な半径差
  orbitSpeed = 1.0 + i * 0.05                // 微小な速度差
  orbitTilt = (i - count/2) * 0.15            // 傾きを分散
```

---

### 4. EncyclopediaOverlay（新規）

惑星図鑑のDOMベースUIオーバーレイ。

**定義箇所**: `src/ui/EncyclopediaOverlay.ts`

#### プロパティ

| フィールド | 型 | 説明 |
|-----------|------|------|
| `overlayEl` | `HTMLDivElement \| null` | フルスクリーンオーバーレイ要素 |
| `detailEl` | `HTMLDivElement \| null` | カード詳細モーダル要素 |
| `isShowingDetail` | `boolean` | 詳細モーダル表示中か |

#### メソッド

| メソッド | 引数 | 戻り値 | 説明 |
|---------|------|--------|------|
| `show(unlockedPlanets: number[], onClose: () => void)` | unlockedPlanets, onClose | void | ギャラリーオーバーレイを表示 |
| `hide()` | — | void | オーバーレイを閉じる |
| `private createCardGrid(unlockedPlanets: number[])` | unlockedPlanets | HTMLDivElement | カードグリッドを生成 |
| `private createCard(entry: PlanetEncyclopediaEntry, isUnlocked: boolean)` | entry, isUnlocked | HTMLDivElement | 個別カード要素を生成 |
| `private showDetail(entry: PlanetEncyclopediaEntry)` | entry | void | カード詳細モーダルを表示 |
| `private hideDetail()` | — | void | 詳細モーダルを閉じてグリッドに戻る |

#### カードUI仕様

**ロックカード**:
- 背景: `#444`
- テキスト: 「？？？」（Zen Maru Gothic, 1.2rem, #aaa）
- opacity: 0.6
- pointer-events: none（タップ不可）

**アンロックカード**:
- 背景: `linear-gradient(135deg, planetColor, darken(planetColor))`
- 上部: 絵文字（2rem）
- 下部: 惑星名（Zen Maru Gothic, 1rem, #fff, bold）
- box-shadow: `0 4px 12px rgba(0,0,0,0.3)`
- border-radius: 16px
- cursor: pointer

**詳細モーダル**:
- 背景: `rgba(0, 0, 32, 0.9)`（フルスクリーン）
- 中央カード: 300×400px
  - 絵文字: 4rem
  - 惑星名: 2rem, #FFD700, bold
  - 豆知識: 1.2rem, #fff, line-height 1.8
- 「もどる」ボタン: 下部中央

---

### 5. CollisionSystem（既存 — 拡張）

星の衝突判定に `companionBonus` パラメータを追加。

**変更箇所**: `src/game/systems/CollisionSystem.ts`

#### check() メソッド変更

```typescript
// Before
check(spaceship: Spaceship, stars: Star[], meteorites: Meteorite[]): CollisionResult

// After
check(spaceship: Spaceship, stars: Star[], meteorites: Meteorite[], companionBonus = 0): CollisionResult
```

星の衝突距離計算:
```typescript
// Before
const collisionDist = 1.0 + star.radius;

// After
const collisionDist = 1.0 + star.radius + companionBonus;
```

隕石の衝突距離計算: **変更なし**

---

## Relationships

```
TitleScene
  ├── EncyclopediaOverlay (1:1) — 「ずかん」ボタンタップで show/hide
  └── SaveManager (1:1) — unlockedPlanets 読み込み

StageScene
  ├── CompanionManager (1:1) — 新規。enter()で生成、update()で毎フレーム更新、exit()で破棄
  ├── CollisionSystem (1:1) — check()にcompanionBonus引数追加
  ├── SaveManager (1:1) — ステージクリア時のunlockedPlanets更新（main.ts経由）
  └── Spaceship (1:1) — position をCompanionManagerに渡す

CompanionManager
  ├── PlanetEncyclopedia (N:1) — コンパニオン形状・色の定義参照
  └── THREE.Group (1:1) — シーンに追加される3Dグループ

EncyclopediaOverlay
  └── PlanetEncyclopedia (N:1) — カード表示データの参照

SaveManager
  └── SaveData (1:1) — localStorage 永続化
```

## State Transitions

### ステージクリア時のデータフロー

```
StageScene.onStageClear()
  → isCleared = true
  → showClearMessage()  ← カード獲得テキスト追加表示
  
StageScene.handleStageComplete()
  → sceneManager.requestTransition('stage' | 'ending', context)
  
main.ts transitionHandler
  → saveData = saveManager.load()
  → if (!saveData.unlockedPlanets.includes(stageNumber)):
       saveData.unlockedPlanets.push(stageNumber)
  → saveData.clearedStage = max(saveData.clearedStage, stageNumber)
  → saveManager.save(saveData)
  → sceneManager.transitionTo(sceneType, context)
```

### 図鑑フロー

```
TitleScene
  → 「ずかん」タップ
  → encyclopediaOverlay.show(saveData.unlockedPlanets, onClose)
  
EncyclopediaOverlay (ギャラリー)
  → アンロックカードタップ → showDetail(entry)
  → ロックカードタップ → 無反応
  → 「もどる」タップ → hide() → onClose()

EncyclopediaOverlay (詳細)
  → 「もどる」タップ → hideDetail() → ギャラリーに戻る
```

## Validation Rules

- `unlockedPlanets` の各値は 1〜11 の整数のみ
- `unlockedPlanets` に重複なし
- `PlanetEncyclopediaEntry.trivia` は全てひらがな・絵文字・句読点のみ（漢字なし）
- コンパニオン数は 0〜11 の範囲
- `companionBonus` は `0 <= bonus <= 2.2`（11体 × 0.2）
- 図鑑の「もどる」ボタンと詳細の「もどる」ボタンは同時タップ不可（先着処理）
