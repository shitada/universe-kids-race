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
});
