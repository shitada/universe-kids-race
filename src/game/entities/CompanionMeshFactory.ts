import * as THREE from 'three';
import type { PlanetEncyclopediaEntry } from '../../types';

const SHARED_BODY_SPHERE_GEOM = new THREE.SphereGeometry(0.3, 6, 6);
const SHARED_BODY_BUBBLE_SPHERE_GEOM = new THREE.SphereGeometry(0.3, 8, 8);
const SHARED_BODY_ICOSAHEDRON_GEOM = new THREE.IcosahedronGeometry(0.3, 0);
const SHARED_EAR_CONE_GEOM = new THREE.ConeGeometry(0.12, 0.25, 6);
const SHARED_RAY_CONE_GEOM = new THREE.ConeGeometry(0.08, 0.25, 4);
const SHARED_HORN_CONE_GEOM = new THREE.ConeGeometry(0.06, 0.35, 4);
const SHARED_RING_GEOM = new THREE.RingGeometry(0.4, 0.55, 12);
const SHARED_BUBBLE_LARGE_GEOM = new THREE.SphereGeometry(0.1, 4, 4);
const SHARED_BUBBLE_SMALL_GEOM = new THREE.SphereGeometry(0.08, 4, 4);
const SHARED_EYE_GEOM = new THREE.SphereGeometry(0.06, 4, 4);

const SHARED_EYE_MATERIAL = new THREE.MeshToonMaterial({ color: 0x111111 });

const OPAQUE_BODY_MATERIALS = new Map<number, THREE.MeshToonMaterial>();
const TRANSPARENT_BODY_MATERIALS = new Map<number, THREE.MeshToonMaterial>();
const RING_BODY_MATERIALS = new Map<number, THREE.MeshToonMaterial>();

function getOpaqueBodyMaterial(color: number): THREE.MeshToonMaterial {
  let mat = OPAQUE_BODY_MATERIALS.get(color);
  if (!mat) {
    mat = new THREE.MeshToonMaterial({ color });
    OPAQUE_BODY_MATERIALS.set(color, mat);
  }
  return mat;
}

function getTransparentBodyMaterial(color: number): THREE.MeshToonMaterial {
  let mat = TRANSPARENT_BODY_MATERIALS.get(color);
  if (!mat) {
    mat = new THREE.MeshToonMaterial({ color, transparent: true, opacity: 0.7 });
    TRANSPARENT_BODY_MATERIALS.set(color, mat);
  }
  return mat;
}

function getRingBodyMaterial(color: number): THREE.MeshToonMaterial {
  let mat = RING_BODY_MATERIALS.get(color);
  if (!mat) {
    mat = new THREE.MeshToonMaterial({ color, side: THREE.DoubleSide });
    RING_BODY_MATERIALS.set(color, mat);
  }
  return mat;
}

function makeSharedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.sharedAssets = true;
  return mesh;
}

export function createCompanionMesh(entry: PlanetEncyclopediaEntry): THREE.Group {
  switch (entry.companionShape) {
    case 'ringed':
      return createRinged(entry.planetColor);
    case 'radiant':
      return createRadiant(entry.planetColor);
    case 'horned':
      return createHorned(entry.planetColor);
    case 'icy':
      return createIcy(entry.planetColor);
    case 'bubble':
      return createBubble(entry.planetColor);
    default:
      return createBasic(entry.planetColor);
  }
}

function createBasic(color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = getOpaqueBodyMaterial(color);

  const body = makeSharedMesh(SHARED_BODY_SPHERE_GEOM, mat);
  group.add(body);

  const ear1 = makeSharedMesh(SHARED_EAR_CONE_GEOM, mat);
  ear1.position.set(0.2, 0.35, 0);
  ear1.rotation.z = -0.3;
  group.add(ear1);

  const ear2 = makeSharedMesh(SHARED_EAR_CONE_GEOM, mat);
  ear2.position.set(-0.2, 0.35, 0);
  ear2.rotation.z = 0.3;
  group.add(ear2);

  const eye1 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye1.position.set(0.1, 0.1, 0.25);
  group.add(eye1);

  const eye2 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye2.position.set(-0.1, 0.1, 0.25);
  group.add(eye2);

  return group;
}

function createRinged(color: number): THREE.Group {
  const group = createBasic(color);
  const ringMat = getRingBodyMaterial(color);
  const ring = makeSharedMesh(SHARED_RING_GEOM, ringMat);
  ring.rotation.x = (Math.PI / 2) * 0.8;
  group.add(ring);
  return group;
}

function createRadiant(color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = getOpaqueBodyMaterial(color);

  const body = makeSharedMesh(SHARED_BODY_SPHERE_GEOM, mat);
  group.add(body);

  const ray1 = makeSharedMesh(SHARED_RAY_CONE_GEOM, mat);
  ray1.position.set(0, 0.5, 0);
  group.add(ray1);

  const ray2 = makeSharedMesh(SHARED_RAY_CONE_GEOM, mat);
  ray2.position.set(0.4, 0.15, 0);
  ray2.rotation.z = -Math.PI / 3;
  group.add(ray2);

  const ray3 = makeSharedMesh(SHARED_RAY_CONE_GEOM, mat);
  ray3.position.set(-0.4, 0.15, 0);
  ray3.rotation.z = Math.PI / 3;
  group.add(ray3);

  const eye1 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye1.position.set(0.1, 0.1, 0.25);
  group.add(eye1);

  const eye2 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye2.position.set(-0.1, 0.1, 0.25);
  group.add(eye2);

  return group;
}

function createHorned(color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = getOpaqueBodyMaterial(color);

  const body = makeSharedMesh(SHARED_BODY_SPHERE_GEOM, mat);
  group.add(body);

  const horn1 = makeSharedMesh(SHARED_HORN_CONE_GEOM, mat);
  horn1.position.set(0.15, 0.45, 0);
  horn1.rotation.z = -0.2;
  group.add(horn1);

  const horn2 = makeSharedMesh(SHARED_HORN_CONE_GEOM, mat);
  horn2.position.set(-0.15, 0.45, 0);
  horn2.rotation.z = 0.2;
  group.add(horn2);

  const eye1 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye1.position.set(0.1, 0.1, 0.25);
  group.add(eye1);

  const eye2 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye2.position.set(-0.1, 0.1, 0.25);
  group.add(eye2);

  return group;
}

function createIcy(color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = getOpaqueBodyMaterial(color);

  const body = makeSharedMesh(SHARED_BODY_ICOSAHEDRON_GEOM, mat);
  group.add(body);

  const ear1 = makeSharedMesh(SHARED_EAR_CONE_GEOM, mat);
  ear1.position.set(0.2, 0.35, 0);
  ear1.rotation.z = -0.3;
  group.add(ear1);

  const ear2 = makeSharedMesh(SHARED_EAR_CONE_GEOM, mat);
  ear2.position.set(-0.2, 0.35, 0);
  ear2.rotation.z = 0.3;
  group.add(ear2);

  const eye1 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye1.position.set(0.1, 0.1, 0.25);
  group.add(eye1);

  const eye2 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye2.position.set(-0.1, 0.1, 0.25);
  group.add(eye2);

  return group;
}

function createBubble(color: number): THREE.Group {
  const group = new THREE.Group();
  const mat = getTransparentBodyMaterial(color);

  const body = makeSharedMesh(SHARED_BODY_BUBBLE_SPHERE_GEOM, mat);
  group.add(body);

  const bubble1 = makeSharedMesh(SHARED_BUBBLE_LARGE_GEOM, mat);
  bubble1.position.set(0.3, 0.2, 0);
  group.add(bubble1);

  const bubble2 = makeSharedMesh(SHARED_BUBBLE_SMALL_GEOM, mat);
  bubble2.position.set(-0.25, 0.3, 0);
  group.add(bubble2);

  const eye1 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye1.position.set(0.1, 0.1, 0.25);
  group.add(eye1);

  const eye2 = makeSharedMesh(SHARED_EYE_GEOM, SHARED_EYE_MATERIAL);
  eye2.position.set(-0.1, 0.1, 0.25);
  group.add(eye2);

  return group;
}
