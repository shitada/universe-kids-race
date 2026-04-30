import type { AdaptivePixelRatioController } from './AdaptivePixelRatioController';

/**
 * Dependencies for the WebGL context-restored handler. Kept as plain
 * interfaces (no Three.js / DOM imports) so the helper can be unit-tested
 * with stubs in jsdom.
 */
export interface WebGLContextRestoredHandlerDeps {
  pixelRatioController: Pick<AdaptivePixelRatioController, 'reset' | 'notifyResume'>;
  applyPixelRatioTier: (tier: number) => void;
  maxTier: number;
  getViewportSize: () => { width: number; height: number };
  scheduleResize: (width: number, height: number) => void;
  flushResize: () => void;
  gameLoopResume: () => void;
  audioEnsureResumed: () => void;
  hideOverlay: () => void;
  now: () => number;
}

/**
 * Build the callback used as `onRestored` for createWebGLContextLossHandler.
 *
 * Why a dedicated helper (mirrors createSceneTransitionHandler):
 * - When the renderer's pixel ratio is forced back to MAX_TIER on context
 *   restore, the AdaptivePixelRatioController's `currentTier` must also be
 *   reset. Otherwise the controller still believes it is on the
 *   pre-context-loss downscaled tier (e.g. 0), which causes:
 *     (a) spurious onTierChange spam back up to MAX_TIER once FPS recovers, or
 *     (b) attempted single-step downscale from `currentTier - 1`, collapsing
 *         straight to the lowest quality instead of MAX_TIER -> MAX_TIER - 1.
 *   `pixelRatioController.reset()` MUST be called before
 *   `applyPixelRatioTier(maxTier)` and before `notifyResume(now())` to keep
 *   the controller and renderer in sync (Constitution IV: 60fps adaptive
 *   pixel-ratio control).
 *
 * Order of operations (matches createSceneTransitionHandler's title path):
 *   hideOverlay -> pixelRatioController.reset
 *               -> applyPixelRatioTier(maxTier)
 *               -> scheduleResize(viewport) + flushResize
 *               -> gameLoopResume
 *               -> audioEnsureResumed
 *               -> pixelRatioController.notifyResume(now())
 */
export function createWebGLContextRestoredHandler(
  deps: WebGLContextRestoredHandlerDeps,
): () => void {
  const {
    pixelRatioController,
    applyPixelRatioTier,
    maxTier,
    getViewportSize,
    scheduleResize,
    flushResize,
    gameLoopResume,
    audioEnsureResumed,
    hideOverlay,
    now,
  } = deps;

  return () => {
    hideOverlay();
    pixelRatioController.reset();
    applyPixelRatioTier(maxTier);
    const { width, height } = getViewportSize();
    scheduleResize(width, height);
    flushResize();
    gameLoopResume();
    audioEnsureResumed();
    pixelRatioController.notifyResume(now());
  };
}
