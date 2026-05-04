import * as THREE from 'three';
import type { StarType } from '../../types';
import type { LODLevel } from '../systems/LODSystem';

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

function createMidStarGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.CylinderGeometry(0.62, 0.62, 0.24, 6, 1, false);
  geometry.rotateX(Math.PI / 2);
  geometry.center();
  return geometry;
}

interface StarSharedResources {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  outlineGeometry: THREE.BufferGeometry;
  outlineScale: number;
}

interface RainbowStarMaterials {
  near: THREE.MeshToonMaterial;
  mid: THREE.MeshToonMaterial;
  far: THREE.MeshBasicMaterial;
}

const SHARED_STAR_RESOURCES: Record<LODLevel, StarSharedResources> = (() => {
  const nearGeometry = createHexPrismGeometry();
  const midGeometry = createMidStarGeometry();
  const farGeometry = new THREE.PlaneGeometry(1.18, 1.18);

  return {
    near: {
      geometry: nearGeometry,
      material: new THREE.MeshToonMaterial({
        color: 0xffdd00,
        emissive: 0xffdd00,
        emissiveIntensity: 0.45,
      }),
      outlineGeometry: new THREE.EdgesGeometry(nearGeometry),
      outlineScale: 1.04,
    },
    mid: {
      geometry: midGeometry,
      material: new THREE.MeshToonMaterial({
        color: 0xffdd00,
        emissive: 0xffdd00,
        emissiveIntensity: 0.35,
      }),
      outlineGeometry: new THREE.EdgesGeometry(midGeometry),
      outlineScale: 1.03,
    },
    far: {
      geometry: farGeometry,
      material: new THREE.MeshBasicMaterial({
        color: 0xffdd00,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
      }),
      outlineGeometry: new THREE.EdgesGeometry(farGeometry),
      outlineScale: 1.05,
    },
  };
})();
const SHARED_OUTLINE_MATERIAL = new THREE.LineBasicMaterial({ color: 0x101020 });

// Initial color for a RAINBOW star. The per-instance materials mutate in place
// so pooled instances can keep reusing the same GPU resources without leaking
// hue from the previous lifetime.
const RAINBOW_INITIAL_COLOR = 0xff0000;

// View-bracket thresholds used by Star.update() to skip per-frame animation
// for stars that are far ahead of (or already behind) the spaceship.
const STAR_ANIMATION_AHEAD = 60;
const STAR_ANIMATION_BEHIND = 5;

let HIGH_CONTRAST_MODE = false;

function createRainbowMaterials(): RainbowStarMaterials {
  return {
    near: new THREE.MeshToonMaterial({
      color: RAINBOW_INITIAL_COLOR,
      emissive: RAINBOW_INITIAL_COLOR,
      emissiveIntensity: 0.45,
    }),
    mid: new THREE.MeshToonMaterial({
      color: RAINBOW_INITIAL_COLOR,
      emissive: RAINBOW_INITIAL_COLOR,
      emissiveIntensity: 0.35,
    }),
    far: new THREE.MeshBasicMaterial({
      color: RAINBOW_INITIAL_COLOR,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    }),
  };
}

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
  private readonly rainbowMaterials: RainbowStarMaterials | null;
  private hueOffset = 0;
  private spinTime = 0;
  private readonly wobblePhase: number;
  private lodLevel: LODLevel = 'near';

  constructor(x: number, y: number, z: number, starType: StarType = 'NORMAL') {
    this.position = { x, y, z };
    this.starType = starType;
    this.scoreValue = starType === 'RAINBOW' ? 500 : 100;
    this.rainbowMaterials = starType === 'RAINBOW' ? createRainbowMaterials() : null;
    this.wobblePhase = ((Math.abs(x) * 0.17 + Math.abs(y) * 0.29 + Math.abs(z) * 0.05) % 1) * Math.PI * 2;
    this.mesh = this.createMesh();
    this.mesh.position.set(x, y, z);
  }

  private createMesh(): THREE.Mesh {
    const mesh = new THREE.Mesh(
      SHARED_STAR_RESOURCES[this.lodLevel].geometry,
      this.getCurrentMaterial(),
    );
    mesh.userData.sharedAssets = true;
    this.syncOutlineVisibility(mesh);
    return mesh;
  }

  private getCurrentMaterial(): THREE.Material {
    if (this.starType === 'RAINBOW') {
      return this.rainbowMaterials?.[this.lodLevel] ?? SHARED_STAR_RESOURCES.near.material;
    }
    return SHARED_STAR_RESOURCES[this.lodLevel].material;
  }

  private attachOutline(mesh: THREE.Mesh): void {
    const resources = SHARED_STAR_RESOURCES[this.lodLevel];
    const outline = new THREE.LineSegments(resources.outlineGeometry, SHARED_OUTLINE_MATERIAL);
    outline.name = 'star-high-contrast-outline';
    outline.scale.setScalar(resources.outlineScale);
    outline.userData.sharedAssets = true;
    mesh.add(outline);
  }

  private syncOutlineVisibility(mesh: THREE.Mesh = this.mesh): void {
    let outline = mesh.getObjectByName('star-high-contrast-outline') as THREE.LineSegments | null;
    if (!outline && HIGH_CONTRAST_MODE) {
      this.attachOutline(mesh);
      outline = mesh.getObjectByName('star-high-contrast-outline') as THREE.LineSegments | null;
    }
    if (outline) {
      const resources = SHARED_STAR_RESOURCES[this.lodLevel];
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
    this.mesh.geometry = SHARED_STAR_RESOURCES[level].geometry;
    this.mesh.material = this.getCurrentMaterial();
    this.syncOutlineVisibility();
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
      const materials = this.rainbowMaterials;
      if (!materials) {
        return;
      }
      materials.near.color.setHSL(hue, 1, 0.5);
      materials.near.emissive.copy(materials.near.color);
      materials.mid.color.copy(materials.near.color);
      materials.mid.emissive.copy(materials.near.color);
      materials.far.color.copy(materials.near.color);
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
    this.applyLOD('near');
    this.syncOutlineVisibility();
    if (this.starType === 'RAINBOW' && this.rainbowMaterials) {
      this.rainbowMaterials.near.color.setHex(RAINBOW_INITIAL_COLOR);
      this.rainbowMaterials.near.emissive.setHex(RAINBOW_INITIAL_COLOR);
      this.rainbowMaterials.mid.color.setHex(RAINBOW_INITIAL_COLOR);
      this.rainbowMaterials.mid.emissive.setHex(RAINBOW_INITIAL_COLOR);
      this.rainbowMaterials.far.color.setHex(RAINBOW_INITIAL_COLOR);
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
    this.applyLOD('near');
    this.syncOutlineVisibility();
  }

  dispose(): void {
    if (this.rainbowMaterials) {
      this.rainbowMaterials.near.dispose();
      this.rainbowMaterials.mid.dispose();
      this.rainbowMaterials.far.dispose();
    }
    this.mesh.parent?.remove(this.mesh);
  }
}
