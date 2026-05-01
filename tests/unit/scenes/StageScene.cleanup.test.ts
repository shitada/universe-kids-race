// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { StageScene } from '../../../src/game/scenes/StageScene';
import { Star } from '../../../src/game/entities/Star';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { InputSystem } from '../../../src/game/systems/InputSystem';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';

function createScene(): StageScene {
  const sceneManager = {} as unknown as SceneManager;
  const inputSystem = {} as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [] })),
    save: vi.fn(),
    clear: vi.fn(),
  } as unknown as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

interface StageSceneInternals {
  threeScene: THREE.Scene;
  spaceship: { position: { x: number; y: number; z: number } };
  stars: Star[];
  meteorites: Meteorite[];
  cleanupPassedObjects: () => void;
}

describe('StageScene.cleanupPassedObjects', () => {
  it('removes passed Stars from array, scene, and disposes them', () => {
    const scene = createScene();
    const internals = scene as unknown as StageSceneInternals;

    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    // Star far behind ship (z > 30) -> should be removed
    const passedStar = new Star(0, 0, 50);
    threeScene.add(passedStar.mesh);
    const passedRecycle = vi.spyOn(passedStar, 'recycle');

    // Star ahead -> should remain
    const aheadStar = new Star(0, 0, -10);
    threeScene.add(aheadStar.mesh);

    // Star just behind threshold -> should remain (z == shipZ + 30 not strictly greater)
    const borderlineStar = new Star(0, 0, 30);
    threeScene.add(borderlineStar.mesh);

    internals.stars = [passedStar, aheadStar, borderlineStar];
    internals.meteorites = [];

    internals.cleanupPassedObjects();

    expect(internals.stars).toHaveLength(2);
    expect(internals.stars).toContain(aheadStar);
    expect(internals.stars).toContain(borderlineStar);
    expect(internals.stars).not.toContain(passedStar);

    expect(passedStar.mesh.parent).toBeNull();
    expect(aheadStar.mesh.parent).toBe(threeScene);
    expect(borderlineStar.mesh.parent).toBe(threeScene);

    expect(passedRecycle).toHaveBeenCalledTimes(1);
  });

  it('removes passed Meteorites from array, scene, and disposes them', () => {
    const scene = createScene();
    const internals = scene as unknown as StageSceneInternals;

    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const passedMet = new Meteorite(0, 0, 100);
    threeScene.add(passedMet.mesh);
    const passedRecycle = vi.spyOn(passedMet, 'recycle');

    const aheadMet = new Meteorite(0, 0, -20);
    threeScene.add(aheadMet.mesh);

    internals.stars = [];
    internals.meteorites = [passedMet, aheadMet];

    internals.cleanupPassedObjects();

    expect(internals.meteorites).toHaveLength(1);
    expect(internals.meteorites).toContain(aheadMet);
    expect(internals.meteorites).not.toContain(passedMet);

    expect(passedMet.mesh.parent).toBeNull();
    expect(aheadMet.mesh.parent).toBe(threeScene);

    expect(passedRecycle).toHaveBeenCalledTimes(1);
  });

  it('also cleans up already-collected Stars and inactive Meteorites once they pass behind', () => {
    const scene = createScene();
    const internals = scene as unknown as StageSceneInternals;

    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const collectedPassed = new Star(0, 0, 60);
    collectedPassed.isCollected = true;
    collectedPassed.mesh.visible = false;
    threeScene.add(collectedPassed.mesh);

    const inactivePassed = new Meteorite(0, 0, 60);
    inactivePassed.isActive = false;
    inactivePassed.mesh.visible = false;
    threeScene.add(inactivePassed.mesh);

    internals.stars = [collectedPassed];
    internals.meteorites = [inactivePassed];

    internals.cleanupPassedObjects();

    expect(internals.stars).toHaveLength(0);
    expect(internals.meteorites).toHaveLength(0);
    expect(collectedPassed.mesh.parent).toBeNull();
    expect(inactivePassed.mesh.parent).toBeNull();
  });

  it('removes already-collected Stars even when still ahead of the behind-threshold', () => {
    const scene = createScene();
    const internals = scene as unknown as StageSceneInternals;

    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    // Collected star still ahead of the ship -> should still be released this frame
    const collectedAhead = new Star(0, 0, -5);
    collectedAhead.isCollected = true;
    threeScene.add(collectedAhead.mesh);
    const recycleSpy = vi.spyOn(collectedAhead, 'recycle');

    const aliveAhead = new Star(0, 0, -10);
    threeScene.add(aliveAhead.mesh);

    internals.stars = [collectedAhead, aliveAhead];
    internals.meteorites = [];

    internals.cleanupPassedObjects();

    expect(internals.stars).toHaveLength(1);
    expect(internals.stars).toContain(aliveAhead);
    expect(internals.stars).not.toContain(collectedAhead);
    expect(collectedAhead.mesh.parent).toBeNull();
    expect(recycleSpy).toHaveBeenCalledTimes(1);
  });

  it('keeps unrelated objects untouched when cleaning passed objects', () => {
    const scene = createScene();
    const internals = scene as unknown as StageSceneInternals;

    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const decoration = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial(),
    );
    threeScene.add(decoration);

    internals.stars = [];
    internals.meteorites = [];
    internals.cleanupPassedObjects();

    expect(decoration.parent).toBe(threeScene);
  });

  it('compacts arrays in-place, preserving array identity and order of survivors', () => {
    const scene = createScene();
    const internals = scene as unknown as StageSceneInternals;

    const threeScene = new THREE.Scene();
    internals.threeScene = threeScene;
    internals.spaceship = { position: { x: 0, y: 0, z: 0 } };

    const s1 = new Star(0, 0, -10);
    const s2 = new Star(0, 0, 50); // passed
    const s3 = new Star(0, 0, -5);
    const s4 = new Star(0, 0, 80); // passed
    const s5 = new Star(0, 0, 0);
    [s1, s2, s3, s4, s5].forEach((s) => threeScene.add(s.mesh));

    const m1 = new Meteorite(0, 0, 100); // passed
    const m2 = new Meteorite(0, 0, -10);
    const m3 = new Meteorite(0, 0, 90); // passed
    [m1, m2, m3].forEach((m) => threeScene.add(m.mesh));

    const starsRef = [s1, s2, s3, s4, s5];
    const meteoritesRef = [m1, m2, m3];
    internals.stars = starsRef;
    internals.meteorites = meteoritesRef;

    internals.cleanupPassedObjects();

    // Same array instances are preserved (in-place compaction).
    expect(internals.stars).toBe(starsRef);
    expect(internals.meteorites).toBe(meteoritesRef);

    // Order of survivors matches original insertion order.
    expect(internals.stars).toEqual([s1, s3, s5]);
    expect(internals.meteorites).toEqual([m2]);
  });
});

describe('StageScene exit cleanup', () => {
  it('keeps persistent nodes but removes stage-specific nodes on exit', () => {
    document.body.innerHTML = '<div id="hud"></div><div id="ui-overlay"></div>';

    const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
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
      setMuted: vi.fn(),
      initFromInteraction: vi.fn(),
    } as unknown as AudioManager;
    const saveManager = {
      load: vi.fn(() => ({ clearedStage: 0, unlockedPlanets: [1, 2], muted: false, tutorialShown: true })),
      save: vi.fn(),
      clear: vi.fn(),
      markStageCleared: vi.fn(() => false),
      updateBestStageStars: vi.fn(),
    } as unknown as SaveManager;
    const stageScene = new StageScene(sceneManager, inputSystem, audioManager, saveManager);
    const internal = stageScene as unknown as {
      threeScene: THREE.Scene;
      spaceship: { mesh: THREE.Group; position: { z: number } };
      airShield: { getMesh(): THREE.Mesh };
      bgStars: THREE.Points | null;
      companionManager: { getGroup(): THREE.Group } | null;
      boostLinesEffect: { getObject(): THREE.LineSegments | null };
      boostFlameEffect: { getObject(): THREE.Points | null };
      destinationPlanet: THREE.Group | null;
      stageConfig: {
        meteoriteInterval: number;
        starDensity: number;
        stageLength: number;
        stageNumber: number;
        destination: string;
        emoji: string;
        displayName: string;
        planetColor: number;
      };
      spawnSystem: {
        update(
          deltaTime: number,
          spaceshipZ: number,
          config: {
            meteoriteInterval: number;
            starDensity: number;
            stageLength: number;
            stageNumber: number;
            destination: string;
            emoji: string;
            displayName: string;
            planetColor: number;
          },
        ): { newStars: Star[]; newMeteorites: Meteorite[] };
      };
      stars: Star[];
      meteorites: Meteorite[];
      countdownOverlay: { dispose(): void } | null;
      isStarting: boolean;
    };

    stageScene.enter({ stageNumber: 1 });
    internal.countdownOverlay?.dispose();
    internal.countdownOverlay = null;
    internal.isStarting = false;

    const persistentNodes = [
      internal.spaceship.mesh,
      internal.airShield.getMesh(),
      internal.companionManager?.getGroup(),
      internal.boostLinesEffect.getObject(),
      internal.boostFlameEffect.getObject(),
    ].filter((node): node is THREE.Object3D => node instanceof THREE.Object3D);
    const destinationPlanetRef = internal.destinationPlanet;

    const spawnResult = internal.spawnSystem.update(
      internal.stageConfig.meteoriteInterval,
      internal.spaceship.position.z,
      { ...internal.stageConfig, starDensity: 1 },
    );
    for (const star of spawnResult.newStars) {
      internal.stars.push(star);
      internal.threeScene.add(star.mesh);
    }
    for (const met of spawnResult.newMeteorites) {
      internal.meteorites.push(met);
      internal.threeScene.add(met.mesh);
    }

    expect(internal.stars.length + internal.meteorites.length).toBeGreaterThan(0);

    stageScene.exit();

    expect(destinationPlanetRef?.parent).toBeNull();
    expect(internal.destinationPlanet).toBeNull();
    expect(internal.bgStars).toBeNull();
    expect(internal.stars).toHaveLength(0);
    expect(internal.meteorites).toHaveLength(0);
    for (const node of persistentNodes) {
      expect(node.parent).toBe(internal.threeScene);
    }
  });
});
