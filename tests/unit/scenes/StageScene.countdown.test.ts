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

describe('StageScene start countdown', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('isStarting is true immediately after enter() (input/spawn locked)', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as { isStarting: boolean };
    expect(internal.isStarting).toBe(true);
    // Countdown overlay DOM is mounted.
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
  });

  it('isStarting becomes false after the full countdown elapses (~3.4s)', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as { isStarting: boolean; update(dt: number): void };
    // Drive the update() countdown branch with deltaTime ticks.
    for (let i = 0; i < 4; i++) internal.update(1.0);
    // 3 * 1.0 (counts) + 1.0 (more than 0.4s go phase) = 4.0s total
    expect(internal.isStarting).toBe(false);
    expect(document.querySelector('[data-countdown-overlay]')).toBeNull();
  });

  it('does not advance the spaceship forward while counting down', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as {
      spaceship: { position: { z: number }; update(dt: number): void };
      update(dt: number): void;
    };
    const z0 = internal.spaceship.position.z;
    internal.update(0.5);
    expect(internal.spaceship.position.z).toBe(z0);
  });

  it('does not invoke spawnSystem.update during countdown', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as {
      spawnSystem: { update: (...args: unknown[]) => unknown };
      update(dt: number): void;
    };
    const spy = vi.spyOn(internal.spawnSystem, 'update');
    internal.update(0.5);
    expect(spy).not.toHaveBeenCalled();
  });

  it('plays countdownTick SFX for each number and countdownGo for スタート！', () => {
    const { scene, audio } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as { update(dt: number): void };
    const sfxSeen = (): string[] => audio.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxSeen()).toContain('countdownTick');
    expect(sfxSeen().filter((n) => n === 'countdownTick')).toHaveLength(1);
    internal.update(1.0); // → "2"
    expect(sfxSeen().filter((n) => n === 'countdownTick')).toHaveLength(2);
    internal.update(1.0); // → "1"
    expect(sfxSeen().filter((n) => n === 'countdownTick')).toHaveLength(3);
    internal.update(1.0); // → スタート！
    expect(sfxSeen()).toContain('countdownGo');
  });

  it('does not consume boost / move input while counting down', () => {
    const { scene, inputState, audio } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as { update(dt: number): void };
    inputState.boostPressed = true;
    inputState.moveDirection = 1;
    internal.update(0.1);
    // Queued boost input is discarded during countdown.
    expect(inputState.boostPressed).toBe(false);
    // No boost SFX fired during countdown.
    const sfxNames = audio.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxNames).not.toContain('boost');
    expect(sfxNames).not.toContain('boostDenied');
  });

  it('does not auto-activate boost right after the start countdown ends', () => {
    const { scene, inputState, audio } = createScene();
    scene.enter({ stageNumber: 1 });
    const internal = scene as unknown as { update(dt: number): void };
    inputState.boostPressed = true;
    internal.update(0.1);
    expect(inputState.boostPressed).toBe(false);

    audio.playSFX.mockClear();
    for (let i = 0; i < 4; i++) internal.update(1.0);
    internal.update(0.1);

    const sfxNames = audio.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxNames).not.toContain('boost');
    expect(sfxNames).not.toContain('boostDenied');
  });

  it('exit() disposes any in-flight countdown overlay', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
    scene.exit();
    expect(document.querySelector('[data-countdown-overlay]')).toBeNull();
    const internal = scene as unknown as {
      isStarting: boolean;
      countdownOverlay: unknown | null;
    };
    expect(internal.isStarting).toBe(false);
    expect(internal.countdownOverlay).toBeNull();
  });

  it('shows a planet intro card before the countdown on campaign transitions', () => {
    const { scene } = createScene();
    scene.enter({
      stageNumber: 2,
      totalScore: 0,
      totalStarCount: 0,
      launchSource: 'campaign',
    });
    const internal = scene as unknown as { update(dt: number): void };

    expect(document.querySelector('[data-stage-intro-overlay]')).not.toBeNull();
    expect(document.querySelector('[data-stage-intro-name]')?.textContent).toBe('すいせい');
    expect(document.querySelector('[data-countdown-overlay]')).toBeNull();

    internal.update(1.8);

    expect(document.querySelector('[data-stage-intro-overlay]')).toBeNull();
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
  });

  it('skips the planet intro card on retry and starts the countdown immediately', () => {
    const { scene } = createScene();
    scene.enter({
      stageNumber: 2,
      totalScore: 0,
      totalStarCount: 0,
      launchSource: 'campaign',
      replayToken: 1,
    });

    expect(document.querySelector('[data-stage-intro-overlay]')).toBeNull();
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
  });

  it('skips the planet intro card for encyclopedia launches', () => {
    const { scene } = createScene();
    scene.enter({
      stageNumber: 2,
      totalScore: 0,
      totalStarCount: 0,
      launchSource: 'encyclopedia',
    });

    expect(document.querySelector('[data-stage-intro-overlay]')).toBeNull();
    expect(document.querySelector('[data-countdown-overlay]')).not.toBeNull();
  });
});
