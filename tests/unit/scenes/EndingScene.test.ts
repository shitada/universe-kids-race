// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { EndingScene } from '../../../src/game/scenes/EndingScene';
import { CompanionManager } from '../../../src/game/entities/CompanionManager';
import { PLANET_ENCYCLOPEDIA } from '../../../src/game/config/PlanetEncyclopedia';
import type { SceneManager } from '../../../src/game/SceneManager';
import type { SaveManager } from '../../../src/game/storage/SaveManager';
import type { AudioManager } from '../../../src/game/audio/AudioManager';
import type { SaveData } from '../../../src/types';

function createMockSceneManager(): SceneManager {
  return {
    requestTransition: vi.fn(),
    registerScene: vi.fn(),
    transitionTo: vi.fn(),
    update: vi.fn(),
    getCurrentThreeScene: vi.fn(),
    getCurrentCamera: vi.fn(),
    setTransitionHandler: vi.fn(),
  } as unknown as SceneManager;
}

function createMockAudioManager(): AudioManager {
  return {
    playBGM: vi.fn(),
    stopBGM: vi.fn(),
    isMuted: vi.fn(() => false),
    toggleMute: vi.fn(() => false),
    setMuted: vi.fn(),
    playSFX: vi.fn(),
    initFromInteraction: vi.fn(),
  } as unknown as AudioManager;
}

function createMockSaveManager(initialData?: SaveData): {
  mock: SaveManager;
  savedData: SaveData[];
} {
  const data: SaveData = initialData ?? { clearedStage: 0, unlockedPlanets: [] };
  const savedData: SaveData[] = [];

  const mock = {
    load: vi.fn(() => ({ ...data, unlockedPlanets: [...data.unlockedPlanets] })),
    save: vi.fn((d: SaveData) => {
      data.clearedStage = d.clearedStage;
      data.unlockedPlanets = [...d.unlockedPlanets];
      savedData.push({ ...d, unlockedPlanets: [...d.unlockedPlanets] });
    }),
    clear: vi.fn(() => {
      data.clearedStage = 0;
      data.unlockedPlanets = [];
    }),
  } as unknown as SaveManager;

  return { mock, savedData };
}

// Mock ui-overlay element for createOverlay
beforeEach(() => {
  const overlay = document.createElement('div');
  overlay.id = 'ui-overlay';
  document.body.appendChild(overlay);
  return () => {
    overlay.remove();
  };
});

describe('EndingScene', () => {
  describe('selective reset (US2)', () => {
    it('resets clearedStage to 0 while preserving unlockedPlanets on full clear', () => {
      const sceneManager = createMockSceneManager();
      const { mock: saveManager, savedData } = createMockSaveManager({
        clearedStage: 11,
        unlockedPlanets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      });
      const audioManager = createMockAudioManager();

      const scene = new EndingScene(sceneManager, saveManager, audioManager);
      scene.enter({ totalScore: 1000, totalStarCount: 50 });

      expect(saveManager.save).toHaveBeenCalled();
      expect(saveManager.clear).not.toHaveBeenCalled();

      const lastSave = savedData[savedData.length - 1];
      expect(lastSave.clearedStage).toBe(0);
      expect(lastSave.unlockedPlanets).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    });

    it('resets clearedStage to 0 while preserving partial unlockedPlanets', () => {
      const sceneManager = createMockSceneManager();
      const { mock: saveManager, savedData } = createMockSaveManager({
        clearedStage: 5,
        unlockedPlanets: [1, 2, 3, 4, 5],
      });
      const audioManager = createMockAudioManager();

      const scene = new EndingScene(sceneManager, saveManager, audioManager);
      scene.enter({ totalScore: 500, totalStarCount: 25 });

      const lastSave = savedData[savedData.length - 1];
      expect(lastSave.clearedStage).toBe(0);
      expect(lastSave.unlockedPlanets).toEqual([1, 2, 3, 4, 5]);
    });

    it('does not call saveManager.clear() (uses selective reset instead)', () => {
      const sceneManager = createMockSceneManager();
      const { mock: saveManager } = createMockSaveManager({
        clearedStage: 11,
        unlockedPlanets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      });
      const audioManager = createMockAudioManager();

      const scene = new EndingScene(sceneManager, saveManager, audioManager);
      scene.enter({ totalScore: 1000, totalStarCount: 50 });

      expect(saveManager.clear).not.toHaveBeenCalled();
    });
  });

  describe('celebration animation (US3)', () => {
    let scene: EndingScene;

    beforeEach(() => {
      const sceneManager = createMockSceneManager();
      const { mock: saveManager } = createMockSaveManager({
        clearedStage: 11,
        unlockedPlanets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      });
      const audioManager = createMockAudioManager();
      scene = new EndingScene(sceneManager, saveManager, audioManager);
      scene.enter({ totalScore: 1000, totalStarCount: 50 });
    });

    it('creates 11 companion meshes after enter()', () => {
      const threeScene = scene.getThreeScene();
      // Find the companion group (a Group containing 11 children)
      let companionGroup: THREE.Group | null = null;
      threeScene.traverse((child) => {
        if (child instanceof THREE.Group && child !== threeScene && child.children.length === PLANET_ENCYCLOPEDIA.length) {
          companionGroup = child as THREE.Group;
        }
      });
      expect(companionGroup).not.toBeNull();
      expect(companionGroup!.children.length).toBe(11);
    });

    it('sets initial scale of each companion mesh to (0,0,0)', () => {
      const threeScene = scene.getThreeScene();
      let companionGroup: THREE.Group | null = null;
      threeScene.traverse((child) => {
        if (child instanceof THREE.Group && child !== threeScene && child.children.length === PLANET_ENCYCLOPEDIA.length) {
          companionGroup = child as THREE.Group;
        }
      });
      expect(companionGroup).not.toBeNull();
      for (const mesh of companionGroup!.children) {
        expect(mesh.scale.x).toBe(0);
        expect(mesh.scale.y).toBe(0);
        expect(mesh.scale.z).toBe(0);
      }
    });

    it('pops in first 3 companions by elapsed=0.5s', () => {
      // Simulate 0.5 seconds of updates (50 steps of 0.01s)
      for (let i = 0; i < 50; i++) {
        scene.update(0.01);
      }

      const threeScene = scene.getThreeScene();
      let companionGroup: THREE.Group | null = null;
      threeScene.traverse((child) => {
        if (child instanceof THREE.Group && child !== threeScene && child.children.length === PLANET_ENCYCLOPEDIA.length) {
          companionGroup = child as THREE.Group;
        }
      });
      expect(companionGroup).not.toBeNull();

      // Companion 0 starts at t=0, popin duration=0.3 → done by 0.3, so at 0.5 scale=1
      expect(companionGroup!.children[0].scale.x).toBeCloseTo(1, 1);
      // Companion 1 starts at t=0.2, popin duration=0.3 → done by 0.5, so at 0.5 scale=1
      expect(companionGroup!.children[1].scale.x).toBeCloseTo(1, 1);
      // Companion 2 starts at t=0.4, would be in progress at 0.5 (local t=0.33)
      expect(companionGroup!.children[2].scale.x).toBeGreaterThan(0);
    });

    it('shows all 11 companions bouncing with thank-you text at elapsed=2.5s', () => {
      // Simulate 3 seconds (well past 2.5s threshold)
      for (let i = 0; i < 300; i++) {
        scene.update(0.01);
      }

      const threeScene = scene.getThreeScene();
      let companionGroup: THREE.Group | null = null;
      threeScene.traverse((child) => {
        if (child instanceof THREE.Group && child !== threeScene && child.children.length === PLANET_ENCYCLOPEDIA.length) {
          companionGroup = child as THREE.Group;
        }
      });
      expect(companionGroup).not.toBeNull();

      // All 11 should be fully visible (scale 1)
      for (const mesh of companionGroup!.children) {
        expect(mesh.scale.x).toBeCloseTo(1, 1);
      }

      // Thank-you text should be in the DOM
      const overlay = document.getElementById('ui-overlay');
      expect(overlay).not.toBeNull();
      const foundThankYou = !!overlay!.querySelector('div[style]');
      const allText = overlay!.textContent ?? '';
      expect(allText).toContain('みんな ありがとう！');
    });

    it('keeps companion x/z constant during bounce phase (only y oscillates)', () => {
      const threeScene = scene.getThreeScene();
      let companionGroup: THREE.Group | null = null;
      threeScene.traverse((child) => {
        if (child instanceof THREE.Group && child !== threeScene && child.children.length === PLANET_ENCYCLOPEDIA.length) {
          companionGroup = child as THREE.Group;
        }
      });
      expect(companionGroup).not.toBeNull();

      // Capture x/z immediately after setup (before any update)
      const initialPositions = companionGroup!.children.map((m) => ({
        x: m.position.x,
        z: m.position.z,
      }));

      // Advance well past POPIN_TOTAL into the bounce phase.
      for (let i = 0; i < 400; i++) {
        scene.update(0.01);
      }

      for (let i = 0; i < companionGroup!.children.length; i++) {
        const mesh = companionGroup!.children[i];
        expect(mesh.position.x).toBeCloseTo(initialPositions[i].x, 6);
        expect(mesh.position.z).toBeCloseTo(initialPositions[i].z, 6);
      }
    });

    it('cleans up companion group and disposes meshes on exit()', () => {
      const threeScene = scene.getThreeScene();

      // Verify companions exist before exit
      let companionGroupBefore: THREE.Group | null = null;
      threeScene.traverse((child) => {
        if (child instanceof THREE.Group && child !== threeScene && child.children.length === PLANET_ENCYCLOPEDIA.length) {
          companionGroupBefore = child as THREE.Group;
        }
      });
      expect(companionGroupBefore).not.toBeNull();

      scene.exit();

      // After exit, companion group should be removed from scene
      let companionGroupAfter: THREE.Group | null = null;
      threeScene.traverse((child) => {
        if (child instanceof THREE.Group && child !== threeScene && child.children.length === PLANET_ENCYCLOPEDIA.length) {
          companionGroupAfter = child as THREE.Group;
        }
      });
      expect(companionGroupAfter).toBeNull();
    });
  });

  describe('updateCelebration() rest-skip optimization', () => {
    function getCompanionGroup(scene: EndingScene): THREE.Group {
      const threeScene = scene.getThreeScene();
      let companionGroup: THREE.Group | null = null;
      threeScene.traverse((child) => {
        if (
          child instanceof THREE.Group &&
          child !== threeScene &&
          child.children.length === PLANET_ENCYCLOPEDIA.length
        ) {
          companionGroup = child as THREE.Group;
        }
      });
      if (!companionGroup) throw new Error('companion group not found');
      return companionGroup;
    }

    function makeScene(): EndingScene {
      const sceneManager = createMockSceneManager();
      const { mock: saveManager } = createMockSaveManager({
        clearedStage: 11,
        unlockedPlanets: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      });
      const audioManager = createMockAudioManager();
      const scene = new EndingScene(sceneManager, saveManager, audioManager);
      scene.enter({ totalScore: 0, totalStarCount: 0 });
      return scene;
    }

    it('does not rotate companions whose popin has not started yet', () => {
      const scene = makeScene();
      const group = getCompanionGroup(scene);
      // Companion index 10 starts at t = 10 * 0.2 = 2.0s.
      const lastIdx = PLANET_ENCYCLOPEDIA.length - 1;
      const initialRotation = group.children[lastIdx].rotation.y;

      // Advance only 0.5s (last companion is still scale=0, hidden, popin not started).
      for (let i = 0; i < 50; i++) scene.update(0.01);

      expect(group.children[lastIdx].scale.x).toBe(0);
      expect(group.children[lastIdx].rotation.y).toBe(initialRotation);
    });

    it('writes scale=1 once when popin completes, then stops touching scale on subsequent updates', () => {
      const scene = makeScene();
      const group = getCompanionGroup(scene);

      // Drive past the full popin window so every companion has settled (POPIN_TOTAL = 10*0.2 + 0.3 = 2.3s).
      for (let i = 0; i < 250; i++) scene.update(0.01);

      for (const mesh of group.children) {
        expect(mesh.scale.x).toBe(1);
        expect(mesh.scale.y).toBe(1);
        expect(mesh.scale.z).toBe(1);
      }

      // After settle, manually corrupt scale; if updateCelebration still re-writes scale every frame,
      // it would clobber back to 1. The optimization guarantees the value is preserved.
      const sentinel = group.children[0];
      sentinel.scale.set(7, 7, 7);
      const rotationBefore = sentinel.rotation.y;

      scene.update(0.016);

      expect(sentinel.scale.x).toBe(7);
      expect(sentinel.scale.y).toBe(7);
      expect(sentinel.scale.z).toBe(7);
      // Rotation must still advance on settled meshes.
      expect(sentinel.rotation.y).toBeGreaterThan(rotationBefore);
    });

    it('resets settled state on re-enter so popin replays cleanly', () => {
      const scene = makeScene();
      // Settle everything.
      for (let i = 0; i < 300; i++) scene.update(0.01);
      scene.exit();

      // Re-enter should reset internal flags so a brand-new popin sequence starts at scale=0.
      scene.enter({ totalScore: 0, totalStarCount: 0 });
      const group = getCompanionGroup(scene);
      for (const mesh of group.children) {
        expect(mesh.scale.x).toBe(0);
      }

      // Single small step: only companion 0 (startTime=0) progresses; index 5+ stays at 0
      // (and crucially, the previously-settled flag from the prior run must NOT short-circuit them to scale=1).
      scene.update(0.05);
      expect(group.children[0].scale.x).toBeGreaterThan(0);
      expect(group.children[0].scale.x).toBeLessThan(1);
      const lastIdx = PLANET_ENCYCLOPEDIA.length - 1;
      expect(group.children[lastIdx].scale.x).toBe(0);
    });
  });
});
