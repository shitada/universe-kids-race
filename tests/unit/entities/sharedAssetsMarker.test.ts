import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { Spaceship } from '../../../src/game/entities/Spaceship';
import { Star } from '../../../src/game/entities/Star';
import { Meteorite } from '../../../src/game/entities/Meteorite';
import { CompanionManager } from '../../../src/game/entities/CompanionManager';
import { PLANET_ENCYCLOPEDIA } from '../../../src/game/config/PlanetEncyclopedia';
import { disposeObject3D } from '../../../src/game/utils/disposeObject3D';

function collectMeshes(root: THREE.Object3D): THREE.Mesh[] {
  const out: THREE.Mesh[] = [];
  root.traverse((c) => {
    if ((c as THREE.Mesh).isMesh) out.push(c as THREE.Mesh);
  });
  return out;
}

function expectAllSharedMarked(meshes: THREE.Mesh[]): void {
  expect(meshes.length).toBeGreaterThan(0);
  for (const m of meshes) {
    expect(m.userData.sharedAssets).toBe(true);
  }
}

function spyDisposes(meshes: THREE.Mesh[]) {
  const geomSpies: ReturnType<typeof vi.spyOn>[] = [];
  const matSpies: ReturnType<typeof vi.spyOn>[] = [];
  const seenG = new Set<THREE.BufferGeometry>();
  const seenM = new Set<THREE.Material>();
  for (const mesh of meshes) {
    const g = mesh.geometry;
    if (g && !seenG.has(g)) {
      seenG.add(g);
      geomSpies.push(vi.spyOn(g, 'dispose'));
    }
    const mat = mesh.material;
    const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
    for (const mm of mats) {
      if (!seenM.has(mm)) {
        seenM.add(mm);
        matSpies.push(vi.spyOn(mm, 'dispose'));
      }
    }
  }
  return { geomSpies, matSpies };
}

describe('shared-asset Mesh marker (userData.sharedAssets)', () => {
  describe('Spaceship', () => {
    it('marks every child mesh as sharedAssets', () => {
      const ship = new Spaceship();
      expectAllSharedMarked(collectMeshes(ship.mesh));
    });

    it('disposeObject3D does NOT dispose shared geometry/material', () => {
      const ship = new Spaceship();
      const meshes = collectMeshes(ship.mesh);
      const { geomSpies, matSpies } = spyDisposes(meshes);

      const parent = new THREE.Group();
      parent.add(ship.mesh);
      disposeObject3D(ship.mesh);

      for (const s of geomSpies) expect(s).not.toHaveBeenCalled();
      for (const s of matSpies) expect(s).not.toHaveBeenCalled();
      expect(ship.mesh.parent).toBeNull();
    });
  });

  describe('Star', () => {
    it('marks NORMAL star mesh as sharedAssets', () => {
      const star = new Star(0, 0, 0, 'NORMAL');
      expectAllSharedMarked(collectMeshes(star.mesh));
    });

    it('marks RAINBOW star mesh as sharedAssets (geometry is shared)', () => {
      const star = new Star(0, 0, 0, 'RAINBOW');
      expectAllSharedMarked(collectMeshes(star.mesh));
    });

    it('disposeObject3D does NOT dispose shared geometry/material on NORMAL', () => {
      const star = new Star(0, 0, 0, 'NORMAL');
      const meshes = collectMeshes(star.mesh);
      const { geomSpies, matSpies } = spyDisposes(meshes);

      const parent = new THREE.Group();
      parent.add(star.mesh);
      disposeObject3D(star.mesh);

      for (const s of geomSpies) expect(s).not.toHaveBeenCalled();
      for (const s of matSpies) expect(s).not.toHaveBeenCalled();
    });

    it('disposeObject3D does NOT dispose shared geometry on RAINBOW', () => {
      const star = new Star(0, 0, 0, 'RAINBOW');
      const meshes = collectMeshes(star.mesh);
      const geomSpy = vi.spyOn(meshes[0].geometry as THREE.BufferGeometry, 'dispose');

      const parent = new THREE.Group();
      parent.add(star.mesh);
      disposeObject3D(star.mesh);

      expect(geomSpy).not.toHaveBeenCalled();
    });
  });

  describe('Meteorite', () => {
    it('marks meteorite mesh as sharedAssets', () => {
      const m = new Meteorite(0, 0, 0);
      expectAllSharedMarked(collectMeshes(m.mesh));
    });

    it('disposeObject3D does NOT dispose shared geometry/material', () => {
      const m = new Meteorite(0, 0, 0);
      const meshes = collectMeshes(m.mesh);
      const { geomSpies, matSpies } = spyDisposes(meshes);

      const parent = new THREE.Group();
      parent.add(m.mesh);
      disposeObject3D(m.mesh);

      for (const s of geomSpies) expect(s).not.toHaveBeenCalled();
      for (const s of matSpies) expect(s).not.toHaveBeenCalled();
    });
  });

  describe('CompanionManager', () => {
    it('marks every child mesh of every companion shape as sharedAssets', () => {
      const stageNumbers = PLANET_ENCYCLOPEDIA.map((e) => e.stageNumber);
      const cm = new CompanionManager(stageNumbers);
      const meshes = collectMeshes(cm.getGroup());
      expectAllSharedMarked(meshes);
    });

    it('disposeObject3D on a companion group does NOT dispose shared geometry/material', () => {
      const stageNumbers = PLANET_ENCYCLOPEDIA.map((e) => e.stageNumber);
      const cm = new CompanionManager(stageNumbers);
      const group = cm.getGroup();
      const meshes = collectMeshes(group);
      const { geomSpies, matSpies } = spyDisposes(meshes);

      const parent = new THREE.Group();
      parent.add(group);
      disposeObject3D(group);

      for (const s of geomSpies) expect(s).not.toHaveBeenCalled();
      for (const s of matSpies) expect(s).not.toHaveBeenCalled();
    });
  });
});
