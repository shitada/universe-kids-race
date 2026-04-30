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

// Initial color for a RAINBOW star. The per-instance MeshToonMaterial mutates
// `color` / `emissive` in place to animate hue; reset() restores this baseline
// so a pooled instance does not leak the previous lifetime's hue.
const RAINBOW_INITIAL_COLOR = 0xff0000;

// View-bracket thresholds used by Star.update() to skip per-frame Y-rotation
// and rainbow hue updates for stars that are far ahead of (or already behind)
// the spaceship. SpawnSystem pre-spawns stars at shipZ - 80 (well outside the
// camera frustum); animating those wastes per-frame cost on iPad Safari.
// Forward axis is -Z, so "ahead" = z < cameraZ. behind matches the very small
// window before cleanupPassedObjects() releases the star at shipZ + 30.
const STAR_ANIMATION_AHEAD = 60;
const STAR_ANIMATION_BEHIND = 5;

export class Star {
  position: { x: number; y: number; z: number };
  // Constant for every Star instance. CollisionSystem.check() relies on this
  // invariance to hoist the collision-radius computation out of its hot loop.
  readonly radius = 0.6;
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
      const mat = new THREE.MeshToonMaterial({
        color: RAINBOW_INITIAL_COLOR,
        emissive: RAINBOW_INITIAL_COLOR,
        emissiveIntensity: 0.4,
      });
      return new THREE.Mesh(SHARED_GEOMETRY, mat);
    }
    return new THREE.Mesh(SHARED_GEOMETRY, SHARED_NORMAL_MATERIAL);
  }

  update(deltaTime: number, cameraZ?: number): void {
    // Skip rotation / hue animation for stars outside the visible Z bracket.
    // cameraZ is optional for backward-compat with existing tests and any
    // callers that haven't been migrated; when omitted, animate as before.
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - STAR_ANIMATION_AHEAD ||
        this.position.z > cameraZ + STAR_ANIMATION_BEHIND)
    ) {
      return;
    }

    // Rotate
    this.mesh.rotation.y += deltaTime * 2;

    // Rainbow hue animation
    if (this.starType === 'RAINBOW' && !this.isCollected) {
      this.hueOffset += deltaTime * 0.5;
      const hue = this.hueOffset % 1;
      const mat = this.mesh.material as THREE.MeshToonMaterial;
      // emissive は color と完全同期するため、HSL→RGB 変換は1回に抑え copy で再利用する
      mat.color.setHSL(hue, 1, 0.5);
      mat.emissive.copy(mat.color);
    }
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  /**
   * Re-initialize a pooled star for re-use at a new position. For RAINBOW
   * stars this also restores the initial hue so the per-instance material
   * does not leak the previous lifetime's animated color.
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
    if (this.starType === 'RAINBOW') {
      const mat = this.mesh.material as THREE.MeshToonMaterial;
      mat.color.setHex(RAINBOW_INITIAL_COLOR);
      mat.emissive.setHex(RAINBOW_INITIAL_COLOR);
    }
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
    // This is invoked by the SpawnSystem RAINBOW pool's disposeFn at scene
    // teardown; per-spawn RAINBOW exits go through the pool, not here.
    if (this.starType === 'RAINBOW') {
      const mat = this.mesh.material as THREE.Material;
      mat.dispose();
    }
    this.mesh.parent?.remove(this.mesh);
  }
}
