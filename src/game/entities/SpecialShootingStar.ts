import * as THREE from 'three';
import type { SpecialShootingStarType } from '../../types';
import { SPECIAL_STAR_CONFIG } from '../config/SpecialStarConfig';

const CORE_GEOMETRY = new THREE.IcosahedronGeometry(0.68, 0);
const AURA_GEOMETRY = new THREE.SphereGeometry(1.12, 14, 14);
const TRAIL_GEOMETRY = new THREE.CylinderGeometry(0.06, 0.22, 2.5, 10, 1, true);
const RING_GEOMETRY = new THREE.TorusGeometry(0.85, 0.08, 8, 24);
const SPECIAL_STAR_ANIMATION_AHEAD = 80;
const SPECIAL_STAR_ANIMATION_BEHIND = 14;

export class SpecialShootingStar {
  position: { x: number; y: number; z: number };
  readonly radius = 0.95;
  readonly mesh: THREE.Group;
  scoreBonus: number;
  isCollected = false;
  specialType: SpecialShootingStarType;

  private readonly core: THREE.Mesh;
  private readonly aura: THREE.Mesh;
  private readonly trail: THREE.Mesh;
  private readonly ring: THREE.Mesh;
  private readonly coreMaterial: THREE.MeshToonMaterial;
  private readonly auraMaterial: THREE.MeshToonMaterial;
  private readonly trailMaterial: THREE.MeshToonMaterial;
  private readonly ringMaterial: THREE.MeshToonMaterial;
  private direction: -1 | 1;
  private elapsed = 0;
  private orbitOffsetX = 0;
  private orbitOffsetY = 0;
  private rainbowHue = 0;

  constructor(
    x: number,
    y: number,
    z: number,
    specialType: SpecialShootingStarType = 'silver',
    direction: -1 | 1 = 1,
  ) {
    this.position = { x, y, z };
    this.specialType = specialType;
    this.direction = direction;
    const config = SPECIAL_STAR_CONFIG[specialType];
    this.scoreBonus = config.scoreBonus;
    const {
      group,
      core,
      aura,
      trail,
      ring,
      coreMaterial,
      auraMaterial,
      trailMaterial,
      ringMaterial,
    } = this.createMesh();
    this.mesh = group;
    this.core = core;
    this.aura = aura;
    this.trail = trail;
    this.ring = ring;
    this.coreMaterial = coreMaterial;
    this.auraMaterial = auraMaterial;
    this.trailMaterial = trailMaterial;
    this.ringMaterial = ringMaterial;
    this.applyVariantAppearance();
    this.syncMesh();
  }

  private createMesh(): {
    group: THREE.Group;
    core: THREE.Mesh;
    aura: THREE.Mesh;
    trail: THREE.Mesh;
    ring: THREE.Mesh;
    coreMaterial: THREE.MeshToonMaterial;
    auraMaterial: THREE.MeshToonMaterial;
    trailMaterial: THREE.MeshToonMaterial;
    ringMaterial: THREE.MeshToonMaterial;
  } {
    const group = new THREE.Group();
    const coreMaterial = new THREE.MeshToonMaterial();
    const auraMaterial = new THREE.MeshToonMaterial({ transparent: true, opacity: 0.38 });
    const trailMaterial = new THREE.MeshToonMaterial({ transparent: true, opacity: 0.88 });
    const ringMaterial = new THREE.MeshToonMaterial({ transparent: true, opacity: 0.72 });
    const core = new THREE.Mesh(CORE_GEOMETRY, coreMaterial);
    const aura = new THREE.Mesh(AURA_GEOMETRY, auraMaterial);
    const trail = new THREE.Mesh(TRAIL_GEOMETRY, trailMaterial);
    const ring = new THREE.Mesh(RING_GEOMETRY, ringMaterial);
    core.name = 'special-star-core';
    aura.name = 'special-star-aura';
    trail.name = 'special-star-trail';
    ring.name = 'special-star-ring';
    trail.rotation.z = Math.PI / 2;
    group.add(aura);
    group.add(ring);
    group.add(core);
    group.add(trail);
    return { group, core, aura, trail, ring, coreMaterial, auraMaterial, trailMaterial, ringMaterial };
  }

  private applyVariantAppearance(): void {
    const config = SPECIAL_STAR_CONFIG[this.specialType];
    this.scoreBonus = config.scoreBonus;
    this.coreMaterial.color.setHex(config.visual.coreColor);
    this.coreMaterial.emissive.setHex(config.visual.emissiveColor);
    this.coreMaterial.emissiveIntensity = 1;
    this.auraMaterial.color.setHex(config.visual.auraColor);
    this.trailMaterial.color.setHex(config.visual.trailColor);
    this.ringMaterial.color.setHex(config.visual.ringColor);
    this.rainbowHue = this.specialType === 'rainbow' ? 0.92 : 0;
  }

  private syncMesh(): void {
    const motion = SPECIAL_STAR_CONFIG[this.specialType].motion;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.z = Math.atan2(motion.speedY, motion.speedX * this.direction);
    this.trail.position.set(-this.direction * 1.15, 0, 0);
    this.trail.rotation.y = this.direction === 1 ? 0 : Math.PI;
  }

  private getOrbitOffsets(): { x: number; y: number } {
    const motion = SPECIAL_STAR_CONFIG[this.specialType].motion;
    switch (this.specialType) {
      case 'rainbow':
        return {
          x: Math.sin(this.elapsed * motion.frequency) * motion.swayX * this.direction,
          y: Math.cos(this.elapsed * motion.frequency * 0.7) * motion.swayY,
        };
      case 'gold':
        return {
          x: Math.asin(Math.sin(this.elapsed * motion.frequency)) * (motion.swayX / (Math.PI / 2)) * this.direction,
          y: Math.sin(this.elapsed * motion.frequency * 0.55) * motion.swayY,
        };
      case 'silver':
      default:
        return {
          x: (
            Math.cos(this.elapsed * motion.frequency) * motion.swayX * 0.72 +
            Math.sin(this.elapsed * motion.frequency * 0.45) * motion.swayX * 0.45
          ) * this.direction,
          y: Math.sin(this.elapsed * motion.frequency * 1.15) * motion.swayY,
        };
    }
  }

  update(deltaTime: number, cameraZ?: number): void {
    if (
      cameraZ !== undefined &&
      (this.position.z < cameraZ - SPECIAL_STAR_ANIMATION_AHEAD || this.position.z > cameraZ + SPECIAL_STAR_ANIMATION_BEHIND)
    ) {
      return;
    }

    const motion = SPECIAL_STAR_CONFIG[this.specialType].motion;
    const previousOffsetX = this.orbitOffsetX;
    const previousOffsetY = this.orbitOffsetY;
    this.elapsed += deltaTime;
    this.position.x += motion.speedX * this.direction * deltaTime - previousOffsetX;
    this.position.y += motion.speedY * deltaTime - previousOffsetY;
    this.position.z += motion.speedZ * deltaTime;

    const nextOffset = this.getOrbitOffsets();
    this.orbitOffsetX = nextOffset.x;
    this.orbitOffsetY = nextOffset.y;
    this.position.x += this.orbitOffsetX;
    this.position.y += this.orbitOffsetY;
    this.syncMesh();

    this.core.rotation.x += deltaTime * 4.5;
    this.core.rotation.z += deltaTime * 6;
    this.ring.rotation.x += deltaTime * 1.6;
    this.ring.rotation.y += deltaTime * 2.3;
    this.aura.scale.setScalar(1.02 + Math.sin(this.elapsed * 6.5) * 0.14);
    this.trail.scale.set(1.04 + Math.sin(this.elapsed * 9.2) * 0.12, 1, 1);
    this.trailMaterial.opacity = 0.48 + Math.sin(this.elapsed * 12) * 0.16;
    this.auraMaterial.opacity = 0.24 + Math.sin(this.elapsed * 9) * 0.1;

    if (this.specialType === 'rainbow') {
      this.rainbowHue = (this.rainbowHue + deltaTime * 0.28) % 1;
      this.coreMaterial.color.setHSL(this.rainbowHue, 0.95, 0.7);
      this.trailMaterial.color.setHSL((this.rainbowHue + 0.18) % 1, 0.95, 0.68);
      this.ringMaterial.color.setHSL((this.rainbowHue + 0.34) % 1, 0.88, 0.82);
    }
  }

  collect(): void {
    this.isCollected = true;
    this.mesh.visible = false;
  }

  reset(
    x: number,
    y: number,
    z: number,
    specialType: SpecialShootingStarType = this.specialType,
    direction: -1 | 1 = 1,
  ): void {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.specialType = specialType;
    this.direction = direction;
    this.elapsed = 0;
    this.orbitOffsetX = 0;
    this.orbitOffsetY = 0;
    this.isCollected = false;
    this.mesh.visible = true;
    this.core.rotation.set(0, 0, 0);
    this.ring.rotation.set(0, 0, 0);
    this.aura.scale.setScalar(1);
    this.trail.scale.set(1, 1, 1);
    this.applyVariantAppearance();
    this.syncMesh();
  }

  recycle(): void {
    this.mesh.parent?.remove(this.mesh);
    this.reset(this.position.x, this.position.y, this.position.z, this.specialType, this.direction);
  }

  dispose(): void {
    this.mesh.parent?.remove(this.mesh);
    this.coreMaterial.dispose();
    this.auraMaterial.dispose();
    this.trailMaterial.dispose();
    this.ringMaterial.dispose();
  }
}
