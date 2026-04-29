import * as THREE from 'three';
import { GameLoop } from './game/GameLoop';
import { SceneManager } from './game/SceneManager';
import { InputSystem } from './game/systems/InputSystem';
import { TitleScene } from './game/scenes/TitleScene';
import { StageScene } from './game/scenes/StageScene';
import { EndingScene } from './game/scenes/EndingScene';
import { SaveManager } from './game/storage/SaveManager';
import { AudioManager } from './game/audio/AudioManager';
import { AdaptivePixelRatioController } from './game/utils/AdaptivePixelRatioController';
import { TOTAL_STAGES } from './game/config/StageConfig';
import { createResizeCoalescer } from './game/utils/ResizeCoalescer';
import type { SceneType, SceneContext } from './types';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const maxPixelRatio = Math.min(window.devicePixelRatio, 2);
const PIXEL_RATIO_TIERS = [1.0, 1.5, maxPixelRatio];
const MAX_TIER = PIXEL_RATIO_TIERS.length - 1;

let lastAppliedWidth = 0;
let lastAppliedHeight = 0;

// Construct early so applyRendererSize() can safely reference it during the
// initial applyPixelRatioTier() call below. SceneManager's constructor has
// no side effects; on iOS WebKit, the bundler-minified output of `const`
// hoisting + early access produced a TDZ "Cannot access 'X' before
// initialization" runtime error when sceneManager was declared after this
// point (caught by Playwright smoke test on iPad emulation).
const sceneManager = new SceneManager();

function applyRendererSize(width: number, height: number): void {
  if (width !== lastAppliedWidth || height !== lastAppliedHeight) {
    renderer.setSize(width, height);
    lastAppliedWidth = width;
    lastAppliedHeight = height;
  }
  const camera = sceneManager.getCurrentCamera();
  if (camera instanceof THREE.PerspectiveCamera) {
    const aspect = width / height;
    if (camera.aspect !== aspect) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
  }
}

function applyPixelRatioTier(tier: number): void {
  const clamped = Math.max(0, Math.min(MAX_TIER, tier));
  renderer.setPixelRatio(PIXEL_RATIO_TIERS[clamped]);
  // Force re-apply: pixel ratio change requires setSize even if dimensions match.
  lastAppliedWidth = 0;
  lastAppliedHeight = 0;
  applyRendererSize(window.innerWidth, window.innerHeight);
}

applyPixelRatioTier(MAX_TIER);
const pixelRatioController = new AdaptivePixelRatioController(MAX_TIER, applyPixelRatioTier);
renderer.setSize(window.innerWidth, window.innerHeight);
lastAppliedWidth = window.innerWidth;
lastAppliedHeight = window.innerHeight;
renderer.setClearColor(0x000020);

const inputSystem = new InputSystem();
inputSystem.setup(canvas);

const gameLoop = new GameLoop();
const saveManager = new SaveManager();
const audioManager = new AudioManager();

// Session management: detect Safari swipe termination
if (saveManager.isFreshSession()) {
  saveManager.clear();
}

// Restore persisted mute state before any audio is initialised so the very
// first BGM/SFX honours it without an audible blip.
audioManager.setMuted(saveManager.load().muted === true);

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
    saveData.clearedStage = Math.max(saveData.clearedStage, TOTAL_STAGES);
    if (!saveData.unlockedPlanets.includes(TOTAL_STAGES)) {
      saveData.unlockedPlanets.push(TOTAL_STAGES);
    }
    saveManager.save(saveData);
  }
  sceneManager.transitionTo(sceneType, context);
});

// Start from title
sceneManager.transitionTo('title');

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
  (fps: number) => {
    pixelRatioController.sample(fps, performance.now());
  },
);

// Handle resize - coalesce via rAF to avoid WebGL framebuffer reallocation
// thrash on iPad Safari URL bar show/hide (Constitution IV: 60fps).
const resizeCoalescer = createResizeCoalescer((w, h) => applyRendererSize(w, h));
function scheduleResize(): void {
  resizeCoalescer.schedule(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', scheduleResize);
window.addEventListener('orientationchange', scheduleResize);

// Auto-pause on background (T053 early integration)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    gameLoop.pause();
    audioManager.suspend();
  } else {
    gameLoop.resume();
    audioManager.ensureResumed();
    pixelRatioController.notifyResume(performance.now());
    // Re-sync size in case viewport changed while in background.
    resizeCoalescer.schedule(window.innerWidth, window.innerHeight);
    resizeCoalescer.flush();
  }
});
