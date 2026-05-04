import type * as THREE from 'three';

// Scene types
export type SceneType = 'title' | 'stage' | 'ending';

export interface SceneContext {
  stageNumber?: number;
  totalScore?: number;
  totalStarCount?: number;
  launchSource?: 'campaign' | 'encyclopedia';
  replayToken?: number;
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
  destinationReading: string;
  stageLength: number;
  meteoriteInterval: number;
  starDensity: number;
  medalThresholds: readonly [number, number, number];
  emoji: string;
  displayName: string;
  planetColor: number;
}

export type StageMedalTier = 'none' | 'bronze' | 'silver' | 'gold';
export type StageMedalGoalTier = Exclude<StageMedalTier, 'none'>;

export interface StageMedalSlot {
  tier: StageMedalGoalTier;
  icon: string;
  threshold: number;
  reached: boolean;
}

export interface StageMedalStatus {
  tier: StageMedalTier;
  icon: string;
  stars: number;
  earnedCount: 0 | 1 | 2 | 3;
  thresholds: readonly [number, number, number];
  slots: readonly StageMedalSlot[];
  nextTier: StageMedalGoalTier | null;
  nextThreshold: number | null;
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
export interface ColorAccessibilitySettings {
  highContrast: boolean;
}

export interface SaveData {
  clearedStage: number;
  unlockedPlanets: number[];
  muted?: boolean;
  colorAccessibility?: ColorAccessibilitySettings;
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
  reading: string;
  encyclopediaLabel: string;
  emoji: string;
  trivia: string;
  planetColor: number;
  companionShape: CompanionShape;
}
