import * as THREE from 'three';
import type { LODLevel } from '../systems/LODSystem';

interface MeteoriteSharedResources {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  outlineGeometry: THREE.BufferGeometry;
  outlineScale: number;
}

const SHARED_METEORITE_RESOURCES: Record<LODLevel, MeteoriteSharedResources> = (() => {
  const nearGeometry = new THREE.BoxGeometry(1.55, 1.55, 1.55);
  const midGeometry = new THREE.OctahedronGeometry(1.08, 0);
  const farGeometry = new THREE.PlaneGeometry(1.45, 1.45);

  return {
    near: {
      geometry: nearGeometry,
      material: new THREE.MeshToonMaterial({ color: 0x7f7566 }),
      outlineGeometry: new THREE.EdgesGeometry(nearGeometry),
      outlineScale: 1.03,
    },
    mid: {
      geometry: midGeometry,
      material: new THREE.MeshToonMaterial({ color: 0x7f7566 }),
      outlineGeometry: new THREE.EdgesGeometry(midGeometry),
      outlineScale: 1.04,
    },
    far: {
      geometry: farGeometry,
      material: new THREE.MeshBasicMaterial({
        color: 0x7f7566,
        side: THREE.DoubleSide,
      }),
      outlineGeometry: new THREE.EdgesGeometry(farGeometry),
      outlineScale: 1.05,
    },
  };
})();
const SHARED_OUTLINE_MATERIAL = new THREE.LineBasicMaterial({ color: 0x05060a });

const METEORITE_ANIMATION_AHEAD = 60;
const METEORITE_ANIMATION_BEHIND = 5;

let HIGH_CONTRAST_MODE = false;

export function setMeteoriteHighContrastMode(enabled: boolean): void {
  HIGH_CONTRAST_MODE = enabled;
}

export class Meteorite {
  position: { x: number; y: number; z: number };
  readonly radius = 1.0;
  isActive = true;
  mesh: THREE.Mesh;
  private vibrationTime = 0;
  private readonly vibrationPhase: number;
  private lodLevel: LODLevel = 'near';

  constructor(x: number, y: number, z: number) {
    this.position = { x, y, z };
    this.vibrationPhase = ((Math.abs(x) * 0.23 + Math.abs(y) * 0.41 + Math.abs(z) * 0.07) % 1) * Math.PI * 2;
    this.mesh = this.createMesh();
    this.mesh.position.set(x, y, z);
  }

  private createMesh(): THREE.Mesh {
    const mesh = new THREE.Mesh(
      SHARED_METEORITE_RESOURCES[this.lodLevel].geometry,
      SHARED_METEORITE_RESOURCES[this.lodLevel].material,
    );
    mesh.userData.sharedAssets = true;
    this.syncOutlineVisibility(mesh);
    return mesh;
  }

  private attachOutline(mesh: THREE.Mesh): void {
    const resources = SHARED_METEORITE_RESOURCES[this.lodLevel];
    const outline = new THREE.LineSegments(resources.outlineGeometry, SHARED_OUTLINE_MATERIAL);
    outline.name = 'meteorite-high-contrast-outline';
    outline.scale.setScalar(resources.outlineScale);
    outline.userData.sharedAssets = true;
    mesh.add(outline);
  }

  private syncOutlineVisibility(mesh: THREE.Mesh = this.mesh): void {
    let outline = mesh.getObjectByName('meteorite-high-contrast-outline') as THREE.LineSegments | null;
    if (!outline && HIGH_CONTRAST_MODE) {
      this.attachOutline(mesh);
      outline = mesh.getObjectByName('meteorite-high-contrast-outline') as THREE.LineSegments | null;
    }
    if (outline) {
      const resources = SHARED_METEORITE_RESOURCES[this.lodLevel];
      outline.geometry = resources.outlineGeometry;
      outline.scale.setScalar(resources.outlineScale);
      outline.visible = HIGH_CONTRAST_MODE;
    }
  }

  getLODLevel(): LODLevel {
    return this.lodLevel;
  }

  applyLOD(level: LODLevel): void {
    if (this.lodLevel === level) {
      return;
    }
    this.lodLevel = level;
    this.mesh.geometry = SHARED_METEORITE_RESOURCES[level].geometry;
    this.mesh.material = SHARED_METEORITE_RESOURCES[level].material;
    this.syncOutlineVisibility();
  }

  update(deltaTime: number, cameraZ?: number): void {
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - METEORITE_ANIMATION_AHEAD ||
        this.position.z > cameraZ + METEORITE_ANIMATION_BEHIND)
    ) {
      return;
    }
    this.vibrationTime += deltaTime;
    this.mesh.rotation.x += deltaTime * 0.5;
    this.mesh.rotation.z += deltaTime * 0.3;
    this.mesh.position.x = this.position.x + Math.sin(this.vibrationTime * 11 + this.vibrationPhase) * 0.09;
    this.mesh.position.y = this.position.y + Math.cos(this.vibrationTime * 8.5 + this.vibrationPhase * 0.7) * 0.06;
    this.mesh.position.z = this.position.z;
  }

  reset(x: number, y: number, z: number): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.set(0, 0, 0);
    this.vibrationTime = 0;
    this.isActive = true;
    this.mesh.visible = true;
    this.applyLOD('near');
    this.syncOutlineVisibility();
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.vibrationTime = 0;
    this.isActive = true;
    this.mesh.visible = true;
    this.applyLOD('near');
    this.syncOutlineVisibility();
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
  }
}
