import type { SceneType, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { AdaptivePixelRatioController } from './AdaptivePixelRatioController';

/**
 * Dependencies for the scene transition handler. Kept as plain interfaces
 * (no Three.js imports) so the helper can be unit-tested with stubs.
 */
export interface SceneTransitionHandlerDeps {
  sceneManager: Pick<SceneManager, 'transitionTo'>;
  pixelRatioController: Pick<AdaptivePixelRatioController, 'reset' | 'notifyResume'>;
  applyPixelRatioTier: (tier: number) => void;
  maxTier: number;
  now: () => number;
}

export type SceneTransitionHandler = (sceneType: SceneType, context?: SceneContext) => void | Promise<void>;

/**
 * Build the transition handler used by SceneManager.setTransitionHandler.
 *
 * Behaviour:
 * - When transitioning to title, reset the adaptive pixel-ratio controller
 *   to the maximum tier and re-apply the renderer pixel ratio so subsequent
 *   stages can re-evaluate from the highest quality (Constitution IV: avoid
 *   unnecessary downscale lock-in across scenes).
 * - For non-title transitions (stage / ending), notify the pixel-ratio
 *   controller of a resume so its grace period excludes the inevitable
 *   one-shot initialisation hitches (geometry/material allocation, spawn
 *   pool rebuild) of the new scene from FPS sampling. Without this, those
 *   hitches can pass FrameRateMonitor's spike filter and trigger an
 *   unwarranted downscale countdown (Constitution IV: avoid unnecessary
 *   permanent downscale lock-in caused by transient transition hitches).
 * - Always delegates the actual scene swap to sceneManager.transitionTo.
 */
export function createSceneTransitionHandler(deps: SceneTransitionHandlerDeps): SceneTransitionHandler {
  const {
    sceneManager,
    pixelRatioController,
    applyPixelRatioTier,
    maxTier,
    now,
  } = deps;

  return (sceneType: SceneType, context?: SceneContext) => {
    if (sceneType === 'title') {
      // Returning to the lightweight title screen is a safe point to recover
      // any pixel-ratio downscale that occurred during a heavy stage so the
      // next stage attempt starts from maximum quality.
      pixelRatioController.reset();
      applyPixelRatioTier(maxTier);
      pixelRatioController.notifyResume(now());
    }

    if (sceneType !== 'title') {
      // All non-title transitions (stage 1, stage > 1, ending) incur a
      // brief one-shot initialisation hitch in the new scene. Trigger the
      // controller's resume-grace so those frames are excluded from the
      // adaptive pixel-ratio FPS sampling window. The title branch above
      // already calls notifyResume after reset, so we deliberately skip
      // a second call here to avoid duplicate invocation.
      pixelRatioController.notifyResume(now());
    }

    return sceneManager.transitionTo(sceneType, context);
  };
}
