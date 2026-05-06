// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SceneManager } from '../../src/game/SceneManager';
import { StageScene } from '../../src/game/scenes/StageScene';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';
import type { SceneContext, SceneType } from '../../src/types';

function dispatchReleaseConfirm(button: HTMLElement): void {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

function finishBonusSequence(scene: { update(deltaTime: number): void }): void {
  scene.update(13);
}

function mockCanvasContext(): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => {
    return {
      fillStyle: '',
      strokeStyle: '',
      lineWidth: 0,
      fillRect: () => {},
      clearRect: () => {},
      beginPath: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      lineTo: () => {},
      ellipse: () => {},
    } as unknown as CanvasRenderingContext2D;
  });
}

describe('StageScene wormhole transition integration', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCanvasContext();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('ステージクリア後につぎへを押すとワームホール後に次ステージへ進む', async () => {
    const transitions: { type: SceneType; context: SceneContext }[] = [];
    const manager = new SceneManager();
    manager.setTransitionHandler((sceneType, context = {}) => {
      transitions.push({ type: sceneType, context });
      return manager.transitionTo(sceneType, context);
    });

    const inputState = { moveDirection: 0 as -1 | 0 | 1, boostPressed: false };
    const inputSystem = {
      getState: () => inputState,
      setBoostPressed: vi.fn(),
      resetPointers: vi.fn(),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
      setMuted: vi.fn(),
      playSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], muted: false, bestStageStars: {} })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;

    const scene = new StageScene(manager, inputSystem, audioManager, saveManager);
    manager.registerScene('stage', scene);

    await manager.transitionTo('stage', { stageNumber: 2, totalScore: 500, totalStarCount: 4, replayToken: 1 });

    const internal = scene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      scoreSystem: {
        getStarCount(): number;
        getTotalScore(): number;
        getTotalStarCount(): number;
        finalizeStage(): { totalScore: number; totalStarCount: number };
      };
      onStageClear(): void;
      update(deltaTime: number): void;
      wormholeTunnelEffect: { isActive(): boolean };
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
    internal.scoreSystem = {
      getStarCount: () => 5,
      getTotalScore: () => 500,
      getTotalStarCount: () => 4,
      finalizeStage: () => ({ totalScore: 900, totalStarCount: 9 }),
    };

    internal.onStageClear();
    finishBonusSequence(internal);

    const continueButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
    expect(continueButton).not.toBeNull();

    dispatchReleaseConfirm(continueButton!);

    expect(internal.wormholeTunnelEffect.isActive()).toBe(true);
    expect(audioManager.playSFX).toHaveBeenCalledWith('wormhole');
    expect(transitions).toHaveLength(0);

    internal.update(2.3);

    expect(transitions).toHaveLength(1);
    expect(transitions[0]).toEqual({
      type: 'stage',
      context: {
        stageNumber: 3,
        totalScore: 900,
        totalStarCount: 9,
      },
    });
  });
});
