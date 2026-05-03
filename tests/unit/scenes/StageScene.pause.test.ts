// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';

interface CreatedScene {
  scene: StageScene;
  sceneManager: { requestTransition: ReturnType<typeof vi.fn> };
  inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean };
}

function createScene(): CreatedScene {
  const sceneManager = { requestTransition: vi.fn() };
  const inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean } = {
    moveDirection: 0,
    boostPressed: false,
  };
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;

  return {
    scene: new StageScene(
      sceneManager as unknown as SceneManager,
      inputSystem,
      audioManager,
      saveManager,
    ),
    sceneManager,
    inputState,
  };
}

function finishStartCountdown(scene: StageScene): void {
  const internal = scene as unknown as { update(dt: number): void };
  for (let i = 0; i < 4; i++) internal.update(1.0);
}

function tapPauseButton(): void {
  const button = Array.from(document.getElementById('hud')!.querySelectorAll('button')).find((element) =>
    (element.textContent ?? '').includes('やすむ'),
  ) as HTMLButtonElement;
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

function confirmButtonTap(selector: string): void {
  const button = document.querySelector<HTMLButtonElement>(selector)!;
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

describe('StageScene manual pause', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('やすむ中は更新と入力が止まり、ポーズオーバーレイが 1 回だけ開く', () => {
    const { scene, inputState } = createScene();
    const onPause = vi.fn();
    scene.setPauseHandlers({ onPauseRequested: onPause });
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    const internal = scene as unknown as {
      spaceship: { position: { x: number; z: number } };
      spawnSystem: { update: (...args: unknown[]) => unknown };
      update(dt: number): void;
      isPauseOverlayOpen: boolean;
    };
    const spawnSpy = vi.spyOn(internal.spawnSystem, 'update');
    inputState.boostPressed = true;
    inputState.moveDirection = 1;

    tapPauseButton();
    tapPauseButton();
    const { x, z } = internal.spaceship.position;
    internal.update(0.5);

    expect(onPause).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll('[data-pause-overlay]')).toHaveLength(1);
    expect(internal.isPauseOverlayOpen).toBe(true);
    expect(scene.isPlaying()).toBe(false);
    expect(internal.spaceship.position.x).toBe(x);
    expect(internal.spaceship.position.z).toBe(z);
    expect(spawnSpy).not.toHaveBeenCalled();
    expect(inputState.boostPressed).toBe(false);
  });

  it('つづけるで既存の復帰カウントダウンに戻る', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    scene.setPauseHandlers({
      onPauseRequested: () => {},
      onResumeRequested: () => scene.requestResumeCountdown(),
    });

    tapPauseButton();
    confirmButtonTap('[data-pause-continue]');

    const internal = scene as unknown as { awaitingResume: boolean; isPauseOverlayOpen: boolean };
    expect(document.querySelector('[data-pause-overlay]')).toBeNull();
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
    expect(internal.isPauseOverlayOpen).toBe(false);
    expect(internal.awaitingResume).toBe(true);
  });

  it('おうちへでホーム確認と競合せずタイトル遷移ハンドラを呼ぶ', () => {
    const { scene } = createScene();
    const onExitHome = vi.fn();
    scene.setPauseHandlers({ onExitHomeRequested: onExitHome });
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    tapPauseButton();
    confirmButtonTap('[data-pause-home]');

    expect(onExitHome).toHaveBeenCalledTimes(1);
    expect(document.querySelector('[data-home-confirm-overlay]')).toBeNull();
    expect(document.querySelector('[data-pause-overlay]')).toBeNull();
  });

  it('ホーム確認中は やすむ できない', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    const homeButton = document.getElementById('hud')!.querySelector('button') as HTMLButtonElement;
    homeButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    tapPauseButton();

    expect(document.querySelector('[data-home-confirm-overlay]')).not.toBeNull();
    expect(document.querySelector('[data-pause-overlay]')).toBeNull();
  });
});
