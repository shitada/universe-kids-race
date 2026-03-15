# Contract: Stage Config (8ステージ拡張)

**Date**: 2026-03-15
**Feature**: 002-ipad-game-enhancements

## Overview

既存の StageConfig 型を拡張し、3ステージから8ステージに増やす。
太陽系の旅テーマに沿って、各天体の表示情報を追加。

## Updated StageConfig Type

```typescript
interface StageConfig {
  stageNumber: number;         // 1-8
  destination: string;         // 天体名（漢字: "月", "火星", etc.）
  stageLength: number;         // ステージの長さ（z座標の距離）
  meteoriteInterval: number;   // 隕石出現間隔（秒）
  starDensity: number;         // 星の密度（100z あたりの星数）
  emoji: string;               // 天体の絵文字
  displayName: string;         // HUD表示用（ひらがな: "月をめざせ！"）
  planetColor: number;         // 天体3Dモデルの色 (hex)
}
```

**新規フィールド**: `emoji`, `displayName`, `planetColor`

## Stage Data

```typescript
const STAGE_CONFIGS: StageConfig[] = [
  {
    stageNumber: 1,
    destination: '月',
    stageLength: 1000,
    meteoriteInterval: 3.0,
    starDensity: 5,
    emoji: '🌙',
    displayName: '月をめざせ！',
    planetColor: 0xCCCCCC,
  },
  {
    stageNumber: 2,
    destination: '火星',
    stageLength: 1200,
    meteoriteInterval: 2.5,
    starDensity: 5,
    emoji: '🔴',
    displayName: '火星をめざせ！',
    planetColor: 0xCC4422,
  },
  {
    stageNumber: 3,
    destination: '木星',
    stageLength: 1400,
    meteoriteInterval: 2.0,
    starDensity: 6,
    emoji: '🟠',
    displayName: '木星をめざせ！',
    planetColor: 0xDD8844,
  },
  {
    stageNumber: 4,
    destination: '土星',
    stageLength: 1600,
    meteoriteInterval: 1.7,
    starDensity: 6,
    emoji: '🪐',
    displayName: '土星をめざせ！',
    planetColor: 0xDDAA44,
  },
  {
    stageNumber: 5,
    destination: '天王星',
    stageLength: 1800,
    meteoriteInterval: 1.4,
    starDensity: 7,
    emoji: '🔵',
    displayName: '天王星をめざせ！',
    planetColor: 0x66CCDD,
  },
  {
    stageNumber: 6,
    destination: '海王星',
    stageLength: 2000,
    meteoriteInterval: 1.1,
    starDensity: 8,
    emoji: '🫧',
    displayName: '海王星をめざせ！',
    planetColor: 0x2244CC,
  },
  {
    stageNumber: 7,
    destination: '冥王星',
    stageLength: 2200,
    meteoriteInterval: 0.8,
    starDensity: 9,
    emoji: '❄️',
    displayName: '冥王星をめざせ！',
    planetColor: 0xBBAAAA,
  },
  {
    stageNumber: 8,
    destination: '太陽',
    stageLength: 2500,
    meteoriteInterval: 0.6,
    starDensity: 10,
    emoji: '☀️',
    displayName: '太陽をめざせ！',
    planetColor: 0xFFCC00,
  },
];
```

## Difficulty Progression

| Stage | Length | Met. Interval | Star Density | Design Intent |
|-------|--------|---------------|--------------|---------------|
| 1 月 | 1000 | 3.0s | 5 | チュートリアル的。ゆったり |
| 2 火星 | 1200 | 2.5s | 5 | 少し活発に |
| 3 木星 | 1400 | 2.0s | 6 | 中盤入口 |
| 4 土星 | 1600 | 1.7s | 6 | 中盤、リングの演出 |
| 5 天王星 | 1800 | 1.4s | 7 | 後半開始 |
| 6 海王星 | 2000 | 1.1s | 8 | 難易度上昇 |
| 7 冥王星 | 2200 | 0.8s | 9 | 高難度 |
| 8 太陽 | 2500 | 0.6s | 10 | 最難関、クライマックス |

## Impact on Existing Code

### StageScene.handleStageComplete()
- 既存: `this.stageNumber >= 3` で ending に遷移
- 変更: `this.stageNumber >= 8` で ending に遷移

### StageScene.createDestinationPlanet()
- 既存: switch 文で 3 ケース（月、火星、土星）
- 変更: 8 ケースに拡張、または `planetColor` を使って汎用化

### SaveData.clearedStage
- 既存: 0-3 の値域
- 変更: 0-8 の値域（型自体は number なので変更不要）

### HUD.show()
- 新規引数または StageConfig を受け取り、ステージ名を表示
