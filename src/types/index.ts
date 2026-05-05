import type * as THREE from 'three';

// Scene types
export type SceneType = 'title' | 'stage' | 'freePlay' | 'ending';

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
export const MOTION_SENSITIVITY_LEVELS = ['strong', 'medium', 'gentle', 'minimal'] as const;
export type MotionSensitivity = (typeof MOTION_SENSITIVITY_LEVELS)[number];
export const COLOR_VISION_SUPPORT_MODES = ['color-only', 'color-and-marks'] as const;
export type ColorVisionSupportMode = (typeof COLOR_VISION_SUPPORT_MODES)[number];
export type Language = 'ja' | 'en';

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
  | 'constellationCelebrate'
  | 'shootingStarCollect'
  | 'cometCollect'
  | 'meteorShowerStart'
  | 'meteoriteHit'
  | 'boost'
  | 'stageClear'
  | 'boostReady'
  | 'boostDenied'
  | 'countdownTick'
  | 'countdownGo'
  | 'wormhole';

export interface WormholeTunnelConfig {
  sourceColor: number;
  targetColor: number;
  duration: number;
  particleCount: number;
  rayCount: number;
}

// Save data
export interface ColorAccessibilitySettings {
  highContrast?: boolean;
  motionSensitivity?: MotionSensitivity;
  colorVisionSupportMode?: ColorVisionSupportMode;
}

export const AUDIO_VOLUME_LEVELS = [0, 25, 50, 75, 100] as const;
export type AudioVolumeLevel = (typeof AUDIO_VOLUME_LEVELS)[number];

export interface AudioSettings {
  bgmVolume?: AudioVolumeLevel;
  sfxVolume?: AudioVolumeLevel;
}

export interface VibrationSettings {
  intensity: VibrationIntensity;
}

export interface RestReminderSettings {
  enabled: boolean;
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
  audioSettings?: AudioSettings;
  colorAccessibility?: ColorAccessibilitySettings;
  vibrationSettings?: VibrationSettings;
  restReminderSettings?: RestReminderSettings;
  bestStageStars?: Record<number, number>;
  discoveredConstellations?: number[];
  discoveredSpecialStars?: SpecialShootingStarType[];
  discoveredMonthlyEncounters?: MonthlyEncounterId[];
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
  language?: Language;
}

// Planet encyclopedia
export type CompanionShape = 'basic' | 'ringed' | 'radiant' | 'horned' | 'icy' | 'bubble';

export interface PlanetEncyclopediaEntry {
  stageNumber: number;
  name: string;
  reading: string;
  encyclopediaLabel: string;
  identityMark: string;
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

export const MONTHLY_ENCOUNTER_IDS = [
  'new-year-comet',
  'heart-nebula',
  'spring-ribbon',
  'rainbow-seed',
  'emerald-comet',
  'rainy-jelly',
  'tanabata-stream',
  'starlight-whale',
  'harvest-lantern',
  'pumpkin-nebula',
  'crystal-comet',
  'geminid-rain',
] as const;
export type MonthlyEncounterId = (typeof MONTHLY_ENCOUNTER_IDS)[number];

export interface MonthlyEncounterEncyclopediaEntry {
  id: MonthlyEncounterId;
  month: number;
  name: string;
  reading: string;
  encyclopediaLabel: string;
  emoji: string;
  trivia: string;
  encounterMessage: string;
  accentColor: number;
  scoreBonus: number;
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

export type SeasonalEventId = 'sakura' | 'tanabata' | 'christmas' | 'new-year';

export interface SeasonalEventConfig {
  id: SeasonalEventId;
  title: string;
  emoji: string;
  noticeMessage: string;
  accentColor: number;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
}

export type SpaceWeatherEventId = 'meteor-shower' | 'aurora-storm' | 'comet-approach';

export interface SpaceWeatherEventConfig {
  id: SpaceWeatherEventId;
  title: string;
  message: string;
  accentColor: number;
  duration: number;
  starScoreMultiplier: number;
}

export interface SpaceWeatherEventState {
  active: boolean;
  started: boolean;
  ended: boolean;
  timeRemaining: number;
  event: SpaceWeatherEventConfig | null;
}
