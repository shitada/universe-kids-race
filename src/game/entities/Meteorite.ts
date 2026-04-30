import * as THREE from 'three';

// Shared resources for Meteorite instances. All meteorites have identical
// shape and color, so we reuse a single geometry/material to reduce GC and
// GPU buffer churn. Do NOT mutate SHARED_MATERIAL or dispose() these from
// instance dispose() (the generic disposeObject3D path is intentionally
// bypassed here).
const SHARED_GEOMETRY = new THREE.DodecahedronGeometry(1.0);
const SHARED_MATERIAL = new THREE.MeshToonMaterial({ color: 0x887766 });

// View-bracket thresholds used by Meteorite.update() to skip per-frame X/Z
// rotation for meteorites that are far ahead of (or already behind) the
// spaceship. SpawnSystem pre-spawns meteorites well outside the camera
// frustum; animating those wastes per-frame cost on iPad Safari. Forward
// axis is -Z, so "ahead" = z < cameraZ. Mirrors Star.update() pattern.
const METEORITE_ANIMATION_AHEAD = 60;
const METEORITE_ANIMATION_BEHIND = 5;

export class Meteorite {
  position: { x: number; y: number; z: number };
  // Constant for every Meteorite instance. CollisionSystem.check() relies on
  // this invariance to hoist the collision-radius computation out of its hot
  // loop.
  readonly radius = 1.0;
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

  update(deltaTime: number, cameraZ?: number): void {
    // Skip rotation for meteorites outside the visible Z bracket. cameraZ is
    // optional for backward-compat with existing tests and any callers that
    // haven't been migrated; when omitted, animate as before.
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - METEORITE_ANIMATION_AHEAD ||
        this.position.z > cameraZ + METEORITE_ANIMATION_BEHIND)
    ) {
      return;
    }
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
