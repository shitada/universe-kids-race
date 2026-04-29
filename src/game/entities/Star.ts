import * as THREE from 'three';
import type { StarType } from '../../types';

// Shared resources for Star instances. NORMAL stars share both geometry and
// material to reduce GC and draw-call setup cost. RAINBOW stars share only the
// geometry; their material is per-instance because hue is animated per-frame.
// Do NOT mutate SHARED_NORMAL_MATERIAL; do NOT dispose() these from instance
// dispose() (see disposeObject3D for the generic path that is intentionally
// bypassed by Star.dispose()).
const SHARED_GEOMETRY = new THREE.OctahedronGeometry(0.6);
const SHARED_NORMAL_MATERIAL = new THREE.MeshToonMaterial({
  color: 0xffdd00,
  emissive: 0xffdd00,
  emissiveIntensity: 0.4,
});

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
    if (this.starType === 'RAINBOW') {
      const color = 0xff0000;
      const mat = new THREE.MeshToonMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
      });
      return new THREE.Mesh(SHARED_GEOMETRY, mat);
    }
    return new THREE.Mesh(SHARED_GEOMETRY, SHARED_NORMAL_MATERIAL);
  }

  update(deltaTime: number): void {
    // Rotate
    this.mesh.rotation.y += deltaTime * 2;

    // Rainbow hue animation
    if (this.starType === 'RAINBOW' && !this.isCollected) {
      this.hueOffset += deltaTime * 0.5;
      const hue = this.hueOffset % 1;
      const mat = this.mesh.material as THREE.MeshToonMaterial;
      mat.color.setHSL(hue, 1, 0.5);
      mat.emissive.setHSL(hue, 1, 0.5);
    }
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  /**
   * Re-initialize a pooled NORMAL star for re-use at a new position.
   * Not intended for RAINBOW stars (they are not pooled because of their
   * per-instance animated material).
   */
  reset(x: number, y: number, z: number): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.visible = true;
    this.isCollected = false;
    this.hueOffset = 0;
  }

  /**
   * Detach the mesh from its parent and reset transient state so the
   * instance can sit idle in a pool until `reset()` is called again.
   * Shared geometry/material are preserved.
   */
  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.visible = true;
    this.isCollected = false;
    this.hueOffset = 0;
  }

  dispose(): void {
    // Shared geometry and (NORMAL) material are NOT disposed here; only the
    // per-instance RAINBOW material is. Detach from parent so the mesh is GC'd.
    if (this.starType === 'RAINBOW') {
      const mat = this.mesh.material as THREE.Material;
      mat.dispose();
    }
    this.mesh.parent?.remove(this.mesh);
  }
}
