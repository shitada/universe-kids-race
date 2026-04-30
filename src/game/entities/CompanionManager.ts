import * as THREE from 'three';
import { PLANET_ENCYCLOPEDIA } from '../config/PlanetEncyclopedia';
import type { PlanetEncyclopediaEntry } from '../../types';

// Shared geometries for companion parts. All companion meshes reuse these to
// reduce GC and GPU buffer setup cost on iPad Safari (Constitution IV: 60fps).
// Do NOT dispose() these from instance dispose(); they live for the entire
// process lifecycle (same policy as Star/Meteorite, commit 9626792).
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

// Shared eye material (uniform black for all companions).
const SHARED_EYE_MATERIAL = new THREE.MeshToonMaterial({ color: 0x111111 });

// Body material caches keyed by color. Different rendering modes
// (opaque / transparent / DoubleSide for rings) are stored separately so the
// renderer keeps consistent draw state per material.
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

// All companion child Meshes use SHARED_* geometries and cached MeshToonMaterial
// instances above. We tag every Mesh with userData.sharedAssets = true so that
// disposeObject3D() (see src/game/utils/disposeObject3D.ts) skips dispose() of
// the shared GPU resources. When adding a new companion shape or extra child
// Mesh, ALWAYS create it via makeSharedMesh() to preserve this invariant.
function makeSharedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
): THREE.Mesh {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.sharedAssets = true;
  return mesh;
}

interface CompanionData {
  mesh: THREE.Group;
  angleOffset: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitTilt: number;
  cosTilt: number;
  sinTilt: number;
  entranceTimer: number;
}

export class CompanionManager {
  private companions: CompanionData[] = [];
  private group = new THREE.Group();
  private elapsedTime = 0;

  constructor(unlockedPlanets: number[]) {
    const count = unlockedPlanets.length;

    for (let i = 0; i < count; i++) {
      const entry = PLANET_ENCYCLOPEDIA.find((e) => e.stageNumber === unlockedPlanets[i]);
      if (!entry) continue;

      const mesh = CompanionManager.createCompanionMesh(entry);
      this.companions.push({
        mesh,
        angleOffset: 0,
        orbitRadius: 0,
        orbitSpeed: 0,
        orbitTilt: 0,
        cosTilt: 1,
        sinTilt: 0,
        entranceTimer: 0,
      });
      this.group.add(mesh);
    }
    this.redistributeOrbitParams();
  }

  addCompanion(stageNumber: number): boolean {
    const entry = PLANET_ENCYCLOPEDIA.find((e) => e.stageNumber === stageNumber);
    if (!entry) return false;

    const mesh = CompanionManager.createCompanionMesh(entry);
    mesh.scale.set(0, 0, 0);
    this.companions.push({
      mesh,
      angleOffset: 0,
      orbitRadius: 0,
      orbitSpeed: 0,
      orbitTilt: 0,
      cosTilt: 1,
      sinTilt: 0,
      entranceTimer: 1.0,
    });
    this.group.add(mesh);
    this.redistributeOrbitParams();
    return true;
  }

  // Recomputes orbit parameters (angleOffset / orbitRadius / orbitSpeed /
  // orbitTilt and its cached cos/sin) for ALL companions using the current
  // total count. This must be called whenever the companion count changes so
  // that the orbit stays evenly spaced and uses the correct baseRadius —
  // otherwise companions added incrementally end up at uneven angles and
  // mismatched radii (see CompanionManager bugfix). entranceTimer is
  // intentionally NOT touched so any in-progress entrance animation continues.
  private redistributeOrbitParams(): void {
    const count = this.companions.length;
    if (count === 0) return;
    const baseRadius = count <= 3 ? 2.0 : count <= 7 ? 2.5 : 3.0;

    for (let i = 0; i < count; i++) {
      const c = this.companions[i];
      const orbitTilt = (i - count / 2) * 0.15;
      c.angleOffset = i * ((2 * Math.PI) / count);
      c.orbitRadius = baseRadius + (i % 3) * 0.15;
      c.orbitSpeed = 1.0 + i * 0.05;
      c.orbitTilt = orbitTilt;
      c.cosTilt = Math.cos(orbitTilt);
      c.sinTilt = Math.sin(orbitTilt);
    }
  }

  update(deltaTime: number, shipX: number, shipY: number, shipZ: number): void {
    this.elapsedTime += deltaTime;

    for (const c of this.companions) {
      const angle = c.angleOffset + this.elapsedTime * c.orbitSpeed;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const x = shipX + c.orbitRadius * cosA;
      const y = shipY + c.orbitRadius * sinA * c.cosTilt;
      const z = shipZ + c.orbitRadius * sinA * c.sinTilt;
      c.mesh.position.set(x, y, z);

      if (c.entranceTimer > 0) {
        c.entranceTimer -= deltaTime;
        if (c.entranceTimer <= 0) {
          c.entranceTimer = 0;
          c.mesh.scale.setScalar(1);
        } else {
          const progress = Math.max(0, Math.min(1, 1 - c.entranceTimer));
          c.mesh.scale.setScalar(progress);
        }
        c.mesh.rotation.y += deltaTime * 8;
      } else {
        c.mesh.rotation.y += deltaTime * 2;
      }
    }
  }

  getCount(): number {
    return this.companions.length;
  }

  getStarAttractionBonus(): number {
    return this.companions.length * 0.2;
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  dispose(): void {
    // Shared geometries/materials are cached at module scope and reused across
    // CompanionManager instances (same policy as Star/Meteorite). Per-instance
    // dispose only detaches meshes from the scene graph; it must NOT dispose
    // the shared resources or subsequent companions would render incorrectly.
    this.companions = [];
    this.group.clear();
  }

  static createCompanionMesh(entry: PlanetEncyclopediaEntry): THREE.Group {
    switch (entry.companionShape) {
      case 'ringed':
        return CompanionManager.createRinged(entry.planetColor);
      case 'radiant':
        return CompanionManager.createRadiant(entry.planetColor);
      case 'horned':
        return CompanionManager.createHorned(entry.planetColor);
      case 'icy':
        return CompanionManager.createIcy(entry.planetColor);
      case 'bubble':
        return CompanionManager.createBubble(entry.planetColor);
      default:
        return CompanionManager.createBasic(entry.planetColor);
    }
  }

  private static createBasic(color: number): THREE.Group {
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

  private static createRinged(color: number): THREE.Group {
    const group = CompanionManager.createBasic(color);
    const ringMat = getRingBodyMaterial(color);
    const ring = makeSharedMesh(SHARED_RING_GEOM, ringMat);
    ring.rotation.x = (Math.PI / 2) * 0.8;
    group.add(ring);
    return group;
  }

  private static createRadiant(color: number): THREE.Group {
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

  private static createHorned(color: number): THREE.Group {
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

  private static createIcy(color: number): THREE.Group {
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

  private static createBubble(color: number): THREE.Group {
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
}
