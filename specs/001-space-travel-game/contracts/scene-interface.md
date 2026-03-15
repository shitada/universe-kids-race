# Module Interface: Scene

**Date**: 2026-03-15
**Feature**: 001-space-travel-game

## Overview

ゲーム内の各画面（タイトル・ステージ・エンディング）が実装するシーンインターフェース。
SceneManager がこのインターフェース経由で各シーンのライフサイクルを管理する。

## Interface Definition

```typescript
/**
 * シーンの種別
 */
type SceneType = 'title' | 'stage' | 'ending';

/**
 * シーン遷移時に渡すコンテキスト
 */
interface SceneContext {
  stageNumber?: number;      // ステージシーンの場合: 1-3
  totalScore?: number;       // エンディングシーンへの累計スコア
  totalStarCount?: number;   // エンディングシーンへの累計星数
}

/**
 * 全シーンが実装するインターフェース
 */
interface Scene {
  /** シーン進入時に呼ばれる。Three.js Scene の初期化、オブジェクト配置を行う */
  enter(context: SceneContext): void;

  /** 毎フレーム呼ばれる。ゲームロジック更新 */
  update(deltaTime: number): void;

  /** シーン退出時に呼ばれる。リソース解放、Three.js Scene のクリーンアップ */
  exit(): void;

  /** Three.js の Scene オブジェクトを返す */
  getThreeScene(): THREE.Scene;

  /** Three.js の Camera オブジェクトを返す */
  getCamera(): THREE.Camera;
}
```

## Scene Transitions

```
Title.enter()
  → ユーザーが「あそぶ」タッチ
  → Title.exit()
  → Stage.enter({ stageNumber: N })
  
Stage.enter({ stageNumber: N })
  → ゴール到着
  → Stage.exit()
  → N < 3: Stage.enter({ stageNumber: N+1 })
  → N = 3: Ending.enter({ totalScore, totalStarCount })
  
Ending.enter({ totalScore, totalStarCount })
  → ユーザーがタイトルへ戻る操作
  → Ending.exit()
  → Title.enter()
```

## SceneManager Interface

```typescript
interface SceneManager {
  /** 指定シーンに遷移する */
  transitionTo(sceneType: SceneType, context?: SceneContext): void;
  
  /** 現在のシーンを更新する (GameLoopから毎フレーム呼ばれる) */
  update(deltaTime: number): void;
  
  /** 現在のシーンの Three.js Scene を返す */
  getCurrentThreeScene(): THREE.Scene;
  
  /** 現在のシーンの Camera を返す */
  getCurrentCamera(): THREE.Camera;
}
```
