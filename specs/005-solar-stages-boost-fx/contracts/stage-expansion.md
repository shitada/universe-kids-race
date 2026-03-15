# Contract: ステージ構成拡張・惑星3Dモデル

**Feature**: `005-solar-stages-boost-fx`
**Date**: 2026-03-15
**Type**: Internal Module Interface

## Overview

STAGE_CONFIGSを8ステージ→11ステージに拡張。水星(2)・金星(3)を追加し既存ステージ番号を+2シフト。地球(11)を最終ステージとして追加。各惑星の3Dモデルをプロシージャル生成で特徴的に描画。

## Interface

### `STAGE_CONFIGS: StageConfig[]`（既存 — 拡張）

配列長を8→11に変更。型定義`StageConfig`自体は変更なし。

**事後条件**:
- `STAGE_CONFIGS.length === 11`
- `STAGE_CONFIGS[0].destination === '月'` (stageNumber=1)
- `STAGE_CONFIGS[1].destination === '水星'` (stageNumber=2, 新規)
- `STAGE_CONFIGS[2].destination === '金星'` (stageNumber=3, 新規)
- `STAGE_CONFIGS[3].destination === '火星'` (stageNumber=4)
- ... (以降シフト)
- `STAGE_CONFIGS[10].destination === '地球'` (stageNumber=11, 新規)

**難易度カーブ**:
```
Stage  1: stageLength=1000, meteoriteInterval=3.0
Stage  2: stageLength=1100, meteoriteInterval=2.8  (新規)
Stage  3: stageLength=1150, meteoriteInterval=2.6  (新規)
Stage  4: stageLength=1200, meteoriteInterval=2.5
Stage  5: stageLength=1400, meteoriteInterval=2.0
...
Stage 10: stageLength=2500, meteoriteInterval=0.6
Stage 11: stageLength=2700, meteoriteInterval=0.5  (新規)
```

### `getStageConfig(stageNumber: number): StageConfig`（既存 — 変更なし）

有効範囲が1〜11に拡大。stageNumber=9, 10, 11が新たに有効に。

### `StageScene.createDestinationPlanet(): void`（既存 — 大幅拡張）

惑星モデルの分岐ロジックを拡張。

**各ステージの惑星モデル仕様**:

| Stage | 惑星 | 球半径 | 特殊要素 |
|-------|------|--------|---------|
| 1 | 月 | 15 | 単色 0xcccccc |
| 2 | 水星 | 10 | canvasテクスチャ（灰色+クレーター） |
| 3 | 金星 | 14 | canvasテクスチャ（黄オレンジ+渦巻き模様） |
| 4 | 火星 | 15 | 単色 0xcc4422 |
| 5 | 木星 | 20 | canvasテクスチャ（縞模様） |
| 6 | 土星 | 15 | RingGeometry(20,30), rotation.x = PI/3 |
| 7 | 天王星 | 16 | 水色 + RingGeometry(21,28), rotation.z = PI/2（横倒し） |
| 8 | 海王星 | 16 | 単色 0x2244cc |
| 9 | 冥王星 | 8 | 小さい球 0xbbaaaa |
| 10 | 太陽 | 25 | PointLight + emissive光 + パルスアニメーション（update()内でscale振動） |
| 11 | 地球 | 15 | canvasテクスチャ（青海+茶色大陸）+ 半透明雲レイヤー(SphereGeometry(15.5), opacity=0.3) |

**太陽のパルスアニメーション**: StageScene.update()内で `destinationPlanet.scale` を `1.0 + sin(time * 2) * 0.05` でアニメーション。

### `StageScene.handleStageComplete(): void`（既存 — 閾値変更）

```typescript
// 旧
if (this.stageNumber >= 8) {
  this.sceneManager.requestTransition('ending', ...);
}

// 新
if (this.stageNumber >= 11) {
  this.sceneManager.requestTransition('ending', ...);
}
```

### `TitleScene.createOverlay()`（既存 — startStage計算変更）

```typescript
// 旧
const startStage = Math.min(saveData.clearedStage + 1, 8);

// 新
const startStage = Math.min(saveData.clearedStage + 1, 11);
```

### `SaveManager.load(): SaveData`（既存 — 上限変更）

```typescript
// 旧
if (... || data.clearedStage > 8) {

// 新
if (... || data.clearedStage > 11) {
```

## Validation Rules

- 全11ステージを順番にクリアできること
- ステージ11クリアでエンディングに遷移すること
- 各惑星モデルが視覚的に区別可能であること
- 新ステージの難易度が前後のステージと整合していること
