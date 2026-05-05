// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StageScene } from '../../src/game/scenes/StageScene';
import { Star } from '../../src/game/entities/Star';
import type { SceneManager } from '../../src/game/SceneManager';
import type { InputSystem } from '../../src/game/systems/InputSystem';
import type { AudioManager } from '../../src/game/audio/AudioManager';
import type { SaveManager } from '../../src/game/storage/SaveManager';

function createScene(): { scene: StageScene; audioManager: { playSFX: ReturnType<typeof vi.fn> } } {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState = { moveDirection: 0, boostPressed: false };
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
    scene: new StageScene(sceneManager, inputSystem, audioManager, saveManager),
    audioManager: audioManager as unknown as { playSFX: ReturnType<typeof vi.fn> },
  };
}

describe('StageScene rainbow trail integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('runs rainbow star collection → trail activation → trail end', () => {
    const { scene, audioManager } = createScene();
    scene.enter({ stageNumber: 1 });

    const internal = scene as unknown as {
      stars: Star[];
      meteorites: [];
      shootingStars: [];
      comets: [];
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      spaceship: { position: { x: number; y: number; z: number } };
      rainbowTrailEffect: { isActive(): boolean; group: { visible: boolean } };
      update(deltaTime: number): void;
      threeScene: { add: (object: object) => void };
    };

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    const rainbowStar = new Star(0, 0, 0, 'RAINBOW');
    internal.stars = [rainbowStar];
    internal.meteorites = [];
    internal.shootingStars = [];
    internal.comets = [];
    internal.spaceship.position.x = 0;
    internal.spaceship.position.y = 0;
    internal.spaceship.position.z = 0;
    internal.threeScene.add(rainbowStar.mesh);

    internal.update(0.016);

    expect(audioManager.playSFX).toHaveBeenCalledWith('rainbowCollect');
    expect(internal.rainbowTrailEffect.isActive()).toBe(true);
    expect(internal.rainbowTrailEffect.group.visible).toBe(true);

    internal.update(5.8);
    expect(internal.rainbowTrailEffect.isActive()).toBe(true);

    internal.update(0.3);
    expect(internal.rainbowTrailEffect.isActive()).toBe(false);
    expect(internal.rainbowTrailEffect.group.visible).toBe(false);
  });
});
