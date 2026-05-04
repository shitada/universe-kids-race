import * as THREE from 'three';
import type { StarType } from '../../types';

function createHexPrismGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const radius = 0.62;
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 6;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.24,
    bevelEnabled: false,
    curveSegments: 1,
  });
  geometry.center();
  return geometry;
}

// Shared resources for Star instances. NORMAL stars share both geometry and
// material to reduce GC and draw-call setup cost. RAINBOW stars share only the
// geometry; their material is per-instance because hue is animated per-frame.
// Do NOT mutate SHARED_NORMAL_MATERIAL; do NOT dispose() these from instance
// dispose() (see disposeObject3D for the generic path that is intentionally
// bypassed by Star.dispose()).
const SHARED_GEOMETRY = createHexPrismGeometry();
const SHARED_OUTLINE_GEOMETRY = new THREE.EdgesGeometry(SHARED_GEOMETRY);
const SHARED_NORMAL_MATERIAL = new THREE.MeshToonMaterial({
  color: 0xffdd00,
  emissive: 0xffdd00,
  emissiveIntensity: 0.45,
});
const SHARED_OUTLINE_MATERIAL = new THREE.LineBasicMaterial({ color: 0x101020 });

// Initial color for a RAINBOW star. The per-instance MeshToonMaterial mutates
// `color` / `emissive` in place to animate hue; reset() restores this baseline
// so a pooled instance does not leak the previous lifetime's hue.
const RAINBOW_INITIAL_COLOR = 0xff0000;

// View-bracket thresholds used by Star.update() to skip per-frame animation
// for stars that are far ahead of (or already behind) the spaceship.
const STAR_ANIMATION_AHEAD = 60;
const STAR_ANIMATION_BEHIND = 5;

let HIGH_CONTRAST_MODE = false;

export function setStarHighContrastMode(enabled: boolean): void {
  HIGH_CONTRAST_MODE = enabled;
}

export class Star {
  position: { x: number; y: number; z: number };
  readonly radius = 0.6;
  starType: StarType;
  scoreValue: number;
  isCollected = false;
  mesh: THREE.Mesh;
  private hueOffset = 0;
  private spinTime = 0;
  private readonly wobblePhase: number;

  constructor(x: number, y: number, z: number, starType: StarType = 'NORMAL') {
    this.position = { x, y, z };
    this.starType = starType;
    this.scoreValue = starType === 'RAINBOW' ? 500 : 100;
    this.wobblePhase = ((Math.abs(x) * 0.17 + Math.abs(y) * 0.29 + Math.abs(z) * 0.05) % 1) * Math.PI * 2;
    this.mesh = this.createMesh();
    this.mesh.position.set(x, y, z);
  }

  private createMesh(): THREE.Mesh {
    if (this.starType === 'RAINBOW') {
      const mat = new THREE.MeshToonMaterial({
        color: RAINBOW_INITIAL_COLOR,
        emissive: RAINBOW_INITIAL_COLOR,
        emissiveIntensity: 0.45,
      });
      const mesh = new THREE.Mesh(SHARED_GEOMETRY, mat);
      mesh.userData.sharedAssets = true;
      this.syncOutlineVisibility(mesh);
      return mesh;
    }
    const mesh = new THREE.Mesh(SHARED_GEOMETRY, SHARED_NORMAL_MATERIAL);
    mesh.userData.sharedAssets = true;
    this.syncOutlineVisibility(mesh);
    return mesh;
  }

  private attachOutline(mesh: THREE.Mesh): void {
    const outline = new THREE.LineSegments(SHARED_OUTLINE_GEOMETRY, SHARED_OUTLINE_MATERIAL);
    outline.name = 'star-high-contrast-outline';
    outline.scale.setScalar(1.04);
    outline.userData.sharedAssets = true;
    mesh.add(outline);
  }

  private syncOutlineVisibility(mesh: THREE.Mesh = this.mesh): void {
    let outline = mesh.getObjectByName('star-high-contrast-outline');
    if (!outline && HIGH_CONTRAST_MODE) {
      this.attachOutline(mesh);
      outline = mesh.getObjectByName('star-high-contrast-outline');
    }
    if (outline) {
      outline.visible = HIGH_CONTRAST_MODE;
    }
  }

  update(deltaTime: number, cameraZ?: number): void {
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - STAR_ANIMATION_AHEAD ||
        this.position.z > cameraZ + STAR_ANIMATION_BEHIND)
    ) {
      return;
    }

    this.spinTime += deltaTime;
    this.mesh.rotation.y += deltaTime * 2;
    this.mesh.rotation.z = Math.sin(this.spinTime * 3.2 + this.wobblePhase) * 0.16;
    this.mesh.position.y = this.position.y + Math.sin(this.spinTime * 2.4 + this.wobblePhase) * 0.05;

    if (this.starType === 'RAINBOW' && !this.isCollected) {
      this.hueOffset += deltaTime * 0.5;
      const hue = this.hueOffset % 1;
      const mat = this.mesh.material as THREE.MeshToonMaterial;
      mat.color.setHSL(hue, 1, 0.5);
      mat.emissive.copy(mat.color);
    }
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  reset(x: number, y: number, z: number): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.visible = true;
    this.isCollected = false;
    this.hueOffset = 0;
    this.spinTime = 0;
    this.syncOutlineVisibility();
    if (this.starType === 'RAINBOW') {
      const mat = this.mesh.material as THREE.MeshToonMaterial;
      mat.color.setHex(RAINBOW_INITIAL_COLOR);
      mat.emissive.setHex(RAINBOW_INITIAL_COLOR);
    }
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.visible = true;
    this.isCollected = false;
    this.hueOffset = 0;
    this.spinTime = 0;
    this.syncOutlineVisibility();
  }

  dispose(): void {
    if (this.starType === 'RAINBOW') {
      const mat = this.mesh.material as THREE.Material;
      mat.dispose();
    }
    this.mesh.parent?.remove(this.mesh);
  }
}
