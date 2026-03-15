import type * as THREE from 'three';

// Scene types
export type SceneType = 'title' | 'stage' | 'ending';

export interface SceneContext {
  stageNumber?: number;
  totalScore?: number;
  totalStarCount?: number;
}

export interface Scene {
  enter(context: SceneContext): void;
  update(deltaTime: number): void;
  exit(): void;
  getThreeScene(): THREE.Scene;
  getCamera(): THREE.Camera;
}

// Speed states
export type SpeedState = 'NORMAL' | 'BOOST' | 'SLOWDOWN';

// Star types
export type StarType = 'NORMAL' | 'RAINBOW';

// Input
export interface InputState {
  moveDirection: -1 | 0 | 1;
  boostPressed: boolean;
}

// Stage configuration
export interface StageConfig {
  stageNumber: number;
  destination: string;
  stageLength: number;
  meteoriteInterval: number;
  starDensity: number;
  emoji: string;
  displayName: string;
  planetColor: number;
}

// Sound effects
export type SFXType = 'starCollect' | 'rainbowCollect' | 'meteoriteHit' | 'boost' | 'stageClear' | 'boostReady';

// Save data
export interface SaveData {
  clearedStage: number;
}
