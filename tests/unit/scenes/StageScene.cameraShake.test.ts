// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(motionSensitivity: 'strong' | 'medium' | 'gentle' | 'minimal' = 'strong'): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputState = { moveDirection: 0, boostPressed: false };
  const inputSystem = {
    getState: () => inputState,
    setBoostPressed: (v: boolean) => {
      inputState.boostPressed = v;
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
      colorAccessibility: motionSensitivity === 'strong' ? undefined : { motionSensitivity },
    })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;

  const scene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  scene.enter({ stageNumber: 1 });
  (scene as unknown as { countdownOverlay: { dispose(): void } | null }).countdownOverlay?.dispose();
  (scene as unknown as { isStarting: boolean }).isStarting = false;
  (scene as unknown as { countdownOverlay: unknown | null }).countdownOverlay = null;
  return scene;
}

interface InternalScene {
  camera: THREE.PerspectiveCamera;
  cameraShakeElapsed: number;
  cameraShakeOffset: THREE.Vector3;
  cameraShakeTimer: number;
  collisionSystem: { check: (...args: unknown[]) => unknown };
  meteorites: Meteorite[];
  spaceship: { position: { x: number; y: number; z: number } };
  startCameraShake(): void;
  update(dt: number): void;
  updateCameraFollow(dt: number): void;
  exit(): void;
}

describe('StageScene camera shake', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('starts a short camera shake when a meteorite collision occurs', () => {
    const scene = createScene();
    const internal = scene as unknown as InternalScene;
    const hit = new Meteorite(2, 1, -30);
    internal.meteorites = [hit];
    internal.collisionSystem = {
      check: () => ({
        starCollisions: [],
        meteoriteCollision: true,
        meteoriteHit: hit,
      }),
    };

    internal.update(0.016);

    const baseX = internal.spaceship.position.x * 0.3;
    const baseY = 5;
    const baseZ = internal.spaceship.position.z + 12;
    expect(internal.cameraShakeTimer).toBeGreaterThan(0);
    expect(internal.cameraShakeOffset.length()).toBeGreaterThan(0);
    expect(internal.camera.position.x).not.toBeCloseTo(baseX, 6);
    expect(internal.camera.position.y).not.toBeCloseTo(baseY, 6);
    expect(internal.camera.position.z).toBeCloseTo(baseZ, 6);
  });

  it('naturally decays back to the normal follow camera position', () => {
    const scene = createScene();
    const internal = scene as unknown as InternalScene;
    internal.spaceship.position.x = 4;
    internal.spaceship.position.z = -120;

    internal.startCameraShake();
    internal.updateCameraFollow(0.016);
    expect(internal.cameraShakeOffset.length()).toBeGreaterThan(0);

    internal.updateCameraFollow(0.4);

    expect(internal.cameraShakeTimer).toBe(0);
    expect(internal.cameraShakeOffset.length()).toBe(0);
    expect(internal.camera.position.x).toBeCloseTo(internal.spaceship.position.x * 0.3, 6);
    expect(internal.camera.position.y).toBeCloseTo(5, 6);
    expect(internal.camera.position.z).toBeCloseTo(internal.spaceship.position.z + 12, 6);
  });

  it('can restart the shake while a previous shake is still active', () => {
    const scene = createScene();
    const internal = scene as unknown as InternalScene;

    internal.startCameraShake();
    internal.updateCameraFollow(0.12);
    const remaining = internal.cameraShakeTimer;
    expect(internal.cameraShakeElapsed).toBeGreaterThan(0);

    internal.startCameraShake();

    expect(internal.cameraShakeElapsed).toBe(0);
    expect(internal.cameraShakeTimer).toBeGreaterThan(remaining);
    internal.updateCameraFollow(0.016);
    expect(internal.cameraShakeOffset.length()).toBeGreaterThan(0);
  });

  it('reduces shake amplitude and smooths camera follow when motion sensitivity is minimal', () => {
    const strongScene = createScene('strong');
    const minimalScene = createScene('minimal');
    const strongInternal = strongScene as unknown as InternalScene;
    const minimalInternal = minimalScene as unknown as InternalScene;

    strongInternal.spaceship.position.x = 10;
    strongInternal.spaceship.position.z = -120;
    minimalInternal.spaceship.position.x = 10;
    minimalInternal.spaceship.position.z = -120;

    strongInternal.updateCameraFollow(0.016);
    minimalInternal.updateCameraFollow(0.016);
    expect(strongInternal.camera.position.x).toBeCloseTo(3, 6);
    expect(minimalInternal.camera.position.x).toBeGreaterThan(0);
    expect(minimalInternal.camera.position.x).toBeLessThan(3);

    strongInternal.startCameraShake();
    minimalInternal.startCameraShake();
    strongInternal.updateCameraFollow(0.016);
    minimalInternal.updateCameraFollow(0.016);

    expect(minimalInternal.cameraShakeOffset.length()).toBeLessThan(strongInternal.cameraShakeOffset.length());
    strongScene.exit();
    minimalScene.exit();
  });

  it('resets any shake state when the scene exits', () => {
    const scene = createScene();
    const internal = scene as unknown as InternalScene;

    internal.startCameraShake();
    internal.updateCameraFollow(0.016);
    expect(internal.cameraShakeTimer).toBeGreaterThan(0);

    internal.exit();

    expect(internal.cameraShakeTimer).toBe(0);
    expect(internal.cameraShakeElapsed).toBe(0);
    expect(internal.cameraShakeOffset.length()).toBe(0);
  });
});
