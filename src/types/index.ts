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
export type SpeedState = 'NORMAL' | 'BOOST' | 'SLOWDOWN' | 'RECOVERING';

// Star types
export type StarType = 'NORMAL' | 'RAINBOW';

// Input
export interface InputState {
  moveDirection: -1 | 0 | 1;
  boostPressed: boolean;
}

export type AssistDirection = 'left' | 'right';

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
export type SFXType =
  | 'starCollect'
  | 'rainbowCollect'
  | 'meteoriteHit'
  | 'boost'
  | 'stageClear'
  | 'boostReady'
  | 'boostDenied'
  | 'countdownTick'
  | 'countdownGo';

// Save data
export interface SaveData {
  clearedStage: number;
  unlockedPlanets: number[];
  muted?: boolean;
  bestStageStars?: Record<number, number>;
  // Last stable adaptive pixel-ratio tier observed in the previous session.
  // Persisted so the next launch can start at the same tier and avoid the
  // initial-frame downscale hitch on slower iPads (Constitution IV).
  lastStablePixelTier?: number;
  // Set to true after the player has dismissed the first-run tutorial overlay
  // on the title screen. When false / missing, TitleScene auto-shows the
  // TutorialOverlay once on entry to introduce controls to new players.
  tutorialShown?: boolean;
}

// Planet encyclopedia
export type CompanionShape = 'basic' | 'ringed' | 'radiant' | 'horned' | 'icy' | 'bubble';

export interface PlanetEncyclopediaEntry {
  stageNumber: number;
  name: string;
  emoji: string;
  trivia: string;
  planetColor: number;
  companionShape: CompanionShape;
}
