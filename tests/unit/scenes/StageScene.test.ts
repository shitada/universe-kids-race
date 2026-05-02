// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene, __resetStageSceneSharedAssetCachesForTest } from '../../../src/game/scenes/StageScene';
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

  it('releases an inactive meteorite to the pool in the same cleanup pass', () => {
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

    // Inactive meteorites are now released the same frame so they no longer
    // incur empty CollisionSystem / scene-graph traversal cost while drifting
    // toward behindThreshold. recycle() resets rotation back to 0 and detaches
    // the mesh from its parent.
    expect(inactiveMet.mesh.rotation.x).toBe(0);
    expect(inactiveMet.mesh.rotation.z).toBe(0);
    expect(internal.meteorites).toHaveLength(0);
    expect(inactiveMet.mesh.parent).toBeNull();
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
    // Bypass the start countdown so existing boost-input assertions can run
    // immediately after enter(). Countdown is covered by StageScene.countdown.test.ts.
    (scene as unknown as { countdownOverlay: { dispose(): void } | null }).countdownOverlay?.dispose();
    (scene as unknown as { isStarting: boolean }).isStarting = false;
    (scene as unknown as { countdownOverlay: unknown | null }).countdownOverlay = null;
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

describe('StageScene best-stage-stars-update feedback on clear', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  function setupClearScene(opts: {
    stageNumber: number;
    earnedStars: number;
    previousBest: number;
    alreadyUnlocked: boolean;
  }): {
    scene: StageScene;
    sceneManager: { requestTransition: ReturnType<typeof vi.fn> };
    audioManager: { playSFX: ReturnType<typeof vi.fn>; stopBoostSFX: ReturnType<typeof vi.fn> };
    saveManager: {
      load: ReturnType<typeof vi.fn>;
      markStageCleared: ReturnType<typeof vi.fn>;
      updateBestStageStars: ReturnType<typeof vi.fn>;
    };
  } {
    const sceneManager = { requestTransition: vi.fn() };
    const inputSystem = {} as InputSystem;
    const audioManager = {
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
    } as unknown as AudioManager;
    const unlockedPlanets = opts.alreadyUnlocked ? [opts.stageNumber] : [];
    // load() must reflect the previously stored best (i.e. the snapshot
    // taken BEFORE updateBestStageStars() runs). The implementation must
    // capture the prior value first, otherwise this snapshot is lost.
    const saveManager = {
      load: vi.fn(() => ({
        clearedStage: 0,
        unlockedPlanets,
        muted: false,
        bestStageStars: { [opts.stageNumber]: opts.previousBest },
      })),
      markStageCleared: vi.fn(() => !opts.alreadyUnlocked),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;

    const scene = new StageScene(sceneManager as unknown as SceneManager, inputSystem, audioManager, saveManager);
    (scene as unknown as { ensureInitialized(): void }).ensureInitialized();
    const internal = scene as unknown as {
      stageNumber: number;
      scoreSystem: { getStarCount(): number };
      companionManager: unknown | null;
    };
    internal.stageNumber = opts.stageNumber;
    internal.scoreSystem = { getStarCount: () => opts.earnedStars } as { getStarCount(): number };
    internal.companionManager = null;

    return {
      scene,
      sceneManager,
      audioManager: audioManager as unknown as {
        playSFX: ReturnType<typeof vi.fn>;
        stopBoostSFX: ReturnType<typeof vi.fn>;
      },
      saveManager: saveManager as unknown as {
        load: ReturnType<typeof vi.fn>;
        markStageCleared: ReturnType<typeof vi.fn>;
        updateBestStageStars: ReturnType<typeof vi.fn>;
      },
    };
  }

  it('marks the stage as cleared immediately before any transition', () => {
    const { scene, sceneManager, saveManager } = setupClearScene({
      stageNumber: 4,
      earnedStars: 2,
      previousBest: 1,
      alreadyUnlocked: false,
    });

    (scene as unknown as { onStageClear(): void }).onStageClear();

    expect(saveManager.markStageCleared).toHaveBeenCalledTimes(1);
    expect(saveManager.markStageCleared).toHaveBeenCalledWith(4);
    expect(saveManager.markStageCleared.mock.invocationCallOrder[0]).toBeLessThan(
      saveManager.updateBestStageStars.mock.invocationCallOrder[0],
    );
    expect(sceneManager.requestTransition).not.toHaveBeenCalled();
  });

  it('shows "じこベストこうしん" message and plays rainbowCollect SFX when star count exceeds previous best', () => {
    const { scene, audioManager } = setupClearScene({
      stageNumber: 2,
      earnedStars: 4,
      previousBest: 2,
      alreadyUnlocked: true,
    });

    (scene as unknown as { onStageClear(): void }).onStageClear();

    const overlay = document.getElementById('ui-overlay');
    expect(overlay?.textContent).toContain('じこベストこうしん');
    expect(overlay?.textContent).toContain('⭐');
    expect(overlay?.textContent).toContain('4');

    const sfxCalls = audioManager.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxCalls).toContain('stageClear');
    expect(sfxCalls).toContain('rainbowCollect');
    // SFX order: stageClear plays first, then rainbowCollect for the best update.
    expect(sfxCalls.indexOf('rainbowCollect')).toBeGreaterThan(sfxCalls.indexOf('stageClear'));
  });

  it('shows "じこベストこうしん" on first clear (previous best is 0) when stars > 0', () => {
    const { scene, audioManager } = setupClearScene({
      stageNumber: 1,
      earnedStars: 1,
      previousBest: 0,
      alreadyUnlocked: false,
    });

    (scene as unknown as { onStageClear(): void }).onStageClear();

    const overlay = document.getElementById('ui-overlay');
    expect(overlay?.textContent).toContain('じこベストこうしん');
    const sfxCalls = audioManager.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxCalls).toContain('rainbowCollect');
  });

  it('does NOT show best-update message when star count equals previous best', () => {
    const { scene, audioManager } = setupClearScene({
      stageNumber: 3,
      earnedStars: 3,
      previousBest: 3,
      alreadyUnlocked: true,
    });

    (scene as unknown as { onStageClear(): void }).onStageClear();

    const overlay = document.getElementById('ui-overlay');
    expect(overlay?.textContent).not.toContain('じこベストこうしん');
    const sfxCalls = audioManager.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxCalls).not.toContain('rainbowCollect');
  });

  it('does NOT show best-update message when star count is below previous best', () => {
    const { scene, audioManager } = setupClearScene({
      stageNumber: 3,
      earnedStars: 1,
      previousBest: 4,
      alreadyUnlocked: true,
    });

    (scene as unknown as { onStageClear(): void }).onStageClear();

    const overlay = document.getElementById('ui-overlay');
    expect(overlay?.textContent).not.toContain('じこベストこうしん');
    const sfxCalls = audioManager.playSFX.mock.calls.map((c) => c[0]);
    expect(sfxCalls).not.toContain('rainbowCollect');
  });

  it('inserts the best-update line between "やったね" and "⭐ N こ" lines', () => {
    const { scene } = setupClearScene({
      stageNumber: 2,
      earnedStars: 5,
      previousBest: 1,
      alreadyUnlocked: true,
    });

    (scene as unknown as { onStageClear(): void }).onStageClear();

    const overlayDiv = (scene as unknown as { clearOverlay: HTMLDivElement | null })
      .clearOverlay;
    expect(overlayDiv).not.toBeNull();
    const texts = Array.from(overlayDiv!.children).map((el) => (el as HTMLElement).textContent ?? '');
    const yattaneIdx = texts.findIndex((t) => t.includes('やったね'));
    const bestIdx = texts.findIndex((t) => t.includes('じこベストこうしん'));
    const scoreIdx = texts.findIndex((t) => t.startsWith('⭐'));
    expect(yattaneIdx).toBeGreaterThanOrEqual(0);
    expect(bestIdx).toBeGreaterThan(yattaneIdx);
    expect(scoreIdx).toBeGreaterThan(bestIdx);
  });

  it('injects @keyframes bestStageStarsPop into document.head when best is updated', () => {
    document.getElementById('best-stage-stars-animation')?.remove();

    const { scene } = setupClearScene({
      stageNumber: 2,
      earnedStars: 3,
      previousBest: 1,
      alreadyUnlocked: true,
    });

    (scene as unknown as { onStageClear(): void }).onStageClear();

    const styleEl = document.getElementById('best-stage-stars-animation');
    expect(styleEl).not.toBeNull();
    expect(styleEl?.tagName).toBe('STYLE');
    expect(styleEl?.textContent).toContain('@keyframes bestStageStarsPop');
  });

  it('does NOT inject the keyframes style when best is not updated', () => {
    document.getElementById('best-stage-stars-animation')?.remove();

    const { scene } = setupClearScene({
      stageNumber: 3,
      earnedStars: 2,
      previousBest: 4,
      alreadyUnlocked: true,
    });

    (scene as unknown as { onStageClear(): void }).onStageClear();

    expect(document.getElementById('best-stage-stars-animation')).toBeNull();
  });
});

describe('StageScene cumulative totals on re-entry', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
  });

  function createEnterableStageScene(): {
    scene: StageScene;
    sceneManager: { requestTransition: ReturnType<typeof vi.fn> };
  } {
    const sceneManager = { requestTransition: vi.fn() };
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], tutorialShown: true })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;

    return {
      scene: new StageScene(
        sceneManager as unknown as SceneManager,
        inputSystem,
        audioManager,
        saveManager,
      ),
      sceneManager,
    };
  }

  function skipCountdown(scene: StageScene): void {
    const internal = scene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
    };
    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
  }

  it('reuses persistent Three.js objects across exit and re-entry without duplicating them', () => {
    const saveState = {
      clearedStage: 0,
      unlockedPlanets: [1, 2],
      muted: false,
      tutorialShown: true,
      bestStageStars: {} as Record<number, number>,
    };
    const sceneManager = { requestTransition: vi.fn() };
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({
        ...saveState,
        unlockedPlanets: [...saveState.unlockedPlanets],
        bestStageStars: { ...saveState.bestStageStars },
      })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;
    const scene = new StageScene(sceneManager as unknown as SceneManager, inputSystem, audioManager, saveManager);
    const internal = scene as unknown as {
      threeScene: THREE.Scene;
      spaceship: {
        position: { x: number; y: number; z: number };
        speedState: string;
        mesh: THREE.Group;
        activateBoost(): void;
      };
      airShield: {
        getMesh(): THREE.Mesh;
        getMode(): string;
        setShieldMode(mode: 'BOOST' | 'OFF'): void;
      };
      bgStars: THREE.Points | null;
      companionManager: {
        getCount(): number;
        getGroup(): THREE.Group;
      } | null;
      boostLinesEffect: { getObject(): THREE.LineSegments | null };
      boostFlameEffect: { getObject(): THREE.Points | null };
      destinationPlanet: THREE.Group | null;
      clearOverlay: HTMLDivElement | null;
      damageTimer: number;
    };

    scene.enter({ stageNumber: 1 });
    skipCountdown(scene);

    const threeSceneRef = internal.threeScene;
    const spaceshipRef = internal.spaceship;
    const spaceshipMeshRef = internal.spaceship.mesh;
    const airShieldMeshRef = internal.airShield.getMesh();
    const companionManagerRef = internal.companionManager;
    const companionGroupRef = companionManagerRef?.getGroup() ?? null;
    const boostLinesRef = internal.boostLinesEffect.getObject();
    const boostFlameRef = internal.boostFlameEffect.getObject();
    const destinationPlanetRef = internal.destinationPlanet;

    internal.spaceship.position.x = 6;
    internal.spaceship.position.z = -120;
    internal.spaceship.mesh.position.set(6, 0, -120);
    internal.spaceship.activateBoost();
    internal.airShield.setShieldMode('BOOST');
    internal.damageTimer = 1;
    internal.clearOverlay = document.createElement('div');
    document.getElementById('ui-overlay')?.appendChild(internal.clearOverlay);

    scene.exit();
    saveState.unlockedPlanets = [1, 2, 3, 4];
    scene.enter({ stageNumber: 4 });
    skipCountdown(scene);

    expect(internal.threeScene).toBe(threeSceneRef);
    expect(internal.spaceship).toBe(spaceshipRef);
    expect(internal.spaceship.mesh).toBe(spaceshipMeshRef);
    expect(internal.airShield.getMesh()).toBe(airShieldMeshRef);
    expect(internal.bgStars).not.toBeNull();
    expect(internal.companionManager).toBe(companionManagerRef);
    expect(internal.companionManager?.getGroup()).toBe(companionGroupRef);
    expect(internal.boostLinesEffect.getObject()).toBe(boostLinesRef);
    expect(internal.boostFlameEffect.getObject()).toBe(boostFlameRef);
    expect(internal.destinationPlanet).not.toBe(destinationPlanetRef);

    expect(internal.damageTimer).toBe(0);
    expect(internal.clearOverlay).toBeNull();
    expect(internal.spaceship.position).toEqual({ x: 0, y: 0, z: 0 });
    expect(internal.spaceship.speedState).toBe('NORMAL');
    expect(internal.airShield.getMode()).toBe('OFF');
    expect(internal.airShield.getMesh().visible).toBe(false);
    expect(internal.companionManager?.getCount()).toBe(4);
    expect(companionGroupRef?.children).toHaveLength(4);

    expect(threeSceneRef.children.filter((child) => child === spaceshipMeshRef)).toHaveLength(1);
    expect(threeSceneRef.children.filter((child) => child === airShieldMeshRef)).toHaveLength(1);
    expect(threeSceneRef.children.filter((child) => child === internal.bgStars)).toHaveLength(1);
    expect(threeSceneRef.children.filter((child) => child === companionGroupRef)).toHaveLength(1);
    expect(threeSceneRef.children.filter((child) => child.type === 'AmbientLight')).toHaveLength(1);
    expect(threeSceneRef.children.filter((child) => child.type === 'DirectionalLight')).toHaveLength(1);
  });

  it('resets cached cumulative totals to zero when re-entered without totals context', () => {
    const { scene } = createEnterableStageScene();
    const internal = scene as unknown as {
      scoreSystem: { getTotalScore(): number; getTotalStarCount(): number };
    };

    scene.enter({ stageNumber: 1, totalScore: 900, totalStarCount: 9 });
    skipCountdown(scene);
    expect(internal.scoreSystem.getTotalScore()).toBe(900);
    expect(internal.scoreSystem.getTotalStarCount()).toBe(9);

    scene.exit();
    scene.enter({ stageNumber: 1 });
    skipCountdown(scene);

    expect(internal.scoreSystem.getTotalScore()).toBe(0);
    expect(internal.scoreSystem.getTotalStarCount()).toBe(0);
  });

  it('keeps cumulative totals when clearing into the next stage', () => {
    const { scene, sceneManager } = createEnterableStageScene();
    const internal = scene as unknown as {
      scoreSystem: {
        addStarScore(starType: 'NORMAL' | 'RAINBOW'): void;
        getTotalScore(): number;
        getTotalStarCount(): number;
      };
      handleStageComplete(): void;
    };

    scene.enter({ stageNumber: 1, totalScore: 500, totalStarCount: 5 });
    skipCountdown(scene);
    internal.scoreSystem.addStarScore('NORMAL');

    internal.handleStageComplete();

    expect(internal.scoreSystem.getTotalScore()).toBe(600);
    expect(internal.scoreSystem.getTotalStarCount()).toBe(6);
    expect(sceneManager.requestTransition).toHaveBeenCalledWith('stage', {
      stageNumber: 2,
      totalScore: 600,
      totalStarCount: 6,
    });
  });
});

describe('StageScene visual quality tier', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';
    __resetStageSceneSharedAssetCachesForTest();
  });

  function createEnterableStageScene(): StageScene {
    const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
    const inputSystem = {
      setBoostPressed: vi.fn(),
      getState: vi.fn(() => ({ moveDirection: 0, boostPressed: false })),
      resetPointers: vi.fn(),
    } as unknown as InputSystem;
    const audioManager = {
      playBGM: vi.fn(),
      stopBGM: vi.fn(),
      playSFX: vi.fn(),
      stopBoostSFX: vi.fn(),
      startBoostSFX: vi.fn(),
      isMuted: vi.fn(() => false),
      toggleMute: vi.fn(() => false),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [], tutorialShown: true })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;
    return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
  }

  function skipCountdown(scene: StageScene): void {
    const internal = scene as unknown as {
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
    };
    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;
  }

  it('shrinks background stars and VFX density without changing gameplay state', () => {
    const scene = createEnterableStageScene();
    const internal = scene as unknown as {
      bgStars: THREE.Points | null;
      boostLinesEffect: { getObject(): THREE.LineSegments | null };
      scoreSystem: { getStageScore(): number; getStarCount(): number };
      boostSystem: { isAvailable(): boolean };
      stars: Star[];
      meteorites: Meteorite[];
      spaceship: { position: { x: number; y: number; z: number } };
    };

    scene.enter({ stageNumber: 1 });
    skipCountdown(scene);

    const bgStars = internal.bgStars;
    const boostLines = internal.boostLinesEffect.getObject();
    expect(bgStars).not.toBeNull();
    expect(boostLines).not.toBeNull();
    expect(bgStars!.geometry.drawRange.count).toBe(2000);
    expect(boostLines!.geometry.drawRange.count).toBe(40);

    const beforeState = {
      stageScore: internal.scoreSystem.getStageScore(),
      starCount: internal.scoreSystem.getStarCount(),
      boostAvailable: internal.boostSystem.isAvailable(),
      starsLength: internal.stars.length,
      meteoritesLength: internal.meteorites.length,
      shipPosition: { ...internal.spaceship.position },
    };

    scene.setVisualQualityTier(0);

    expect(bgStars!.geometry.drawRange.count).toBe(900);
    expect(boostLines!.geometry.drawRange.count).toBe(18);
    expect(internal.scoreSystem.getStageScore()).toBe(beforeState.stageScore);
    expect(internal.scoreSystem.getStarCount()).toBe(beforeState.starCount);
    expect(internal.boostSystem.isAvailable()).toBe(beforeState.boostAvailable);
    expect(internal.stars.length).toBe(beforeState.starsLength);
    expect(internal.meteorites.length).toBe(beforeState.meteoritesLength);
    expect(internal.spaceship.position).toEqual(beforeState.shipPosition);
  });
});
