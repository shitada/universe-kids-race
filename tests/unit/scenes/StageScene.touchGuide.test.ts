// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface CreatedScene {
  scene: StageScene;
  inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean };
}

function createScene(): CreatedScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean } = {
    moveDirection: 0,
    boostPressed: false,
  };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (pressed: boolean) => {
      inputState.boostPressed = pressed;
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
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], muted: false })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;

  return {
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager),
    inputState,
  };
}

function finishStartCountdown(scene: StageScene): void {
  const internal = scene as unknown as { update(dt: number): void };
  for (let i = 0; i < 4; i++) {
    internal.update(1.0);
  }
}

describe('StageScene touch guide overlay', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('shows the touch guide in intro mode when the stage starts', () => {
    const { scene } = createScene();

    scene.enter({ stageNumber: 1 });

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root).not.toBeNull();
    expect(root?.getAttribute('data-touch-guide-state')).toBe('intro');
  });

  it('hides the touch guide after the player moves left or right', () => {
    const { scene, inputState } = createScene();
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    inputState.moveDirection = -1;
    (scene as unknown as { update(dt: number): void }).update(0.016);

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('hidden');
  });

  it('shows the touch guide again in idle mode after 3 seconds without movement', () => {
    const { scene, inputState } = createScene();
    const internal = scene as unknown as { update(dt: number): void };
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    inputState.moveDirection = 1;
    internal.update(0.016);
    inputState.moveDirection = 0;
    internal.update(2.9);
    expect(document.querySelector('[data-touch-guide-overlay]')?.getAttribute('data-touch-guide-state')).toBe('hidden');

    internal.update(0.2);

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('idle');
    expect(root?.getAttribute('aria-hidden')).toBe('false');
  });

  it('prioritizes assist directions over the normal touch guide state machine', () => {
    const { scene, inputState } = createScene();
    const internal = scene as unknown as {
      assistTimer: number;
      assistDirection: 'left' | 'right' | null;
      assistDirectionRefreshTimer: number;
      update(dt: number): void;
    };
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    internal.assistTimer = 10;
    internal.assistDirection = 'right';
    internal.assistDirectionRefreshTimer = 10;
    inputState.moveDirection = -1;
    internal.update(0.016);

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('assist-right');
  });

  it('removes the touch guide on exit()', () => {
    const { scene } = createScene();
    scene.enter({ stageNumber: 1 });

    scene.exit();

    expect(document.querySelector('[data-touch-guide-overlay]')).toBeNull();
  });

  it('prioritizes assist guidance over idle when repeated hits activate assist mode', () => {
    const { scene, inputState } = createScene();
    const internal = scene as unknown as {
      update(dt: number): void;
      playTime: number;
      meteorites: Meteorite[];
      spaceship: { position: { z: number } };
      recordMeteoriteHit(): void;
    };

    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    inputState.moveDirection = -1;
    internal.update(0.016);
    inputState.moveDirection = 0;
    internal.update(3.1);
    expect(document.querySelector('[data-touch-guide-overlay]')?.getAttribute('data-touch-guide-state')).toBe('idle');

    const shipZ = internal.spaceship.position.z;
    internal.meteorites = [
      new Meteorite(-5.5, 0, shipZ - 10),
      new Meteorite(-4.5, 0, shipZ - 16),
      new Meteorite(5.4, 0, shipZ - 34),
    ];
    internal.recordMeteoriteHit();
    internal.playTime = 2;
    internal.recordMeteoriteHit();
    internal.update(0.016);

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('assist-right');
    expect(root?.getAttribute('data-touch-guide-active-side')).toBe('right');
  });

  it('returns to the normal touch guide flow after assist ends and does not carry assist state across re-entry', () => {
    const { scene, inputState } = createScene();
    const internal = scene as unknown as {
      update(dt: number): void;
      playTime: number;
      meteorites: Meteorite[];
      recordMeteoriteHit(): void;
    };

    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    inputState.moveDirection = 1;
    internal.update(0.016);
    inputState.moveDirection = 0;
    internal.meteorites = [
      new Meteorite(5.2, 0, -10),
      new Meteorite(4.6, 0, -15),
      new Meteorite(-5.5, 0, -34),
    ];
    internal.recordMeteoriteHit();
    internal.playTime = 1.5;
    internal.recordMeteoriteHit();
    internal.update(0.016);

    expect(document.querySelector('[data-touch-guide-overlay]')?.getAttribute('data-touch-guide-state')).toBe('assist-left');

    internal.update(5.1);
    expect(document.querySelector('[data-touch-guide-overlay]')?.getAttribute('data-touch-guide-state')).toBe('idle');

    scene.exit();
    scene.enter({ stageNumber: 1 });

    const root = document.querySelector<HTMLElement>('[data-touch-guide-overlay]');
    expect(root?.getAttribute('data-touch-guide-state')).toBe('intro');
    expect(root?.getAttribute('data-touch-guide-active-side')).toBe('both');
  });
});
