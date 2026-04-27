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

function createStage(): StageScene {
  const sceneManager = { requestTransition: vi.fn() } as unknown as SceneManager;
  const inputSystem = { setBoostPressed: vi.fn() } as unknown as InputSystem;
  const audioManager = {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    playSFX: vi.fn(),
  } as unknown as AudioManager;
  const saveManager = {
    load: vi.fn().mockReturnValue({ clearedStage: 0, unlockedPlanets: [] }),
    save: vi.fn(),
  } as unknown as SaveManager;
  return new StageScene(sceneManager, inputSystem, audioManager, saveManager);
}

describe('StageScene.cleanupPassedObjects', () => {
  it('disposes and removes stars/meteorites that have passed behind the spaceship', () => {
    const stage = createStage();
    const internals = stage as unknown as {
      spaceship: { position: { z: number } };
      stars: Star[];
      meteorites: Meteorite[];
      threeScene: THREE.Scene;
      cleanupPassedObjects: () => void;
    };

    // Replace threeScene with a fresh one we control
    internals.threeScene = new THREE.Scene();
    internals.spaceship = { position: { z: 0 } };

    // Two stars: one well behind (passed), one ahead
    const passedStar = new Star(0, 0, 100, 'NORMAL'); // behind: z=100 > shipZ(0)+30
    const aheadStar = new Star(0, 0, -50, 'NORMAL');
    internals.stars = [passedStar, aheadStar];
    internals.threeScene.add(passedStar.mesh);
    internals.threeScene.add(aheadStar.mesh);

    // Two meteorites: one passed, one ahead
    const passedMet = new Meteorite(0, 0, 80);
    const aheadMet = new Meteorite(0, 0, -20);
    internals.meteorites = [passedMet, aheadMet];
    internals.threeScene.add(passedMet.mesh);
    internals.threeScene.add(aheadMet.mesh);

    const passedStarGeo = passedStar.mesh.geometry;
    const passedStarMat = passedStar.mesh.material as THREE.Material;
    const passedMetGeo = passedMet.mesh.geometry;
    const passedMetMat = passedMet.mesh.material as THREE.Material;
    const geoSpy = vi.spyOn(passedStarGeo, 'dispose');
    const matSpy = vi.spyOn(passedStarMat, 'dispose');
    const metGeoSpy = vi.spyOn(passedMetGeo, 'dispose');
    const metMatSpy = vi.spyOn(passedMetMat, 'dispose');

    expect(internals.threeScene.children).toHaveLength(4);

    internals.cleanupPassedObjects();

    // Arrays only contain ahead objects
    expect(internals.stars).toEqual([aheadStar]);
    expect(internals.meteorites).toEqual([aheadMet]);

    // Passed meshes are removed from the scene graph; ahead meshes remain
    expect(internals.threeScene.children).toContain(aheadStar.mesh);
    expect(internals.threeScene.children).toContain(aheadMet.mesh);
    expect(internals.threeScene.children).not.toContain(passedStar.mesh);
    expect(internals.threeScene.children).not.toContain(passedMet.mesh);
    expect(internals.threeScene.children).toHaveLength(2);

    // dispose() was called on geometries/materials of the passed entities
    expect(geoSpy).toHaveBeenCalled();
    expect(matSpy).toHaveBeenCalled();
    expect(metGeoSpy).toHaveBeenCalled();
    expect(metMatSpy).toHaveBeenCalled();
  });

  it('keeps stars/meteorites that are still within the active range', () => {
    const stage = createStage();
    const internals = stage as unknown as {
      spaceship: { position: { z: number } };
      stars: Star[];
      meteorites: Meteorite[];
      threeScene: THREE.Scene;
      cleanupPassedObjects: () => void;
    };

    internals.threeScene = new THREE.Scene();
    internals.spaceship = { position: { z: 0 } };

    // Boundary: exactly at shipZ + 30 should NOT be cleaned up (uses strict >)
    const boundaryStar = new Star(0, 0, 30, 'NORMAL');
    const boundaryMet = new Meteorite(0, 0, 30);
    internals.stars = [boundaryStar];
    internals.meteorites = [boundaryMet];
    internals.threeScene.add(boundaryStar.mesh);
    internals.threeScene.add(boundaryMet.mesh);

    internals.cleanupPassedObjects();

    expect(internals.stars).toEqual([boundaryStar]);
    expect(internals.meteorites).toEqual([boundaryMet]);
    expect(internals.threeScene.children).toContain(boundaryStar.mesh);
    expect(internals.threeScene.children).toContain(boundaryMet.mesh);
  });
});
