// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene() {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState = { moveDirection: 0 as -1 | 0 | 1, boostPressed: false };
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

  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

function finishStartCountdown(scene: StageScene): void {
  const internal = scene as unknown as { update(dt: number): void };
  for (let i = 0; i < 4; i++) {
    internal.update(1.0);
  }
}

describe('StageScene assist direction', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('recommends moving right when the left lane is more dangerous', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      meteorites: Meteorite[];
      determineAssistTouchGuideMode(): 'assist-left' | 'assist-right' | null;
    };
    internal.meteorites = [
      new Meteorite(-6, 0, -12),
      new Meteorite(-4.5, 0, -18),
      new Meteorite(6.5, 0, -32),
    ];

    expect(internal.determineAssistTouchGuideMode()).toBe('assist-right');
  });

  it('returns no recommendation when both sides are similarly dangerous', () => {
    const scene = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      meteorites: Meteorite[];
      determineAssistTouchGuideMode(): 'assist-left' | 'assist-right' | null;
    };
    internal.meteorites = [
      new Meteorite(-5.5, 0, -14),
      new Meteorite(5.5, 0, -14),
    ];

    expect(internal.determineAssistTouchGuideMode()).toBeNull();
  });

  it('shows an assist direction after two recent meteorite hits', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      collisionSystem: { check: () => { starCollisions: []; meteoriteCollision: boolean; meteoriteHit: Meteorite | null } };
      meteorites: Meteorite[];
      update(dt: number): void;
    };
    scene.enter({ stageNumber: 1 });
    finishStartCountdown(scene);

    const hit1 = new Meteorite(0, 0, -10);
    const hit2 = new Meteorite(0.5, 0, -11);
    const hazard1 = new Meteorite(-6, 0, -12);
    const hazard2 = new Meteorite(-4.5, 0, -18);
    internal.meteorites = [hit1, hit2, hazard1, hazard2];

    let callCount = 0;
    internal.collisionSystem = {
      check: () => {
        callCount += 1;
        if (callCount === 1) {
          return { starCollisions: [], meteoriteCollision: true, meteoriteHit: hit1 };
        }
        if (callCount === 2) {
          internal.meteorites = [hit2, hazard1, hazard2];
          return { starCollisions: [], meteoriteCollision: true, meteoriteHit: hit2 };
        }
        return { starCollisions: [], meteoriteCollision: false, meteoriteHit: null };
      },
    };

    internal.update(0.016);
    internal.update(0.2);

    expect(document.querySelector('[data-touch-guide-overlay]')?.getAttribute('data-touch-guide-state')).toBe('assist-right');
  });
});
