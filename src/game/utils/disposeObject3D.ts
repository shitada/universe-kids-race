import * as THREE from 'three';

const TEXTURE_SLOTS = [
  'map',
  'normalMap',
  'alphaMap',
  'emissiveMap',
  'roughnessMap',
  'metalnessMap',
  'aoMap',
  'bumpMap',
  'displacementMap',
  'envMap',
  'lightMap',
  'specularMap',
  'gradientMap',
  'matcap',
] as const;

function disposeMaterialTextures(material: THREE.Material): void {
  const record = material as unknown as Record<string, unknown>;
  for (const slot of TEXTURE_SLOTS) {
    const value = record[slot];
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  }
}

function disposeMaterial(material: THREE.Material): void {
  disposeMaterialTextures(material);
  material.dispose();
}

/**
 * Object3D を再帰的に traverse して geometry / material / テクスチャを dispose する。
 * 親があれば親からも remove する。
 */
function hasSharedAssets(object: THREE.Object3D): boolean {
  return Boolean(
    object.userData && (object.userData as { sharedAssets?: boolean }).sharedAssets,
  );
}

function disposeNode(object: THREE.Object3D): void {
  const mesh = object as THREE.Mesh & { material?: THREE.Material | THREE.Material[] };
  if ((mesh as { geometry?: THREE.BufferGeometry }).geometry) {
    (mesh as { geometry: THREE.BufferGeometry }).geometry.dispose();
  }
  const material = mesh.material;
  if (material) {
    if (Array.isArray(material)) {
      for (const m of material) disposeMaterial(m);
    } else {
      disposeMaterial(material);
    }
  }
}

export function disposeObject3D(object: THREE.Object3D): void {
  // THREE.Object3D.traverse はコールバックの戻り値を無視して必ず子孫まで再帰するため、
  // sharedAssets の付いたノード「およびその子孫」をまとめてスキップできるよう
  // 自前のスタックでサブツリー単位の枝刈りを行う。
  const stack: THREE.Object3D[] = [object];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (hasSharedAssets(node)) {
      continue;
    }
    disposeNode(node);
    for (const child of node.children) {
      stack.push(child);
    }
  }
  if (object.parent) {
    object.parent.remove(object);
  }
}
