// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface CreatedScene {
  scene: StageScene;
  sceneManager: { requestTransition: ReturnType<typeof vi.fn> };
  inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean };
  resetPointers: ReturnType<typeof vi.fn>;
}

function createScene(): CreatedScene {
  const sceneManager = { requestTransition: vi.fn() };
  const inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean } = {
    moveDirection: 0,
    boostPressed: false,
  };
  const resetPointers = vi.fn(() => {
    inputState.moveDirection = 0;
  });
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (v: boolean) => {
      inputState.boostPressed = v;
    },
    resetPointers,
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
    resetPointers,
  };
}

function finishStartCountdown(scene: StageScene): void {
  const internal = scene as unknown as { update(dt: number): void };
  for (let i = 0; i < 4; i++) internal.update(1.0);
}

function tapPauseButton(): void {
  const pauseButton = document.querySelector('#hud button[aria-label="やすむ"]') as HTMLButtonElement;
  pauseButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
}

function confirmOverlayButtonTap(button: HTMLButtonElement): void {
  button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
  button.dispatchEvent(new Event('pointerup', { bubbles: true }));
}

function tapHomeButton(): void {
  const homeButton = document.querySelector('#hud button[aria-label="ホームへ もどる"]') as HTMLButtonElement;
  homeButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
}

function getBoostButton(): HTMLButtonElement {
  return document.querySelector('#ui-overlay button[aria-label="ブースト"]') as HTMLButtonElement;
}

describe('StageScene pause', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('ポーズ表示中は宇宙船前進・スポーン・衝突判定が止まる', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    expect(scene.isPlaying()).toBe(true);

    const internal = scene as unknown as {
      spaceship: { position: { z: number } };
      spawnSystem: { update: (...args: unknown[]) => unknown };
      collisionSystem: { check: (...args: unknown[]) => unknown };
      update(dt: number): void;
    };
    const spawnSpy = vi.spyOn(internal.spawnSystem, 'update');
    const collisionSpy = vi.spyOn(internal.collisionSystem, 'check');

    tapPauseButton();
    const z0 = internal.spaceship.position.z;
    internal.update(0.5);

    expect(document.querySelector('[data-pause-overlay]')).not.toBeNull();
    expect(scene.isPlaying()).toBe(false);
    expect(internal.spaceship.position.z).toBe(z0);
    expect(spawnSpy).not.toHaveBeenCalled();
    expect(collisionSpy).not.toHaveBeenCalled();
  });

  it('ポーズを開くと残留ポインタ入力が解除される', () => {
    const { scene, inputState, resetPointers } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    resetPointers.mockClear();
    inputState.moveDirection = 1;

    tapPauseButton();

    expect(resetPointers).toHaveBeenCalledTimes(1);
    expect(inputState.moveDirection).toBe(0);
  });

  it('つづけるでポーズを閉じて復帰カウントダウンへ入る', () => {
    const { scene, resetPointers } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    resetPointers.mockClear();

    const internal = scene as unknown as {
      awaitingResume: boolean;
      isPauseOpen: boolean;
    };

    tapPauseButton();
    const continueButton = document.querySelector<HTMLButtonElement>('[data-pause-continue]')!;
    confirmOverlayButtonTap(continueButton);

    expect(document.querySelector('[data-pause-overlay]')).toBeNull();
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
    expect(internal.awaitingResume).toBe(true);
    expect(internal.isPauseOpen).toBe(false);
    expect(resetPointers).toHaveBeenCalledTimes(2);
  });

  it('つづける後の復帰カウントダウン完了後も宇宙船が横に流れない', () => {
    const { scene, inputState } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    inputState.moveDirection = 1;

    const internal = scene as unknown as {
      spaceship: { position: { x: number } };
      update(dt: number): void;
    };

    tapPauseButton();
    const continueButton = document.querySelector<HTMLButtonElement>('[data-pause-continue]')!;
    confirmOverlayButtonTap(continueButton);

    const xBeforeResume = internal.spaceship.position.x;
    for (let i = 0; i < 4; i++) internal.update(1.0);
    internal.update(0.25);

    expect(inputState.moveDirection).toBe(0);
    expect(internal.spaceship.position.x).toBe(xBeforeResume);
  });

  it('ポーズ表示中はブーストボタンが無効で queued boost も破棄される', () => {
    const { scene, inputState } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    inputState.boostPressed = true;

    tapPauseButton();

    const boostButton = getBoostButton();
    expect(boostButton.getAttribute('aria-disabled')).toBe('true');

    const internal = scene as unknown as { update(dt: number): void };
    internal.update(0.1);
    expect(inputState.boostPressed).toBe(false);

    const continueButton = document.querySelector<HTMLButtonElement>('[data-pause-continue]')!;
    confirmOverlayButtonTap(continueButton);
    expect(boostButton.getAttribute('aria-disabled')).toBe('true');

    for (let i = 0; i < 4; i++) internal.update(1.0);
    expect(boostButton.getAttribute('aria-disabled')).toBe('false');
  });

  it('ポーズ再開後にホーム確認を開いてもオーバーレイが二重表示されない', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    const internal = scene as unknown as {
      awaitingResume: boolean;
      isHomeConfirmOpen: boolean;
      isPauseOpen: boolean;
    };

    tapPauseButton();
    const continueButton = document.querySelector<HTMLButtonElement>('[data-pause-continue]')!;
    confirmOverlayButtonTap(continueButton);
    tapHomeButton();

    expect(document.querySelector('[data-pause-overlay]')).toBeNull();
    expect(document.querySelector('[data-home-confirm-overlay]')).not.toBeNull();
    expect(document.querySelectorAll('[data-home-confirm-overlay]').length).toBe(1);
    expect(internal.awaitingResume).toBe(true);
    expect(internal.isHomeConfirmOpen).toBe(true);
    expect(internal.isPauseOpen).toBe(false);
  });
});
