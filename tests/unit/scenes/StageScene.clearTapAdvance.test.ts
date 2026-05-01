// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface ClearTestScene {
  scene: StageScene;
  sceneManager: { requestTransition: ReturnType<typeof vi.fn> };
  internal: {
    scoreSystem: {
      getStarCount(): number;
      finalizeStage(): { totalScore: number; totalStarCount: number };
    };
    companionManager: unknown | null;
    clearOverlay: HTMLDivElement | null;
    awaitingClearTap: boolean;
    update(deltaTime: number): void;
    onStageClear(): void;
  };
}

function createScene(): ClearTestScene {
  const sceneManager = { requestTransition: vi.fn() };
  const inputState = { moveDirection: 0 as -1 | 0 | 1, boostPressed: false };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (value: boolean) => {
      inputState.boostPressed = value;
    },
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], muted: false, bestStageStars: { 1: 0 } })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;
  const scene = new StageScene(
    sceneManager as unknown as SceneManager,
    inputSystem,
    audioManager,
    saveManager,
  );
  scene.enter({ stageNumber: 1 });

  const internal = scene as unknown as ClearTestScene['internal'];
  internal.scoreSystem = {
    getStarCount: () => 2,
    finalizeStage: () => ({ totalScore: 1200, totalStarCount: 8 }),
  };
  internal.companionManager = null;

  return { scene, sceneManager, internal };
}

describe('StageScene clear tap advance', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    window.history.replaceState({}, '', '/');
  });

  it('shows the tap hint only after the 1.5 second minimum display time', () => {
    const { internal, sceneManager } = createScene();

    internal.onStageClear();
    expect(document.querySelector('[data-stage-clear-hint]')).toBeNull();

    internal.update(1.49);
    expect(document.querySelector('[data-stage-clear-hint]')).toBeNull();
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    internal.update(0.01);
    expect(document.querySelector('[data-stage-clear-hint]')?.textContent).toContain('タップして すすもう！');
    expect(internal.awaitingClearTap).toBe(true);
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
  });

  it('advances exactly once on pointerup after the hint appears', () => {
    const { internal, sceneManager } = createScene();

    internal.onStageClear();
    internal.update(1.5);

    const overlay = internal.clearOverlay;
    expect(overlay).not.toBeNull();

    overlay!.dispatchEvent(new Event('pointerup', { bubbles: true, cancelable: true }));
    overlay!.dispatchEvent(new Event('pointerup', { bubbles: true, cancelable: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 2,
      totalScore: 1200,
      totalStarCount: 8,
    });
  });

  it('keeps ?notap=1 as auto advance after 3.5 seconds without showing the hint', () => {
    window.history.replaceState({}, '', '/?notap=1');
    const { internal, sceneManager } = createScene();

    internal.onStageClear();
    internal.update(1.5);
    expect(document.querySelector('[data-stage-clear-hint]')).toBeNull();
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    internal.update(1.99);
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();

    internal.update(0.01);
    internal.update(1.0);
    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
  });

  it('removes the clear tap listener on exit so detached overlays cannot retrigger transitions', () => {
    const { scene, internal, sceneManager } = createScene();

    internal.onStageClear();
    internal.update(1.5);

    const overlay = internal.clearOverlay;
    expect(overlay).not.toBeNull();

    scene.exit();
    overlay!.dispatchEvent(new Event('pointerup', { bubbles: true, cancelable: true }));

    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
    expect((scene as unknown as { clearOverlay: HTMLDivElement | null }).clearOverlay).toBeNull();
  });
});
