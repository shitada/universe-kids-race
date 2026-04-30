// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
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
  const inputSystem = {} as InputSystem;
  const audioManager = {} as AudioManager;
  const saveManager = {} as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

describe('StageScene cleanupPassedObjects', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  it('removes passed stars from array, scene, and disposes resources', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      stars: Star[];
      meteorites: Meteorite[];
      threeScene: THREE.Scene;
      spaceship: { position: { x: number; y: number; z: number } };
      cleanupPassedObjects(): void;
    };

    internal.threeScene = new THREE.Scene();
    internal.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const passedStar = new Star(0, 0, 50);
    const aheadStar = new Star(0, 0, -50);
    internal.threeScene.add(passedStar.mesh);
    internal.threeScene.add(aheadStar.mesh);
    internal.stars = [passedStar, aheadStar];

    const passedGeoSpy = vi.spyOn(passedStar.mesh.geometry, 'dispose');
    const aheadGeoSpy = vi.spyOn(aheadStar.mesh.geometry, 'dispose');

    internal.cleanupPassedObjects();

    expect(internal.stars).toHaveLength(1);
    expect(internal.stars[0]).toBe(aheadStar);
    expect(internal.threeScene.children).not.toContain(passedStar.mesh);
    expect(internal.threeScene.children).toContain(aheadStar.mesh);
    // Shared NORMAL star geometry must NOT be disposed when an instance is removed.
    expect(passedGeoSpy).not.toHaveBeenCalled();
    expect(aheadGeoSpy).not.toHaveBeenCalled();
  });

  it('removes passed meteorites from array, scene, and disposes resources', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      stars: Star[];
      meteorites: Meteorite[];
      threeScene: THREE.Scene;
      spaceship: { position: { x: number; y: number; z: number } };
      cleanupPassedObjects(): void;
    };

    internal.threeScene = new THREE.Scene();
    internal.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const passedMet = new Meteorite(0, 0, 50);
    const aheadMet = new Meteorite(0, 0, -50);
    internal.threeScene.add(passedMet.mesh);
    internal.threeScene.add(aheadMet.mesh);
    internal.meteorites = [passedMet, aheadMet];
    internal.stars = [];

    const passedGeoSpy = vi.spyOn(passedMet.mesh.geometry, 'dispose');

    internal.cleanupPassedObjects();

    expect(internal.meteorites).toHaveLength(1);
    expect(internal.meteorites[0]).toBe(aheadMet);
    expect(internal.threeScene.children).not.toContain(passedMet.mesh);
    expect(internal.threeScene.children).toContain(aheadMet.mesh);
    // Shared meteorite geometry must NOT be disposed when an instance is removed.
    expect(passedGeoSpy).not.toHaveBeenCalled();
  });

  it('rotates retained meteorites on X/Z each cleanup pass and skips released ones', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      stars: Star[];
      meteorites: Meteorite[];
      threeScene: THREE.Scene;
      spaceship: { position: { x: number; y: number; z: number } };
      cleanupPassedObjects(deltaTime: number): void;
    };

    internal.threeScene = new THREE.Scene();
    internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
    internal.stars = [];

    const aheadMets = [
      new Meteorite(0, 0, -10),
      new Meteorite(0, 0, -20),
      new Meteorite(0, 0, -30),
    ];
    const passedMet = new Meteorite(0, 0, 50);
    for (const m of [...aheadMets, passedMet]) internal.threeScene.add(m.mesh);
    internal.meteorites = [...aheadMets, passedMet];

    // Pre-conditions: all rotations start at 0.
    for (const m of [...aheadMets, passedMet]) {
      expect(m.mesh.rotation.x).toBe(0);
      expect(m.mesh.rotation.z).toBe(0);
    }

    internal.cleanupPassedObjects(0.1);

    // Active meteorites must have rotated on both axes.
    for (const m of aheadMets) {
      expect(m.mesh.rotation.x).toBeGreaterThan(0);
      expect(m.mesh.rotation.z).toBeGreaterThan(0);
    }
    // Released meteorite was reset/recycled and must NOT show rotation growth
    // from update(); recycle() resets rotation to 0.
    expect(passedMet.mesh.rotation.x).toBe(0);
    expect(passedMet.mesh.rotation.z).toBe(0);
    expect(internal.meteorites).toHaveLength(3);
  });

  it('skips meteorite update when isActive is false', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      stars: Star[];
      meteorites: Meteorite[];
      threeScene: THREE.Scene;
      spaceship: { position: { x: number; y: number; z: number } };
      cleanupPassedObjects(deltaTime: number): void;
    };

    internal.threeScene = new THREE.Scene();
    internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
    internal.stars = [];

    const inactiveMet = new Meteorite(0, 0, -10);
    inactiveMet.isActive = false;
    internal.threeScene.add(inactiveMet.mesh);
    internal.meteorites = [inactiveMet];

    internal.cleanupPassedObjects(0.1);

    expect(inactiveMet.mesh.rotation.x).toBe(0);
    expect(inactiveMet.mesh.rotation.z).toBe(0);
    expect(internal.meteorites).toHaveLength(1);
  });

  it('does not let scene children grow unboundedly across many cleanup cycles', () => {
    const scene = createScene();
    const internal = scene as unknown as {
      stars: Star[];
      meteorites: Meteorite[];
      threeScene: THREE.Scene;
      spaceship: { position: { x: number; y: number; z: number } };
      cleanupPassedObjects(): void;
    };

    internal.threeScene = new THREE.Scene();
    internal.spaceship = { position: { x: 0, y: 0, z: 0 } };
    internal.stars = [];
    internal.meteorites = [];

    for (let cycle = 0; cycle < 20; cycle++) {
      const star = new Star(0, 0, internal.spaceship.position.z + 50);
      const met = new Meteorite(0, 0, internal.spaceship.position.z + 50);
      internal.threeScene.add(star.mesh);
      internal.threeScene.add(met.mesh);
      internal.stars.push(star);
      internal.meteorites.push(met);

      internal.cleanupPassedObjects();
      internal.spaceship.position.z -= 50;
    }

    expect(internal.stars).toHaveLength(0);
    expect(internal.meteorites).toHaveLength(0);
    expect(internal.threeScene.children).toHaveLength(0);
  });
});

describe('StageScene boost activation SFX feedback (PC keyboard parity with HUD)', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  function createSceneForBoost(): {
    scene: StageScene;
    inputState: { moveDirection: number; boostPressed: boolean };
    audioManager: { playSFX: ReturnType<typeof vi.fn> };
  } {
    const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
    const inputState = { moveDirection: 0, boostPressed: false };
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
    scene.enter({ stageNumber: 1 });
    return {
      scene,
      inputState,
      audioManager: audioManager as unknown as { playSFX: ReturnType<typeof vi.fn> },
    };
  }

  it('plays boostDenied SFX when Space is pressed while boost is unavailable', () => {
    const { scene, inputState, audioManager } = createSceneForBoost();
    const internal = scene as unknown as {
      boostSystem: { activate: () => boolean; update: (dt: number) => void };
      update: (dt: number) => void;
    };

    // Consume the boost so the next activate() returns false (cooldown/active).
    expect(internal.boostSystem.activate()).toBe(true);

    // Sanity: a second activate() now returns false.
    expect(internal.boostSystem.activate()).toBe(false);

    audioManager.playSFX.mockClear();

    // Simulate PC keyboard Space press during cooldown.
    inputState.boostPressed = true;
    internal.update(0.016);

    const sfxCalls = audioManager.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxCalls).toContain('boostDenied');
    expect(sfxCalls).not.toContain('boost');
    // Input flag must be consumed even when activation failed.
    expect(inputState.boostPressed).toBe(false);
  });

  it('plays boost SFX (not boostDenied) when boost is available', () => {
    const { scene, inputState, audioManager } = createSceneForBoost();
    const internal = scene as unknown as {
      boostSystem: { isAvailable: () => boolean };
      update: (dt: number) => void;
    };

    // Boost should be available right after enter().
    expect(internal.boostSystem.isAvailable()).toBe(true);

    audioManager.playSFX.mockClear();

    inputState.boostPressed = true;
    internal.update(0.016);

    const sfxCalls = audioManager.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxCalls).toContain('boost');
    expect(sfxCalls).not.toContain('boostDenied');
    expect(inputState.boostPressed).toBe(false);
  });
});
