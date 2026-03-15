# Module Interface: Game Systems

**Date**: 2026-03-15
**Feature**: 001-space-travel-game

## Overview

ゲームの各機能（入力・衝突判定・スコア・生成・ブースト）を独立システムとして定義する。
各システムは StageScene から毎フレーム呼び出される。

## InputSystem

```typescript
interface InputState {
  moveDirection: -1 | 0 | 1;  // -1=左, 0=なし, 1=右
  boostPressed: boolean;
}

interface InputSystem {
  /** イベントリスナーを登録する */
  setup(canvas: HTMLCanvasElement): void;
  
  /** 現在の入力状態を返す */
  getState(): InputState;
  
  /** イベントリスナーを解除する */
  dispose(): void;
}
```

**Details**:
- canvas の左半分タッチ → moveDirection = -1
- canvas の右半分タッチ → moveDirection = 1
- 左右同時タッチ → moveDirection = 0
- ブーストボタン（HTML overlay）のタッチ → boostPressed = true

## CollisionSystem

```typescript
interface CollisionResult {
  starCollisions: Star[];         // このフレームで接触した星の一覧
  meteoriteCollision: boolean;    // このフレームで隕石に接触したか
}

interface CollisionSystem {
  /** 宇宙船と全オブジェクトの当たり判定を実行する */
  check(spaceship: Spaceship, stars: Star[], meteorites: Meteorite[]): CollisionResult;
}
```

**Details**:
- バウンディングスフィア距離判定
- 収集済み星（isCollected=true）はスキップ
- 宇宙船が SLOWDOWN 中は隕石衝突を無視（無敵時間）

## ScoreSystem

```typescript
interface ScoreSystem {
  /** 星取得でスコア加算 */
  addStarScore(starType: StarType): void;
  
  /** 現在のステージスコアを取得 */
  getStageScore(): number;
  
  /** 集めた星の数を取得 */
  getStarCount(): number;
  
  /** ステージ終了時にトータルスコアに加算し、ステージスコアをリセット */
  finalizeStage(): { stageScore: number; totalScore: number; totalStarCount: number };
  
  /** 全リセット（新規ゲーム開始時） */
  reset(): void;
}
```

## SpawnSystem

```typescript
interface SpawnSystem {
  /** ステージ設定に基づいて星と隕石を生成する */
  update(deltaTime: number, spaceshipZ: number, config: StageConfig): SpawnResult;
  
  /** 生成済みオブジェクトをリセット */
  reset(): void;
}

interface SpawnResult {
  newStars: Star[];
  newMeteorites: Meteorite[];
}
```

**Details**:
- 宇宙船の前方（z方向）に一定距離先にオブジェクトを生成
- 画面外（宇宙船の後方）に過ぎたオブジェクトは非アクティブ化
- 虹色星の出現確率は10%

## BoostSystem

```typescript
interface BoostSystem {
  /** ブーストを発動する（使用可能な場合） */
  activate(): boolean;
  
  /** 毎フレーム更新（タイマー管理） */
  update(deltaTime: number): void;
  
  /** ブーストを強制解除する（隕石接触時） */
  cancel(): void;
  
  /** ブーストが使用可能か */
  isAvailable(): boolean;
  
  /** 現在ブースト中か */
  isActive(): boolean;
  
  /** リセット */
  reset(): void;
}
```

**Parameters**:
- ブースト持続時間: 3秒
- クールダウン: 5秒
- ブースト速度倍率: 通常速度の2倍
