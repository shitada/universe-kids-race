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

export type VibrationPattern = number | number[];
export type VibrationIntensity = 'off' | 'weak' | 'medium' | 'strong';

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

export type StageAtmosphereParticlePattern =
  | 'sparkle'
  | 'mist'
  | 'dust'
  | 'ember'
  | 'ring'
  | 'aurora'
  | 'crystal'
  | 'flare'
  | 'homecoming';

export interface StageAtmosphereConfig {
  stageNumber: number;
  gradientTopColor: number;
  gradientBottomColor: number;
  particlePrimaryColor: number;
  particleSecondaryColor: number;
  particlePattern: StageAtmosphereParticlePattern;
  particleCount: number;
  particleSize: number;
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
  | 'shootingStarCollect'
  | 'cometCollect'
  | 'meteorShowerStart'
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

export interface VibrationSettings {
  intensity: VibrationIntensity;
}

export const SPACESHIP_COLOR_KEYS = ['sky', 'sunset', 'aqua'] as const;
export type SpaceshipColorKey = (typeof SPACESHIP_COLOR_KEYS)[number];

export interface SpaceshipCustomization {
  bodyColor: SpaceshipColorKey;
  noseColor: SpaceshipColorKey;
  wingColor: SpaceshipColorKey;
}

export const DEFAULT_SPACESHIP_CUSTOMIZATION: SpaceshipCustomization = {
  bodyColor: 'sky',
  noseColor: 'sunset',
  wingColor: 'aqua',
};

export interface GameplayStats {
  totalPlayTimeSeconds: number;
  totalStarsCollected: number;
  totalBoostUses: number;
  stageClearCounts: Record<number, number>;
}

export interface SaveData {
  clearedStage: number;
  unlockedPlanets: number[];
  muted?: boolean;
  colorAccessibility?: ColorAccessibilitySettings;
  vibrationSettings?: VibrationSettings;
  bestStageStars?: Record<number, number>;
  discoveredConstellations?: number[];
  discoveredSpecialStars?: SpecialShootingStarType[];
  gameplayStats?: GameplayStats;
  spaceshipCustomization?: SpaceshipCustomization;
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

export const SPECIAL_SHOOTING_STAR_TYPES = ['rainbow', 'gold', 'silver'] as const;
export type SpecialShootingStarType = (typeof SPECIAL_SHOOTING_STAR_TYPES)[number];

export interface SpecialStarEncyclopediaEntry {
  id: SpecialShootingStarType;
  name: string;
  reading: string;
  encyclopediaLabel: string;
  emoji: string;
  trivia: string;
  accentColor: number;
}

export interface ConstellationPoint {
  x: number;
  y: number;
  z: number;
}

export interface ConstellationDefinition {
  id: string;
  stageNumber: number;
  name: string;
  reading: string;
  encyclopediaLabel: string;
  hintMessage: string;
  celebrationMessage: string;
  points: readonly ConstellationPoint[];
}

export type StageSpecialEffectStyle =
  | 'rabbit'
  | 'twinkle'
  | 'veil'
  | 'dust'
  | 'halo'
  | 'ring'
  | 'aurora'
  | 'bubble'
  | 'crystal'
  | 'flare'
  | 'homecoming';

export interface StageSpecialEventConfig {
  stageNumber: number;
  id: string;
  style: StageSpecialEffectStyle;
  startProgress: number;
  duration: number;
  message: string;
  accentColor: number;
}

export interface StageSpecialEventState {
  active: boolean;
  started: boolean;
  ended: boolean;
  timeRemaining: number;
  event: StageSpecialEventConfig | null;
}
