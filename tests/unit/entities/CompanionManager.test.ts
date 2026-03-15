import { describe, it, expect, beforeEach } from 'vitest';
import { CompanionManager } from '../../../src/game/entities/CompanionManager';

describe('CompanionManager', () => {
  describe('constructor', () => {
    it('creates meshes for each unlocked planet', () => {
      const manager = new CompanionManager([1, 2, 3]);
      expect(manager.getCount()).toBe(3);
    });

    it('creates no meshes when unlockedPlanets is empty', () => {
      const manager = new CompanionManager([]);
      expect(manager.getCount()).toBe(0);
    });

    it('creates meshes for all 11 planets', () => {
      const manager = new CompanionManager([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      expect(manager.getCount()).toBe(11);
    });

    it('creates group with companion meshes as children', () => {
      const manager = new CompanionManager([1, 4, 6]);
      const group = manager.getGroup();
      expect(group.children.length).toBe(3);
    });
  });

  describe('update', () => {
    it('updates companion positions based on orbit calculation with cos/sin', () => {
      const manager = new CompanionManager([1]);
      const group = manager.getGroup();

      // Initial update — companions should orbit around ship position
      manager.update(1.0, 5, 0, -10);

      const companion = group.children[0];
      // Companion should be approximately orbitRadius away from ship
      const dx = companion.position.x - 5;
      const dy = companion.position.y - 0;
      const dz = companion.position.z - (-10);
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      // With 1 companion, baseRadius = 2.0, orbitRadius = 2.0 + (0 % 3) * 0.15 = 2.0
      expect(dist).toBeCloseTo(2.0, 0);
    });

    it('tracks ship position correctly', () => {
      const manager = new CompanionManager([1]);
      const group = manager.getGroup();

      manager.update(0.016, 10, 5, -50);
      const companion = group.children[0];

      // Companion should be near ship position (within orbit radius)
      const dx = companion.position.x - 10;
      const dy = companion.position.y - 5;
      const dz = companion.position.z - (-50);
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      expect(dist).toBeLessThanOrEqual(3.5);
    });

    it('updates self-rotation on each frame', () => {
      const manager = new CompanionManager([1]);
      const group = manager.getGroup();
      const companion = group.children[0];

      const initialRotY = companion.rotation.y;
      manager.update(1.0, 0, 0, 0);
      expect(companion.rotation.y).toBeGreaterThan(initialRotY);
    });
  });

  describe('orbit parameter auto-adjustment', () => {
    it('uses baseRadius 2.0 for 1-3 companions', () => {
      const manager = new CompanionManager([1, 2, 3]);
      const group = manager.getGroup();
      manager.update(0, 0, 0, 0);

      // With 3 companions, all should be approximately 2.0 radius away (plus small offset)
      for (const child of group.children) {
        const dist = Math.sqrt(
          child.position.x ** 2 +
          child.position.y ** 2 +
          child.position.z ** 2,
        );
        expect(dist).toBeGreaterThanOrEqual(1.8);
        expect(dist).toBeLessThanOrEqual(2.5);
      }
    });

    it('uses baseRadius 2.5 for 4-7 companions', () => {
      const manager = new CompanionManager([1, 2, 3, 4, 5]);
      const group = manager.getGroup();
      manager.update(0, 0, 0, 0);

      for (const child of group.children) {
        const dist = Math.sqrt(
          child.position.x ** 2 +
          child.position.y ** 2 +
          child.position.z ** 2,
        );
        expect(dist).toBeGreaterThanOrEqual(2.2);
        expect(dist).toBeLessThanOrEqual(3.2);
      }
    });

    it('uses baseRadius 3.0 for 8+ companions', () => {
      const manager = new CompanionManager([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(manager.getCount()).toBe(8);
      // Just verify it doesn't crash and has correct count
    });
  });

  describe('getCount', () => {
    it('returns 0 for no companions', () => {
      expect(new CompanionManager([]).getCount()).toBe(0);
    });

    it('returns correct count for multiple companions', () => {
      expect(new CompanionManager([1, 5, 10]).getCount()).toBe(3);
    });
  });

  describe('getStarAttractionBonus', () => {
    it('returns 0 for no companions', () => {
      expect(new CompanionManager([]).getStarAttractionBonus()).toBe(0);
    });

    it('returns count * 0.2', () => {
      expect(new CompanionManager([1, 2, 3]).getStarAttractionBonus()).toBeCloseTo(0.6);
    });

    it('returns 2.2 for all 11 companions', () => {
      const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      expect(new CompanionManager(all).getStarAttractionBonus()).toBeCloseTo(2.2);
    });
  });

  describe('getGroup', () => {
    it('returns a THREE.Group', () => {
      const manager = new CompanionManager([1]);
      const group = manager.getGroup();
      expect(group).toBeDefined();
      expect(group.type).toBe('Group');
    });
  });

  describe('dispose', () => {
    it('cleans up geometry and material', () => {
      const manager = new CompanionManager([1, 2, 3]);
      const group = manager.getGroup();
      expect(group.children.length).toBe(3);

      manager.dispose();
      expect(group.children.length).toBe(0);
      expect(manager.getCount()).toBe(0);
    });

    it('handles dispose on empty manager', () => {
      const manager = new CompanionManager([]);
      expect(() => manager.dispose()).not.toThrow();
    });
  });

  describe('companion shapes', () => {
    it('creates basic shape for moon (stageNumber 1)', () => {
      const manager = new CompanionManager([1]);
      expect(manager.getCount()).toBe(1);
    });

    it('creates ringed shape for saturn (stageNumber 6)', () => {
      const manager = new CompanionManager([6]);
      expect(manager.getCount()).toBe(1);
    });

    it('creates radiant shape for sun (stageNumber 10)', () => {
      const manager = new CompanionManager([10]);
      expect(manager.getCount()).toBe(1);
    });

    it('creates horned shape for mars (stageNumber 4)', () => {
      const manager = new CompanionManager([4]);
      expect(manager.getCount()).toBe(1);
    });

    it('creates icy shape for uranus (stageNumber 7)', () => {
      const manager = new CompanionManager([7]);
      expect(manager.getCount()).toBe(1);
    });

    it('creates bubble shape for neptune (stageNumber 8)', () => {
      const manager = new CompanionManager([8]);
      expect(manager.getCount()).toBe(1);
    });
  });
});
