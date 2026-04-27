import * as THREE from 'three';
import type { StarType } from '../../types';
import { disposeObject3D } from '../utils/disposeObject3D';

export class Star {
  position: { x: number; y: number; z: number };
  radius = 0.6;
  starType: StarType;
  scoreValue: number;
  isCollected = false;
  mesh: THREE.Mesh;
  private hueOffset = 0;

  constructor(x: number, y: number, z: number, starType: StarType = 'NORMAL') {
    this.position = { x, y, z };
    this.starType = starType;
    this.scoreValue = starType === 'RAINBOW' ? 500 : 100;
    this.mesh = this.createMesh();
    this.mesh.position.set(x, y, z);
  }

  private createMesh(): THREE.Mesh {
    const geo = new THREE.OctahedronGeometry(this.radius);
    const color = this.starType === 'RAINBOW' ? 0xff0000 : 0xffdd00;
    const mat = new THREE.MeshToonMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.4,
    });
    return new THREE.Mesh(geo, mat);
  }

  update(deltaTime: number): void {
    // Rotate
    this.mesh.rotation.y += deltaTime * 2;

    // Rainbow hue animation
    if (this.starType === 'RAINBOW' && !this.isCollected) {
      this.hueOffset += deltaTime * 0.5;
      const hue = this.hueOffset % 1;
      const color = new THREE.Color().setHSL(hue, 1, 0.5);
      const mat = this.mesh.material as THREE.MeshToonMaterial;
      mat.color.copy(color);
      mat.emissive.copy(color);
    }
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  dispose(): void {
    disposeObject3D(this.mesh);
  }
}
