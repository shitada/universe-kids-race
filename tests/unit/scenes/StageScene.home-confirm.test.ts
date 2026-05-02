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
}

function createScene(): CreatedScene {
  const sceneManager = { requestTransition: vi.fn() };
  const inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean } = {
    moveDirection: 0,
    boostPressed: false,
  };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (v: boolean) => {
      inputState.boostPressed = v;
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

function tapHomeButton(): void {
  const homeButton = document.getElementById('hud')!.querySelector('button') as HTMLButtonElement;
  homeButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
}

function getBoostButton(): HTMLButtonElement {
  return document.querySelector('#ui-overlay button[aria-label="ブースト"]') as HTMLButtonElement;
}

describe('StageScene home confirm pause', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('ホーム確認表示中は宇宙船前進・スポーン・衝突判定が止まる', () => {
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

    tapHomeButton();
    const z0 = internal.spaceship.position.z;
    internal.update(0.5);

    expect(document.querySelector('[data-home-confirm-overlay]')).not.toBeNull();
    expect(scene.isPlaying()).toBe(false);
    expect(internal.spaceship.position.z).toBe(z0);
    expect(spawnSpy).not.toHaveBeenCalled();
    expect(collisionSpy).not.toHaveBeenCalled();
  });

  it('✋ つづけるでホーム確認を閉じて復帰カウントダウンへ入る', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    const internal = scene as unknown as {
      awaitingResume: boolean;
      isHomeConfirmOpen: boolean;
    };

    tapHomeButton();
    const continueButton = document.querySelector<HTMLButtonElement>(
      '[data-home-confirm-continue]',
    )!;
    continueButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(document.querySelector('[data-home-confirm-overlay]')).toBeNull();
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
    expect(internal.awaitingResume).toBe(true);
    expect(internal.isHomeConfirmOpen).toBe(false);
  });

  it('🏠 タイトルへ もどるで title 遷移を 1 回だけ要求する', () => {
    const { scene, sceneManager } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    tapHomeButton();
    const backButton = document.querySelector<HTMLButtonElement>(
      '[data-home-confirm-back]',
    )!;
    backButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));

    expect(sceneManager.requestTransition).toHaveBeenCalledTimes(1);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('title');
    expect(document.querySelector('[data-home-confirm-overlay]')).toBeNull();
  });

  it('ホーム確認表示中はブーストボタンが無効で queued boost も破棄される', () => {
    const { scene, inputState } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    inputState.boostPressed = true;

    tapHomeButton();

    const boostButton = getBoostButton();
    expect(boostButton.getAttribute('aria-disabled')).toBe('true');

    const internal = scene as unknown as { update(dt: number): void };
    internal.update(0.1);
    expect(inputState.boostPressed).toBe(false);

    const continueButton = document.querySelector<HTMLButtonElement>(
      '[data-home-confirm-continue]',
    )!;
    continueButton.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(boostButton.getAttribute('aria-disabled')).toBe('true');

    for (let i = 0; i < 4; i++) internal.update(1.0);
    expect(boostButton.getAttribute('aria-disabled')).toBe('false');
  });
});
