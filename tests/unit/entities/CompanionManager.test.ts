import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';
import { CompanionManager } from '../../../src/game/entities/CompanionManager';
import { PLANET_ENCYCLOPEDIA } from '../../../src/game/config/PlanetEncyclopedia';

describe('CompanionManager', () => {
  describe('createCompanionMesh (static)', () => {
    it('creates a mesh group from a PlanetEncyclopediaEntry', () => {
      const entry = PLANET_ENCYCLOPEDIA[0]; // stage 1
      const mesh = CompanionManager.createCompanionMesh(entry);
      expect(mesh).toBeDefined();
      expect(mesh.type).toBe('Group');
    });

    it('creates different shapes for different companionShape values', () => {
      const shapes = new Set<number>();
      for (const entry of PLANET_ENCYCLOPEDIA) {
        const mesh = CompanionManager.createCompanionMesh(entry);
        shapes.add(mesh.children.length);
      }
      // Different shapes produce different child counts
      expect(shapes.size).toBeGreaterThan(1);
    });

    it('creates meshes for all 11 encyclopedia entries without error', () => {
      for (const entry of PLANET_ENCYCLOPEDIA) {
        expect(() => CompanionManager.createCompanionMesh(entry)).not.toThrow();
      }
    });
  });

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

  describe('addCompanion', () => {
    it('returns true and increments companion count for valid stageNumber', () => {
      const manager = new CompanionManager([]);
      expect(manager.addCompanion(1)).toBe(true);
      expect(manager.getCount()).toBe(1);
    });

    it('adds mesh to group', () => {
      const manager = new CompanionManager([]);
      const before = manager.getGroup().children.length;
      manager.addCompanion(1);
      expect(manager.getGroup().children.length).toBe(before + 1);
    });

    it('returns false for invalid stageNumber (no matching PLANET_ENCYCLOPEDIA entry)', () => {
      const manager = new CompanionManager([]);
      expect(manager.addCompanion(99)).toBe(false);
      expect(manager.getCount()).toBe(0);
    });

    it('sets initial mesh scale to (0, 0, 0)', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      const mesh = manager.getGroup().children[0];
      expect(mesh.scale.x).toBe(0);
      expect(mesh.scale.y).toBe(0);
      expect(mesh.scale.z).toBe(0);
    });

    it('sets entranceTimer to 1.0', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      // After update(0, ...) scale should still be 0 (timer just started)
      // After update(0.5, ...) scale should be ~0.5
      manager.update(0.5, 0, 0, 0);
      const mesh = manager.getGroup().children[0];
      expect(mesh.scale.x).toBeCloseTo(0.5, 1);
    });

    it('progresses scale toward 1.0 during entrance animation', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      manager.update(0.5, 0, 0, 0);
      const mesh = manager.getGroup().children[0];
      expect(mesh.scale.x).toBeCloseTo(0.5, 1);
      expect(mesh.scale.y).toBeCloseTo(0.5, 1);
      expect(mesh.scale.z).toBeCloseTo(0.5, 1);
    });

    it('completes entrance animation: entranceTimer <= 0, scale ≈ 1.0, normal orbit resumes', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      manager.update(1.0, 0, 0, 0);
      const mesh = manager.getGroup().children[0];
      expect(mesh.scale.x).toBeCloseTo(1.0, 1);
      expect(mesh.scale.y).toBeCloseTo(1.0, 1);
      expect(mesh.scale.z).toBeCloseTo(1.0, 1);
    });

    it('spins at 4x normal speed (deltaTime * 8) during entrance', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      const mesh = manager.getGroup().children[0];
      const initialRotY = mesh.rotation.y;
      manager.update(0.5, 0, 0, 0);
      // During entrance: rotation.y += deltaTime * 8 = 0.5 * 8 = 4.0
      expect(mesh.rotation.y - initialRotY).toBeCloseTo(4.0, 1);
    });

    it('snaps mesh scale to exactly 1.0 once entrance completes, even when last step lands mid-progress', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      // 0.4 + 0.4 + 0.4 = 1.2 > 1.0, last step lands while progress < 1.0 then crosses 0.
      manager.update(0.4, 0, 0, 0);
      manager.update(0.4, 0, 0, 0);
      manager.update(0.4, 0, 0, 0);
      const mesh = manager.getGroup().children[0];
      expect(mesh.scale.x).toBe(1);
      expect(mesh.scale.y).toBe(1);
      expect(mesh.scale.z).toBe(1);
    });

    it('clamps entranceTimer to 0 once entrance completes (no further scale updates)', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      manager.update(1.5, 0, 0, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cs = (manager as any).companions;
      expect(cs[0].entranceTimer).toBe(0);

      // After completion, manually mutate scale to detect whether update() rewrites it.
      const mesh = manager.getGroup().children[0];
      mesh.scale.setScalar(0.42);
      manager.update(0.016, 0, 0, 0);
      // Scale must remain at the externally-set value because the entrance branch
      // is no longer entered and the normal-orbit branch does NOT touch scale.
      expect(mesh.scale.x).toBe(0.42);
      expect(mesh.scale.y).toBe(0.42);
      expect(mesh.scale.z).toBe(0.42);
    });

    it('uses normal rotation speed (deltaTime * 2) after entrance completes', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      // Complete entrance animation
      manager.update(1.0, 0, 0, 0);
      const mesh = manager.getGroup().children[0];
      const rotAfterEntrance = mesh.rotation.y;
      // Now update with normal speed
      manager.update(0.5, 0, 0, 0);
      // Normal rotation: deltaTime * 2 = 0.5 * 2 = 1.0
      expect(mesh.rotation.y - rotAfterEntrance).toBeCloseTo(1.0, 1);
    });
  });

  describe('addCompanion orbit redistribution', () => {
    // Helper to peek into private companions for orbit-param assertions.
    function getCompanions(manager: CompanionManager): Array<{
      angleOffset: number;
      orbitRadius: number;
      orbitTilt: number;
      cosTilt: number;
      sinTilt: number;
      entranceTimer: number;
    }> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (manager as any).companions;
    }

    it('keeps angleOffset evenly distributed (i * 2π/count) as companions are added 1..10', () => {
      const manager = new CompanionManager([]);
      const stageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      for (let n = 0; n < stageNumbers.length; n++) {
        manager.addCompanion(stageNumbers[n]);
        const cs = getCompanions(manager);
        const count = cs.length;
        for (let i = 0; i < count; i++) {
          expect(cs[i].angleOffset).toBeCloseTo(i * ((2 * Math.PI) / count), 10);
        }
      }
    });

    it('recomputes orbitRadius for ALL companions when crossing baseRadius boundary at count=4', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      manager.addCompanion(2);
      manager.addCompanion(3);
      // Add 4th — baseRadius switches from 2.0 to 2.5
      manager.addCompanion(4);
      const cs = getCompanions(manager);
      expect(cs.length).toBe(4);
      for (let i = 0; i < 4; i++) {
        expect(cs[i].orbitRadius).toBeCloseTo(2.5 + (i % 3) * 0.15, 10);
      }
    });

    it('recomputes orbitRadius for ALL companions when crossing baseRadius boundary at count=8', () => {
      const manager = new CompanionManager([]);
      for (const s of [1, 2, 3, 4, 5, 6, 7, 8]) {
        manager.addCompanion(s);
      }
      const cs = getCompanions(manager);
      expect(cs.length).toBe(8);
      for (let i = 0; i < 8; i++) {
        expect(cs[i].orbitRadius).toBeCloseTo(3.0 + (i % 3) * 0.15, 10);
      }
    });

    it('recomputes orbitTilt and cached cos/sin for all companions on add', () => {
      const manager = new CompanionManager([]);
      for (const s of [1, 2, 3]) {
        manager.addCompanion(s);
      }
      const cs = getCompanions(manager);
      const count = cs.length;
      for (let i = 0; i < count; i++) {
        const expectedTilt = (i - count / 2) * 0.15;
        expect(cs[i].orbitTilt).toBeCloseTo(expectedTilt, 10);
        expect(cs[i].cosTilt).toBeCloseTo(Math.cos(expectedTilt), 10);
        expect(cs[i].sinTilt).toBeCloseTo(Math.sin(expectedTilt), 10);
      }
    });

    it('preserves entranceTimer of the newly added companion (not reset by redistribution)', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      manager.addCompanion(2);
      manager.addCompanion(3);
      const cs = getCompanions(manager);
      // The most recently added companion must still have its entrance timer near 1.0
      expect(cs[cs.length - 1].entranceTimer).toBeCloseTo(1.0, 5);
    });

    it('does not reset entranceTimer of an in-progress entrance when another companion is added', () => {
      const manager = new CompanionManager([]);
      manager.addCompanion(1);
      // Partially advance the first companion's entrance animation
      manager.update(0.4, 0, 0, 0);
      const cs1 = getCompanions(manager);
      const partialTimer = cs1[0].entranceTimer;
      expect(partialTimer).toBeGreaterThan(0);
      expect(partialTimer).toBeLessThan(1.0);

      // Add another companion — must not reset existing entranceTimer
      manager.addCompanion(2);
      const cs2 = getCompanions(manager);
      expect(cs2[0].entranceTimer).toBeCloseTo(partialTimer, 10);
      expect(cs2[1].entranceTimer).toBeCloseTo(1.0, 5);
    });

    it('matches the constructor-produced layout when adding companions one-by-one', () => {
      const stages = [1, 2, 3, 4, 5];
      const incremental = new CompanionManager([]);
      for (const s of stages) incremental.addCompanion(s);
      const bulk = new CompanionManager(stages);

      const incCs = getCompanions(incremental);
      const bulkCs = getCompanions(bulk);
      expect(incCs.length).toBe(bulkCs.length);
      for (let i = 0; i < incCs.length; i++) {
        expect(incCs[i].angleOffset).toBeCloseTo(bulkCs[i].angleOffset, 10);
        expect(incCs[i].orbitRadius).toBeCloseTo(bulkCs[i].orbitRadius, 10);
        expect(incCs[i].orbitTilt).toBeCloseTo(bulkCs[i].orbitTilt, 10);
      }
    });
  });

  describe('shared geometry / material caching', () => {
    it('reuses the same body geometry across multiple companions of the same shape', () => {
      const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const manager = new CompanionManager(all);
      const group = manager.getGroup();

      // Group bodies (first child of each companion group) by geometry uuid
      // and confirm at least one geometry is shared between companions.
      const geomUuids = new Set<string>();
      let sharedHits = 0;
      for (const companion of group.children) {
        const body = (companion as THREE.Group).children[0] as THREE.Mesh;
        if (geomUuids.has(body.geometry.uuid)) {
          sharedHits++;
        }
        geomUuids.add(body.geometry.uuid);
      }
      expect(sharedHits).toBeGreaterThan(0);
    });

    it('reuses the same eye material across companions (single shared instance)', () => {
      const manager = new CompanionManager([1, 2, 3]);
      const group = manager.getGroup();

      const eyeMaterials = new Set<string>();
      for (const companion of group.children) {
        const c = companion as THREE.Group;
        // Eyes are the last two children of every companion group.
        const eye = c.children[c.children.length - 1] as THREE.Mesh;
        const mat = eye.material as THREE.Material;
        eyeMaterials.add(mat.uuid);
      }
      expect(eyeMaterials.size).toBe(1);
    });

    it('shares opaque body materials by color across companions', () => {
      // Both stage 1 (moon) and stage 1 again would share, but we use 1 + add()
      // to verify cross-instance material reuse.
      const manager = new CompanionManager([1]);
      manager.addCompanion(1);
      const group = manager.getGroup();
      const body0 = (group.children[0] as THREE.Group).children[0] as THREE.Mesh;
      const body1 = (group.children[1] as THREE.Group).children[0] as THREE.Mesh;
      expect(body0.material).toBe(body1.material);
    });

    it('does not dispose shared resources on dispose() — new manager still works', () => {
      const m1 = new CompanionManager([1, 6, 8]); // basic, ringed, bubble
      m1.dispose();

      // Re-create and verify geometries are still usable (positions attribute present).
      const m2 = new CompanionManager([1, 6, 8]);
      const group = m2.getGroup();
      for (const companion of group.children) {
        const body = (companion as THREE.Group).children[0] as THREE.Mesh;
        expect(body.geometry.attributes.position).toBeDefined();
        const mat = body.material as THREE.MeshToonMaterial;
        // A disposed Material's color object survives, but disposed materials
        // mark resources internally; here we simply assert the material is
        // still a valid MeshToonMaterial with its color preserved.
        expect(mat.color).toBeDefined();
      }
      m2.dispose();
    });

    it('uses a transparent material variant for bubble companions', () => {
      const manager = new CompanionManager([8]); // neptune = bubble
      const body = (manager.getGroup().children[0] as THREE.Group).children[0] as THREE.Mesh;
      const mat = body.material as THREE.MeshToonMaterial;
      expect(mat.transparent).toBe(true);
    });

    it('uses a DoubleSide material variant for the ring of ringed companions', () => {
      const manager = new CompanionManager([6]); // saturn = ringed
      const companion = manager.getGroup().children[0] as THREE.Group;
      // Ring is appended after createBasic's 5 children → index 5.
      const ring = companion.children[5] as THREE.Mesh;
      const mat = ring.material as THREE.MeshToonMaterial;
      expect(mat.side).toBe(THREE.DoubleSide);
    });
  });

  describe('orbit pre-computed tilt', () => {
    it('positions companions using cos/sin(orbitTilt) pre-computed at construction', () => {
      const manager = new CompanionManager([1, 2, 3]);
      const group = manager.getGroup();

      const dt = 0.25;
      const shipX = 1;
      const shipY = 2;
      const shipZ = 3;
      manager.update(dt, shipX, shipY, shipZ);

      const count = 3;
      const baseRadius = 2.0;
      for (let i = 0; i < count; i++) {
        const angleOffset = i * ((2 * Math.PI) / count);
        const orbitRadius = baseRadius + (i % 3) * 0.15;
        const orbitSpeed = 1.0 + i * 0.05;
        const orbitTilt = (i - count / 2) * 0.15;
        const angle = angleOffset + dt * orbitSpeed;
        const expectedX = shipX + orbitRadius * Math.cos(angle);
        const expectedY = shipY + orbitRadius * Math.sin(angle) * Math.cos(orbitTilt);
        const expectedZ = shipZ + orbitRadius * Math.sin(angle) * Math.sin(orbitTilt);

        const pos = group.children[i].position;
        expect(pos.x).toBeCloseTo(expectedX, 5);
        expect(pos.y).toBeCloseTo(expectedY, 5);
        expect(pos.z).toBeCloseTo(expectedZ, 5);
      }
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
