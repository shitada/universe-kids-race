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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000020);

const inputSystem = new InputSystem();
inputSystem.setup(canvas);

const sceneManager = new SceneManager();
const gameLoop = new GameLoop();
const saveManager = new SaveManager();
const audioManager = new AudioManager();

// Session management: detect Safari swipe termination
const SESSION_KEY = 'universe-kids-race-session';
if (!sessionStorage.getItem(SESSION_KEY)) {
  saveManager.clear();
}
sessionStorage.setItem(SESSION_KEY, 'active');

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
  }
});
