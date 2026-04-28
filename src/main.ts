import * as THREE from 'three';
import { GameLoop } from './game/GameLoop';
import { SceneManager } from './game/SceneManager';
import { InputSystem } from './game/systems/InputSystem';
import { TitleScene } from './game/scenes/TitleScene';
import { StageScene } from './game/scenes/StageScene';
import { EndingScene } from './game/scenes/EndingScene';
import { SaveManager } from './game/storage/SaveManager';
import { AudioManager } from './game/audio/AudioManager';
import type { SceneType, SceneContext } from './types';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
const PIXEL_RATIO_TIERS = [1.0, 1.5, maxPixelRatio];
const MAX_TIER = PIXEL_RATIO_TIERS.length - 1;
let currentTier = MAX_TIER;

function applyPixelRatioTier(tier: number): void {
  const clamped = Math.max(0, Math.min(MAX_TIER, tier));
  currentTier = clamped;
  renderer.setPixelRatio(PIXEL_RATIO_TIERS[clamped]);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

applyPixelRatioTier(MAX_TIER);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000020);

const inputSystem = new InputSystem();
inputSystem.setup(canvas);

const sceneManager = new SceneManager();
const gameLoop = new GameLoop();
const saveManager = new SaveManager();
const audioManager = new AudioManager();

// Session management: detect Safari swipe termination
if (saveManager.isFreshSession()) {
  saveManager.clear();
}

const titleScene = new TitleScene(sceneManager, saveManager, audioManager);
const stageScene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
const endingScene = new EndingScene(sceneManager, saveManager, audioManager);

sceneManager.registerScene('title', titleScene);
sceneManager.registerScene('stage', stageScene);
sceneManager.registerScene('ending', endingScene);

sceneManager.setTransitionHandler((sceneType: SceneType, context?: SceneContext) => {
  // Save progress when transitioning to next stage or ending
  if (sceneType === 'stage' && context?.stageNumber && context.stageNumber > 1) {
    const clearedStageNumber = context.stageNumber - 1;
    const saveData = saveManager.load();
    saveData.clearedStage = Math.max(saveData.clearedStage, clearedStageNumber);
    if (!saveData.unlockedPlanets.includes(clearedStageNumber)) {
      saveData.unlockedPlanets.push(clearedStageNumber);
    }
    saveManager.save(saveData);
  } else if (sceneType === 'ending') {
    const saveData = saveManager.load();
    saveData.clearedStage = Math.max(saveData.clearedStage, 11);
    if (!saveData.unlockedPlanets.includes(11)) {
      saveData.unlockedPlanets.push(11);
    }
    saveManager.save(saveData);
  }
  sceneManager.transitionTo(sceneType, context);
});

// Start from title
sceneManager.transitionTo('title');

// Adaptive pixel ratio scaling thresholds (Constitution IV: maintain 60fps on iPad Safari).
const FPS_DOWNSCALE_THRESHOLD = 50;
const FPS_UPSCALE_THRESHOLD = 58;
const DOWNSCALE_SUSTAIN_MS = 1500;
const UPSCALE_SUSTAIN_MS = 3000;
const TIER_CHANGE_COOLDOWN_MS = 2000;
const RESUME_GRACE_MS = 1000;

let lowFpsSince: number | null = null;
let highFpsSince: number | null = null;
let lastTierChangeAt = 0;
let resumeGraceUntil = 0;

function handleFpsSample(fps: number): void {
  const now = performance.now();
  if (now < resumeGraceUntil) {
    lowFpsSince = null;
    highFpsSince = null;
    return;
  }
  if (now - lastTierChangeAt < TIER_CHANGE_COOLDOWN_MS) {
    return;
  }

  if (fps < FPS_DOWNSCALE_THRESHOLD) {
    highFpsSince = null;
    if (lowFpsSince === null) lowFpsSince = now;
    if (now - lowFpsSince >= DOWNSCALE_SUSTAIN_MS && currentTier > 0) {
      applyPixelRatioTier(currentTier - 1);
      lastTierChangeAt = now;
      lowFpsSince = null;
    }
  } else if (fps >= FPS_UPSCALE_THRESHOLD) {
    lowFpsSince = null;
    if (highFpsSince === null) highFpsSince = now;
    if (now - highFpsSince >= UPSCALE_SUSTAIN_MS && currentTier < MAX_TIER) {
      applyPixelRatioTier(currentTier + 1);
      lastTierChangeAt = now;
      highFpsSince = null;
    }
  } else {
    lowFpsSince = null;
    highFpsSince = null;
  }
}

gameLoop.start(
  (deltaTime: number) => {
    sceneManager.update(deltaTime);
  },
  () => {
    const scene = sceneManager.getCurrentThreeScene();
    const camera = sceneManager.getCurrentCamera();
    if (scene && camera) {
      renderer.render(scene, camera);
    }
  },
  handleFpsSample,
);

// Handle resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  const camera = sceneManager.getCurrentCamera();
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
});

// Auto-pause on background (T053 early integration)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gameLoop.pause();
    audioManager.suspend();
  } else {
    gameLoop.resume();
    audioManager.ensureResumed();
    resumeGraceUntil = performance.now() + RESUME_GRACE_MS;
    lowFpsSince = null;
    highFpsSince = null;
  }
});
