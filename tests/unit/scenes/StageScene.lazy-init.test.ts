// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { TOTAL_STAGES } from '../../../src/game/config/StageConfig';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function mockCanvasContext(): void {
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
}

function createScene(sceneManagerOverrides: Partial<SceneManager> = {}): StageScene {
  const inputState: { moveDirection: -1 | 0 | 1; boostPressed: boolean } = {
    moveDirection: 0,
    boostPressed: false,
  };
  const sceneManager = {
    requestTransition: vi.fn(),
    ...sceneManagerOverrides,
  } as unknown as SceneManager;
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
    load: vi.fn(() => ({
      clearedStage: 0,
      unlockedPlanets: [1, 2],
      muted: false,
      tutorialShown: true,
      bestStageStars: {},
    })),
    save: vi.fn(),
    clear: vi.fn(),
    markStageCleared: vi.fn(() => false),
    updateBestStageStars: vi.fn(),
  } as unknown as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

describe('StageScene lazy initialization', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockCanvasContext();
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('keeps heavy stage resources uninitialized until enter()', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      initialized: boolean;
      threeScene: THREE.Scene;
      bgStars: THREE.Points | null;
    };

    expect(internal.initialized).toBe(false);
    expect(internal.threeScene.children).toHaveLength(0);
    expect(internal.bgStars).toBeNull();
    expect(document.querySelector('[aria-label="ホームへ もどる"]')).toBeNull();
  });

  it('initializes heavy resources on first enter() only and reuses them on re-entry', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      initialized: boolean;
      ambientLight: THREE.AmbientLight;
      directionalLight: THREE.DirectionalLight;
      spaceship: { mesh: THREE.Group };
      airShield: { getMesh(): THREE.Object3D };
      companionManager: { getGroup(): THREE.Group };
      hud: object;
      bgStars: THREE.Points | null;
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
      threeScene: THREE.Scene;
    };

    scene.enter({ stageNumber: 1 });

    expect(internal.initialized).toBe(true);
    expect(internal.bgStars).not.toBeNull();
    expect(document.querySelector('[aria-label="ホームへ もどる"]')).not.toBeNull();

    const firstAmbientLight = internal.ambientLight;
    const firstDirectionalLight = internal.directionalLight;
    const firstSpaceshipMesh = internal.spaceship.mesh;
    const firstShieldMesh = internal.airShield.getMesh();
    const firstCompanionGroup = internal.companionManager.getGroup();
    const firstHud = internal.hud;
    const firstBgStars = internal.bgStars;

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    scene.exit();

    expect(internal.bgStars).toBeNull();
    expect(document.querySelector('[aria-label="ホームへ もどる"]')).toBeNull();

    scene.enter({ stageNumber: 2 });

    expect(internal.ambientLight).toBe(firstAmbientLight);
    expect(internal.directionalLight).toBe(firstDirectionalLight);
    expect(internal.spaceship.mesh).toBe(firstSpaceshipMesh);
    expect(internal.airShield.getMesh()).toBe(firstShieldMesh);
    expect(internal.companionManager.getGroup()).toBe(firstCompanionGroup);
    expect(internal.hud).toBe(firstHud);
    expect(internal.bgStars).not.toBe(firstBgStars);
    expect(internal.threeScene.children.filter((child) => child === firstAmbientLight)).toHaveLength(1);
    expect(internal.threeScene.children.filter((child) => child === firstDirectionalLight)).toHaveLength(1);
    expect(internal.threeScene.children.filter((child) => child === firstSpaceshipMesh)).toHaveLength(1);
    expect(internal.threeScene.children.filter((child) => child === firstShieldMesh)).toHaveLength(1);
    expect(internal.threeScene.children.filter((child) => child === firstCompanionGroup)).toHaveLength(1);
    expect(internal.threeScene.children.filter((child) => child === internal.bgStars)).toHaveLength(1);
    expect(document.querySelectorAll('[aria-label="ホームへ もどる"]')).toHaveLength(1);

    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
  });

  it('prefetches ending scene module from the penultimate stage', () => {
    const prefetchSceneModule = vi.fn();
    const scene = createScene({ prefetchSceneModule });

    scene.enter({ stageNumber: TOTAL_STAGES - 1 });

    expect(prefetchSceneModule).toHaveBeenCalledWith('ending');
  });

  it('does not prefetch ending scene module before the penultimate stage', () => {
    const prefetchSceneModule = vi.fn();
    const scene = createScene({ prefetchSceneModule });

    scene.enter({ stageNumber: TOTAL_STAGES - 2 });

    expect(prefetchSceneModule).not.toHaveBeenCalled();
  });
});
