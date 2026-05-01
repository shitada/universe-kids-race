import { describe, it, expect, vi } from 'vitest';
import * as THREE from 'three';
import { disposeObject3D } from '../../../src/game/utils/disposeObject3D';

describe('disposeObject3D', () => {
  it('disposes geometry and material of a single mesh', () => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geo, mat);
    const geoSpy = vi.spyOn(geo, 'dispose');
    const matSpy = vi.spyOn(mat, 'dispose');

    disposeObject3D(mesh);

    expect(geoSpy).toHaveBeenCalledTimes(1);
    expect(matSpy).toHaveBeenCalledTimes(1);
  });

  it('recursively disposes children of a group', () => {
    const group = new THREE.Group();
    const spies: ReturnType<typeof vi.spyOn>[] = [];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.SphereGeometry(1);
      const mat = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geo, mat);
      spies.push(vi.spyOn(geo, 'dispose'), vi.spyOn(mat, 'dispose'));
      group.add(mesh);
    }

    disposeObject3D(group);

    for (const spy of spies) {
      expect(spy).toHaveBeenCalledTimes(1);
    }
  });

  it('disposes all materials when material is an array', () => {
    const geo = new THREE.BoxGeometry();
    const m1 = new THREE.MeshBasicMaterial();
    const m2 = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(geo, [m1, m2]);
    const s1 = vi.spyOn(m1, 'dispose');
    const s2 = vi.spyOn(m2, 'dispose');

    disposeObject3D(mesh);

    expect(s1).toHaveBeenCalledTimes(1);
    expect(s2).toHaveBeenCalledTimes(1);
  });

  it('disposes Points (geometry + material)', () => {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.PointsMaterial();
    const points = new THREE.Points(geo, mat);
    const gs = vi.spyOn(geo, 'dispose');
    const ms = vi.spyOn(mat, 'dispose');

    disposeObject3D(points);

    expect(gs).toHaveBeenCalledTimes(1);
    expect(ms).toHaveBeenCalledTimes(1);
  });

  it('disposes LineSegments (geometry + material)', () => {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.LineBasicMaterial();
    const lines = new THREE.LineSegments(geo, mat);
    const gs = vi.spyOn(geo, 'dispose');
    const ms = vi.spyOn(mat, 'dispose');

    disposeObject3D(lines);

    expect(gs).toHaveBeenCalledTimes(1);
    expect(ms).toHaveBeenCalledTimes(1);
  });

  it('does not throw on plain Object3D without geometry/material', () => {
    const obj = new THREE.Object3D();
    expect(() => disposeObject3D(obj)).not.toThrow();
  });

  it('disposes texture in material.map', () => {
    const geo = new THREE.BoxGeometry();
    const tex = new THREE.Texture();
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const mesh = new THREE.Mesh(geo, mat);
    const texSpy = vi.spyOn(tex, 'dispose');

    disposeObject3D(mesh);

    expect(texSpy).toHaveBeenCalledTimes(1);
  });

  it('disposes both map and normalMap on a material', () => {
    const geo = new THREE.BoxGeometry();
    const map = new THREE.Texture();
    const normalMap = new THREE.Texture();
    const mat = new THREE.MeshStandardMaterial({ map, normalMap });
    const mesh = new THREE.Mesh(geo, mat);
    const mapSpy = vi.spyOn(map, 'dispose');
    const normalSpy = vi.spyOn(normalMap, 'dispose');

    disposeObject3D(mesh);

    expect(mapSpy).toHaveBeenCalledTimes(1);
    expect(normalSpy).toHaveBeenCalledTimes(1);
  });

  it('disposes textures within an array material', () => {
    const geo = new THREE.BoxGeometry();
    const t1 = new THREE.Texture();
    const t2 = new THREE.Texture();
    const m1 = new THREE.MeshBasicMaterial({ map: t1 });
    const m2 = new THREE.MeshBasicMaterial({ map: t2 });
    const mesh = new THREE.Mesh(geo, [m1, m2]);
    const s1 = vi.spyOn(t1, 'dispose');
    const s2 = vi.spyOn(t2, 'dispose');

    disposeObject3D(mesh);

    expect(s1).toHaveBeenCalledTimes(1);
    expect(s2).toHaveBeenCalledTimes(1);
  });

  it('disposes a CanvasTexture (StageScene usage pattern)', () => {
    const fakeCanvas = { width: 16, height: 16 } as unknown as HTMLCanvasElement;
    const tex = new THREE.CanvasTexture(fakeCanvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mat);
    const texSpy = vi.spyOn(tex, 'dispose');

    disposeObject3D(mesh);

    expect(texSpy).toHaveBeenCalledTimes(1);
  });

  it('removes the object from its parent', () => {
    const parent = new THREE.Group();
    const child = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
    parent.add(child);
    expect(parent.children).toHaveLength(1);

    disposeObject3D(child);

    expect(parent.children).toHaveLength(0);
  });

  describe('userData.sharedAssets', () => {
    it('does not dispose geometry/material on a single shared mesh', () => {
      const geo = new THREE.BoxGeometry();
      const mat = new THREE.MeshBasicMaterial();
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData.sharedAssets = true;
      const geoSpy = vi.spyOn(geo, 'dispose');
      const matSpy = vi.spyOn(mat, 'dispose');

      disposeObject3D(mesh);

      expect(geoSpy).not.toHaveBeenCalled();
      expect(matSpy).not.toHaveBeenCalled();
    });

    it('does not dispose descendants of a shared node', () => {
      const sharedGeo = new THREE.BoxGeometry();
      const sharedMat = new THREE.MeshBasicMaterial();
      const sharedMesh = new THREE.Mesh(sharedGeo, sharedMat);
      sharedMesh.userData.sharedAssets = true;

      const childGeo = new THREE.SphereGeometry(1);
      const childMat = new THREE.MeshBasicMaterial();
      const childMesh = new THREE.Mesh(childGeo, childMat);
      sharedMesh.add(childMesh);

      const sharedGeoSpy = vi.spyOn(sharedGeo, 'dispose');
      const sharedMatSpy = vi.spyOn(sharedMat, 'dispose');
      const childGeoSpy = vi.spyOn(childGeo, 'dispose');
      const childMatSpy = vi.spyOn(childMat, 'dispose');

      disposeObject3D(sharedMesh);

      expect(sharedGeoSpy).not.toHaveBeenCalled();
      expect(sharedMatSpy).not.toHaveBeenCalled();
      expect(childGeoSpy).not.toHaveBeenCalled();
      expect(childMatSpy).not.toHaveBeenCalled();
    });

    it('disposes only non-shared meshes when mixed within a group', () => {
      const group = new THREE.Group();

      const sharedGeo = new THREE.BoxGeometry();
      const sharedMat = new THREE.MeshBasicMaterial();
      const sharedMesh = new THREE.Mesh(sharedGeo, sharedMat);
      sharedMesh.userData.sharedAssets = true;

      const normalGeo = new THREE.SphereGeometry(1);
      const normalMat = new THREE.MeshBasicMaterial();
      const normalMesh = new THREE.Mesh(normalGeo, normalMat);

      group.add(sharedMesh);
      group.add(normalMesh);

      const sharedGeoSpy = vi.spyOn(sharedGeo, 'dispose');
      const sharedMatSpy = vi.spyOn(sharedMat, 'dispose');
      const normalGeoSpy = vi.spyOn(normalGeo, 'dispose');
      const normalMatSpy = vi.spyOn(normalMat, 'dispose');

      disposeObject3D(group);

      expect(sharedGeoSpy).not.toHaveBeenCalled();
      expect(sharedMatSpy).not.toHaveBeenCalled();
      expect(normalGeoSpy).toHaveBeenCalledTimes(1);
      expect(normalMatSpy).toHaveBeenCalledTimes(1);
    });

    it('still removes a shared root from its parent', () => {
      const parent = new THREE.Group();
      const sharedMesh = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial(),
      );
      sharedMesh.userData.sharedAssets = true;
      parent.add(sharedMesh);

      disposeObject3D(sharedMesh);

      expect(parent.children).toHaveLength(0);
    });

    it('does not dispose textures within a shared subtree', () => {
      const sharedRoot = new THREE.Group();
      sharedRoot.userData.sharedAssets = true;
      const tex = new THREE.Texture();
      const mat = new THREE.MeshBasicMaterial({ map: tex });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(), mat);
      sharedRoot.add(mesh);

      const texSpy = vi.spyOn(tex, 'dispose');
      const matSpy = vi.spyOn(mat, 'dispose');

      disposeObject3D(sharedRoot);

      expect(texSpy).not.toHaveBeenCalled();
      expect(matSpy).not.toHaveBeenCalled();
    });
  });
});
