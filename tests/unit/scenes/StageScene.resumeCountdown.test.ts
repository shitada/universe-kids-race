// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface CreatedScene {
  scene: StageScene;
  inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean };
  audio: { playSFX: ReturnType<typeof vi.fn> };
}

function createScene(): CreatedScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
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
  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  return {
    scene,
    inputState,
    audio: audioManager as unknown as { playSFX: ReturnType<typeof vi.fn> },
  };
}

/** Drive the start-countdown to completion so isPlaying() === true. */
function finishStartCountdown(scene: StageScene): void {
  const internal = scene as unknown as { update(dt: number): void };
  for (let i = 0; i < 4; i++) internal.update(1.0);
}

describe('StageScene background-resume countdown', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('isPlaying() is false before enter()', () => {
    const { scene } = createScene();
    expect(scene.isPlaying()).toBe(false);
  });

  it('isPlaying() stays false until the start countdown fully finishes', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as { update(dt: number): void };
    internal.update(3.0);
    expect(scene.isPlaying()).toBe(false);
  });

  it('isPlaying() is true after the start countdown finishes', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    expect(scene.isPlaying()).toBe(true);
  });

  it('requestResumeCountdown() shows a fresh CountdownOverlay during gameplay', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    // Start countdown DOM is gone now.
    expect(document.querySelector('[data-countdown-overlay]')).toBeNull();

    scene.requestResumeCountdown();

    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
    const internal = scene as unknown as { awaitingResume: boolean };
    expect(internal.awaitingResume).toBe(true);
  });

  it('requestResumeCountdown() is a no-op while the start countdown is still running (no double overlay)', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    // Start countdown is in flight: exactly one overlay exists.
    expect(document.querySelectorAll('[data-countdown-overlay]').length).toBe(1);

    scene.requestResumeCountdown();

    expect(document.querySelectorAll('[data-countdown-overlay]').length).toBe(1);
    const internal = scene as unknown as {
      awaitingResume: boolean;
      resumeCountdownOverlay: unknown | null;
    };
    expect(internal.awaitingResume).toBe(false);
    expect(internal.resumeCountdownOverlay).toBeNull();
  });

  it('requestResumeCountdown() does not double-fire if called twice in a row', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    scene.requestResumeCountdown();
    scene.requestResumeCountdown();

    expect(document.querySelectorAll('[data-countdown-overlay]').length).toBe(1);
  });

  it('does not advance the spaceship while awaitingResume is true', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    const internal = scene as unknown as {
      spaceship: { position: { z: number } };
      update(dt: number): void;
    };
    scene.requestResumeCountdown();
    const z0 = internal.spaceship.position.z;
    internal.update(0.5);
    expect(internal.spaceship.position.z).toBe(z0);
  });

  it('does not invoke spawnSystem.update while awaitingResume is true', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    const internal = scene as unknown as {
      spawnSystem: { update: (...args: unknown[]) => unknown };
      update(dt: number): void;
    };
    scene.requestResumeCountdown();
    const spy = vi.spyOn(internal.spawnSystem, 'update');
    internal.update(0.5);
    expect(spy).not.toHaveBeenCalled();
  });

  it('ignores user move/boost input while awaitingResume is true', () => {
    const { scene, inputState, audio } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    audio.playSFX.mockClear();
    scene.requestResumeCountdown();
    inputState.boostPressed = true;
    inputState.moveDirection = 1;
    const internal = scene as unknown as {
      spaceship: { position: { x: number } };
      update(dt: number): void;
    };
    const x0 = internal.spaceship.position.x;
    internal.update(0.1);
    expect(internal.spaceship.position.x).toBe(x0);
    expect(inputState.boostPressed).toBe(true);
    const sfxNames = audio.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxNames).not.toContain('boost');
    expect(sfxNames).not.toContain('boostDenied');
  });

  it('clears awaitingResume once the resume countdown elapses', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    scene.requestResumeCountdown();
    const internal = scene as unknown as {
      awaitingResume: boolean;
      update(dt: number): void;
    };
    expect(internal.awaitingResume).toBe(true);
    for (let i = 0; i < 4; i++) internal.update(1.0);
    expect(internal.awaitingResume).toBe(false);
    expect(document.querySelector('[data-countdown-overlay]')).toBeNull();
    expect(scene.isPlaying()).toBe(true);
  });

  it('exit() disposes any in-flight resume countdown overlay', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    scene.requestResumeCountdown();
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
    scene.exit();
    expect(document.querySelector('[data-countdown-overlay]')).toBeNull();
    const internal = scene as unknown as {
      awaitingResume: boolean;
      resumeCountdownOverlay: unknown | null;
    };
    expect(internal.awaitingResume).toBe(false);
    expect(internal.resumeCountdownOverlay).toBeNull();
  });
});
