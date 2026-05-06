// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { TOTAL_STAGES } from '../../src/game/config/StageConfig';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function dispatchReleaseConfirm(button: HTMLElement): void {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
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

describe('StageScene stage clear flow without bonus time', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCanvasContext();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('ステージクリア後にボーナスタイムを出さず通常のクリア遷移へ進む', () => {
    const sceneManager = { requestTransition: vi.fn() };
    const inputSystem = {
      getState: () => ({ moveDirection: 0 as -1 | 0 | 1, boostPressed: false }),
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
      load: vi.fn(() => ({ clearedStage: TOTAL_STAGES - 1, unlockedPlanets: [], muted: false, bestStageStars: {} })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => true),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;

    const scene = new StageScene(
      sceneManager as unknown as SceneManager,
      inputSystem,
      audioManager,
      saveManager,
    );
    scene.enter({ stageNumber: TOTAL_STAGES, totalScore: 500, totalStarCount: 4, replayToken: 1 });

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

    expect(document.querySelector('[data-bonus-time-overlay]')).toBeNull();
    internal.update(0.7);

    const continueButton = document.querySelector<HTMLButtonElement>('[data-stage-clear-continue]');
    expect(continueButton?.disabled).toBe(false);

    dispatchReleaseConfirm(continueButton!);

    expect(sceneManager.requestTransition).toHaveBeenCalledWith('ending', {
      totalScore: 900,
      totalStarCount: 9,
    });
  });
});
