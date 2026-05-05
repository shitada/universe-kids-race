// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Star } from '../../../src/game/entities/Star';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState = { moveDirection: 0, boostPressed: false };
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
    playSFX: vi.fn(),
    startBoostSFX: vi.fn(),
    stopBoostSFX: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    markStageCleared: vi.fn(() => false),
  } as unknown as SaveManager;

  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  scene.enter({ stageNumber: 1 });
  const internal = scene as unknown as {
    countdownOverlay: { dispose(): void } | null;
    isStarting: boolean;
  };
  internal.countdownOverlay?.dispose();
  internal.countdownOverlay = null;
  internal.isStarting = false;
  return scene;
}

describe('StageScene LOD integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('updates star and meteorite LODs during the frame update', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      spaceship: { position: { x: number; y: number; z: number } };
      stars: Star[];
      meteorites: Meteorite[];
      threeScene: THREE.Scene;
      update(deltaTime: number): void;
    };

    const farStar = new Star(0, 0, internal.spaceship.position.z - 80, 'NORMAL');
    const farMeteorite = new Meteorite(0, 0, internal.spaceship.position.z - 80);
    const starApplySpy = vi.spyOn(farStar, 'applyLOD');
    const meteoriteApplySpy = vi.spyOn(farMeteorite, 'applyLOD');

    internal.stars.push(farStar);
    internal.meteorites.push(farMeteorite);
    internal.threeScene.add(farStar.mesh);
    internal.threeScene.add(farMeteorite.mesh);

    internal.update(0.016);

    expect(starApplySpy).toHaveBeenCalledWith('far');
    expect(meteoriteApplySpy).toHaveBeenCalledWith('far');
    expect(farStar.getLODLevel()).toBe('far');
    expect(farMeteorite.getLODLevel()).toBe('far');
  });
});
