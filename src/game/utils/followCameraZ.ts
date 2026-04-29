import type * as THREE from 'three';

/**
 * Pure helper: snap a background object's Z position to the ship's Z position
 * using a parallax coefficient. Used to keep the background star field
 * centered around the spaceship as it travels deep into the stage,
 * preventing the night sky from appearing empty.
 *
 * @param obj    Object3D-like target (must expose `position.z`).
 * @param shipZ  The spaceship's current Z coordinate.
 * @param parallax Multiplier (1.0 = full follow, <1.0 = parallax lag).
 */
export function followCameraZ(
  obj: { position: { z: number } } | THREE.Object3D,
  shipZ: number,
  parallax: number,
): void {
  obj.position.z = shipZ * parallax;
}
