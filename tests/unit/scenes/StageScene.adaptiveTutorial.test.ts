// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import { Star } from '../../../src/game/entities/Star';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(options: { highContrast?: boolean } = {}): StageScene {
  const inputState = { moveDirection: 0, boostPressed: false };
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (value: boolean) => {
      inputState.boostPressed = value;
    },
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
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [],
      muted: false,
      bestStageStars: {},
      colorAccessibility: options.highContrast ? { highContrast: true } : undefined,
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;

  return new StageScene(sceneManager, inputSystem, audioManager, saveManager, {
    scheduleIdleTask: () => {},
  });
}

function finishStartCountdown(scene: StageScene): void {
  const internal = scene as unknown as { update(dt: number): void };
  for (let i = 0; i < 4; i++) {
    internal.update(1);
  }
}

describe('StageScene adaptive tutorial', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
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
  });

  it('shows a meteorite tutorial hint while danger is approaching and the player stays still', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      update(dt: number): void;
      meteorites: Meteorite[];
      spaceship: { position: { z: number } };
    };

    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    internal.meteorites = [new Meteorite(0.3, 0, internal.spaceship.position.z - 220)];

    internal.update(3);

    const hint = document.querySelector('[data-adaptive-tutorial-bubble]') as HTMLDivElement | null;
    expect(hint?.textContent).toBe('ひだりみぎで よけよう！');
    expect(document.querySelector('[data-adaptive-tutorial-hint]')?.getAttribute('aria-hidden')).toBe('false');
  });

  it('shows a star tutorial hint after missing 5 stars', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      update(dt: number): void;
      stars: Star[];
      spaceship: { position: { z: number } };
    };

    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    const shipZ = internal.spaceship.position.z;
    internal.stars = Array.from({ length: 5 }, (_, index) => new Star(index - 2, 0, shipZ + 40 + index));

    internal.update(0.016);

    const hint = document.querySelector('[data-adaptive-tutorial-bubble]') as HTMLDivElement | null;
    expect(hint?.textContent).toBe('きらきら あつめよう⭐');
  });

  it('applies high contrast styles to adaptive hints when accessibility mode is enabled', () => {
    const scene = createScene({ highContrast: true });
    const internal = scene as unknown as {
      update(dt: number): void;
      meteorites: Meteorite[];
      spaceship: { position: { z: number } };
    };

    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);
    internal.meteorites = [new Meteorite(0, 0, internal.spaceship.position.z - 220)];

    internal.update(3);

    const root = document.querySelector('[data-adaptive-tutorial-hint]') as HTMLDivElement | null;
    const hint = document.querySelector('[data-adaptive-tutorial-bubble]') as HTMLDivElement | null;
    expect(root?.getAttribute('data-adaptive-tutorial-contrast')).toBe('high');
    expect(hint?.textContent).toBe('ひだりみぎで よけよう！');
  });
});
