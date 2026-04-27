import * as THREE from 'three';

/**
 * Object3D を再帰的に traverse して geometry / material を dispose する。
 * 親があれば親からも remove する。
 */
export function disposeObject3D(object: THREE.Object3D): void {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh & { material?: THREE.Material | THREE.Material[] };
    if ((mesh as { geometry?: THREE.BufferGeometry }).geometry) {
      (mesh as { geometry: THREE.BufferGeometry }).geometry.dispose();
    }
    const material = mesh.material;
    if (material) {
      if (Array.isArray(material)) {
        for (const m of material) m.dispose();
      } else {
        material.dispose();
      }
    }
  });
  if (object.parent) {
    object.parent.remove(object);
  }
}
