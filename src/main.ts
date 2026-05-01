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
import { createSceneTransitionHandler } from './game/utils/createSceneTransitionHandler';
import { createWebGLContextLossHandler } from './game/utils/createWebGLContextLossHandler';
import { createVisibilityPauseHandler } from './game/utils/createVisibilityPauseHandler';
import { createRenderer } from './game/utils/createRenderer';
import { getViewportSize, subscribeViewportResize } from './game/utils/getViewportSize';
import { resolveInitialPixelTier } from './game/utils/resolveInitialPixelTier';
import { ContextLossOverlay } from './ui/ContextLossOverlay';
import { ResumeOverlay } from './ui/ResumeOverlay';
import { OrientationHintOverlay } from './ui/OrientationHintOverlay';
import { createOrientationHintHandler } from './game/utils/createOrientationHintHandler';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;

const renderer = createRenderer(canvas);
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
// Construct InputSystem early as well: applyRendererSize() references it via
// notifyResize() during the initial applyPixelRatioTier() call below. Same
// TDZ avoidance pattern as sceneManager above. setup() is deferred until the
// rest of the systems are wired.
const inputSystem = new InputSystem();

function applyRendererSize(width: number, height: number): void {
  if (width !== lastAppliedWidth || height !== lastAppliedHeight) {
    renderer.setSize(width, height);
    lastAppliedWidth = width;
    lastAppliedHeight = height;
    // Keep InputSystem's cached canvas width in sync to avoid forced reflow
    // on every pointermove (Constitution III/IV: iPad Safari touch latency).
    inputSystem.notifyResize(canvas.clientWidth);
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
  const { width: w0, height: h0 } = getViewportSize();
  applyRendererSize(w0, h0);
}

const saveManager = new SaveManager();

// Session management: detect Safari swipe termination. Run before reading the
// persisted pixel-ratio tier so a stale value is not preserved into a fresh
// session — though resetSessionDataPreservingMuted does intentionally keep
// the tier as a performance hint, not progress data.
if (saveManager.isFreshSession()) {
  saveManager.resetSessionDataPreservingMuted();
}

// Restore previous session's stable adaptive pixel-ratio tier (if any) so
// slower iPads do not need to re-discover the downscale on every launch
// (Constitution IV: 60fps on iPad Safari). Resolved before the first
// applyPixelRatioTier() call so we configure the renderer's framebuffer
// exactly once at cold start instead of allocating at MAX_TIER and then
// immediately reallocating at the persisted lower tier (PR #130 follow-up).
const initialPixelTier = resolveInitialPixelTier(
  saveManager.load().lastStablePixelTier,
  MAX_TIER,
);

applyPixelRatioTier(initialPixelTier);

// Track the last-applied tier so onTierChange can persist only on downscale.
// Held in a closure-friendly mutable object so the controller's onTierChange
// callback (declared in the same scope as the controller itself) can mutate it.
const lastAppliedTier = { value: initialPixelTier };

const pixelRatioController = new AdaptivePixelRatioController(
  MAX_TIER,
  (newTier: number) => {
    applyPixelRatioTier(newTier);
    // Persist downscales immediately so the next launch starts at the lower
    // tier. Upscales are not persisted: the existing upscale heuristic will
    // rediscover them naturally on the next session if conditions allow.
    if (newTier < lastAppliedTier.value) {
      saveManager.saveLastStablePixelTier(newTier);
    }
    lastAppliedTier.value = newTier;
  },
  {},
  initialPixelTier,
);
renderer.setClearColor(0x000020);

inputSystem.setup(canvas);

const gameLoop = new GameLoop();
const audioManager = new AudioManager();

// Restore persisted mute state before any audio is initialised so the very
// first BGM/SFX honours it without an audible blip.
audioManager.setMuted(saveManager.load().muted === true);

const titleScene = new TitleScene(sceneManager, saveManager, audioManager);
const stageScene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
const endingScene = new EndingScene(sceneManager, saveManager, audioManager);

sceneManager.registerScene('title', titleScene);
sceneManager.registerScene('stage', stageScene);
sceneManager.registerScene('ending', endingScene);

sceneManager.setTransitionHandler(
  createSceneTransitionHandler({
    sceneManager,
    saveManager,
    pixelRatioController,
    applyPixelRatioTier,
    maxTier: MAX_TIER,
    totalStages: TOTAL_STAGES,
    now: () => performance.now(),
  }),
);

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
// Subscribes to both window and visualViewport events; the latter is needed
// for iPad Safari to react promptly to URL bar show/hide (window.resize is
// delayed/suppressed in that case). Duplicate dispatches are absorbed by the
// coalescer's rAF batching and "same size" guard.
const resizeCoalescer = createResizeCoalescer((w, h) => applyRendererSize(w, h));
function scheduleResize(): void {
  const { width, height } = getViewportSize();
  resizeCoalescer.schedule(width, height);
}
subscribeViewportResize(window, scheduleResize);

// Resume the game loop / audio. Idempotent: safe to call from multiple
// visibility-restore signals (visibilitychange, bfcache pageshow, focus).
function resumeGame(): void {
  gameLoop.resume();
  audioManager.ensureResumed();
}

// Re-sync viewport / pixel ratio after returning from background. Cosmetic
// only; runs immediately on every restore signal regardless of scene because
// it does not affect gameplay state.
function refreshViewportAfterRestore(): void {
  pixelRatioController.notifyResume(performance.now());
  const { width, height } = getViewportSize();
  resizeCoalescer.schedule(width, height);
  resizeCoalescer.flush();
}

// Tap-to-resume overlay (Constitution I: 子供が戻ってきたとき隕石にぶつかる
// 前にタップで再開できる)。Stage シーン以外では即時自動再開する。
const resumeOverlay = new ResumeOverlay();

// True while the device is held in portrait. Suppresses the ResumeOverlay
// so that the orientation hint takes priority and we don't double-stack
// pause prompts when the user simply rotated the iPad (Constitution III).
let isPortraitLocked = false;

// True while a background-induced pause has not yet been "consumed" by a
// ResumeOverlay tap (or by an immediate auto-resume in non-stage scenes).
// Needed so a portrait→landscape rotation that happens AFTER the page is
// re-shown still routes through ResumeOverlay (Constitution I: prevent the
// child from being thrown straight back into the meteor shower). When the
// pause was caused purely by rotation, this stays false and onLandscape
// resumes immediately to avoid a double countdown (spec 011).
let pendingBackgroundResume = false;

function showStageResumeOverlay(): void {
  resumeOverlay.show(() => {
    pendingBackgroundResume = false;
    resumeGame();
    stageScene.requestResumeCountdown();
  });
}

function handleVisibilityRestore(): void {
  refreshViewportAfterRestore();
  if (isPortraitLocked) {
    // Stay paused until landscape is restored; orientation hint owns the UI.
    // Keep `pendingBackgroundResume` set so onLandscape can route through
    // ResumeOverlay instead of resuming silently.
    return;
  }
  if (sceneManager.getCurrentType() === 'stage' && gameLoop.isPaused()) {
    showStageResumeOverlay();
  } else {
    resumeOverlay.hide();
    pendingBackgroundResume = false;
    resumeGame();
  }
}

// Auto-pause on visibilitychange / pagehide / blur, auto-resume (or show
// overlay) on visibilitychange / bfcache pageshow / focus.
createVisibilityPauseHandler({
  onHide: () => {
    pendingBackgroundResume = true;
    gameLoop.pause();
    audioManager.suspend();
  },
  onShow: handleVisibilityRestore,
});

// Orientation hint (Constitution III/V: iPad Safari is the only target and
// must be played in landscape). When the device is rotated to portrait we
// pause the loop, hide any ResumeOverlay, and show a kid-friendly hint;
// rotating back to landscape removes the hint and resumes cleanly.
const orientationHintOverlay = new OrientationHintOverlay();
const orientationHintHandler = createOrientationHintHandler({
  onPortrait: () => {
    isPortraitLocked = true;
    // Always hide ResumeOverlay so we don't end up with two stacked prompts.
    resumeOverlay.hide();
    orientationHintOverlay.show();
    gameLoop.pause();
    audioManager.suspend();
  },
  onLandscape: () => {
    if (!isPortraitLocked) return;
    isPortraitLocked = false;
    orientationHintOverlay.hide();
    // Re-sync viewport / pixel ratio: rotating changes both.
    refreshViewportAfterRestore();
    // If a backgrounded pause is still un-consumed (the page was hidden,
    // came back in portrait, and is only now landscape again), the safe
    // thing is to route through ResumeOverlay so the child taps before
    // the meteor shower resumes (Constitution I). Otherwise the pause was
    // caused purely by the rotation itself and we resume immediately to
    // avoid a double countdown (spec 011 / acceptance criterion 2).
    if (
      pendingBackgroundResume &&
      sceneManager.getCurrentType() === 'stage' &&
      gameLoop.isPaused()
    ) {
      showStageResumeOverlay();
    } else {
      pendingBackgroundResume = false;
      resumeGame();
    }
  },
});
// Synchronous initial check so a portrait boot shows the hint before the
// first rendered frame.
orientationHintHandler.evaluate();

// WebGL context loss recovery (iPad Safari background/memory pressure).
// Without this, the canvas freezes black with no path back. We pause the
// loop, show a kid-friendly reload overlay, and if the browser does fire
// `webglcontextrestored` we re-apply pixel ratio and resume cleanly.
const contextLossOverlay = new ContextLossOverlay();
createWebGLContextLossHandler(canvas, {
  onLost: () => {
    gameLoop.pause();
    audioManager.suspend();
    contextLossOverlay.show(() => {
      window.location.reload();
    });
  },
  onRestored: () => {
    contextLossOverlay.hide();
    pixelRatioController.reset();
    applyPixelRatioTier(MAX_TIER);
    lastAppliedTier.value = MAX_TIER;
    handleVisibilityRestore();
  },
});
