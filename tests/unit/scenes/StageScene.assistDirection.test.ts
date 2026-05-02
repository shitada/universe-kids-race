// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { AssistDirection } from '../../../src/types';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

interface StageSceneAssistInternals {
  spaceship: { position: { x: number; y: number; z: number } };
  meteorites: Meteorite[];
  getSaferAssistDirection(): AssistDirection | null;
}

function createScene(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = {
    getState: () => ({ moveDirection: 0, boostPressed: false }),
    setBoostPressed: vi.fn(),
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

describe('StageScene assist direction scoring', () => {
  it('prefers the right side when closer meteorites cluster on the left', () => {
    const scene = createScene();
    const internal = scene as unknown as StageSceneAssistInternals;

    internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
    internal.meteorites = [
      new Meteorite(-5.5, 0, -10),
      new Meteorite(-4.8, 0, -16),
      new Meteorite(5.2, 0, -34),
    ];

    expect(internal.getSaferAssistDirection()).toBe('right');
  });

  it('prefers the left side when closer meteorites cluster on the right', () => {
    const scene = createScene();
    const internal = scene as unknown as StageSceneAssistInternals;

    internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
    internal.meteorites = [
      new Meteorite(4.5, 0, -9),
      new Meteorite(5.8, 0, -15),
      new Meteorite(-5.2, 0, -33),
    ];

    expect(internal.getSaferAssistDirection()).toBe('left');
  });

  it('returns null when the danger gap is too small after ignoring far or inactive meteorites', () => {
    const scene = createScene();
    const internal = scene as unknown as StageSceneAssistInternals;
    const inactiveLeft = new Meteorite(-6, 0, -8);
    inactiveLeft.isActive = false;

    internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
    internal.meteorites = [
      inactiveLeft,
      new Meteorite(-4.2, 0, -18),
      new Meteorite(4.1, 0, -18.5),
      new Meteorite(6.5, 0, -80),
    ];

    expect(internal.getSaferAssistDirection()).toBeNull();
  });
});
