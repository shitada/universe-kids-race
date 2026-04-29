import * as THREE from 'three';

// Shared resources for Meteorite instances. All meteorites have identical
// shape and color, so we reuse a single geometry/material to reduce GC and
// GPU buffer churn. Do NOT mutate SHARED_MATERIAL or dispose() these from
// instance dispose() (the generic disposeObject3D path is intentionally
// bypassed here).
const SHARED_GEOMETRY = new THREE.DodecahedronGeometry(1.0);
const SHARED_MATERIAL = new THREE.MeshToonMaterial({ color: 0x887766 });

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
    return new THREE.Mesh(SHARED_GEOMETRY, SHARED_MATERIAL);
  }

  update(deltaTime: number): void {
    this.mesh.rotation.x += deltaTime * 0.5;
    this.mesh.rotation.z += deltaTime * 0.3;
  }

  /** Re-initialize a pooled meteorite for re-use at a new position. */
  reset(x: number, y: number, z: number): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.set(0, 0, 0);
    this.isActive = true;
  }

  /**
   * Detach the mesh from its parent and reset transient state so the
   * instance can sit idle in a pool until `reset()` is called again.
   */
  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.mesh.rotation.set(0, 0, 0);
    this.isActive = true;
  }

  dispose(): void {
    // Shared geometry/material are NOT disposed here; only detach from parent.
    this.mesh.parent?.remove(this.mesh);
  }
}
