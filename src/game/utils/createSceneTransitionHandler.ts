import type { SceneType, SceneContext } from '../../types';
import type { SceneManager } from '../SceneManager';
import type { SaveManager } from '../storage/SaveManager';
import type { AdaptivePixelRatioController } from './AdaptivePixelRatioController';

/**
 * Dependencies for the scene transition handler. Kept as plain interfaces
 * (no Three.js imports) so the helper can be unit-tested with stubs.
 */
export interface SceneTransitionHandlerDeps {
  sceneManager: Pick<SceneManager, 'transitionTo'>;
  saveManager: Pick<SaveManager, 'load' | 'save'>;
  pixelRatioController: Pick<AdaptivePixelRatioController, 'reset' | 'notifyResume'>;
  applyPixelRatioTier: (tier: number) => void;
  maxTier: number;
  totalStages: number;
  now: () => number;
}

export type SceneTransitionHandler = (sceneType: SceneType, context?: SceneContext) => void;

/**
 * Build the transition handler used by SceneManager.setTransitionHandler.
 *
 * Behaviour:
 * - When transitioning to a stage with stageNumber > 1, persist the cleared
 *   previous stage into save data (clearedStage + unlockedPlanets).
 * - When transitioning to the ending, persist the final stage as cleared.
 * - When transitioning to title, reset the adaptive pixel-ratio controller
 *   to the maximum tier and re-apply the renderer pixel ratio so subsequent
 *   stages can re-evaluate from the highest quality (Constitution IV: avoid
 *   unnecessary downscale lock-in across scenes).
 * - Always delegates the actual scene swap to sceneManager.transitionTo.
 */
export function createSceneTransitionHandler(deps: SceneTransitionHandlerDeps): SceneTransitionHandler {
  const {
    sceneManager,
    saveManager,
    pixelRatioController,
    applyPixelRatioTier,
    maxTier,
    totalStages,
    now,
  } = deps;

  return (sceneType: SceneType, context?: SceneContext) => {
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
      saveData.clearedStage = Math.max(saveData.clearedStage, totalStages);
      if (!saveData.unlockedPlanets.includes(totalStages)) {
        saveData.unlockedPlanets.push(totalStages);
      }
      saveManager.save(saveData);
    } else if (sceneType === 'title') {
      // Returning to the lightweight title screen is a safe point to recover
      // any pixel-ratio downscale that occurred during a heavy stage so the
      // next stage attempt starts from maximum quality.
      pixelRatioController.reset();
      applyPixelRatioTier(maxTier);
      pixelRatioController.notifyResume(now());
    }

    sceneManager.transitionTo(sceneType, context);
  };
}
