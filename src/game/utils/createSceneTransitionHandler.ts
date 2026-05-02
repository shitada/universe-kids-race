import type { SceneType, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { AdaptivePixelRatioController } from './AdaptivePixelRatioController';

/**
 * Dependencies for the scene transition handler. Kept as plain interfaces
 * (no Three.js imports) so the helper can be unit-tested with stubs.
 */
export interface SceneTransitionHandlerDeps {
  sceneManager: Pick<SceneManager, 'transitionTo'>;
  pixelRatioController: Pick<AdaptivePixelRatioController, 'notifyResume'>;
  now: () => number;
}

export type SceneTransitionHandler = (sceneType: SceneType, context?: SceneContext) => void | Promise<void>;

/**
 * Build the transition handler used by SceneManager.setTransitionHandler.
 *
 * Behaviour:
 * - For every transition (title / stage / ending), notify the adaptive
 *   pixel-ratio controller of a resume so its grace period excludes the
 *   inevitable one-shot hitches around scene swaps from FPS sampling.
 * - Returning to title deliberately keeps the current tier instead of forcing
 *   MAX_TIER, preserving the last stable downscale across same-session
 *   retries on slower iPads while still allowing the existing high-FPS
 *   heuristic to recover quality gradually.
 * - Always delegates the actual scene swap to sceneManager.transitionTo.
 */
export function createSceneTransitionHandler(deps: SceneTransitionHandlerDeps): SceneTransitionHandler {
  const { sceneManager, pixelRatioController, now } = deps;

  return (sceneType: SceneType, context?: SceneContext) => {
    pixelRatioController.notifyResume(now());
    return sceneManager.transitionTo(sceneType, context);
  };
}
