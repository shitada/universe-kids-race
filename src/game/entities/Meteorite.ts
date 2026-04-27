import * as THREE from 'three';
import { disposeObject3D } from '../utils/disposeObject3D';

export class Meteorite {
  position: { x: number; y: number; z: number };
  radius = 1.0;
  isActive = true;
  mesh: THREE.Mesh;

  constructor(x: number, y: number, z: number) {
    this.position = { x, y, z };
    this.mesh = this.createMesh();
    this.mesh.position.set(x, y, z);
  }

  private createMesh(): THREE.Mesh {
    const geo = new THREE.DodecahedronGeometry(this.radius);
    const mat = new THREE.MeshToonMaterial({ color: 0x887766 });
    return new THREE.Mesh(geo, mat);
  }

  update(deltaTime: number): void {
    this.mesh.rotation.x += deltaTime * 0.5;
    this.mesh.rotation.z += deltaTime * 0.3;
  }

  dispose(): void {
    disposeObject3D(this.mesh);
  }
}
