import * as THREE from 'three';
import type { ColorVisionSupportMode, StarType } from '../../types';
import type { LODLevel } from '../systems/LODSystem';
import { triggerSharedVisualFeedback } from '../systems/VisualFeedbackSystem';

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

function createHeartShape(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.3);
  shape.bezierCurveTo(0, 0.65, -0.45, 0.92, -0.88, 0.48);
  shape.bezierCurveTo(-1.18, 0.15, -1.02, -0.38, 0, -1.08);
  shape.bezierCurveTo(1.02, -0.38, 1.18, 0.15, 0.88, 0.48);
  shape.bezierCurveTo(0.45, 0.92, 0, 0.65, 0, 0.3);
  shape.closePath();
  return shape;
}

function createLovelyGeometry(curveSegments: number, depth: number): THREE.BufferGeometry {
  const geometry = new THREE.ExtrudeGeometry(createHeartShape(), {
    depth,
    bevelEnabled: false,
    curveSegments,
  });
  geometry.scale(0.5, 0.5, 1);
  geometry.center();
  return geometry;
}

function createLovelyFarGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.ShapeGeometry(createHeartShape());
  geometry.scale(0.52, 0.52, 1);
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

type AnimatedStarMaterials = RainbowStarMaterials;
type AnimatedStarType = Exclude<StarType, 'NORMAL'>;

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
const SHARED_LOVELY_STAR_RESOURCES: Record<LODLevel, StarSharedResources> = (() => {
  const nearGeometry = createLovelyGeometry(6, 0.24);
  const midGeometry = createLovelyGeometry(3, 0.2);
  const farGeometry = createLovelyFarGeometry();

  return {
    near: {
      geometry: nearGeometry,
      material: new THREE.MeshToonMaterial({
        color: 0xff8fd6,
        emissive: 0xff8fd6,
        emissiveIntensity: 0.55,
      }),
      outlineGeometry: new THREE.EdgesGeometry(nearGeometry),
      outlineScale: 1.05,
    },
    mid: {
      geometry: midGeometry,
      material: new THREE.MeshToonMaterial({
        color: 0xff8fd6,
        emissive: 0xff8fd6,
        emissiveIntensity: 0.42,
      }),
      outlineGeometry: new THREE.EdgesGeometry(midGeometry),
      outlineScale: 1.04,
    },
    far: {
      geometry: farGeometry,
      material: new THREE.MeshBasicMaterial({
        color: 0xff8fd6,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.98,
      }),
      outlineGeometry: new THREE.EdgesGeometry(farGeometry),
      outlineScale: 1.06,
    },
  };
})();
const SHARED_OUTLINE_MATERIAL = new THREE.LineBasicMaterial({ color: 0x101020 });
const SHARED_RAINBOW_MARK_GEOMETRY = (() => {
  const shape = new THREE.Shape();
  const outerRadius = 0.34;
  const innerRadius = 0.15;
  for (let i = 0; i < 10; i++) {
    const angle = (-Math.PI / 2) + (i * Math.PI) / 5;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  const geometry = new THREE.ShapeGeometry(shape);
  geometry.center();
  return geometry;
})();
const SHARED_RAINBOW_MARK_SHADOW_MATERIAL = new THREE.MeshBasicMaterial({
  color: 0x102040,
  transparent: true,
  opacity: 0.95,
  depthTest: false,
});
const SHARED_RAINBOW_MARK_FILL_MATERIAL = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.98,
  depthTest: false,
});

// Initial color for a RAINBOW star. The per-instance materials mutate in place
// so pooled instances can keep reusing the same GPU resources without leaking
// hue from the previous lifetime.
const RAINBOW_INITIAL_COLOR = 0xff0000;
const LOVELY_INITIAL_COLOR = 0xff8fd6;

// View-bracket thresholds used by Star.update() to skip per-frame animation
// for stars that are far ahead of (or already behind) the spaceship.
const STAR_ANIMATION_AHEAD = 60;
const STAR_ANIMATION_BEHIND = 5;

let HIGH_CONTRAST_MODE = false;
let COLOR_VISION_SUPPORT_MODE: ColorVisionSupportMode = 'color-only';

function createRainbowMaterials(): RainbowStarMaterials {
  return createAnimatedMaterials(RAINBOW_INITIAL_COLOR);
}

function createAnimatedMaterials(
  initialColor: number,
  nearEmissiveIntensity = 0.45,
  midEmissiveIntensity = 0.35,
  farOpacity = 0.95,
): AnimatedStarMaterials {
  return {
    near: new THREE.MeshToonMaterial({
      color: initialColor,
      emissive: initialColor,
      emissiveIntensity: nearEmissiveIntensity,
    }),
    mid: new THREE.MeshToonMaterial({
      color: initialColor,
      emissive: initialColor,
      emissiveIntensity: midEmissiveIntensity,
    }),
    far: new THREE.MeshBasicMaterial({
      color: initialColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: farOpacity,
    }),
  };
}

function isAnimatedStarType(starType: StarType): starType is AnimatedStarType {
  return starType !== 'NORMAL';
}

function getStarScoreValue(starType: StarType): number {
  if (starType === 'RAINBOW') {
    return 500;
  }
  if (starType === 'LOVELY') {
    return 1000;
  }
  return 100;
}

function getAnimatedStarInitialColor(starType: AnimatedStarType): number {
  return starType === 'LOVELY' ? LOVELY_INITIAL_COLOR : RAINBOW_INITIAL_COLOR;
}

export function setStarHighContrastMode(enabled: boolean): void {
  HIGH_CONTRAST_MODE = enabled;
}

export function setStarColorVisionSupportMode(mode: ColorVisionSupportMode): void {
  COLOR_VISION_SUPPORT_MODE = mode;
}

export class Star {
  position: { x: number; y: number; z: number };
  readonly radius = 0.6;
  starType: StarType;
  scoreValue: number;
  isCollected = false;
  constellationId: string | null = null;
  constellationStageNumber: number | null = null;
  constellationOrder: number | null = null;
  mesh: THREE.Mesh;
  private readonly animatedMaterials: AnimatedStarMaterials | null;
  private hueOffset = 0;
  private spinTime = 0;
  private readonly wobblePhase: number;
  private lodLevel: LODLevel = 'near';

  constructor(x: number, y: number, z: number, starType: StarType = 'NORMAL') {
    this.position = { x, y, z };
    this.starType = starType;
    this.scoreValue = getStarScoreValue(starType);
    this.animatedMaterials = starType === 'RAINBOW'
      ? createRainbowMaterials()
      : starType === 'LOVELY'
        ? createAnimatedMaterials(LOVELY_INITIAL_COLOR, 0.55, 0.42, 0.98)
        : null;
    this.wobblePhase = ((Math.abs(x) * 0.17 + Math.abs(y) * 0.29 + Math.abs(z) * 0.05) % 1) * Math.PI * 2;
    this.mesh = this.createMesh();
    this.mesh.position.set(x, y, z);
  }

  private createMesh(): THREE.Mesh {
    const mesh = new THREE.Mesh(
      this.getCurrentResources().geometry,
      this.getCurrentMaterial(),
    );
    mesh.userData.sharedAssets = true;
    this.syncOutlineVisibility(mesh);
    this.syncRainbowMarkVisibility(mesh);
    return mesh;
  }

  private getCurrentMaterial(): THREE.Material {
    if (isAnimatedStarType(this.starType)) {
      return this.animatedMaterials?.[this.lodLevel] ?? this.getCurrentResources().material;
    }
    return this.getCurrentResources().material;
  }

  private getCurrentResources(): StarSharedResources {
    return this.starType === 'LOVELY'
      ? SHARED_LOVELY_STAR_RESOURCES[this.lodLevel]
      : SHARED_STAR_RESOURCES[this.lodLevel];
  }

  private attachOutline(mesh: THREE.Mesh): void {
    const resources = this.getCurrentResources();
    const outline = new THREE.LineSegments(resources.outlineGeometry, SHARED_OUTLINE_MATERIAL);
    outline.name = 'star-high-contrast-outline';
    outline.scale.setScalar(resources.outlineScale);
    outline.userData.sharedAssets = true;
    mesh.add(outline);
  }

  private attachRainbowMark(mesh: THREE.Mesh): void {
    if (this.starType !== 'RAINBOW') {
      return;
    }
    const group = new THREE.Group();
    group.name = 'rainbow-star-mark';
    group.position.z = 0.17;
    group.renderOrder = 2;
    group.userData.sharedAssets = true;

    const shadow = new THREE.Mesh(
      SHARED_RAINBOW_MARK_GEOMETRY,
      SHARED_RAINBOW_MARK_SHADOW_MATERIAL,
    );
    shadow.scale.setScalar(1.2);
    shadow.renderOrder = 2;
    shadow.userData.sharedAssets = true;

    const fill = new THREE.Mesh(
      SHARED_RAINBOW_MARK_GEOMETRY,
      SHARED_RAINBOW_MARK_FILL_MATERIAL,
    );
    fill.scale.setScalar(0.82);
    fill.position.z = 0.01;
    fill.renderOrder = 3;
    fill.userData.sharedAssets = true;

    group.add(shadow, fill);
    mesh.add(group);
  }

  private syncOutlineVisibility(mesh: THREE.Mesh = this.mesh): void {
    let outline = mesh.getObjectByName('star-high-contrast-outline') as THREE.LineSegments | null;
    if (!outline && HIGH_CONTRAST_MODE) {
      this.attachOutline(mesh);
      outline = mesh.getObjectByName('star-high-contrast-outline') as THREE.LineSegments | null;
    }
    if (outline) {
      const resources = this.getCurrentResources();
      outline.geometry = resources.outlineGeometry;
      outline.scale.setScalar(resources.outlineScale);
      outline.visible = HIGH_CONTRAST_MODE;
    }
  }

  private syncRainbowMarkVisibility(mesh: THREE.Mesh = this.mesh): void {
    if (this.starType !== 'RAINBOW') {
      return;
    }
    let mark = mesh.getObjectByName('rainbow-star-mark');
    if (!mark && COLOR_VISION_SUPPORT_MODE === 'color-and-marks') {
      this.attachRainbowMark(mesh);
      mark = mesh.getObjectByName('rainbow-star-mark');
    }
    if (mark) {
      mark.visible = COLOR_VISION_SUPPORT_MODE === 'color-and-marks';
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
    this.mesh.geometry = this.getCurrentResources().geometry;
    this.mesh.material = this.getCurrentMaterial();
    this.syncOutlineVisibility();
    this.syncRainbowMarkVisibility();
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

    if (isAnimatedStarType(this.starType) && !this.isCollected) {
      this.hueOffset += deltaTime * (this.starType === 'LOVELY' ? 0.34 : 0.5);
      const materials = this.animatedMaterials;
      if (!materials) {
        return;
      }
      const hue = ((this.starType === 'LOVELY' ? 0.84 : 0) + this.hueOffset) % 1;
      const saturation = this.starType === 'LOVELY' ? 0.82 : 1;
      const lightness = this.starType === 'LOVELY' ? 0.7 : 0.5;
      materials.near.color.setHSL(hue, saturation, lightness);
      materials.near.emissive.copy(materials.near.color);
      materials.mid.color.copy(materials.near.color);
      materials.mid.emissive.copy(materials.near.color);
      materials.far.color.copy(materials.near.color);
      if (this.starType === 'LOVELY') {
        const pulse = 1 + Math.sin(this.spinTime * 6.2 + this.wobblePhase) * 0.08;
        this.mesh.scale.setScalar(pulse);
        materials.near.emissiveIntensity = 0.55 + Math.sin(this.spinTime * 7.4 + this.wobblePhase) * 0.12;
        materials.mid.emissiveIntensity = 0.42 + Math.sin(this.spinTime * 7.4 + this.wobblePhase) * 0.08;
      }
    }
  }

  collect(): void {
    if (this.isCollected) {
      return;
    }
    this.isCollected = true;
    this.mesh.visible = false;
    triggerSharedVisualFeedback(isAnimatedStarType(this.starType) ? 'rainbowCollect' : 'starCollect');
  }

  setConstellationMarker(id: string, stageNumber: number, order: number): void {
    this.constellationId = id;
    this.constellationStageNumber = stageNumber;
    this.constellationOrder = order;
  }

  clearConstellationMarker(): void {
    this.constellationId = null;
    this.constellationStageNumber = null;
    this.constellationOrder = null;
  }

  reset(x: number, y: number, z: number): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.mesh.position.set(x, y, z);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.scale.setScalar(1);
    this.mesh.visible = true;
    this.isCollected = false;
    this.hueOffset = 0;
    this.spinTime = 0;
    this.clearConstellationMarker();
    this.applyLOD('near');
    this.syncOutlineVisibility();
    this.syncRainbowMarkVisibility();
    if (isAnimatedStarType(this.starType) && this.animatedMaterials) {
      const initialColor = getAnimatedStarInitialColor(this.starType);
      this.animatedMaterials.near.color.setHex(initialColor);
      this.animatedMaterials.near.emissive.setHex(initialColor);
      this.animatedMaterials.mid.color.setHex(initialColor);
      this.animatedMaterials.mid.emissive.setHex(initialColor);
      this.animatedMaterials.far.color.setHex(initialColor);
      if (this.starType === 'LOVELY') {
        this.animatedMaterials.near.emissiveIntensity = 0.55;
        this.animatedMaterials.mid.emissiveIntensity = 0.42;
      }
    }
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.scale.setScalar(1);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.visible = true;
    this.isCollected = false;
    this.hueOffset = 0;
    this.spinTime = 0;
    this.clearConstellationMarker();
    this.applyLOD('near');
    this.syncOutlineVisibility();
    this.syncRainbowMarkVisibility();
  }

  dispose(): void {
    if (this.animatedMaterials) {
      this.animatedMaterials.near.dispose();
      this.animatedMaterials.mid.dispose();
      this.animatedMaterials.far.dispose();
    }
    this.mesh.parent?.remove(this.mesh);
  }
}
