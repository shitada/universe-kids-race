import type { AdaptivePixelRatioController } from './AdaptivePixelRatioController';

/**
 * Dependencies for the WebGL context-restored handler. Kept as plain
 * interfaces (no Three.js / DOM imports) so the helper can be unit-tested
 * with stubs in jsdom.
 */
export interface WebGLContextRestoredHandlerDeps {
  pixelRatioController: Pick<AdaptivePixelRatioController, 'resetToTier' | 'notifyResume'>;
  applyPixelRatioTier: (tier: number) => void;
  maxTier: number;
  getRestoreTier: () => number;
  syncVisualQualityTier: (tier: number) => void;
  getViewportSize: () => { width: number; height: number };
  scheduleResize: (width: number, height: number) => void;
  flushResize: () => void;
  gameLoopResume: () => void;
  audioEnsureResumed: () => void;
  hideOverlay: () => void;
  onRecovered?: () => void;
  now: () => number;
}

/**
 * Build the callback used as `onRestored` for createWebGLContextLossHandler.
 *
 * Why a dedicated helper (mirrors createSceneTransitionHandler):
 * - WebGL context restore must re-apply the renderer framebuffer, StageScene
 *   visual tier, and AdaptivePixelRatioController's internal tier to the same
 *   already-learned stable tier instead of always jumping back to MAX_TIER.
 *   Otherwise slower iPads can hit another memory / FPS spike immediately
 *   after recovering from a blackout.
 * - `pixelRatioController.resetToTier(restoreTier)` MUST be called before
 *   `applyPixelRatioTier(restoreTier)` and before `notifyResume(now())` to
 *   keep the controller and renderer in sync (Constitution IV: 60fps adaptive
 *   pixel-ratio control).
 *
 * Order of operations (matches createSceneTransitionHandler's title path):
 *   hideOverlay -> pixelRatioController.resetToTier(restoreTier)
 *               -> applyPixelRatioTier(restoreTier)
 *               -> syncVisualQualityTier(restoreTier)
 *               -> scheduleResize(viewport) + flushResize
 *               -> gameLoopResume
 *               -> audioEnsureResumed
 *               -> onRecovered
 *               -> pixelRatioController.notifyResume(now())
 */
export function createWebGLContextRestoredHandler(
  deps: WebGLContextRestoredHandlerDeps,
): () => void {
  const {
    pixelRatioController,
    applyPixelRatioTier,
    maxTier,
    getRestoreTier,
    syncVisualQualityTier,
    getViewportSize,
    scheduleResize,
    flushResize,
    gameLoopResume,
    audioEnsureResumed,
    hideOverlay,
    onRecovered,
    now,
  } = deps;

  return () => {
    const restoreTierRaw = getRestoreTier();
    const restoreTier = Number.isFinite(restoreTierRaw)
      ? Math.max(0, Math.min(maxTier, Math.floor(restoreTierRaw)))
      : maxTier;
    hideOverlay();
    pixelRatioController.resetToTier(restoreTier);
    applyPixelRatioTier(restoreTier);
    syncVisualQualityTier(restoreTier);
    const { width, height } = getViewportSize();
    scheduleResize(width, height);
    flushResize();
    gameLoopResume();
    audioEnsureResumed();
    onRecovered?.();
    pixelRatioController.notifyResume(now());
  };
}
