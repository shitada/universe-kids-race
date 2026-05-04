import * as THREE from 'three';

const SHARED_GEOMETRY = new THREE.BoxGeometry(1.55, 1.55, 1.55);
const SHARED_OUTLINE_GEOMETRY = new THREE.EdgesGeometry(SHARED_GEOMETRY);
const SHARED_MATERIAL = new THREE.MeshToonMaterial({ color: 0x7f7566 });
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

  constructor(x: number, y: number, z: number) {
    this.position = { x, y, z };
    this.vibrationPhase = ((Math.abs(x) * 0.23 + Math.abs(y) * 0.41 + Math.abs(z) * 0.07) % 1) * Math.PI * 2;
    this.mesh = this.createMesh();
    this.mesh.position.set(x, y, z);
  }

  private createMesh(): THREE.Mesh {
    const mesh = new THREE.Mesh(SHARED_GEOMETRY, SHARED_MATERIAL);
    mesh.userData.sharedAssets = true;
    this.syncOutlineVisibility(mesh);
    return mesh;
  }

  private attachOutline(mesh: THREE.Mesh): void {
    const outline = new THREE.LineSegments(SHARED_OUTLINE_GEOMETRY, SHARED_OUTLINE_MATERIAL);
    outline.name = 'meteorite-high-contrast-outline';
    outline.scale.setScalar(1.03);
    outline.userData.sharedAssets = true;
    mesh.add(outline);
  }

  private syncOutlineVisibility(mesh: THREE.Mesh = this.mesh): void {
    let outline = mesh.getObjectByName('meteorite-high-contrast-outline');
    if (!outline && HIGH_CONTRAST_MODE) {
      this.attachOutline(mesh);
      outline = mesh.getObjectByName('meteorite-high-contrast-outline');
    }
    if (outline) {
      outline.visible = HIGH_CONTRAST_MODE;
    }
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
    this.syncOutlineVisibility();
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.vibrationTime = 0;
    this.isActive = true;
    this.mesh.visible = true;
    this.syncOutlineVisibility();
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
  }
}
